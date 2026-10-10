<script lang="ts">
	/**
	 * <ItemsPlayground> — "See it happen" on concept pages (awflow/Agentic-Flow#1343).
	 *
	 * A small run, drawn as 2–4 steps with what each one received or produced, and the
	 * items of the selected step as a table or as JSON. The data comes from props; it is
	 * an illustration, not a live run.
	 *
	 * In MDX:
	 *   import { ItemsPlayground } from '@components/awflow';
	 *   <ItemsPlayground client:visible steps={[
	 *     { name: 'Get All Links', items: [{ text: 'Pricing', href: '/pricing' }] },
	 *     { name: 'Edit Fields', runs: 1, items: [{ title: 'Pricing' }] },
	 *   ]} />
	 */

	type Kind = 'trigger' | 'data' | 'flow' | 'ai' | 'io';
	interface Step {
		/** Node label as it appears on the canvas. */
		name: string;
		/** What the step outputs: a list of items, or a single object (one item). */
		items?: unknown;
		/** How many times the node ran. Shown as "ran 3×". */
		runs?: number;
		/** Overrides the count label, e.g. "1 item (a list inside)". */
		count?: string;
		/** Short note under the step name. */
		note?: string;
		/** Node reference page. */
		href?: string;
		/** Colour family of the node. */
		kind?: Kind;
	}
	interface Props {
		steps: Step[];
		/** Index of the step whose items are shown first. Defaults to the last step with items. */
		selected?: number;
		/** Text under the playground. */
		caption?: string;
		/** First view. */
		view?: 'table' | 'json';
	}

	let { steps, selected, caption, view = 'table' }: Props = $props();

	const hasItems = (s: Step) => s.items !== undefined;
	const lastWithItems = () => {
		for (let i = steps.length - 1; i >= 0; i--) if (hasItems(steps[i])) return i;
		return 0;
	};

	// svelte-ignore state_referenced_locally
	let current = $state(selected ?? lastWithItems());
	// svelte-ignore state_referenced_locally
	let mode = $state<'table' | 'json'>(view);

	const pid = $props.id();
	const uid = `awf-ip-${pid}`;

	function asList(items: unknown): unknown[] {
		if (items === undefined || items === null) return [];
		return Array.isArray(items) ? items : [items];
	}
	function countLabel(s: Step): string {
		if (s.count) return s.count;
		if (!hasItems(s)) return '';
		const n = asList(s.items).length;
		return `${n} item${n === 1 ? '' : 's'}`;
	}
	function cell(v: unknown): string {
		if (v === undefined) return '';
		if (v === null) return 'null';
		if (typeof v === 'object') return JSON.stringify(v);
		return String(v);
	}

	const step = $derived(steps[current] ?? steps[0]);
	const rows = $derived(asList(step?.items));
	const columns = $derived.by(() => {
		const keys: string[] = [];
		for (const r of rows) {
			if (r && typeof r === 'object' && !Array.isArray(r)) {
				for (const k of Object.keys(r as Record<string, unknown>)) if (!keys.includes(k)) keys.push(k);
			}
		}
		return keys;
	});
	const json = $derived(JSON.stringify(step?.items ?? null, null, 2));
	const summary = $derived(
		steps
			.map((s) => [s.name, s.runs ? `ran ${s.runs} times` : '', countLabel(s)].filter(Boolean).join(', '))
			.join(' → ')
	);
</script>

