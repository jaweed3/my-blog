#!/usr/bin/env node
// Generates a social-preview image (og:image) for every project that lacks a coverImage.
//
//   node scripts/generate-covers.mjs
//
// Why generated rather than sourced: these are personal projects, so there is no
// photography or artwork to license, and stock imagery would say nothing about the work.
// Each image is an abstract mark seeded deterministically from the project slug, drawn in
// this site's own palette, so the set looks like it belongs to the design system.
//
// Output is PNG at 1200x630 (the Open Graph size) rather than SVG, because most social
// scrapers will not render an SVG og:image. sharp rasterises the intermediate SVG.
//
// Projects already carrying a hand-made cover are left alone.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'lib', 'data', 'projects', 'content');
const OUT_DIR = join(ROOT, 'static', 'images', 'features');

const W = 1200;
const H = 630;

// Palette lifted from src/lib/scss/_themes.scss.
const INK = '#080808';
const GRID = 'rgba(255,255,255,0.05)';
const ACCENT = '#bdc2ff';
const CYAN = '#00eefc';
const AMBER = '#ffb867';
const MUTED = '#908f9e';

/** Deterministic PRNG so a slug always produces the same image. */
function seeded(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	let a = h >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length) % arr.length];

// Motif is chosen from the project's tags, so the marks group by kind of work.
function motifFor(tags = []) {
	const t = tags.join(' ').toLowerCase();
	// Order matters: the most characteristic tag wins, so an edge-ML project reads as
	// quantisation rather than as "computer vision" just because that tag is also present.
	if (/distributed|backend|architecture|micro/.test(t)) return 'network';
	if (/benchmark|evaluation/.test(t)) return 'bars';
	if (/circular|waste|sustainab/.test(t)) return 'loop';
	if (/security|privacy|governance/.test(t)) return 'sealed';
	if (/quantization|edge|speech|model/.test(t)) return 'density';
	if (/vision|mobile/.test(t)) return 'scan';
	if (/web3|social/.test(t)) return 'orbit';
	return 'density';
}

