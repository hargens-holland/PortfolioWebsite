"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

const PATHS = [
  "M16 0 L16 1400 L40 1424 L40 4600 L16 4624 L16 6600",
  "M88 0 L88 2600 L112 2624 L112 5400 L88 5424 L88 6600",
  "M160 0 L160 800 L136 824 L136 3800 L160 3824 L160 6600",
];

/** Layered strokes that read as one glowing conductor. */
const FILAMENTS = [
  { stroke: "#3C9377", width: 5, dash: "118 1882", opacity: 0.1, filter: "blur(4.5px)" },
  { stroke: "#43A583", width: 4.2, dash: "94 1906", opacity: 0.14, filter: "blur(3.2px)" },
  { stroke: "#4FB894", width: 3.6, dash: "72 1928", opacity: 0.19, filter: "blur(2.4px)" },
  { stroke: "#5CC6A0", width: 3, dash: "54 1946", opacity: 0.25, filter: "blur(1.7px)" },
  { stroke: "#79D9B4", width: 2.6, dash: "38 1962", opacity: 0.34, filter: "blur(1.1px)" },
  { stroke: "#A6E8CD", width: 2.4, dash: "25 1975", opacity: 0.5, filter: "blur(0.6px)" },
  { stroke: "#CFF3E2", width: 2.3, dash: "15 1985", opacity: 0.78, filter: "blur(0.25px)" },
  {
    stroke: "#EAFBF3",
    width: 2.2,
    dash: "8 1992",
    opacity: 1,
    filter:
      "drop-shadow(0 0 6px rgba(190,240,220,.6)) drop-shadow(0 0 13px rgba(110,215,180,.4))",
  },
];

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

/**
 * Decorative PCB traces down the left gutter, each pulsing on its own
 * randomized schedule. setTimeout only — no per-frame JS.
 */
export function TraceRails() {
  const ref = useRef<SVGSVGElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || !ref.current) return;

    const groups = Array.from(ref.current.querySelectorAll<SVGGElement>(".pulse"));
    const timers: ReturnType<typeof setTimeout>[] = [];

    groups.forEach((group) => {
      const schedule = () => {
        const duration = rand(9, 13);
        group.style.setProperty("--dur", `${duration.toFixed(2)}s`);
        group.classList.remove("pulse--running");
        void group.getBoundingClientRect().width; // force reflow so it restarts
        group.classList.add("pulse--running");

        timers.push(
          setTimeout(() => {
            group.classList.remove("pulse--running");
            timers.push(setTimeout(schedule, rand(6.4, 17.6) * 1000));
          }, duration * 1000),
        );
      };
      timers.push(setTimeout(schedule, rand(0.5, 9) * 1000));
    });

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <div className="rails" aria-hidden="true">
      <svg ref={ref} viewBox="0 0 176 6600" preserveAspectRatio="none">
        {PATHS.map((d) => (
          <path key={d} d={d} fill="none" stroke="#2B5A4A" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        ))}
        {PATHS.map((d) => (
          <g className="pulse" key={`pulse-${d}`}>
            {FILAMENTS.map((f) => (
              <path
                key={f.stroke}
                d={d}
                pathLength={1000}
                fill="none"
                stroke={f.stroke}
                strokeWidth={f.width}
                strokeLinecap="round"
                strokeDasharray={f.dash}
                vectorEffect="non-scaling-stroke"
                opacity={f.opacity}
                style={{ filter: f.filter }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
