/**
 * CloudFront Function — viewer request.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is exported with trailingSlash, so a project page is stored in S3
 * under the key `projects/eeg-seizure-detection/index.html`. A visitor asks
 * CloudFront for `/projects/eeg-seizure-detection/`.
 *
 * Because the bucket is private and reached through Origin Access Control,
 * CloudFront talks to the S3 *REST* endpoint. That endpoint returns exactly
 * the key you ask for — it has no notion of a directory index, so the request
 * above 404s. (The S3 *website* endpoint does resolve index documents, but it
 * requires a public bucket, which is worse.)
 *
 * So we rewrite the path before it reaches the origin:
 *
 *   /                          -> /index.html
 *   /projects/eeg/             -> /projects/eeg/index.html
 *   /projects/eeg              -> /projects/eeg/index.html
 *   /_next/static/abc123.js    -> unchanged (has a file extension)
 *
 * This runs at the edge in well under a millisecond and costs about $0.10 per
 * million requests.
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (!uri.includes(".")) {
    // Extensionless path — treat it as a directory.
    request.uri = uri + "/index.html";
  }

  return request;
}
