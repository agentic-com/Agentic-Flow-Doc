<script lang="ts">
	/**
	 * Release timeline for /releases/ (awflow/Agentic-Flow#1345, Releases.dc.html).
	 * Newest first; the current release is open, older ones collapse (native <details>,
	 * so they work without JS). Area chips filter every release's changes; they need
	 * hydration (`client:load`), and without it every change stays visible.
	 */
	import type { Release } from '../../data/releases';
	import ReleaseChanges from './ReleaseChanges.svelte';

	interface Props {
		releases: Release[];
	}

	let { releases }: Props = $props();

	let area = $state('All');

	const areas = $derived([
		'All',
		...Array.from(new Set(releases.flatMap((r) => r.changes.map((c) => c.area)))),
	]);
	const [current, ...older] = $derived(releases);

	function pick(r: Release) {
		return area === 'All' ? r.changes : r.changes.filter((c) => c.area === area);
	}
	function href(version: string) {
		return `/releases/v${version.replace(/\./g, '-')}/`;
	}
	function date(iso: string) {
		return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC',
		});
	}
	function counts(r: Release) {
		const list = pick(r);
		return (['new', 'improved', 'fixed'] as const)
			.map((k) => [k, list.filter((c) => c.kind === k).length] as const)
			.filter(([, n]) => n > 0)
			.map(([k, n]) => `${n} ${k}`)
			.join(' · ');
	}
	const currentChanges = $derived(current ? pick(current) : []);
	const visibleOlder = $derived(older.filter((r) => area === 'All' || pick(r).length > 0));
</script>

