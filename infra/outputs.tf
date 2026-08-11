output "s3_bucket" {
  description = "Set as the AWS_S3_BUCKET secret in GitHub."
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "Set as the AWS_CLOUDFRONT_DISTRIBUTION_ID secret in GitHub."
  value       = aws_cloudfront_distribution.site.id
}

output "deploy_role_arn" {
  description = "Set as the AWS_DEPLOY_ROLE_ARN secret in GitHub."
  value       = aws_iam_role.github_deploy.arn
}

output "cloudfront_url" {
  description = "The site, before any custom domain. Works immediately after the first deploy."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "site_url" {
  description = "Your real URL once DNS resolves."
  value       = local.has_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "nameservers" {
  description = <<-EOT
    Only set when Terraform created the hosted zone. Enter these four at your
    domain registrar, replacing whatever is there. Until you do, the
    certificate can't validate and the domain won't resolve.
  EOT
  value       = coalesce(one(aws_route53_zone.site[*].name_servers), [])
}
