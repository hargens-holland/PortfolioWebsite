import { PROJECTS, findProject } from "@/content/projects";
import { SITE } from "@/content/site";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

// Required by `output: "export"` — tells Next this is a build-time file, not a request-time route.
export const dynamic = "force-static";

// One link-preview card per project, rendered at build time alongside the
// page. Same static params as the page so every slug gets one.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);

  return ogImage({
    eyebrow: project ? `${project.designator} · ${project.slug}` : "portfolio",
    title: project?.name ?? SITE.name,
    subtitle: project?.summary ?? SITE.description,
    chips: project?.tags.slice(0, 4) ?? [],
  });
}
