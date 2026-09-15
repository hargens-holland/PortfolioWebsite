import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Build-time check that a file under /public actually exists.
 *
 * The site is exported statically, so every page is rendered once, on the
 * build machine, where the filesystem is right there. Checking here means a
 * missing headshot or screenshot is decided at build time — the page simply
 * renders its fallback — rather than every visitor's browser requesting the
 * file, getting a 404, and then swapping in the fallback.
 *
 * Server components only: this reaches for node:fs, which doesn't exist in
 * the browser bundle.
 *
 *   publicAsset("/assets/headshot-hero.jpg")  // "/assets/headshot-hero.jpg" or undefined
 */
export function publicAsset(path: string | undefined): string | undefined {
  if (!path) return undefined;
  return existsSync(join(process.cwd(), "public", path)) ? path : undefined;
}