const motifs = {
	// A quantised lattice: mostly empty cells, a scattering of filled ones.
	density(rnd, a, b) {
		const cols = 22;
		const rows = 11;
		const gap = 6;
		const cw = (W - 160) / cols - gap;
		const ch = (H - 160) / rows - gap;
		let out = '';
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const v = rnd();
				if (v < 0.42) continue;
				const op = 0.25 + v * 0.75;
				out += `<rect x="${(80 + x * (cw + gap)).toFixed(1)}" y="${(80 + y * (ch + gap)).toFixed(
					1
				)}" width="${cw.toFixed(1)}" height="${ch.toFixed(
					1
				)}" rx="3" fill="${a}" opacity="${op.toFixed(2)}"/>`;
			}
		}
		return out;
	},

	// Benchmark bars: a run of columns, taller where the value was higher.
	bars(rnd, a, b) {
		const n = 26;
		const gap = 10;
		const bw = (W - 200) / n - gap;
		let out = '';
		for (let i = 0; i < n; i++) {
			const v = rnd();
			const h = 40 + v * (H - 260);
			out += `<rect x="${(100 + i * (bw + gap)).toFixed(1)}" y="${(H - 100 - h).toFixed(
				1
			)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${
				i % 5 === 0 ? b : a
			}" opacity="${(0.3 + v * 0.7).toFixed(2)}"/>`;
		}
		return out;
	},

	// Sharded network: nodes joined by edges.
	network(rnd, a, b) {
		const n = 22;
		const pts = Array.from({ length: n }, () => ({
			x: 70 + rnd() * (W - 140),
			y: 70 + rnd() * (H - 140),
			r: 3 + rnd() * 5
		}));
		let out = '';
		for (let i = 0; i < pts.length; i++) {
			for (let j = i + 1; j < pts.length; j++) {
				const dx = pts[i].x - pts[j].x;
				const dy = pts[i].y - pts[j].y;
				const d = Math.hypot(dx, dy);
				if (d > 240) continue;
				out += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[
					j
				].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${a}" stroke-width="1.5" opacity="${(
					0.5 -
					d / 700
				).toFixed(2)}"/>`;
			}
		}
		for (const p of pts) {
			out += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${
				p.r > 6 ? b : a
			}"/>`;
		}
		return out;
	},

	// Sealed layers: overlapping translucent panels with one solid band. Denser than a
	// plain nested-outline stack, which read as an empty placeholder.
	sealed(rnd, a, b) {
		const cols = 7;
		const rows = 4;
		const gap = 14;
		const pw = (W - 120) / cols - gap;
		const ph = (H - 120) / rows - gap;
		const hi = Math.floor(rnd() * cols);
		const vi = Math.floor(rnd() * rows);
		let out = '';
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const px = 60 + x * (pw + gap);
				const py = 60 + y * (ph + gap);
				const v = rnd();
				if (x === hi && y === vi) {
					out += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${pw.toFixed(
						1
					)}" height="${ph.toFixed(1)}" rx="6" fill="${b}"/>`;
				} else if (v > 0.3) {
					const o = (0.06 + v * 0.3).toFixed(2);
					out += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${pw.toFixed(
						1
					)}" height="${ph.toFixed(
						1
					)}" rx="6" fill="none" stroke="${a}" stroke-width="2" opacity="${o}"/>`;
					out += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${(
						pw *
						(0.3 + v * 0.5)
					).toFixed(1)}" height="4" rx="2" fill="${a}" opacity="${(o * 2).toFixed(2)}"/>`;
				}
			}
		}
		return out;
	},

	// Circular economy: arc segments closing a loop, with two direction markers.
	loop(rnd, a, b) {
		const cx = W / 2;
		const cy = H / 2;
		let out = `<circle cx="${cx}" cy="${cy}" r="215" fill="none" stroke="${a}" stroke-width="2" opacity="0.18"/>`;
		const segs = 14;
		for (let i = 0; i < segs; i++) {
			const sweep = 12 + rnd() * 9;
			const rot = (i / segs) * 360 + rnd() * 6;
			out += `<circle cx="${cx}" cy="${cy}" r="${(150 + rnd() * 90).toFixed(
				1
			)}" fill="none" stroke="${i % 4 === 0 ? b : a}" stroke-width="${(3 + rnd() * 9).toFixed(
				1
			)}" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}" stroke-dasharray="${sweep.toFixed(1)} ${(
				360 - sweep
			).toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${cx} ${cy})" stroke-linecap="round"/>`;
		}
		for (let k = 0; k < 2; k++) {
			const ang = (k * 180 + 40) * (Math.PI / 180);
			const ax = cx + Math.cos(ang) * 215;
			const ay = cy + Math.sin(ang) * 215;
			const dir = k * Math.PI;
			out += `<path d="M ${(ax - 26).toFixed(1)} ${(ay - 14).toFixed(1)} L ${ax.toFixed(
				1
			)} ${ay.toFixed(1)} L ${(ax - 26).toFixed(1)} ${(ay + 14).toFixed(
				1
			)}" fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${(
				(dir * 180) / Math.PI +
				90
			).toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)})" opacity="0.9"/>`;
		}
		return out;
	},

	// Concentric scan arcs.
	scan(rnd, a, b) {
		const cx = W / 2;
		const cy = H / 2;
		let out = '';
		for (let i = 0; i < 13; i++) {
			const r = 50 + i * 44;
			const start = rnd() * 360;
			const sweep = 90 + rnd() * 220;
			const col = i % 4 === 0 ? b : a;
			out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${(
				3 -
				i * 0.16
			).toFixed(2)}" opacity="${(0.7 - i * 0.045).toFixed(2)}" stroke-dasharray="${sweep} ${
				360 - sweep
			}" transform="rotate(${start.toFixed(1)} ${cx} ${cy})" stroke-linecap="round"/>`;
		}
		return out;
	},

	// Dots on concentric rings.
	orbit(rnd, a, b) {
		const cx = W / 2;
		const cy = H / 2;
		let out = '';
		for (let ring = 1; ring <= 5; ring++) {
			const r = ring * 52;
			const count = 6 + ring * 5;
			for (let i = 0; i < count; i++) {
				const ang = (i / count) * Math.PI * 2 + ring * 0.4;
				const x = cx + Math.cos(ang) * r;
				const y = cy + Math.sin(ang) * r * 0.82;
				const rr = 2.5 + rnd() * 4;
				out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${
					ring % 2 === 0 ? b : a
				}" opacity="${(0.9 - ring * 0.12).toFixed(2)}"/>`;
			}
		}
		return out;
	}
};

