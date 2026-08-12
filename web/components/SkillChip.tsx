"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { findProject } from "@/content/projects";
import type { Skill } from "@/content/site";

/**
 * One skill in the toolkit grid.
 *
 * A skill with a `note` in content/site.ts becomes a button with an arrow that
 * opens a short writeup underneath it. A skill without one stays a plain label,
 * so half-written notes never ship as empty dropdowns.
 */
export function SkillChip({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!skill.note) {
    return (
      <div className="skill">
        <span className="chip">
          <i className="chip__mark" />
          <span className="chip__name">{skill.name}</span>
        </span>
      </div>
    );
  }

  // Unknown slugs drop out rather than rendering a link to a 404.
  const projects = skill.projects?.map(findProject).filter((p) => p !== undefined) ?? [];

  return (
    <div className={`skill${open ? " skill--open" : ""}`}>
      <button
        type="button"
        className="chip chip--toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <i className="chip__mark" />
        <span className="chip__name">{skill.name}</span>
        <span className="chip__arrow" aria-hidden="true">
          ▾
        </span>
      </button>

      {/* Always rendered so it can animate; the inner div's visibility keeps
          links inside a closed panel out of the tab order. */}
      <div className="skill__panel" id={panelId}>
        <div className="skill__panel-inner">
          <p className="skill__note">{skill.note}</p>
          {projects.length > 0 && (
            <div className="skill__projects">
              {projects.map((project) => (
                <Link className="skill__project" key={project.slug} href={`/projects/${project.slug}`}>
                  {project.name} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
