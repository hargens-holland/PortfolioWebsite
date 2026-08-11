# ---------------------------------------------------------------------------
# S3 — origin bucket
#
# Never public. CloudFront is the only thing allowed to read it, via Origin
# Access Control (the bucket policy at the bottom of this file).
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "site" {
  bucket = var.project_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lets you recover a file you overwrote with a bad deploy. Storage for a site
# this small is fractions of a cent either way.
resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Old versions aren't worth paying for forever.
resource "aws_s3_bucket_lifecycle_configuration" "site" {
  bucket     = aws_s3_bucket.site.id
  depends_on = [aws_s3_bucket_versioning.site]

  rule {
    id     = "expire-noncurrent-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# ---------------------------------------------------------------------------
# CloudFront
# ---------------------------------------------------------------------------

# OAC is how CloudFront proves to S3 that a request came from this
# distribution. It replaces the older Origin Access Identity.
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.project_name}-oac"
  description                       = "Lets only this distribution read the site bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "rewrite_index" {
  name    = "${var.project_name}-rewrite-index"
  runtime = "cloudfront-js-2.0"
  comment = "Appends index.html so directory URLs resolve against the S3 REST endpoint"
  publish = true
  code    = file("${path.module}/functions/rewrite-index.js")
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = var.project_name
  default_root_object = "index.html"
  price_class         = var.price_class

  # Empty unless you've set domain_name.
  aliases = local.aliases

  origin {
    origin_id                = "s3-${aws_s3_bucket.site.id}"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    # AWS-managed "CachingOptimized". It honours the Cache-Control headers the
    # deploy workflow writes onto each object, which is where the real caching
    # policy lives: hashed assets get a year, HTML gets revalidated.
    cache_policy_id = data.aws_cloudfront_cache_policy.optimized.id

    # HSTS, X-Content-Type-Options, Referrer-Policy, frame options.
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_index.arn
    }
  }

  # A missing key should render the styled 404 page, not S3's XML error.
  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 60
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 60
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    # Without a custom domain, use CloudFront's own cert on *.cloudfront.net.
    cloudfront_default_certificate = local.has_domain ? null : true

    acm_certificate_arn      = one(aws_acm_certificate_validation.site[*].certificate_arn)
    ssl_support_method       = local.has_domain ? "sni-only" : null
    minimum_protocol_version = local.has_domain ? "TLSv1.2_2021" : null
  }
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_response_headers_policy" "security" {
  name = "Managed-SecurityHeadersPolicy"
}

# ---------------------------------------------------------------------------
# Bucket policy — CloudFront only
#
# Written after the distribution exists because the condition pins it to this
# specific distribution's ARN. No other principal can read the bucket.
# ---------------------------------------------------------------------------

data "aws_iam_policy_document" "site_bucket" {
  statement {
    sid       = "AllowCloudFrontRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site_bucket.json

  depends_on = [aws_s3_bucket_public_access_block.site]
}
