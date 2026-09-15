# public/assets

Static files served at `/assets/*`. Referenced from `web/content/site.ts` and
`web/content/projects.ts` — rename a file there too if you rename it here.

| File | Referenced by | Notes |
|---|---|---|
| `resume.pdf` | `LINKS.resume` in `content/site.ts` | The two "Download résumé" buttons |
| `headshot-hero.jpg` | `app/page.tsx` | **4:5** portrait crop, 800×1000 or larger |
| `about-hiking.jpg` | `app/page.tsx` | **16:9** landscape, 1600 px wide is plenty. If you swap the photo, give the file a new name — see the caching note in `.github/workflows/deploy.yml` |
| `<project>.png` | `image` on a project in `content/projects.ts` | Project screenshots. Until one exists the card draws a schematic placeholder |

The link-preview image (what Slack/LinkedIn/iMessage show) isn't a file here —
it's rendered at build time from `app/opengraph-image.tsx`.

Missing files are handled at build time (`lib/assets.ts`): a headshot that
isn't there means the silhouette renders and nothing is requested, rather than
a 404 for every visitor.

Keep photos under ~300 KB. `sips` ships with macOS:

    sips -Z 1200 headshot-hero.jpg
