# wedjaw.my.id

Personal site of **Fatih Jawwad** — ML Engineer, Edge AI specialist, OSS contributor.
Blog + portfolio + résumé, built as a fully static site.

Live: [wedjaw.my.id](https://wedjaw.my.id) · Feed: `/rss.xml`

## Stack

|               |                                                                       |
| ------------- | --------------------------------------------------------------------- |
| Framework     | SvelteKit 1.x on Svelte 3.54, `@sveltejs/adapter-static`              |
| Content       | MDsveX 0.11 (`.md` compiled to Svelte components)                     |
| Styling       | SCSS design system, single dark theme                                 |
| Highlighting  | Prism via mdsvex (`prismjs` + `prism-svelte`)                         |
| Math          | KaTeX, rendered at build time via a rehype pass in `svelte.config.js` |
| Components    | [Histoire](https://histoire.dev/) for the component workshop          |
| SEO           | `svelte-sitemap`, per-page JSON-LD, Open Graph tags                   |
| Type checking | `svelte-check` + `jsconfig.json` (`strict`, `checkJs`)                |

Output is plain static HTML/CSS/JS in `build/` — no server runtime anywhere.

## Requirements

**Node 20** (what CI uses). No database, no Docker, no env vars required for the
normal build.

## Getting started

```shell
npm install
npm run dev          # http://localhost:5173, exposed on the LAN (--host)
```

## Scripts

| Script                    | What it does                                          |
| ------------------------- | ----------------------------------------------------- |
| `npm run dev`             | Dev server with HMR                                   |
| `npm run build`           | Static build → `build/`, then generates `sitemap.xml` |
| `npm run preview`         | Serve the production build locally                    |
| `npm run lint`            | Prettier check **then** ESLint                        |
| `npm run format`          | Prettier write                                        |
| `npm run check`           | `svelte-check` type check                             |
| `npm run check:watch`     | Same, in watch mode                                   |
| `npm run story:dev`       | Histoire component workshop                           |
| `npm run vercel-build`    | Build + sitemap + image optimization for Vercel       |
| `npm run optimize-images` | Re-encode `build/images` to png/webp/avif             |

### Quality gates

`npm run lint` and `npm run check` both run in CI **before** the build, and the build
fails on any prerender error. If you touch this repo, run all three locally:

```shell
npm run lint && npm run check && npm run build
```

Two things will fail the build that used to pass silently:

- **Prerender errors.** `handleHttpError` is `'fail'`. A malformed frontmatter block
  produces a route with `slug: undefined` and a 500 page — the build now stops instead
  of shipping it.
- **Malformed YAML.** An unquoted frontmatter value containing `": "` breaks the parse
  (see [docs/content.md](docs/content.md#yaml-gotcha)).

## Routes

| URL                                           | Source                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `/`                                           | `src/routes/(waves)/` — hero, work, skills, writing                       |
| `/<slug>`                                     | `src/routes/(blog-article)/<slug>/+page.md` — blog posts live at the root |
| `/projects`                                   | Full project list, filterable by tag                                      |
| `/projects/<slug>`                            | Project detail + prev/next navigation                                     |
| `/writing`                                    | All posts                                                                 |
| `/resume`, `/roadmap`, `/playground`, `/hire` | Static-ish pages                                                          |
| `/rss.xml`                                    | Generated feed                                                            |

`(waves)` and `(blog-article)` are SvelteKit **route groups** — the parentheses mean
they contribute no URL segment.

## Project structure

```
src/
├── lib/
│   ├── actions/reveal.ts      scroll-reveal action (IntersectionObserver)
│   ├── components/            atoms → molecules → organisms
│   ├── data/                  blog-posts/ and projects/ loaders + content
│   ├── icons/                 inline SVG components
│   ├── scss/                  design system (tokens, mixins, markdown, themes)
│   └── utils/                 shared types + regex
└── routes/
    ├── (blog-article)/<slug>/+page.md    one file per post
    ├── (waves)/                          home, writing, resume, roadmap, playground
    ├── projects/[slug]/                   project detail
    └── rss.xml/+server.ts
```

Content lives in data files, not in the components: posts are `.md` files with
frontmatter, projects are `.md` files in `src/lib/data/projects/content/`. Both are
glob-imported at build time.

## Adding content

See **[docs/content.md](docs/content.md)** — frontmatter reference for posts and
projects, the URL/path rules, and the traps that silently hide a page.

## Animations

Scroll reveal is one Svelte action, no animation library:

```svelte
<script>
	import { reveal } from '$lib/actions/reveal';
</script>

<div use:reveal>…</div><div use:reveal={{ delay: 120 }}>…</div> <!-- stagger -->
```

The hidden state is applied by the action on the client, so prerendered HTML is fully
visible without JS, and the whole thing is skipped under
`prefers-reduced-motion: reduce`.

## Deploy

Two independent targets:

- **GitHub Pages** — push to `main`, `.github/workflows/deploy.yml` runs
  lint → check → build → deploy.
- **Vercel** — `npm run vercel-build`, which targets `.vercel/output/static`.

Both need the domain updated in two places if it changes:
`package.json` (`postbuild`/`vercel-sitemap`) and `src/lib/data/meta.ts`
(`siteBaseUrl`, plus `image`).

## Known limitations

- Math (`$…$` / `$$…$$`) **is** supported and rendered to static HTML at build time — no
  client-side JS. See [docs/content.md](docs/content.md#math) for the syntax and the
  currency-lookalike rules.
- `getRelatedPosts` in `src/lib/data/blog-posts/utils.ts` re-scans and re-sorts every
  post for each post — O(n²) in tag comparisons. Irrelevant at 13 posts; revisit if
  that changes.
- KaTeX pulls ~290 KB of woff2 fonts into `build/_app/immutable/assets/`, but a browser
  only downloads the families a page actually uses.
- Newer projects have no `coverImage`, so their `og:image` is empty and link previews
  render without an image.
