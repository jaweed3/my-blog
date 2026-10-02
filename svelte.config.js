// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import katex from 'katex';

const extensions = ['.svelte', '.md'];

// Math rendering for mdsvex.
//
// Why this is hand-rolled instead of remark-math: mdsvex 0.11 parses markdown with its own
// bundled parser rather than remark-parse, so micromark extensions never register.
// remark-math is therefore dead weight here — it produces zero math nodes, the LaTeX leaks
// through as literal text, and its `{}` braces reach Svelte's template parser and kill the
// build with "Expecting Unicode escape sequence". So this is a rehype pass over the text
// nodes instead, which is the last stage that reliably sees the prose.
//
// Delimiter rules are the standard ones, and they matter a lot on a hardware blog: `$…$`
// must have no whitespace next to either `$`, so prose like "$500+/node, imagery at $1,000"
// is left alone — the `$` there is always preceded or followed by a space.
const BLOCK_MATH = /\$\$([\s\S]+?)\$\$/g;

const renderMath = () => (tree) => {
	// KaTeX output reaches Svelte's template parser as-is, and any literal `{` in it is read
	// as the start of a mustache -> "Expecting Unicode escape sequence". That happens on the
	// normal path (LaTeX inside <annotation>) and on the `throwOnError: false` path, where
	// the source lands in a <span class="katex-error"> both as text *and* inside the title
	// attribute — and Svelte parses braces in attribute position too. Entities decode back
	// to `{`/`}` in the browser, so copy-paste and the tooltip are unaffected.
	const escapeBraces = (html) => html.replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'));

	const render = (tex, displayMode) => ({
		type: 'raw',
		value: escapeBraces(
			katex.renderToString(tex, { displayMode, throwOnError: false, output: 'html' })
		)
	});

	const expandText = (value) => {
		const nodes = [];
		// Block math first: it spans lines and would otherwise be eaten by the inline pass.
		let cursor = 0;
		for (const match of value.matchAll(BLOCK_MATH)) {
			const tex = match[1].trim();
			if (tex) {
				if (match.index > cursor)
					nodes.push({ type: 'text', value: value.slice(cursor, match.index) });
				nodes.push(render(tex, true));
				cursor = match.index + match[0].length;
			}
		}
		const tail = cursor ? value.slice(cursor) : value;

		for (const part of tail.split(/(\$[^$\n]+\$)/g)) {
			if (!part) continue;
			const inner = part.startsWith('$') ? part.slice(1, -1) : null;
			if (inner === null) {
				nodes.push({ type: 'text', value: part });
				continue;
			}
			// Reject whitespace-adjacent delimiters and bare numbers, so currency stays text.
			if (/^\s|\s$/.test(inner) || /^[\d.,]+$/.test(inner)) {
				nodes.push({ type: 'text', value: part });
			} else {
				nodes.push(render(inner, false));
			}
		}
		return nodes;
	};

	const SKIP = new Set(['pre', 'code', 'script', 'style', 'annotation']);
	const walk = (node) => {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'element' && SKIP.has(node.tagName)) return;
		if (!node.children) return;

		const next = [];
		for (const child of node.children) {
			if (child.type === 'text') next.push(...expandText(child.value));
			else {
				walk(child);
				next.push(child);
			}
		}
		node.children = next;
	};

	walk(tree);
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			// Fail the build on any prerender error instead of warning. A malformed
			// frontmatter block (e.g. an unquoted value containing ": ") silently
			// produces a route with `slug: undefined` and ships a 500 page.
			handleHttpError: 'fail'
		}
	},
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: extensions,
			rehypePlugins: [
				renderMath, // Math first: it rewrites text nodes, so it must run before the link plugins
				rehypeExternalLinks, // Adds 'target' and 'rel' to external links
				rehypeSlug, // Adds 'id' attributes to Headings (h1,h2,etc)
				[
					rehypeAutolinkHeadings,
					{
						// Adds hyperlinks to the headings, requires rehypeSlug
						behavior: 'prepend',
						properties: { className: ['heading-link'], title: 'Permalink', ariaHidden: 'true' },
						content: {
							type: 'element',
							tagName: 'span',
							properties: {},
							children: [{ type: 'text', value: '#' }]
						}
					}
				]
			]
		})
	],
	extensions: extensions
};

export default config;
