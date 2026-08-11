terraform {
  required_version = ">= 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # State lives on your machine for now, which is fine for a solo project.
  # It records what Terraform created, so don't delete it — and don't commit
  # it, since state can contain sensitive values (see .gitignore).
  #
  # If you ever want it in S3 with locking (what a team would do):
  #   backend "s3" {
  #     bucket       = "hollandhargens-tfstate"
  #     key          = "portfolio/terraform.tfstate"
  #     region       = "us-east-1"
  #     use_lockfile = true
  #   }
}

# Everything lives in us-east-1 on purpose.
#
# CloudFront can only use ACM certificates issued in us-east-1, so the cert has
# to be there regardless. Putting the bucket there too means one provider block
# instead of two — and since CloudFront caches at edge locations worldwide, the
# bucket's region barely affects what visitors experience.
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      Repo      = var.github_repo
    }
  }
}
