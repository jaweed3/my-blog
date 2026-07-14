# wedjaw.my.id

Personal blog and portfolio of Fatih Jawwad — ML Engineer, Edge AI specialist, OSS contributor.

Built with [SvelteKit](https://kit.svelte.dev/) + static adapter. Deployed via GitHub Pages.

## Tech

- SvelteKit 3.x + TypeScript
- SCSS design system (dark theme)
- MDsveX for blog posts
- WebGL simplex noise shader background
- svelte-sitemap for SEO

## Local dev

```shell
npm install
npm run dev
```

## Build

```shell
npm run build
```

Output goes to `build/` — static HTML/CSS/JS, deploy anywhere.

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages.
