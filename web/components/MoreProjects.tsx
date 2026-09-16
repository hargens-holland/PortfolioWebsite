import Link from "next/link";
import type { Project } from "@/content/projects";

/**
 * The collapsed list under the project cards: course projects that don't
 * have a screenshot and don't need a full card to make their point. It's a
 * native <details>, so it works without JavaScript and the open/closed state
 * is the browser's to manage.
 */
export function MoreProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  const n = projects.length;

  return (
    <details className="more">
      <summary className="more__toggle">
        <span className="more__chev" aria-hidden="true">
          ▸
        </span>
        <span className="more__closed">
          Show {n} more course project{n === 1 ? "" : "s"}
        </span>
        <span className="more__open">Hide course projects</span>
      </summary>

      <ul className="more__list">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link className="more__row" href={`/projects/${project.slug}`}>
              <span className="more__id">
                <span className="card__designator">{project.designator}</span>
                <span>{project.slug}</span>
              </span>

              <span className="more__body">
                <span className="more__head">
                  <h3 className="more__title">{project.name}</h3>
                  <span className="more__meta">
                    {project.year} · {project.role}
                  </span>
                </span>
                <span className="more__blurb">{project.summary}</span>
                <span className="more__tags">
                  {project.tags.map((tag) => (
                    <span className="more__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                  {project.links.length === 0 && <span className="more__tag more__tag--lock">private repo</span>}
                </span>
              </span>

              <span className="more__cta">Details →</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
