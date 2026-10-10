<script lang="ts" module>
	import type { Change, ChangeKind, Release } from '../../data/releases';

	export const KINDS: { kind: ChangeKind; label: string }[] = [
		{ kind: 'new', label: 'New' },
		{ kind: 'improved', label: 'Improved' },
		{ kind: 'fixed', label: 'Fixed' },
	];
</script>

<script lang="ts">
	/**
	 * A release's changes (awflow/Agentic-Flow#1345).
	 * - `grouped` (default, version pages): New / Improved / Fixed sections.
	 * - `flat` (timeline card): one list with a kind column.
	 * Data lives in src/data/releases.ts.
	 */
	interface Props {
		release: Release;
		/** Override the list, e.g. filtered by area. Defaults to all of the release's changes. */
		changes?: Change[];
		layout?: 'grouped' | 'flat';
		/** Heading level for group titles in the grouped layout. */
		level?: 2 | 3 | 4;
		/** Show the version · date · browsers row (version pages). */
		meta?: boolean;
	}

	let { release, changes, layout = 'grouped', level = 2, meta = false }: Props = $props();

	const list = $derived(changes ?? release.changes);
	const groups = $derived(
		KINDS.map((k) => ({ ...k, items: list.filter((c) => c.kind === k.kind) })).filter((g) => g.items.length),
	);
	const date = $derived(
		new Date(`${release.date}T00:00:00Z`).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC',
		}),
	);
	const breakingHref = $derived(`/releases/breaking-changes/#v${release.version.replace(/\./g, '')}`);
</script>

<div class="awf-rel not-content">
	{#if meta}
		<p class="awf-rel__meta">
			<span class="awf-rel__ver">v{release.version}</span>
			<time datetime={release.date}>{date}</time>
			<span aria-hidden="true">·</span>
			<span>{release.browsers.join(', ')}</span>
			<a class="awf-rel__breaking" href={breakingHref}>
				{release.breaking ? 'Breaking changes & migration' : 'No breaking changes'}
			</a>
		</p>
	{/if}

	{#if layout === 'flat'}
		<ul class="awf-rel__list" role="list">
			{#each list as c, i (i)}
				<li class="awf-rel__row">
					<span class="awf-rel__kind awf-rel__kind--{c.kind}">{KINDS.find((k) => k.kind === c.kind)?.label}</span>
					<span class="awf-rel__text">{c.text}</span>
					{#if c.link}
						<a class="awf-rel__link" href={c.link}>{c.label ?? 'Read more'} <span class="awf-rel__arr" aria-hidden="true">→</span></a>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		{#each groups as g (g.kind)}
			<section class="awf-rel__group">
				<svelte:element this={`h${level}`} class="awf-rel__heading awf-rel__kind--{g.kind}" id={`${g.kind}-in-v${release.version.replace(/\./g, '-')}`}>
					{g.label} <span class="awf-rel__count">{g.items.length}</span>
				</svelte:element>
				<ul class="awf-rel__list" role="list">
					{#each g.items as c, i (i)}
						<li class="awf-rel__row awf-rel__row--grouped">
							<span class="awf-rel__area">{c.area}</span>
							<span class="awf-rel__text">{c.text}</span>
							{#if c.link}
								<a class="awf-rel__link" href={c.link}>{c.label ?? 'Read more'} <span class="awf-rel__arr" aria-hidden="true">→</span></a>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</div>

<style>
	.awf-rel {
		--rel-v: #c4b5fd;
		--rel-v-soft: color-mix(in srgb, #6d28d9 24%, transparent);
		--rel-new: #fbbf24;
		--rel-improved: #93c5fd;
		--rel-fixed: #86efac;
		--rel-hover: color-mix(in srgb, #6d28d9 12%, transparent);
	}
	:global(:root[data-theme='light']) .awf-rel {
		--rel-v: #6d28d9;
		--rel-v-soft: #f5f3ff;
		--rel-new: #b45309;
		--rel-improved: #1e40af;
		--rel-fixed: #166534;
		--rel-hover: #faf5ff;
	}

	.awf-rel__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 10px;
		margin: 0 0 1.25rem;
		font-size: 0.875rem;
		color: var(--awf-muted);
	}
	.awf-rel__ver {
		font-family: var(--sl-font-mono);
		font-weight: 600;
		font-size: 0.8125rem;
		padding: 2px 10px;
		border-radius: 999px;
		background: #6d28d9;
		color: #fff;
	}
	.awf-rel__breaking {
		margin-inline-start: auto;
		color: var(--rel-v);
		font-weight: 500;
	}

	.awf-rel__group + .awf-rel__group {
		margin-top: 1.5rem;
	}
	.awf-rel :global(.awf-rel__heading) {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 0.5rem;
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.awf-rel__count {
		font-family: var(--sl-font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--awf-muted);
	}

	.awf-rel__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.awf-rel__list > li {
		margin: 0;
	}
	.awf-rel__row {
		display: grid;
		grid-template-columns: 6.5rem 1fr auto;
		gap: 4px 14px;
		align-items: baseline;
		padding: 10px 12px;
		border-radius: 12px;
		transition: background var(--awf-fast, 150ms);
	}
	.awf-rel__row:hover {
		background: var(--rel-hover);
	}
	.awf-rel__kind {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	.awf-rel__kind--new {
		color: var(--rel-new);
	}
	.awf-rel__kind--improved {
		color: var(--rel-improved);
	}
	.awf-rel__kind--fixed {
		color: var(--rel-fixed);
	}
	.awf-rel__area {
		font-size: 0.75rem;
		color: var(--awf-muted);
	}
	.awf-rel__text {
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--sl-color-gray-1);
	}
	.awf-rel__link {
		font-size: 0.8125rem;
		color: var(--rel-v);
		text-decoration: none;
		white-space: nowrap;
	}
	.awf-rel__link:hover {
		text-decoration: underline;
	}
	.awf-rel__arr {
		display: inline-block;
		transition: transform var(--awf-base, 300ms) var(--awf-ease, ease);
	}
	.awf-rel__row:hover .awf-rel__arr {
		transform: translateX(3px);
	}

	@media (max-width: 640px) {
		.awf-rel__row {
			grid-template-columns: 1fr;
			padding: 10px 8px;
		}
		.awf-rel__link {
			white-space: normal;
		}
		.awf-rel__breaking {
			margin-inline-start: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-rel__row,
		.awf-rel__arr {
			transition: none;
		}
	}
</style>
