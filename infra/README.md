# Infrastructure

Terraform for hosting the site on AWS, plus notes on what every piece does and
why it's there. Read this before running anything — the point is to understand
the stack, not to paste commands.

---

## The shape of it

```
        you push to main
               │
               ▼
      GitHub Actions runner
               │  assumes an IAM role via OIDC (no stored keys)
               ▼
         ┌───────────┐
         │ S3 bucket │  private — nothing on the internet can read it directly
         └─────┬─────┘
               │  Origin Access Control
               ▼
        ┌─────────────┐
        │ CloudFront  │  ~600 edge locations, TLS, caching
        └──────┬──────┘
               │  CloudFront Function rewrites /projects/eeg/ → …/index.html
               ▼
           a visitor
```

Route 53 answers DNS for your domain and points it at CloudFront. ACM issues
the TLS certificate CloudFront serves.

---

## What each AWS service is doing

**S3** is object storage — a key/value store where keys look like file paths.
It holds your built site. It is *not* a web server: it has no notion of "the
index file for this directory," which matters later.

The bucket is **private**. That's deliberate. A public bucket serves the
internet directly, which means no CDN caching, no edge TLS, no protection from
someone scraping it in a loop and running up your bill. Instead only CloudFront
can read it.

**CloudFront** is the CDN and the thing users actually connect to. It copies
your files to edge locations worldwide, terminates TLS, compresses responses,
and serves most requests without ever touching S3. It's also where the free
tier lives: 1 TB/month of egress costs nothing, permanently.

**Origin Access Control (OAC)** is how CloudFront proves to S3 that a request
came from your distribution. CloudFront signs each origin request with SigV4;
the bucket policy accepts only requests carrying that signature *and* naming
your distribution's ARN. This replaces the older Origin Access Identity.

**ACM** issues and auto-renews the TLS certificate. Free, but it must live in
`us-east-1` — CloudFront reads certificates from that region and nowhere else,
which is why this whole stack pins that region.

**Route 53** is DNS. It maps `hollandhargens.com` to CloudFront. It's the only
line item that reliably costs money: $0.50/month per hosted zone.

**IAM** is permissions. Two things here: the bucket policy (who may read the
bucket — only CloudFront) and the deploy role (what GitHub may do — write to
one bucket, invalidate one distribution, nothing else).

---

## What each file does

### `versions.tf`
Pins Terraform and the AWS provider so a run next year behaves like today's.
Configures the provider for `us-east-1` and applies default tags to every
resource, which is how you later answer "what is this thing and who made it."

### `variables.tf`
Every input, with defaults. The two that matter: `project_name` (also the S3
bucket name, so it must be globally unique across all of AWS) and
`domain_name` (empty means "no custom domain yet" — the whole DNS layer is
skipped and you get a working CloudFront URL).

### `main.tf`
The bucket, the distribution, and the glue between them.

- **`aws_s3_bucket`** — the origin.
- **`aws_s3_bucket_public_access_block`** — four separate switches that make it
  structurally impossible to make the bucket public, even by accident later.
- **`aws_s3_bucket_versioning`** — keeps the previous copy of overwritten
  objects, so a bad deploy is recoverable.
- **`aws_s3_bucket_lifecycle_configuration`** — deletes those old versions
  after 30 days so they don't accumulate forever.
- **`aws_cloudfront_origin_access_control`** — the signing config described
  above.
- **`aws_cloudfront_function`** — see "the directory index problem" below.
- **`aws_cloudfront_distribution`** — the CDN itself. Worth reading closely:
  - `default_root_object` — a request for `/` fetches `index.html`.
  - `viewer_protocol_policy = "redirect-to-https"` — plain HTTP gets a 301.
  - `compress = true` — gzip/brotli at the edge.
  - `cache_policy_id` — the AWS-managed *CachingOptimized* policy. It honours
    the `Cache-Control` headers the deploy workflow writes onto each object,
    which is where the real policy lives.
  - `response_headers_policy_id` — managed *SecurityHeadersPolicy*, which adds
    HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and frame options.
  - `custom_error_response` — turns S3's XML "access denied" into your styled
    404 page. Two blocks, because a missing key returns 403 rather than 404
    when the caller isn't allowed to list the bucket.
  - `price_class` — `PriceClass_100` is North America and Europe. Cheaper, and
    fine unless you expect traffic from Asia or South America.
- **`aws_s3_bucket_policy`** — the other half of OAC. Grants `s3:GetObject` to
  the CloudFront *service*, conditional on the request naming this exact
  distribution. Written last because it needs the distribution's ARN.

### `dns.tf`
Everything here is behind `count = local.has_domain ? 1 : 0`, so it doesn't
exist until you set `domain_name`.

- **`aws_route53_zone`** — created only if you didn't pass an existing zone ID.
  Registering through Route 53 creates a zone automatically; pass its ID so you
  don't end up with two zones fighting over the domain.
- **`aws_acm_certificate`** — requests a cert for the apex and `www`.
- **`aws_route53_record.cert_validation`** — AWS proves you own the domain by
  asking you to publish a specific CNAME. Since Route 53 holds the zone,
  Terraform publishes it for you.
- **`aws_acm_certificate_validation`** — doesn't create anything; it *waits*
  until AWS has seen those records and issued the cert. Usually a couple of
  minutes. This is the step that hangs if your registrar isn't yet pointing at
  Route 53's nameservers.
