variable "project_name" {
  description = "Name prefix for resources. Also used for the S3 bucket, so it must be globally unique."
  type        = string
  default     = "hollandhargens-portfolio"
}

variable "aws_region" {
  description = "Region for everything. Keep us-east-1 — CloudFront only reads ACM certs from there."
  type        = string
  default     = "us-east-1"
}

variable "github_repo" {
  description = "owner/repo that is allowed to deploy. Only this repo's main branch can assume the deploy role."
  type        = string
  default     = "hargens-holland/PortfolioWebsite"
}

variable "domain_name" {
  description = <<-EOT
    Apex domain, e.g. "hollandhargens.com". Leave empty to deploy without a
    custom domain — you'll get a working site at the CloudFront URL and can
    add the domain later by setting this and re-running apply.
  EOT
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = <<-EOT
    Existing Route 53 hosted zone ID for domain_name. Leave empty and Terraform
    creates the zone for you — then point your registrar at the nameservers it
    outputs. If you registered the domain through Route 53, AWS already made a
    zone; put its ID here so you don't end up with two.
  EOT
  type        = string
  default     = ""
}

variable "create_oidc_provider" {
  description = "Set false if your AWS account already has the GitHub Actions OIDC provider (only one per account is allowed)."
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront edge coverage. PriceClass_100 is North America + Europe and the cheapest; PriceClass_All is worldwide."
  type        = string
  default     = "PriceClass_100"
}
