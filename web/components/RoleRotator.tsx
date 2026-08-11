"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

export function RoleRotator({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length, reduceMotion]);

  return (
    <span className="rotator">
      {roles[index]}
      <span className="caret" />
    </span>
  );
}
