# Portfolio — Holland Hargens

Personal site and project index. Next.js, TypeScript, statically exported.

Each project lives in its own repo and deploys on its own. This site is the
front door: a page per project with the writeup, the stack, and links out to
wherever that project actually runs.

---

## Running it

```bash
npm run dev          # http://localhost:3000
```

From the repo root — it forwards to `web/`. First time, run `npm run install:web`.

Checks, all of which pass clean:

```bash
npm run lint
npm run typecheck
npm run build        # emits web/out/ — plain HTML/CSS/JS, no server
```

---

## Layout

```
web/
├── app/
│   ├── layout.tsx              Shell: fonts, metadata, nav, footer, status bar
│   ├── page.tsx                Homepage
│   ├── globals.css             All styling. Palette is the :root block at the top
│   ├── not-found.tsx           404
│   └── projects/[slug]/page.tsx   One page per project, generated at build
├── components/                 Nav, cards, boot sequence, trace rails, photos
├── content/
│   ├── projects.ts             ← every project. Add one here and you're done
│   └── site.ts                 ← name, links, jobs, education, skills, about
└── public/assets/              resume.pdf, headshots, screenshots

design/                         Archived Claude Design export the layout came from.
                                Reference only; nothing imports it. Safe to delete.
site-notes.md                   Original planning notes.
amplify.yml                     Build spec, only used if you deploy via AWS Amplify.
```

### Adding a project

Append one object to `PROJECTS` in [`web/content/projects.ts`](web/content/projects.ts).
That entry generates the detail page at `/projects/<slug>`, the homepage card,
and the OG tags. Nothing else to touch.

```ts
{
  slug: "flex-pga-tracker",
  name: "Flex-PGA Fitness Tracker",
  designator: "M4",
  year: "2026",
  role: "Team of 4 · RTL",
  summary: "One or two sentences for the card.",
  body: ["A paragraph.", "Another paragraph."],
  tags: ["SystemVerilog", "Vivado"],
  links: [],           // fill in as each repo goes public
}
```

`links` can be empty — the page renders fine and shows a note where the buttons
would go, rather than a dead link. Add entries as repos get cleaned up:

```ts
links: [
  { label: "Source", href: "https://github.com/hargens-holland/eeg-seizure" },
  { label: "Live demo", href: "https://eeg.hollandhargens.com" },
]
```

Array order is page order. Exactly one project should have `featured: true` —
it gets the big card.

Write `summary` and `body` for someone deciding whether to look. The repo's
README is for someone who already decided.

### Other common edits

| I want to… | Edit |
|---|---|
| Change my bio, jobs, skills, contact links | `web/content/site.ts` |
| Add my LinkedIn | `LINKS.linkedin` — empty string hides it everywhere |
| Change colors or spacing | The `:root` block in `web/app/globals.css` |
| Change the rotating "Currently building ___" | `HERO.roles` in `content/site.ts` |
| Change link-preview text | `metadata` in `web/app/layout.tsx` |

---

## Deploying

`npm run build` produces `web/out/` — a directory of static files. No server, no
runtime, nothing to keep alive. Any static host serves it.

### AWS (S3 + CloudFront)

The setup this is built for.

1. S3 bucket, **not** public — CloudFront reaches it through an Origin Access
   Control, so the bucket itself stays private.
2. CloudFront distribution in front, with `index.html` as the default root
   object and a 403/404 → `/404.html` error response.
3. ACM certificate **in us-east-1** (CloudFront only reads certs from there).
4. Deploy is `aws s3 sync web/out/ s3://<bucket> --delete` followed by a
   CloudFront invalidation. Wire it to GitHub Actions with OIDC so no
   long-lived AWS keys ever live in GitHub.

Running cost is roughly **$6–20/year**: CloudFront's 1 TB/month egress is
permanently free tier, S3 storage for a 1.4 MB site is cents, and the only real
line item is Route 53's $0.50/month hosted zone — which drops to $0 if you use
Cloudflare for DNS instead.

Set a **billing alarm at $10** before creating any of it.

### Anything else

Vercel, Netlify, Cloudflare Pages, or GitHub Pages all serve `web/out/`
directly. AWS Amplify works too and reads `amplify.yml` automatically.

### Custom domain

Point the apex at CloudFront, then update `SITE.url` in `web/content/site.ts` —
it drives the canonical and OG tags, which otherwise advertise the wrong
address to Google and link previews.

---

## Project backends

This site has none, on purpose. Nothing here is computed at request time.

Each project brings its own — the EEG repo, for instance, holds the FastAPI
service and its Dockerfile. Projects deploy wherever suits them (Render,
Fly.io, AWS App Runner), keep their own URLs, and this site just links to them.
A project's backend belongs with the project, not here.

---

## Still open

- [ ] `web/public/assets/resume.pdf` — both download buttons point at it
- [ ] `headshot-hero.jpg` (4:5) and `headshot-about.jpg` (1:1) — silhouette shows until then
- [ ] LinkedIn URL → `LINKS.linkedin`
- [ ] Repo and demo URLs → each project's `links`
- [ ] Project screenshots → each project's `image`
- [ ] The remaining projects (2 in so far)
- [ ] Domain, and `SITE.url` updated to match
