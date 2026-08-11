# ---------------------------------------------------------------------------
# GitHub Actions → AWS, without storing credentials
#
# The alternative is creating an IAM user, generating an access key, and
# pasting it into GitHub secrets. That key is long-lived: it works until
# someone revokes it, and if it leaks it's valid from anywhere.
#
# OIDC removes it entirely. GitHub mints a short-lived signed token describing
# the workflow run ("this is repo X, branch main"). AWS verifies the signature
# against GitHub's published keys, checks that description against the trust
# policy below, and hands back temporary credentials that expire in an hour.
# Nothing secret is ever stored in GitHub.
# ---------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS stopped validating this for GitHub's endpoint, but the field is still
  # required. This is GitHub's well-known intermediate CA thumbprint.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

locals {
  oidc_provider_arn = coalesce(
    one(aws_iam_openid_connect_provider.github[*].arn),
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
  )
}

data "aws_iam_policy_document" "github_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # The important line. Only the main branch of this one repo can assume the
    # role — not a fork, not a pull request, not another repo in your account.
    #
    # The numbers are GitHub's immutable IDs: 72099379 is the user ID for
    # hargens-holland, and 1330104288 is the repo ID for PortfolioWebsite.
    # GitHub emits this ID-bearing subject claim rather than the name-based
    # form because names can be transferred or re-registered by someone else,
    # while numeric IDs are never reused — so matching on the IDs can't be
    # hijacked by whoever claims the name next.
    #
    # Hardcoded rather than built from var.github_repo because the IDs belong
    # to this specific repo instance. Delete and recreate the repo and they
    # change, and this line has to be updated by hand.
    #
    # If it's wrong, sts:AssumeRoleWithWebIdentity fails with "Not
    # authorized" and no indication of which condition mismatched.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:hargens-holland@72099379/PortfolioWebsite@1330104288:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "${var.project_name}-github-deploy"
  description        = "Assumed by GitHub Actions to publish the site"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json
}

# Exactly what a deploy needs and nothing else: write to this one bucket,
# invalidate this one distribution.
data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid       = "ListSiteBucket"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid       = "WriteSiteObjects"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  statement {
    sid       = "InvalidateDistribution"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "${var.project_name}-deploy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}