<div class="awf-tl not-content">
	<div class="awf-tl__actions">
		<a class="awf-tl__btn awf-tl__btn--solid" href="/releases/rss.xml">
			<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M5 3a16 16 0 0 1 16 16h-3A13 13 0 0 0 5 6V3Zm0 6a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V9Zm2 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
			Subscribe (RSS)
		</a>
		<a class="awf-tl__btn" href="/releases/breaking-changes/">Breaking changes &amp; migration</a>
	</div>
	<div class="awf-tl__chips" role="group" aria-label="Filter changes by area">
		{#each areas as a (a)}
			<button type="button" class="awf-tl__chip" aria-pressed={a === area} onclick={() => (area = a)}>{a}</button>
		{/each}
	</div>
	<p class="awf-tl__status" aria-live="polite">
		{area === 'All' ? '' : `Showing ${area} changes only.`}
	</p>

	<ol class="awf-tl__rail" role="list">
		{#if current}
			<li class="awf-tl__item">
				<span class="awf-tl__dot awf-tl__dot--current" aria-hidden="true"></span>
				<article class="awf-tl__card awf-tl__card--current" aria-labelledby="rel-current">
					<header class="awf-tl__head">
						<p class="awf-tl__meta">
							<span class="awf-tl__ver awf-tl__ver--solid">v{current.version}</span>
							<span><time datetime={current.date}>{date(current.date)}</time> · {current.browsers.join(', ')}</span>
							<span class="awf-tl__latest">Latest</span>
						</p>
						<h2 id="rel-current" class="awf-tl__headline">
							<a href={href(current.version)}>{current.headline}</a>
						</h2>
						<p class="awf-tl__summary">{current.summary}</p>
					</header>
					<div class="awf-tl__body">
						{#if currentChanges.length}
							<ReleaseChanges release={current} changes={currentChanges} layout="flat" />
						{:else}
							<p class="awf-tl__empty">No {area} changes in this release.</p>
						{/if}
						<a class="awf-tl__more" href={href(current.version)}>Read the full v{current.version} notes →</a>
					</div>
				</article>
			</li>
		{/if}

		{#each visibleOlder as r (r.version)}
			<li class="awf-tl__item">
				<span class="awf-tl__dot" aria-hidden="true"></span>
				<details class="awf-tl__card awf-tl__card--older">
					<summary class="awf-tl__summary-row">
						<span class="awf-tl__ver">v{r.version}</span>
						<span class="awf-tl__older-text">
							<span class="awf-tl__older-title">{r.headline}</span>
							<span class="awf-tl__older-meta"><time datetime={r.date}>{date(r.date)}</time> · {counts(r)}</span>
						</span>
						<span class="awf-tl__toggle" aria-hidden="true"></span>
					</summary>
					<div class="awf-tl__older-body">
						<p class="awf-tl__summary">{r.teaser ?? r.summary}</p>
						<ReleaseChanges release={r} changes={pick(r)} layout="flat" />
						<a class="awf-tl__more" href={href(r.version)}>Read the full v{r.version} notes →</a>
					</div>
				</details>
			</li>
		{/each}
	</ol>
</div>

<style>
	.awf-tl {
		--tl-v: #c4b5fd;
		--tl-v-strong: #6d28d9;
		--tl-v-soft: color-mix(in srgb, #6d28d9 20%, var(--awf-surface));
		--tl-v-line: color-mix(in srgb, #6d28d9 45%, var(--awf-line));
		--tl-latest-bg: #451a03;
		--tl-latest-fg: #fde68a;
		margin-top: 1.5rem;
	}
	:global(:root[data-theme='light']) .awf-tl {
		--tl-v: #5b21b6;
		--tl-v-soft: #f5f3ff;
		--tl-v-line: #ddd6fe;
		--tl-latest-bg: #fef3e2;
		--tl-latest-fg: #92400e;
	}

	.awf-tl__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 1.25rem;
	}
	.awf-tl__btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		padding: 8px 14px;
		border-radius: 10px;
		border: 1px solid var(--tl-v-line);
		color: var(--tl-v);
		text-decoration: none;
		transition: background var(--awf-fast, 150ms);
	}
	.awf-tl__btn:hover {
		background: var(--tl-v-soft);
	}
	.awf-tl__btn--solid {
		background: var(--tl-v-strong);
		border-color: var(--tl-v-strong);
		color: #fff;
	}
	.awf-tl__btn--solid:hover {
		background: #5b21b6;
	}
	.awf-tl__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.awf-tl__chip {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--sl-color-gray-2);
		cursor: pointer;
		transition:
			transform var(--awf-fast, 150ms),
			background var(--awf-fast, 150ms),
			border-color var(--awf-fast, 150ms);
	}
	.awf-tl__chip:hover {
		transform: translateY(-1px);
		border-color: var(--tl-v-line);
	}
	.awf-tl__chip[aria-pressed='true'] {
		background: var(--tl-v-strong);
		border-color: var(--tl-v-strong);
		color: #fff;
	}
	.awf-tl__chip:focus-visible,
	.awf-tl a:focus-visible,
	.awf-tl summary:focus-visible {
		outline: 2px solid var(--awf-ember);
		outline-offset: 2px;
	}
	.awf-tl__status {
		min-height: 1.25rem;
		margin: 0.5rem 0 0;
		font-size: 0.8125rem;
		color: var(--awf-muted);
	}

	.awf-tl__rail {
		position: relative;
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0 0 0 44px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.awf-tl__rail::before {
		content: '';
		position: absolute;
		left: 13px;
		top: 12px;
		bottom: 12px;
		width: 2px;
		border-radius: 2px;
		background: linear-gradient(var(--tl-v-strong), var(--tl-v-line));
	}
	.awf-tl__item {
		position: relative;
		margin: 0;
	}
	.awf-tl__dot {
		position: absolute;
		left: -36px;
		top: 22px;
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--tl-v-line);
		border: 3px solid var(--sl-color-black);
	}
	.awf-tl__dot--current {
		left: -39px;
		top: 28px;
		width: 18px;
		height: 18px;
		background: var(--tl-v-strong);
		border-width: 4px;
		animation: awf-tl-ping 2s ease-out infinite;
	}
	@keyframes awf-tl-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(109, 40, 217, 0.5);
		}
		100% {
			box-shadow: 0 0 0 12px rgba(109, 40, 217, 0);
		}
	}

	.awf-tl__card {
		background: var(--awf-surface);
		border: 1px solid var(--awf-line);
		border-radius: var(--awf-radius-lg, 18px);
	}
	.awf-tl__card--current {
		border-color: var(--tl-v-line);
		border-radius: var(--awf-radius-xl, 22px);
		overflow: hidden;
		box-shadow: 0 30px 60px -40px rgba(109, 40, 217, 0.5);
	}
	.awf-tl__head {
		padding: 22px 24px;
		background: var(--tl-v-soft);
		border-bottom: 1px solid var(--tl-v-line);
	}
	.awf-tl__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 10px;
		margin: 0;
		font-size: 0.8125rem;
		color: var(--awf-muted);
	}
	.awf-tl__ver {
		flex: none;
		font-family: var(--sl-font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 2px 10px;
		border-radius: 999px;
		background: var(--tl-v-soft);
		color: var(--tl-v);
	}
	.awf-tl__ver--solid {
		background: var(--tl-v-strong);
		color: #fff;
	}
	.awf-tl__latest {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--tl-latest-bg);
		color: var(--tl-latest-fg);
	}
	.awf-tl__headline {
		margin: 10px 0 0;
		font-size: clamp(1.35rem, 3vw, 1.75rem);
		line-height: 1.2;
		letter-spacing: -0.02em;
		font-weight: 700;
	}
	.awf-tl__headline a {
		color: var(--sl-color-white);
		text-decoration: none;
	}
	.awf-tl__headline a:hover {
		text-decoration: underline;
		text-decoration-color: var(--tl-v-line);
	}
	.awf-tl__summary {
		margin: 8px 0 0;
		max-width: 46rem;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--sl-color-gray-2);
	}
	.awf-tl__body {
		padding: 8px 12px 16px;
	}
	.awf-tl__empty {
		margin: 12px;
		color: var(--awf-muted);
	}
	.awf-tl__more {
		display: inline-block;
		margin: 8px 12px 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--tl-v);
		text-decoration: none;
	}
	.awf-tl__more:hover {
		text-decoration: underline;
	}

	.awf-tl__summary-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		cursor: pointer;
		list-style: none;
	}
	.awf-tl__summary-row::-webkit-details-marker {
		display: none;
	}
	.awf-tl__older-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.awf-tl__older-title {
		font-size: 1.0625rem;
		font-weight: 650;
		line-height: 1.35;
		color: var(--sl-color-white);
	}
	.awf-tl__older-meta {
		font-size: 0.8125rem;
		color: var(--awf-muted);
	}
	.awf-tl__toggle {
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		border: 1px solid var(--awf-line);
		background: var(--sl-color-black);
		position: relative;
	}
	.awf-tl__toggle::before {
		content: '';
		position: absolute;
		inset: 0;
		margin: auto;
		width: 7px;
		height: 7px;
		border-right: 2px solid var(--sl-color-gray-3);
		border-bottom: 2px solid var(--sl-color-gray-3);
		transform: translateY(-2px) rotate(45deg);
		transition: transform var(--awf-base, 300ms) var(--awf-ease, ease);
	}
	details[open] .awf-tl__toggle::before {
		transform: translateY(1px) rotate(-135deg);
	}
	.awf-tl__older-body {
		padding: 0 8px 14px;
		border-top: 1px solid var(--awf-line-soft);
	}
	.awf-tl__older-body > .awf-tl__summary {
		margin: 12px 12px 4px;
		font-size: 0.9375rem;
	}

	@media (max-width: 640px) {
		.awf-tl__rail {
			padding-left: 28px;
		}
		.awf-tl__rail::before {
			left: 6px;
		}
		.awf-tl__dot {
			left: -27px;
		}
		.awf-tl__dot--current {
			left: -30px;
		}
		.awf-tl__head {
			padding: 18px 16px;
		}
		.awf-tl__summary-row {
			padding: 12px 12px;
			align-items: flex-start;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-tl__dot--current {
			animation: none;
		}
		.awf-tl__chip,
		.awf-tl__toggle::before {
			transition: none;
		}
	}
</style>
