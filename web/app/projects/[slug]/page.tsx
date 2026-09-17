import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, findProject } from "@/content/projects";
import { SITE } from "@/content/site";
import { ProjectShot } from "@/components/ProjectShot";
import { publicAsset } from "@/lib/assets";

type Params = { slug: string };

/** Pre-render every project at build time. */
export function generateStaticParams(): Params[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — ${SITE.name}`,
      description: project.summary,
      url: `${SITE.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  // Site-relative links point at files in public/; keep only the ones that exist.
  const links = project.links.filter((link) => !link.href.startsWith("/") || publicAsset(link.href));

  const poster = publicAsset(project.image);
  const video = publicAsset(project.video);
  // Unknown slugs drop out rather than linking to a 404.
  const related = project.related?.map(findProject).filter((p) => p !== undefined) ?? [];

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const previous = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];

  return (
    <article className="project" data-section={project.slug}>
      <Link className="project__back" href="/#work">
        ← All work
      </Link>

      <header className="project__head">
        <div className="eyebrow">
          <span className="eyebrow__pad">{project.designator}</span>
          {project.slug}
        </div>
        <h1 className="project__title">{project.name}</h1>
        <div className="project__meta">
          <span>{project.year}</span>
          <span>{project.role}</span>
        </div>
      </header>

      {/* A video takes the banner slot, with the screenshot as its poster
          frame. Only with a real file either way — a placeholder this large
          would just be a hole between the title and the writeup. */}
      {video ? (
        <figure className="project__frame project__frame--video">
          <video className="project__video" controls playsInline preload="metadata" poster={poster} src={video}>
            Your browser can&apos;t play this video. <a href={video}>Download it</a> instead.
          </video>
          {project.imageCaption && <figcaption className="project__caption">{project.imageCaption}</figcaption>}
        </figure>
      ) : (
        poster && (
          <figure className="project__frame">
            <ProjectShot project={project} variant="banner" />
            {project.imageCaption && <figcaption className="project__caption">{project.imageCaption}</figcaption>}
          </figure>
        )
      )}

      <div className="project__body">
        {project.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <div className="project__tags">
        {project.tags.map((tag) => (
          <span className="project__tag" key={tag}>
            <i className="pin__mark" />
            {tag}
          </span>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="project__links">
          {links.map((link, i) => (
            <a
              key={link.href}
              className={`btn ${i === 0 ? "btn--primary" : "btn--ghost"}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} {link.href.startsWith("/") ? "↓" : "↗"}
            </a>
          ))}
        </div>
      ) : (
        <p className="project__none">
          {project.sourceNote ?? "The source for this one isn't public yet."} Happy to walk through
          it or share access —{" "}
          <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(project.name)}`}>
            email me
          </a>
          .
        </p>
      )}

      {related.length > 0 && (
        <p className="project__related">
          <span className="project__related-label">See also</span>
          {related.map((r) => (
            <Link key={r.slug} href={`/projects/${r.slug}`}>
              {r.name} →
            </Link>
          ))}
        </p>
      )}

      <nav className="project__nav">
        {previous ? (
          <Link href={`/projects/${previous.slug}`}>← {previous.name}</Link>
        ) : (
          <span />
        )}
        {next ? <Link href={`/projects/${next.slug}`}>{next.name} →</Link> : <span />}
      </nav>
    </article>
  );
}
