import Link from "next/link";
import type { Project } from "@/content/projects";

function Pins({ project, numbered }: { project: Project; numbered?: boolean }) {
  return (
    <div className="pins">
      {project.tags.map((tag, i) => (
        <span className="pin" key={tag}>
          <i className="pin__mark" />
          {numbered && <span className="pin__n">{String(i + 1).padStart(2, "0")}</span>}
          {tag}
        </span>
      ))}
    </div>
  );
}

/** The big card at the top of the work section. */
export function FeaturedCard({ project }: { project: Project }) {
  return (
    <Link className="card card--featured" href={`/projects/${project.slug}`}>
      <div className="card__bar">
        <span className="card__id">
          <span className="card__designator">{project.designator}</span>
          <span>{project.slug}</span>
        </span>
        <span className="card__state">
          <span className="card__state-label">status</span>
          <span className="led" />
        </span>
      </div>

      <div className="card__split">
        <div className="card__frame">
          <div className="shot">{project.image ?? `${project.slug}.png`}</div>
        </div>
        <div className="card__copy">
          <div className="card__meta">
            <span className="flag">Featured</span>
            <span className="card__meta-text">
              {project.year} · {project.role}
            </span>
          </div>
          <h3 className="card__title">{project.name}</h3>
          <p className="card__blurb">{project.summary}</p>
          <p className="card__cta">Read the details →</p>
        </div>
      </div>

      <Pins project={project} numbered />
    </Link>
  );
}

/** Half-width cards in the row below the featured one. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link className="card" href={`/projects/${project.slug}`}>
      <div className="card__bar">
        <span className="card__id">
          <span className="card__designator">{project.designator}</span>
          <span>{project.slug}</span>
        </span>
        <span className="led" />
      </div>

      <div className="card__frame--top">
        <div className="shot shot--wide">{project.image ?? `${project.slug}.png`}</div>
      </div>

      <div className="card__compact">
        <div className="card__compact-head">
          <h3 className="card__title">{project.name}</h3>
          <span className="card__year">{project.year}</span>
        </div>
        <p className="card__blurb">{project.summary}</p>
        <p className="card__cta">Read the details →</p>
      </div>

      <Pins project={project} />
    </Link>
  );
}
