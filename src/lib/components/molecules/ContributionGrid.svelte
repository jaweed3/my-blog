<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import snapshot from '$lib/data/contributions.json';

	type Day = { date: string; count: number };

	const days = (snapshot as { days: Day[] }).days;
	const total = (snapshot as { total: number }).total;
	const generatedAt = (snapshot as { generatedAt: string }).generatedAt;

	// Thresholds are quartiles of the user's own active days rather than fixed numbers.
	// GitHub does the same, and it matters: a fixed scale makes a steady 5/day look
	// identical to a bursty 100/day, or renders a calm week as a wall of empty cells.
	const active = days
		.filter((d) => d.count > 0)
		.map((d) => d.count)
		.sort((a, b) => a - b);
	const quartile = (p: number) => active[Math.floor((active.length - 1) * p)] || 1;
	const t1 = quartile(0.25);
	const t2 = quartile(0.5);
	const t3 = quartile(0.75);

	const level = (count: number) =>
		count === 0 ? 0 : count <= t1 ? 1 : count <= t2 ? 2 : count <= t3 ? 3 : 4;

	// Pad the front so the first column starts on a Sunday, otherwise every row is
	// shifted by however many days are missing from the leading partial week.
	const leadingBlanks = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
	const cells: ({ date: string; count: number } | null)[] = [
		...Array(leadingBlanks).fill(null),
		...days
	];
	const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) =>
		cells.slice(i * 7, i * 7 + 7)
	);

	// A month label sits above the first week that rolls into a new month — but only if
	// there is room. At ~18px per column, adjacent labels collide ("SepOct"), so require a
	// few columns of clearance from the last one emitted.
	const MONTH_LABELS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const MIN_LABEL_GAP = 3;
	const monthLabels = (() => {
		const labels: (string | null)[] = [];
		let lastAt = -MIN_LABEL_GAP;
		weeks.forEach((week, i) => {
			const first = week.find(Boolean);
			if (!first) return labels.push(null);
			const month = Number(first.date.slice(5, 7));
			const prev = weeks[i - 1]?.find(Boolean);
			const isNewMonth = !prev || Number(prev.date.slice(5, 7)) !== month;
			if (!isNewMonth || i - lastAt < MIN_LABEL_GAP) return labels.push(null);
			lastAt = i;
			labels.push(MONTH_LABELS[month - 1]);
		});
		return labels;
	})();

	const formatDate = (iso: string) =>
		new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		});
</script>

