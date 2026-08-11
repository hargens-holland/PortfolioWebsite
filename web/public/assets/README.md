# public/assets

Static files served at `/assets/*`. Referenced from `web/content/site.ts` and
`web/content/projects.ts` — rename a file there too if you rename it here.

| File | Referenced by | Notes |
|---|---|---|
| `resume.pdf` | `LINKS.resume` in `content/site.ts` | The two "Download résumé" buttons |
| `headshot-hero.jpg` | `app/page.tsx` | **4:5** portrait crop, 800×1000 or larger |
| `headshot-about.jpg` | `app/page.tsx` | **1:1** square crop, 800×800 or larger. Can be the same photo cropped differently |
| `og-cover.png` | commented out in `app/layout.tsx` | 1200×630 — the picture in Slack/LinkedIn/iMessage previews. Drop it in and uncomment the `images` line |
| `<project>.png` | `image` on a project in `content/projects.ts` | Project screenshots. Until one exists the card shows the filename in a placeholder frame |

Missing headshots degrade gracefully — `components/Photo.tsx` falls back to the
silhouette rather than showing a broken image.

Keep photos under ~300 KB. `sips` ships with macOS:

    sips -Z 1200 headshot-hero.jpg
