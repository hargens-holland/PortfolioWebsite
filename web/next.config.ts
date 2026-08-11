import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fail the production build on type errors rather than shipping them.
  // (Next 16 decoupled ESLint from `next build` — run `npm run lint` in CI.)
  typescript: { ignoreBuildErrors: false },

  // Static export: `next build` emits plain HTML/CSS/JS into web/out with no
  // server. That's what makes S3 + CloudFront (or any static host) work.
  //
  // The trade-off: no Route Handlers, no server-side rendering at request time.
  // Everything on this site is known at build time, so nothing is lost. If you
  // ever add something that needs a server, drop this line and deploy to
  // Amplify or Vercel instead.
  output: "export",

  // Next's image optimizer is a server feature; static export can't use it.
  images: { unoptimized: true },

  // Emit /projects/eeg/index.html rather than /projects/eeg.html, so S3 serves
  // clean URLs without rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
