# Adding content

Everything on this site is a markdown file with frontmatter. Nothing is created through
a CMS or an admin UI.

- **Blog posts** → `src/routes/(blog-article)/<slug>/+page.md`
- **Projects** → `src/lib/data/projects/content/<slug>.md`

---

## Blog posts

### Path rules

The glob in `src/lib/data/blog-posts/utils.ts` is depth-sensitive:

```js
import.meta.glob('$routes/*/*/*.md'); // src/routes/(group)/<slug>/+page.md
import.meta.glob('$routes/*/*/*/*.md'); // one level deeper, also supported
```

So the filename **must** be `+page.md`, and it must sit exactly one directory below a
route group. A post dropped at `src/routes/my-post.md` is silently ignored.

The URL is `/<slug>` — the `(blog-article)` group adds no path segment. There is no
`/blog/` prefix.

### Frontmatter

```yaml
---
slug: kws-pi5-revision # must match the directory name
title: 'Post title' # quoted if it contains : or starts with a special char
date: 2026-08-14T10:00:00.000Z # ISO; drives sort order
excerpt: 'One or two sentences. Used for cards, RSS and meta description.'
tags:
  - Edge AI
  - Embedded Systems
keywords:
  - optional # SEO keywords; falls back to tags
coverImage: /images/posts/foo.png # optional; also used as og:image
hidden: false # true keeps it off the blog but leaves the page reachable
---
```

| Key          | Required | Used for                                      |
| ------------ | -------- | --------------------------------------------- |
| `slug`       | yes      | Must match the directory name                 |
| `title`      | yes      | `<h1>`, `<title>`, RSS, JSON-LD `headline`    |
| `date`       | yes      | Sort order, `<time>`, JSON-LD `datePublished` |
| `excerpt`    | yes      | Cards, RSS `<description>`, meta description  |
| `tags`       | yes      | Related posts, tag filters, `<meta keywords>` |
| `keywords`   | no       | Extra SEO keywords                            |
| `coverImage` | no       | og:image, social cards                        |
| `hidden`     | no       | `true` = excluded from listings               |
| `updated`    | no       | JSON-LD `dateModified`; falls back to `date`  |

The body is normal markdown. Fenced code blocks are highlighted by Prism — label them
(` ```bash `) to get highlighting. Unlabelled fences render fine as plain text.

---

## Projects

### Frontmatter

```yaml
---
title: Poultry Edge Disease Detection
slug: poultry-edge # must match the filename
description: 'One line. Meta description.'
excerpt: 'One or two sentences. Shown on cards and the homepage strip.'
date: 2026-09-30
tags:
  - Edge AI # drives the /projects tag filters
techStack:
  - PyTorch
  - ONNX Runtime
github: https://github.com/jaweed3/paper_poultry_edge
status: active # active | wip | archived
featured: true # see "Where projects appear" below
hidden: false
impact: 'One sentence: what this changed.'
stats:
  - value: '8,770'
    label: 'Training Images'
  - value: '98.35%'
    label: 'Best Test Accuracy'
problem: 'What was broken, concretely.'
results:
  - 'Measured outcome one'
  - 'Measured outcome two'
outcome: 'What it enabled.'
---
```

Everything except `coverImage` is required in practice — the detail page reads these
fields directly. Keep stat `value` as a string (`'8,770'`, `'1.58-bit'`) so YAML does
not mangle the formatting.

### Where projects appear

`featured` and `hidden` do **not** control what you see on the homepage. The
"Featured Work" bento grid is hardcoded to five slugs in
`src/routes/(waves)/+page.svelte`:

| Slug                | Slot   |
| ------------------- | ------ |
| `vibesentinel`      | hero   |
| `retakid`           | small  |
| `perpusgate`        | small  |
| `burn-recsys`       | accent |
| `rescuevision-edge` | wide   |

Adding a project does **not** put it there. New work shows up in:

1. the **Latest Work** strip (6 newest by `date`, homepage), and
2. `/projects` and `/projects/<slug>`.

To change what the bento shows, edit those slug checks directly.

---

## Math

Inline `$…$`, display `$$…$$`. Rendered by KaTeX at build time, so the result is plain
HTML in `build/` — works without JS, and search engines and copy-paste see the result.

```markdown
Inline math: the loss is $E = mc^2$ and the gradient $\frac{\partial \mathcal{L}}{\partial w}$.

$$
\frac{\partial \mathcal{L}}{\partial w} = \sum_{i=1}^{n} (\hat{y}_i - y_i)\, x_i
$$
```

### Rules that will bite you

- **No whitespace next to the delimiters.** `$x$`, not `$ x $`. This is what keeps prose
  like "$500+/node, imagery at $1,000" from being read as math — there is always a space
  next to one of those `$`.
- **A bare number is never math.** `$15` stays text.
- **Code fences and inline code are untouched.** `$…$` inside `` ` `` or a fenced block
  is left alone.
- **Broken LaTeX does not fail the build.** It renders as a red `katex-error` span, so a
  typo degrades one expression instead of taking the site down.

### Why it isn't remark-math

`remark-math` is installed-but-unused and cannot work here: mdsvex 0.11 parses markdown
with its own bundled parser rather than `remark-parse`, so micromark extensions never
register and it produces zero math nodes. The renderer is a rehype pass over text nodes
in `svelte.config.js` instead — the last stage that reliably sees prose. It also escapes
`{`/`}` to entities, because Svelte's template parser reads a literal brace as the start
of a mustache and would otherwise reject the page.

---

## Traps

### The `techStack` trap (blog posts)

`filterPosts` excludes any post that has a `techStack` key:

```js
// src/lib/data/blog-posts/utils.ts
.filter((post) => !post.hidden && !(post as any).techStack)
```

`techStack` is a **project** field. Adding it to a post's frontmatter makes the post
vanish from `/`, `/writing` and the RSS feed while its page stays live. No post
currently uses it.

### YAML gotcha

An unquoted scalar cannot contain `": "`. YAML reads `foo: bar: baz` as a nested
mapping and the whole frontmatter block fails to parse:

```yaml
excerpt: A guide to this: with a colon # breaks — parse error
excerpt: 'A guide to this: with a colon' # fine
```

This used to fail _silently_ — the post rendered as a route with `slug: undefined` and
shipped a 500 page. The build now fails on it (`handleHttpError: 'fail'`), so you will
find out immediately.

Same trap applies to any frontmatter value, including inside `stats` and `results`.

### `coverImage` and og:image

`coverImage` is optional. Without it the page still builds, but `og:image` is empty and
social/chat link previews show no image. Put files in `static/images/features/` and
reference them without a leading slash (`images/features/foo.jpg`) to match the existing
entries.

### Related posts are tag-based

`getRelatedPosts` scores every other visible post by how many tags it shares and takes
the top 3. Tagging a post identically to an unrelated one will surface it as "related"
whether or not that makes sense.

---

## After adding content

```shell
npm run lint && npm run check && npm run build
```

Then confirm the page actually exists in the output:

```shell
ls build/<slug>.html              # blog post
ls build/projects/<slug>.html     # project
grep "<slug>" build/sitemap.xml   # picked up for SEO
```
