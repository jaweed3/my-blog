#!/usr/bin/env node
// Refreshes src/lib/data/contributions.json from GitHub's contributions calendar.
//
// Run manually when you want fresh numbers — the build never calls GitHub, it just
// reads the committed snapshot. That keeps the build hermetic (no API token in CI, no
// third-party proxy, no rate-limit flake) at the cost of the graph going stale.
//
//   node scripts/fetch-contributions.mjs
//   GH_TOKEN=ghp_xxx node scripts/fetch-contributions.mjs   # instead of gh auth
//
// Requires `gh auth login` (or GH_TOKEN) for the GraphQL API. GraphQL has no
// equivalent unauthenticated REST endpoint, which is the whole reason this is a script
// and not a build step.

import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const LOGIN = process.env.GH_LOGIN || 'jaweed3';
const OUT = join(
	dirname(fileURLToPath(import.meta.url)),
	'..',
	'src',
	'lib',
	'data',
	'contributions.json'
);

const query = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

function fetchJson() {
	if (process.env.GH_TOKEN) {
		const res = fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				authorization: `bearer ${process.env.GH_TOKEN}`,
				'content-type': 'application/json',
				'user-agent': 'my-blog-contributions'
			},
			body: JSON.stringify({ query, variables: { login: LOGIN } })
		});
		if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
		return res.json();
	}

	const out = execFileSync(
		'gh',
		['api', 'graphql', '-f', `query=${query}`, '-F', `login=${LOGIN}`],
		{ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
	);
	return JSON.parse(out);
}

try {
	const json = fetchJson();
	const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
	if (!calendar) throw new Error('no contributionCalendar in response (check the login)');

	// Flatten to one entry per day, ascending, and drop GitHub's level in favour of our
	// own thresholds so the colour scale can be tuned independently of the API.
	const days = calendar.weeks
		.flatMap((week) => week.contributionDays)
		.map((d) => ({ date: d.date, count: d.contributionCount }))
		.sort((a, b) => a.date.localeCompare(b.date));

	const payload = {
		login: LOGIN,
		total: calendar.totalContributions,
		generatedAt: new Date().toISOString().slice(0, 10),
		days
	};

	writeFileSync(OUT, JSON.stringify(payload, null, '\t') + '\n');

	const active = days.filter((d) => d.count > 0).length;
	console.log(`wrote ${days.length} days (${active} active) to ${OUT}`);
	console.log(
		`total contributions: ${calendar.totalContributions}, generated ${payload.generatedAt}`
	);
} catch (err) {
	// Never fail a build over decoration: keep the previous snapshot and say so.
	console.error(`could not refresh contributions: ${err.message}`);
	console.error('leaving the existing src/lib/data/contributions.json untouched');
	process.exitCode = 1;
}
