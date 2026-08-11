"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/content/site";

/** Fake uptime counter and current-section readout along the bottom edge. */
export function StatusBar() {
  const [seconds, setSeconds] = useState(0);
  const [section, setSection] = useState("top");

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSection((entry.target as HTMLElement).dataset.section ?? "top");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="statusbar">
      <span className="statusbar__left">
        <span className="statusbar__dot" />
        <span>
          uptime {mm}:{ss}
        </span>
      </span>
      <span className="statusbar__mid">
        {SITE.nameLower} · portfolio {SITE.revision}
      </span>
      <span className="statusbar__right">sect: {section}</span>
    </div>
  );
}
