"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { BOOT_LINES } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

const STORAGE_KEY = "hh-portfolio-boot-seen";

/**
 * localStorage as an external store. Only this component writes to it, and the
 * `finished` state below covers that write, so the subscription is a no-op.
 */
const subscribe = () => () => {};

function hasSeenBoot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true; // private browsing — don't nag
  }
}

// On the server, assume seen: the overlay then never renders in the HTML and
// can't get stuck on screen for a visitor whose JS fails.
const seenOnServer = () => true;

/**
 * Power-on self-test overlay. Shows once per browser, then is remembered.
 */
export function BootSequence() {
  const seen = useSyncExternalStore(subscribe, hasSeenBoot, seenOnServer);
  const reduceMotion = usePrefersReducedMotion();

  const [finished, setFinished] = useState(false);
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  const visible = !seen && !reduceMotion && !finished;

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // private browsing — just don't remember it
    }
    setFinished(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setStep(i + 1), 260 + i * 340),
    );
    timers.push(setTimeout(() => setFading(true), 1980));
    timers.push(setTimeout(finish, 2380));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
    // `finish` is stable; re-running only when visibility flips is intended.
  }, [visible, finish]);

  if (!visible) return null;

  return (
    <div className={`boot${fading ? " boot--fading" : ""}`}>
      <div className="boot__lines">
        {BOOT_LINES.map((line, i) => (
          <div key={line.text} className={`boot__line${i < step ? " boot__line--shown" : ""}`}>
            <span className="boot__tag">{line.tag}</span>
            <span>{line.text}</span>
          </div>
        ))}
      </div>
      <button className="boot__skip" type="button" onClick={finish}>
        Skip ▸
      </button>
    </div>
  );
}
