# AGENTS.md

Guidance for AI agents working in this repo.

## Verify before you claim done

```shell
npm run lint && npm run check && npm run build
```

All three must pass. This is exactly what CI runs, in that order.

- `lint` = Prettier check **then** ESLint. A Prettier failure means ESLint never ran.
- `check` = `svelte-check`, expected to report **0 errors and 0 warnings**. If it starts
  warning about `Unused CSS selector`, that is not noise: it means a selector targets
  mdsvex-generated markup and cannot match it.
- `build` fails on any prerender error by design.

## Conventions

- Prettier is the source of truth for formatting: `npm run format`, never hand-format.
  Tabs, single quotes, no trailing commas, 100 cols.
- Comments explain **why**, not what. Match the density of the surrounding code.
- Components are grouped `atoms` → `molecules` → `organisms`.
- Styling is SCSS using the design tokens in `src/lib/scss/_themes.scss`
  (`--surface`, `--border`, `--text`, `--muted`, `--accent`, `--gutter`). Do not hardcode
  colours in components.
- Static site. No server runtime, no database, no env vars needed to build.

## Things that will bite you

- **Adding a blog post?** Read `docs/content.md`. The path must be
  `src/routes/(blog-article)/<slug>/+page.md` (glob is depth-sensitive) and adding a
  `techStack` key makes the post **disappear** from all listings.
- **Unquoted frontmatter values cannot contain `": "`.** This fails the build now, but
  it used to silently ship 500 pages — do not relax `handleHttpError`.
- **`onDestroy()` inside `onMount()` throws** in Svelte and the cleanup silently never
  registers. Return the cleanup function from `onMount` instead.
- **Never style mdsvex output from a component `<style>` block.** Svelte appends a scope
  class to each selector it compiles, and mdsvex markup carries no such class — so
  `:global(.content) p { … }` compiles to `.content p.svelte-x` and silently never
  matches. `:global { … }` block syntax is Svelte 5+, not 3. Put markdown styles in the
  global stylesheet (`_markdown.scss`, `_project-markdown.scss`) instead.
- **Math works**, via a hand-rolled rehype pass in `svelte.config.js` — not
  `remark-math`, which is inert under mdsvex 0.11 (its bundled parser never registers
  micromark extensions). Keep the delimiter rules: no whitespace next to `$`, and never
  treat a bare number as math, or prose like "$500+/node … $1,000" turns into math.
  Never "simplify" it back to `remark-math`.
- The homepage bento grid is hardcoded to five slugs; `featured: true` does not control
  it. See `docs/content.md`.
- `eslint-plugin-svelte3` needs `settings: { 'svelte3/typescript': ... }` in
  `.eslintrc.cjs` or every `<script lang="ts">` file fails with a ParseError.

## Do not

- Commit `build/`, `.vercel/`, `taste-skill.md`, or `stitch_portfolio_ui_redesign/` —
  they are gitignored.
- Add a dependency to work around something the existing SCSS or Svelte already does.
  This repo deliberately has no animation or component library.
