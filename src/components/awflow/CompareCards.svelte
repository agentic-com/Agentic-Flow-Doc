<script lang="ts">
	/**
	 * <CompareCards> — several ways to do one thing, side by side (awflow/Agentic-Flow#1343).
	 *
	 * Use it on concept and hub pages when the reader has to pick between approaches
	 * (Loop vs Split in Batches vs Poll Until, Try / Catch vs Retry vs Continue On Fail).
	 * Static: no client directive needed.
	 *
	 * In MDX:
	 *   import { CompareCards } from '@components/awflow';
	 *   <CompareCards cards={[
	 *     { title: 'Loop', icon: 'loop', href: '/nodes/builtin/flow/loop/',
	 *       when: 'Repeat steps while a condition holds.', example: 'Click "Next" until the last page.',
	 *       meta: 'Loop · Done' },
	 *   ]} />
	 */

	type Icon =
		| 'loop'
		| 'batch'
		| 'poll'
		| 'items'
		| 'shield'
		| 'retry'
		| 'skip'
		| 'alert'
		| 'branch'
		| 'switch'
		| 'filter'
		| 'merge'
		| 'chain'
		| 'agent'
		| 'book'
		| 'cloud'
		| 'device'
		| 'mouse'
		| 'code';
	interface Card {
		title: string;
		/** When to pick this one, in one sentence. */
		when: string;
		/** A concrete example. */
		example?: string;
		/** Small monospace line, e.g. the output ports. */
		meta?: string;
		href?: string;
		icon?: Icon;
	}
	interface Props {
		cards: Card[];
		/** Accessible name of the group, e.g. "Ways to repeat work". */
		label?: string;
	}

	let { cards, label = 'Options compared' }: Props = $props();

	// Lucide-style 24px stroke icons.
	const ICONS: Record<Icon, string> = {
		loop: 'M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6',
		batch: 'M4 20V10M9 20V6M14 20v-8M19 20V4',
		poll: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
		items: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
		shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
		retry: 'M3 12a9 9 0 0 1 15.4-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16M3 21v-5h5',
		skip: 'M5 4l10 8-10 8V4zM19 5v14',
		alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
		branch: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
		switch: 'M4 12h6M10 12l4-6h6M10 12l4 6h6M14 12h6',
		filter: 'M22 3H2l8 9.5V19l4 2v-8.5L22 3z',
		merge: 'M6 3v6a6 6 0 0 0 6 6h6M18 21l3-3-3-3M6 21v-6',
		chain: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
		agent: 'M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M9 13v2M15 13v2',
		book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
		cloud: 'M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z',
		device: 'M3 4h18v12H3zM8 20h8M12 16v4',
		mouse: 'M12 2a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6zM12 6v4',
		code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
	};
</script>

<ul class="awf-cmp not-content" aria-label={label}>
	{#each cards as c (c.title)}
		<li class="awf-cmp__item">
			<svelte:element this={c.href ? 'a' : 'div'} class="awf-cmp__card awf-lift" href={c.href}>
				{#if c.icon}
					<span class="awf-cmp__art" aria-hidden="true">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d={ICONS[c.icon]} /></svg
						>
					</span>
				{/if}
				<span class="awf-cmp__body">
					<span class="awf-cmp__title">{c.title}{#if c.href}&nbsp;<span class="awf-arr" aria-hidden="true">→</span>{/if}</span>
					<span class="awf-cmp__when">{c.when}</span>
					{#if c.example}<span class="awf-cmp__example"><span class="awf-cmp__k">Example</span> {c.example}</span>{/if}
					{#if c.meta}<span class="awf-cmp__meta">{c.meta}</span>{/if}
				</span>
			</svelte:element>
		</li>
	{/each}
</ul>

<style>
	.awf-cmp {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 0.875rem;
	}
	.awf-cmp__item {
		margin: 0;
		display: flex;
	}
	.awf-cmp__card {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: var(--awf-radius-lg);
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: inherit;
		text-decoration: none;
	}
	a.awf-cmp__card:focus-visible {
		outline: 2px solid var(--sl-color-accent);
		outline-offset: 2px;
	}
	.awf-cmp__art {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 4.5rem;
		background: color-mix(in srgb, var(--awf-sc) 10%, var(--awf-surface));
		color: var(--awf-sc-text);
	}
	.awf-cmp__body {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0.875rem 1rem 1rem;
	}
	.awf-cmp__title {
		font-weight: 650;
		color: var(--sl-color-white);
	}
	.awf-cmp__when {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--sl-color-gray-2);
	}
	.awf-cmp__example {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--awf-muted);
	}
	.awf-cmp__k {
		font-weight: 600;
		color: var(--sl-color-gray-2);
	}
	.awf-cmp__meta {
		margin-top: auto;
		padding-top: 0.25rem;
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		color: var(--awf-muted);
	}
</style>
