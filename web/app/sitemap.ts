import type { MetadataRoute } from "next";
import { PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";

// Required by `output: "export"` — tells Next this is a build-time file, not a request-time route.
export const dynamic = "force-static";

// Emitted as /sitemap.xml at build time: the homepage plus one entry per
// project. Adding a project to content/projects.ts adds it here too.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((project) => ({
      url: `${SITE.url}/projects/${project.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
