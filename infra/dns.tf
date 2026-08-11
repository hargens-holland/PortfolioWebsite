# ---------------------------------------------------------------------------
# Custom domain: certificate + DNS
#
# Everything here is skipped when domain_name is empty, so you can stand the
# site up first and add the domain later by setting the variable and running
# apply again.
# ---------------------------------------------------------------------------

locals {
  has_domain = var.domain_name != ""

  # Serve both hollandhargens.com and www.hollandhargens.com.
  aliases = local.has_domain ? [var.domain_name, "www.${var.domain_name}"] : []

  # Use the zone you passed in, or the one created below.
  # one() returns the single element of a count'd resource, or null when the
  # count is 0 — safer than [0], which errors if the resource doesn't exist.
  zone_id = local.has_domain ? (
    var.route53_zone_id != "" ? var.route53_zone_id : one(aws_route53_zone.site[*].zone_id)
  ) : ""
}

# Only created if you didn't supply an existing zone. If you registered the
# domain through Route 53, AWS already made one — pass its ID as
# route53_zone_id so you don't end up with two zones fighting over the domain.
resource "aws_route53_zone" "site" {
  count = local.has_domain && var.route53_zone_id == "" ? 1 : 0
  name  = var.domain_name
}

# ---------------------------------------------------------------------------
# ACM certificate
#
# Must be in us-east-1 — CloudFront reads certs from nowhere else. That's why
# the whole stack pins that region.
# ---------------------------------------------------------------------------

resource "aws_acm_certificate" "site" {
  count = local.has_domain ? 1 : 0

  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# AWS asks you to prove you own the domain by publishing a CNAME it specifies.
# Since Route 53 holds the zone, Terraform can publish it for you.
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for option in flatten(aws_acm_certificate.site[*].domain_validation_options) :
    option.domain_name => option
  }

  zone_id = local.zone_id
  name    = each.value.resource_record_name
  type    = each.value.resource_record_type
  records = [each.value.resource_record_value]
  ttl     = 60

  allow_overwrite = true
}

# Blocks until AWS has seen the records and issued the cert. Usually a couple
# of minutes; can be longer if the zone's nameservers aren't live at your
# registrar yet.
resource "aws_acm_certificate_validation" "site" {
  count = local.has_domain ? 1 : 0

  certificate_arn         = one(aws_acm_certificate.site[*].arn)
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# ---------------------------------------------------------------------------
# Point the domain at CloudFront
#
# Alias records, not CNAMEs: DNS forbids a CNAME at the apex, and aliases are
# free to query where CNAMEs are billed.
# ---------------------------------------------------------------------------

resource "aws_route53_record" "apex" {
  count = local.has_domain ? 1 : 0

  zone_id = local.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  count = local.has_domain ? 1 : 0

  zone_id = local.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