<figure class="contrib" use:reveal>
	<figcaption class="contrib-caption">
		<span class="contrib-total">{total.toLocaleString('en-US')}</span>
		<span class="contrib-caption-text">
			contributions over the last year. Levels are quartiles of my own active days, so the scale
			shows relative intensity rather than raw counts.
		</span>
	</figcaption>

	<div class="contrib-grid">
		<div class="contrib-months" aria-hidden="true">
			{#each monthLabels as label}
				<span>{label ?? ''}</span>
			{/each}
		</div>

		<div class="contrib-days" aria-hidden="true">
			<span />
			<span>Mon</span>
			<span />
			<span>Wed</span>
			<span />
			<span>Fri</span>
		</div>

		<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
		<div
			class="contrib-weeks"
			role="img"
			aria-label="Contribution activity over the last year: {total.toLocaleString(
				'en-US'
			)} contributions across {days.length} days."
		>
			{#each weeks as week}
				<div class="contrib-week">
					{#each week as day}
						{#if day}
							<span
								class="contrib-cell"
								data-level={level(day.count)}
								title="{formatDate(day.date)} — {day.count} contribution{day.count === 1
									? ''
									: 's'}"
							/>
						{:else}
							<span class="contrib-cell contrib-cell--pad" />
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="contrib-legend" aria-hidden="true">
		<span>Less</span>
		{#each [0, 1, 2, 3, 4] as l (l)}
			<span class="contrib-cell" data-level={l} />
		{/each}
		<span>More</span>
	</div>

	<p class="contrib-foot">
		Snapshot generated {generatedAt} at build time — the build never calls GitHub.
		<a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer">@jaweed3</a>
	</p>
</figure>

<style lang="scss">
	$cell: 14px;

	.contrib {
		margin: 0;
		padding: var(--gutter);
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--surface-charcoal);
		overflow: hidden;
	}

	.contrib-caption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 10px;
		margin-bottom: 18px;
		font-size: 14px;
		color: var(--muted);
	}

	.contrib-total {
		font-family: var(--font-mono);
		font-size: 22px;
		font-weight: 700;
		color: var(--text);
	}

	.contrib-caption-text {
		flex: 1 1 260px;
		line-height: 1.5;
	}

	// Labels and cells share one grid so they cannot drift out of alignment: the month row
	// and the week strip are both 53 columns of (cell + gap), and the day labels use the same
	// explicit row height as a single week column.
	.contrib-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		gap: 4px;
		overflow-x: auto;
		padding-bottom: 4px;
		// The gradient shadows below are the scroll affordance, so hide the native bar
		// rather than stacking a chunky grey scrollbar under the graph.
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		// CSS-only scroll shadows: the `local` layers are opaque covers that travel with the
		// content, the `scroll` layers sit still. Once you reach either end the cover hides
		// the shadow, so the hint appears only when there is more to see. 53 weeks do not fit
		// a phone, and without this the graph just looks truncated.
		background: linear-gradient(to right, var(--surface-charcoal), transparent) 0 0 / 20px 100%
				no-repeat local,
			linear-gradient(to left, var(--surface-charcoal), transparent) 100% 0 / 20px 100% no-repeat
				local,
			radial-gradient(farthest-side at 0 50%, rgba(0, 0, 0, 0.55), transparent) 0 0 / 12px 100%
				no-repeat scroll,
			radial-gradient(farthest-side at 100% 50%, rgba(0, 0, 0, 0.55), transparent) 100% 0 / 12px
				100% no-repeat scroll;
	}

	.contrib-months {
		grid-column: 2;
		grid-row: 1;
		display: flex;
		gap: 4px;
		height: 12px;
		font-family: var(--font-mono);
		font-size: 9px;
		line-height: 1;
		color: var(--muted);

		span {
			width: $cell;
			min-width: $cell;
			white-space: nowrap;
		}
	}

	.contrib-days {
		grid-column: 1;
		grid-row: 2;
		display: grid;
		grid-template-rows: repeat(7, $cell);
		gap: 4px;
		font-family: var(--font-mono);
		font-size: 9px;
		line-height: $cell;
		color: var(--muted);

		span {
			white-space: nowrap;
		}
	}

	.contrib-weeks {
		grid-column: 2;
		grid-row: 2;
		display: flex;
		gap: 4px;
	}

	.contrib-week {
		display: grid;
		grid-template-rows: repeat(7, $cell);
		gap: 4px;
	}

	.contrib-cell {
		width: $cell;
		height: $cell;
		border-radius: 2px;
		background: var(--surface-container-high);
		transition: transform 0.15s ease, box-shadow 0.15s ease;

		&[data-level='1'] {
			background: color-mix(in srgb, var(--accent) 28%, var(--surface-charcoal));
		}
		&[data-level='2'] {
			background: color-mix(in srgb, var(--accent) 50%, var(--surface-charcoal));
		}
		&[data-level='3'] {
			background: color-mix(in srgb, var(--accent) 74%, var(--surface-charcoal));
		}
		&[data-level='4'] {
			background: var(--accent);
		}

		&:hover {
			transform: scale(1.3);
			box-shadow: 0 0 0 1px var(--accent);
		}
	}

	.contrib-cell--pad {
		background: transparent;
	}

	.contrib-legend {
		display: flex;
		align-items: center;
		gap: 4px;
		justify-content: flex-end;
		margin-top: 12px;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--muted);
	}

	.contrib-foot {
		margin: 14px 0 0;
		font-size: 12px;
		color: var(--muted);

		a {
			color: var(--accent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.contrib-cell {
			transition: none;

			&:hover {
				transform: none;
			}
		}
	}

	@media (max-width: 560px) {
		$cell: 11px;
		.contrib-grid {
			gap: 3px;
		}
		.contrib-months,
		.contrib-days,
		.contrib-weeks,
		.contrib-week {
			gap: 3px;
		}
		.contrib-months span,
		.contrib-cell {
			width: $cell;
			min-width: $cell;
		}
		.contrib-weeks .contrib-cell {
			height: $cell;
		}
		.contrib-days {
			grid-template-rows: repeat(7, $cell);
			font-size: 8px;
		}
		.contrib-week {
			grid-template-rows: repeat(7, $cell);
		}
		.contrib-legend {
			justify-content: flex-start;
		}
	}
</style>