function svgFor(slug, tags) {
	const rnd = seeded(slug);
	const kind = motifFor(tags);
	const a = pick(rnd, [ACCENT, CYAN]);
	// Amber is the one warm token in an otherwise cool palette, so it stays a rare
	// highlight rather than a co-primary.
	const b = rnd() > 0.72 ? AMBER : CYAN;

	// Faint baseline grid so the mark sits on something rather than floating.
	let grid = '';
	for (let x = 0; x <= W; x += 40)
		grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${GRID}" stroke-width="1"/>`;
	for (let y = 0; y <= H; y += 40)
		grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${INK}"/>
${grid}
<g>${motifs[kind](rnd, a, b)}</g>
<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${MUTED}" stroke-width="2" opacity="0.25"/>
</svg>`;
}

/** Minimal frontmatter reader: enough for the flat scalars we need. */
function parseFrontmatter(raw) {
	const m = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!m) return null;
	const fm = {};
	let key = null;
	for (const line of m[1].split('\n')) {
		const listItem = line.match(/^\s+-\s+(.*)$/);
		if (listItem && key) {
			(fm[key] ||= []).push(listItem[1].trim());
			continue;
		}
		const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (pair) {
			key = pair[1];
			fm[key] = pair[2].trim();
		}
	}
	return fm;
}

const files = readdirSync(CONTENT).filter((f) => f.endsWith('.md'));
let made = 0;
let skipped = 0;

for (const file of files) {
	const path = join(CONTENT, file);
	const raw = readFileSync(path, 'utf8');
	const fm = parseFrontmatter(raw);

	if (!fm) {
		console.log(`  skip ${file} (no frontmatter)`);
		continue;
	}
	// Presence, not truthiness. Some files carry a bare `coverImage:` with no value, which
	// parses as '' -- falsy, so a truthiness check would insert a SECOND coverImage key, and
	// duplicate-key YAML drops the whole metadata block (the project then renders with an
	// undefined slug and date, which 500s the build).
	const hasKey = /^coverImage:/m.test(raw.slice(0, raw.indexOf('\n---', 4)));
	if (hasKey && fm.coverImage) {
		skipped++;
		continue;
	}

	const slug = fm.slug || file.replace(/\.md$/, '');
	const svg = svgFor(slug, fm.tags || []);
	const png = join(OUT_DIR, `${slug}.png`);

	await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(png);

	const line = `coverImage: images/features/${slug}.png`;
	// Replace an empty placeholder in place; otherwise insert after excerpt, which is where
	// the hand-made covers already sit.
	const updated = hasKey
		? raw.replace(/^coverImage:\s*$/m, line)
		: raw.replace(/^(excerpt:.*)$/m, `$1\n${line}`);

	if (updated === raw) {
		console.log(`  warn ${slug}: wrote png but could not place ${line}`);
	} else {
		writeFileSync(path, updated);
	}

	made++;
	console.log(`  ${slug}.png  (${motifFor(fm.tags)})`);
}

console.log(`\n${made} generated, ${skipped} already had a coverImage`);
