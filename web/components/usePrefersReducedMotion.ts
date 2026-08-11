"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server can't know the preference; false keeps SSR and the first client
// render in agreement, and the real value arrives before anything animates.
const getServerSnapshot = () => false;

/** Tracks the user's `prefers-reduced-motion` setting, live. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