- **`aws_route53_record.apex` / `.www`** — alias records pointing at
  CloudFront. Aliases rather than CNAMEs for two reasons: DNS forbids a CNAME
  at a zone apex, and Route 53 doesn't charge for alias queries to AWS targets.

### `github_oidc.tf`
How GitHub deploys without a stored password.

The alternative is an IAM user with an access key pasted into GitHub secrets.
That key is long-lived — valid until revoked, from anywhere, by anyone holding
it.

OIDC replaces it. GitHub mints a short-lived, signed token describing the run:
*this is repo `owner/name`, on branch `main`*. AWS verifies the signature
against GitHub's published keys, checks the description against the trust
policy, and returns temporary credentials that expire in an hour.

The line that makes it safe:

```hcl
variable = "token.actions.githubusercontent.com:sub"
values   = ["repo:${var.github_repo}:ref:refs/heads/main"]
```

Only that repo, only that branch. A fork, a pull request, or another repo in
your account gets refused. Without this condition *any* GitHub repository in
the world could assume your role — it's the single most important line in this
directory.

The attached policy grants three things and nothing else: list the bucket,
read/write/delete objects in it, invalidate this distribution.

### `outputs.tf`
Values you need afterward: the three GitHub secrets, the CloudFront URL for
testing before DNS exists, and the nameservers to enter at your registrar.

### `functions/rewrite-index.js`
See below — it's the one genuinely non-obvious piece.

---

## The directory index problem

The thing most likely to confuse you when the site 404s.

Your pages are stored at keys like `projects/eeg-seizure-detection/index.html`.
A visitor requests `/projects/eeg-seizure-detection/`.

S3 has two different ways of being reached:

- The **website endpoint** resolves directory indexes — ask for a path ending
  in `/` and it serves `index.html`. But it only works on a **public** bucket
  and doesn't support OAC.
- The **REST endpoint** returns exactly the key you name and nothing else. It
  works with OAC and a private bucket. It has no concept of a directory.

We use the REST endpoint, so `/projects/eeg-seizure-detection/` asks for a key
that doesn't exist → 403 → your 404 page. Every page except the homepage would
be broken.

The fix is a **CloudFront Function**: a tiny piece of JavaScript that runs at
the edge on every viewer request, before the cache is consulted. It appends
`index.html` to paths that look like directories.

CloudFront Functions are not Lambda@Edge — they're far more limited (no
network, no filesystem, sub-millisecond) and far cheaper, about $0.10 per
million requests. Rewriting a URL is exactly what they're for.

---

## Cache strategy

Two ideas that work together.

**Filenames.** Everything under `_next/static/` has a content hash in its
name. Change the file, the name changes. So those can be cached for a year and
marked `immutable` — a browser never needs to check. HTML filenames never
change, so HTML must revalidate on every request or your updates would be
invisible to returning visitors for a year.

That's why the deploy does two `aws s3 sync` passes with different
`--cache-control` values. The header is stored on the S3 object, and both
CloudFront and the visitor's browser obey it.

**Invalidation.** Even with `must-revalidate`, CloudFront's edges hold copies.
`create-invalidation --paths "/*"` tells all of them to drop everything. The
first 1,000 paths per month are free and `/*` counts as one.

---

## Running it

**Before anything: set a billing alarm.** Console → Billing → Budgets → create
a zero-spend or $10 budget with an email alert. It's the cheapest insurance in
computing and takes two minutes.

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # edit project_name if taken
terraform init                                  # downloads the AWS provider
terraform plan                                  # READ THIS — it's the whole point
terraform apply
```

`plan` prints every resource it intends to create before creating anything.
Read it. You should recognise all of it from this document; if something
appears that you don't recognise, stop and find out why.

Then in **GitHub → Settings → Secrets and variables → Actions**, add the three
values `terraform output` printed:

| Secret | From |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | `deploy_role_arn` |
| `AWS_S3_BUCKET` | `s3_bucket` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` |

Push to `main`. The workflow builds and deploys. Visit the `cloudfront_url`
output — the site should be live, on HTTPS, with project pages working.

### Adding the domain later

Buy it, then uncomment `domain_name` in `terraform.tfvars` and re-run
`terraform apply`. If Terraform created the hosted zone, set the four
`nameservers` it outputs at your registrar. The `apply` will pause at
certificate validation until DNS resolves — that's expected, and it can take
anywhere from minutes to a few hours depending on the registrar.

Then update `SITE.url` in `web/content/site.ts` so canonical and OG tags point
at the real domain, and push.

### Tearing it down

```bash
terraform destroy
```

Empty the bucket first — S3 refuses to delete a bucket with objects in it, and
versioning means "empty" includes old versions.

---

## What this costs

| | Monthly |
|---|---|
| S3 storage (~2 MB) | under $0.01 |
| S3 requests | pennies — CloudFront absorbs almost all traffic |
| CloudFront | **$0** — 1 TB/month egress is permanently free tier |
| CloudFront Functions | $0.10 per million requests |
| ACM certificate | $0 |
| Route 53 hosted zone | **$0.50** |
| Route 53 queries | $0.40 per million |
| **Total** | **~$0.55/month**, plus ~$11/year for the domain |

The hosted zone is the only guaranteed charge. Using Cloudflare for DNS instead
would make this stack effectively free, at the cost of splitting your setup
across two providers.
