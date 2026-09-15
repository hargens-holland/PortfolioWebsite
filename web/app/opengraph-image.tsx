import { HERO, SITE } from "@/content/site";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

// Required by `output: "export"` — tells Next this is a build-time file, not a request-time route.
export const dynamic = "force-static";

// /opengraph-image.png — the homepage's link-preview card. Next picks this
// file up by name and adds the og:image / twitter:image tags for it.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = SITE.title;

export default function Image() {
  return ogImage({
    eyebrow: "bring-up complete",
    title: SITE.name,
    subtitle: SITE.description,
    chips: HERO.chips.slice(0, 3),
  });
}
