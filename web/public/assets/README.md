# public/assets

Static files served at `/assets/*`. Referenced from `web/content/site.ts` and
`web/content/projects.ts` — rename a file there too if you rename it here.

| File | Referenced by | Notes |
|---|---|---|
| `resume.pdf` | `LINKS.resume` in `content/site.ts` | The two "Download résumé" buttons |
| `headshot-hero.jpg` | `app/page.tsx` | **4:5** portrait crop, 800×1000 or larger |
| `about-hiking.jpg` | `app/page.tsx` | **4:3** landscape (a phone photo as shot), 1600 px wide is plenty. If you swap the photo, give the file a new name — see the caching note in `.github/workflows/deploy.yml` |
| `<project>.png` | `image` on a project in `content/projects.ts` | Project screenshots. Until one exists the card draws a schematic placeholder |
| `whack-a-mole.mp4` | `video` on `whack-a-mole-pcb` | Short clip of the board running, shown on the project page. Keep it well under 10 MB: H.264 MP4, 720p is plenty (`ffmpeg -i in.mov -vf scale=-2:720 -c:v libx264 -crf 28 -an whack-a-mole.mp4`) |
| `whack-a-mole-board.jpg` | `image` on `whack-a-mole-pcb` | A still frame from the video: the video's poster and the row thumbnail |
| `mlp-vlsi-top-level-layout.png` | `image` on `mlp-vlsi` | The team's top-level layout, captioned on the page |

The link-preview image (what Slack/LinkedIn/iMessage show) isn't a file here —
it's rendered at build time from `app/opengraph-image.tsx`.

Missing files are handled at build time (`lib/assets.ts`): a headshot that
isn't there means the silhouette renders and nothing is requested, rather than
a 404 for every visitor.

Keep photos under ~300 KB. `sips` ships with macOS:

    sips -Z 1200 headshot-hero.jpg
