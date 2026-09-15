import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// Required by `output: "export"` — tells Next this is a build-time file, not a request-time route.
export const dynamic = "force-static";

// Emitted as /robots.txt at build time.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
