import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";

/**
 * The link-preview card: what Slack, LinkedIn, iMessage, and search results
 * show next to a link to this site. Rendered once at build time by
 * app/opengraph-image.tsx (the homepage) and app/projects/[slug]/
 * opengraph-image.tsx (one per project), both of which just call this.
 *
 * ImageResponse can't use next/font, so the two faces it needs ship as
 * plain TTFs in app/fonts — build-time only, never sent to a visitor.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Palette, copied from the :root block in globals.css. Satori draws from the
// values here, not from the stylesheet.
const BG = "#0D110F";
const PANEL = "#182A20";
const LINE = "#2E4739";
const TEXT = "#F4F8F4";
const MUTE = "#B3C4B7";
const COPPER = "#B4501F";
const COPPER_LIGHT = "#F2A263";
const OK = "#8FC79C";

const fontsDir = join(process.cwd(), "app", "fonts");

async function fonts() {
  const [display, mono] = await Promise.all([
    readFile(join(fontsDir, "SpaceGrotesk-Bold.ttf")),
    readFile(join(fontsDir, "IBMPlexMono-Regular.ttf")),
  ]);
  return [
    { name: "Space Grotesk", data: display, weight: 700 as const, style: "normal" as const },
    { name: "IBM Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

export async function ogImage({
  eyebrow,
  title,
  subtitle,
  chips,
}: {
  /** Small mono line above the title, e.g. "M1 · flex-pga". */
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Tags along the bottom. */
  chips: readonly string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          color: TEXT,
          fontFamily: "IBM Plex Mono",
        }}
      >
        {/* Copper rail down the left edge, like the eyebrow pads on the site. */}
        <div style={{ width: 18, height: "100%", background: COPPER, display: "flex" }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 56px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: OK, letterSpacing: 2 }}>
              [ OK ]&nbsp;&nbsp;{eyebrow}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 36,
                fontFamily: "Space Grotesk",
                fontSize: 84,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: TEXT,
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 28,
                maxWidth: 940,
                fontSize: 27,
                lineHeight: 1.45,
                color: MUTE,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 28,
              borderTop: `1px solid ${LINE}`,
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    background: PANEL,
                    fontSize: 19,
                    color: TEXT,
                  }}
                >
                  <div style={{ width: 14, height: 5, background: COPPER, display: "flex" }} />
                  {chip}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 20, color: COPPER_LIGHT, letterSpacing: 2 }}>
              {SITE.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
