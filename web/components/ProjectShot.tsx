import Image from "next/image";
import type { Project } from "@/content/projects";
import { publicAsset } from "@/lib/assets";

type Variant = "featured" | "wide" | "banner";

const SIZES: Record<Variant, string> = {
  featured: "(max-width: 900px) 100vw, 640px",
  wide: "(max-width: 900px) 100vw, 550px",
  banner: "(max-width: 900px) 100vw, 1120px",
};

/**
 * The picture slot on a project card or page.
 *
 * With a screenshot (`image` in content/projects.ts, and the file present in
 * /public) it renders the image. Without one it draws a schematic-style
 * placeholder — a chip outline carrying the project's board designator — so
 * a project with no screenshot yet still looks like it belongs on the board
 * rather than like something is missing.
 *
 * Whether the file exists is decided at build time; see lib/assets.ts.
 */
export function ProjectShot({ project, variant }: { project: Project; variant: Variant }) {
  const src = publicAsset(project.image);
  const modifier = variant === "featured" ? "" : ` shot--${variant}`;

  if (src) {
    return (
      <div className={`shot shot--image${modifier}`}>
        <Image
          className="shot__img"
          src={src}
          alt={`${project.name} — screenshot`}
          fill
          sizes={SIZES[variant]}
        />
      </div>
    );
  }

  return (
    <div className={`shot${modifier}`} aria-hidden="true">
      <Schematic project={project} />
    </div>
  );
}

/** Pins along one edge of the chip outline. */
function pins(count: number, axis: "x" | "y", start: number, step: number, fixed: number, len: number, thick: number) {
  return Array.from({ length: count }, (_, i) => {
    const pos = start + i * step;
    return axis === "x" ? (
      <rect key={i} x={pos - thick / 2} y={fixed} width={thick} height={len} />
    ) : (
      <rect key={i} x={fixed} y={pos - thick / 2} width={len} height={thick} />
    );
  });
}

function Schematic({ project }: { project: Project }) {
  const gridId = `grid-${project.slug}`;

  // Chip body, centred in a 400×250 frame.
  const chip = { x: 108, y: 78, w: 184, h: 94 };

  return (
    <svg className="shot__schematic" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Silkscreen grid */}
      <rect className="schem__grid" width="400" height="250" fill={`url(#${gridId})`} />

      {/* Fiducials in the corners */}
      <g className="schem__fiducial">
        <circle cx="24" cy="24" r="3" />
        <circle cx="376" cy="24" r="3" />
        <circle cx="24" cy="226" r="3" />
        <circle cx="376" cy="226" r="3" />
      </g>

      {/* Traces running in to the chip */}
      <g className="schem__trace">
        <path d={`M0 ${chip.y + 22} H${chip.x - 14}`} />
        <path d={`M0 ${chip.y + chip.h - 22} H${chip.x - 14}`} />
        <path d={`M400 ${chip.y + 22} H${chip.x + chip.w + 14}`} />
        <path d={`M400 ${chip.y + chip.h - 22} H${chip.x + chip.w + 14}`} />
        <path d={`M${chip.x + chip.w / 2} 0 V${chip.y - 12}`} />
        <path d={`M${chip.x + chip.w / 2} 250 V${chip.y + chip.h + 12}`} />
      </g>

      {/* Pins */}
      <g className="schem__pin">
        {pins(10, "x", chip.x + 20, 16, chip.y - 10, 10, 4)}
        {pins(10, "x", chip.x + 20, 16, chip.y + chip.h, 10, 4)}
        {pins(5, "y", chip.y + 15, 16, chip.x - 10, 10, 4)}
        {pins(5, "y", chip.y + 15, 16, chip.x + chip.w, 10, 4)}
      </g>

      {/* Chip body */}
      <rect className="schem__body" x={chip.x} y={chip.y} width={chip.w} height={chip.h} />
      {/* Pin-1 marker */}
      <circle className="schem__pin1" cx={chip.x + 12} cy={chip.y + 12} r="3" />

      <text className="schem__designator" x="200" y="128" textAnchor="middle">
        {project.designator}
      </text>
      <text className="schem__label" x="200" y="152" textAnchor="middle">
        {project.slug}
      </text>
    </svg>
  );
}
