import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, findProject } from "@/content/projects";
import { SITE } from "@/content/site";

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

      <div className="project__frame">
        <div className="shot shot--banner">{project.image ?? `${project.slug}.png`}</div>
      </div>

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

      {project.links.length > 0 ? (
        <div className="project__links">
          {project.links.map((link, i) => (
            <a
              key={link.href}
              className={`btn ${i === 0 ? "btn--primary" : "btn--ghost"}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      ) : (
        <p className="project__none">
          No public links yet. Add them to this project&apos;s <code>links</code> array in{" "}
          <code>web/content/projects.ts</code> — each one renders as a button here.
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