<figure class="awf-ip not-content" aria-labelledby="{uid}-cap">
	<p class="awf-ip__sr" id="{uid}-cap">Example run: {summary}.{caption ? ` ${caption}` : ''}</p>
	<ol class="awf-ip__steps">
		{#each steps as s, i (i)}
			<li class="awf-ip__step-wrap">
				<button
					type="button"
					class="awf-ip__step awf-ip__step--{s.kind ?? 'data'}"
					aria-pressed={i === current}
					disabled={!hasItems(s)}
					onclick={() => (current = i)}
				>
					<span class="awf-ip__name">{s.name}</span>
					{#if s.runs}<span class="awf-ip__runs">ran {s.runs}×</span>{/if}
					{#if countLabel(s)}<span class="awf-ip__count">{countLabel(s)}</span>{/if}
					{#if s.note}<span class="awf-ip__note">{s.note}</span>{/if}
				</button>
				{#if i < steps.length - 1}<span class="awf-ip__arrow" aria-hidden="true">→</span>{/if}
			</li>
		{/each}
	</ol>

	<div class="awf-ip__panel">
		<div class="awf-ip__bar">
			<span class="awf-ip__label">Output of <strong>{step?.name}</strong></span>
			<span class="awf-ip__toggle" role="group" aria-label="View as">
				<button type="button" aria-pressed={mode === 'table'} onclick={() => (mode = 'table')}>Table</button>
				<button type="button" aria-pressed={mode === 'json'} onclick={() => (mode = 'json')}>JSON</button>
			</span>
		</div>
		{#if mode === 'table'}
			<div class="awf-ip__table-wrap">
				{#if rows.length === 0}
					<p class="awf-ip__empty">No items. Nothing runs after this step on this path.</p>
				{:else if columns.length === 0}
					<table class="awf-ip__table">
						<thead><tr><th scope="col">#</th><th scope="col">value</th></tr></thead>
						<tbody>
							{#each rows as r, i (i)}<tr><td class="awf-ip__idx">{i}</td><td>{cell(r)}</td></tr>{/each}
						</tbody>
					</table>
				{:else}
					<table class="awf-ip__table">
						<thead>
							<tr>
								<th scope="col">#</th>
								{#each columns as c (c)}<th scope="col">{c}</th>{/each}
							</tr>
						</thead>
						<tbody>
							{#each rows as r, i (i)}
								<tr>
									<td class="awf-ip__idx">{i}</td>
									{#each columns as c (c)}<td>{cell((r as Record<string, unknown>)?.[c])}</td>{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		{:else}
			<pre class="awf-ip__json"><code>{json}</code></pre>
		{/if}
	</div>
	{#if caption}<figcaption class="awf-ip__caption">{caption}</figcaption>{/if}
</figure>

<style>
	.awf-ip {
		margin: 1.25rem 0 0;
		padding: 1rem;
		border-radius: var(--awf-radius-lg);
		border: 1px solid color-mix(in srgb, var(--awf-sc) 35%, var(--awf-line));
		background: color-mix(in srgb, var(--awf-sc) 6%, var(--awf-surface));
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}
	.awf-ip__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
	.awf-ip__steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 0.5rem;
	}
	.awf-ip__step-wrap {
		margin: 0;
		display: flex;
		align-items: stretch;
		gap: 0.5rem;
	}
	.awf-ip__step {
		font: inherit;
		text-align: start;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 7.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--awf-radius);
		border: 1px solid var(--awf-line);
		border-inline-start: 4px solid var(--awf-step, var(--awf-sc));
		background: var(--awf-surface);
		color: var(--sl-color-white);
		cursor: pointer;
		transition:
			border-color var(--awf-fast),
			box-shadow var(--awf-fast),
			transform var(--awf-fast) var(--awf-ease);
	}
	.awf-ip__step:disabled {
		cursor: default;
	}
	.awf-ip__step:not(:disabled):hover {
		transform: translateY(-2px);
	}
	.awf-ip__step[aria-pressed='true'] {
		border-color: var(--awf-sc);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--awf-sc) 35%, transparent);
	}
	.awf-ip__step:focus-visible {
		outline: 2px solid var(--sl-color-accent);
		outline-offset: 2px;
	}
	.awf-ip__step--trigger { --awf-step: #b45309; }
	.awf-ip__step--data { --awf-step: #0e7490; }
	.awf-ip__step--flow { --awf-step: #4338ca; }
	.awf-ip__step--ai { --awf-step: #6d28d9; }
	.awf-ip__step--io { --awf-step: #78716c; }
	.awf-ip__name {
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
	}
	.awf-ip__count,
	.awf-ip__runs {
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--awf-sc-text);
	}
	.awf-ip__runs {
		color: var(--awf-muted);
	}
	.awf-ip__note {
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--awf-muted);
	}
	.awf-ip__arrow {
		align-self: center;
		color: var(--awf-sc-text);
		font-weight: 600;
	}
	.awf-ip__panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}
	.awf-ip__bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	.awf-ip__label {
		color: var(--sl-color-gray-2);
	}
	.awf-ip__toggle {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 10px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
	}
	.awf-ip__toggle button {
		font: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.3rem 0.65rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--awf-sc-text);
		cursor: pointer;
	}
	.awf-ip__toggle button[aria-pressed='true'] {
		background: var(--awf-sc);
		color: #fff;
	}
	.awf-ip__toggle button:focus-visible {
		outline: 2px solid var(--sl-color-accent);
		outline-offset: 1px;
	}
	.awf-ip__table-wrap {
		overflow-x: auto;
		border-radius: var(--awf-radius);
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
	}
	/* Override Starlight's markdown table styles inside the island. */
	.awf-ip__table {
		display: table;
		width: 100%;
		margin: 0 !important;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}
	.awf-ip__table th,
	.awf-ip__table td {
		padding: 0.45rem 0.75rem;
		border: 0;
		border-top: 1px solid var(--awf-line-soft, var(--awf-line));
		text-align: start;
		vertical-align: top;
		white-space: nowrap;
		max-width: 22rem;
		overflow: hidden;
		text-overflow: ellipsis;
		background: transparent;
	}
	.awf-ip__table thead th {
		border-top: 0;
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--awf-muted);
	}
	.awf-ip__idx {
		font-family: var(--__sl-font-mono);
		color: var(--awf-sc-text);
	}
	.awf-ip__empty {
		margin: 0;
		padding: 0.75rem;
		font-size: 0.875rem;
		color: var(--awf-muted);
	}
	.awf-ip__json {
		margin: 0 !important;
		max-height: 18rem;
		overflow: auto;
		padding: 0.75rem 0.875rem;
		border-radius: var(--awf-radius);
		border: 1px solid var(--awf-line);
		background: var(--awf-code-bg, #1a1714);
		color: #f5f0e8;
		font-family: var(--__sl-font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
	}
	.awf-ip__caption {
		font-size: 0.8125rem;
		color: var(--awf-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-ip__step {
			transition: none;
		}
		.awf-ip__step:not(:disabled):hover {
			transform: none;
		}
	}
</style>
