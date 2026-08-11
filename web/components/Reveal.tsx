"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

/**
 * Fades a section in as it scrolls into view. Starts visible, so if JS never
 * runs — or an observer never fires — nothing is hidden permanently.
 */
export function Reveal({
  children,
  as: Tag = "section",
  ...rest
}: {
  children: ReactNode;
  as?: "section" | "div";
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (reduceMotion || !node) return;

    // Only hide what starts below the fold.
    if (node.getBoundingClientRect().top <= window.innerHeight * 1.05) return;
    setHidden(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHidden(false);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    observer.observe(node);

    const failsafe = setTimeout(() => setHidden(false), 2600);
    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, [reduceMotion]);

  const className = ["reveal", hidden ? "reveal--hidden" : "", rest.className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag {...rest} ref={ref as React.Ref<HTMLElement & HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
