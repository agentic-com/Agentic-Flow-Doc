<script lang="ts">
	/**
	 * Filterable node catalog for /nodes/ (awflow/Agentic-Flow#1337). Data comes from
	 * src/data/nodeCatalog.ts (built from the generated nodes.json), never hand-maintained:
	 *
	 *   import NodeCatalog from '@components/awflow/NodeCatalog.svelte';
	 *   import { catalogNodes, catalogGroups } from '../../data/nodeCatalog';
	 *   <NodeCatalog client:load nodes={catalogNodes()} groups={catalogGroups()} />
	 *
	 * Filters live in the URL (?q=&family=&works=&needs=&tool=1&new=1) so a filtered view can be shared.
	 */
	import { onMount } from 'svelte';
	import type { CatalogGroup, CatalogNode, CatalogFamily, CatalogNeeds } from '../../data/nodeCatalog';

	interface Props {
		nodes: CatalogNode[];
		/** Integration use-case groups, in display order. */
		groups?: CatalogGroup[];
	}
	let { nodes = [], groups = [] }: Props = $props();

	const FAMILIES: { id: CatalogFamily; label: string; color: string }[] = [
		{ id: 'trigger', label: 'Triggers', color: '#d97706' },
		{ id: 'inpage', label: 'In-page', color: '#db2777' },
		{ id: 'flow', label: 'Flow', color: '#2563eb' },
		{ id: 'data', label: 'Data', color: '#0d9488' },
		{ id: 'core', label: 'Core', color: '#78716c' },
		{ id: 'ai', label: 'AI', color: '#7c3aed' },
		{ id: 'integration', label: 'Integrations', color: '#16a34a' },
		{ id: 'lambda', label: 'Lambda', color: '#a8a29e' },
	];
	const FAMILY = Object.fromEntries(FAMILIES.map((f) => [f.id, f])) as Record<CatalogFamily, (typeof FAMILIES)[number]>;
	const NEEDS: { id: CatalogNeeds; label: string }[] = [
		{ id: 'none', label: 'No setup' },
		{ id: 'connection', label: 'A connection' },
		{ id: 'on-device', label: 'On-device AI' },
	];
	const WORKS = [
		{ id: 'web', label: 'Web app' },
		{ id: 'extension', label: 'Extension only' },
	] as const;
	type Works = (typeof WORKS)[number]['id'];

	let q = $state('');
	let family = $state<CatalogFamily | ''>('');
	let works = $state<Works | ''>('');
	let needs = $state<CatalogNeeds | ''>('');
	let tool = $state(false);
	let fresh = $state(false);
	let ready = $state(false);

	const uid = $props.id();

	// British and American spellings match ("summarise" finds "Summarize").
	const norm = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/is(e|es|ed|ing|ation)\b/g, 'iz$1');

	const groupLabel = new Map(groups.map((g) => [g.id, g.label]));
	const haystack = new Map(
		nodes.map((n) => [
			n.id,
			norm(
				[n.name, n.description, FAMILY[n.family]?.label ?? '', n.group ? groupLabel.get(n.group) ?? '' : '', ...n.ops].join(' '),
			),
		]),
	);

	function matches(n: CatalogNode, ignoreFamily = false): boolean {
		if (!ignoreFamily && family && n.family !== family) return false;
		// Every node runs in the extension; "Extension only" means it doesn't run in the web app.
		if (works === 'web' && !n.web) return false;
		if (works === 'extension' && n.web) return false;
		if (needs && n.needs !== needs) return false;
		if (tool && !n.agentTool) return false;
		if (fresh && !n.isNew) return false;
		const terms = norm(q).split(/\s+/).filter(Boolean);
		if (terms.length) {
			const hay = haystack.get(n.id) ?? '';
			if (!terms.every((t) => hay.includes(t))) return false;
		}
		return true;
	}

	const results = $derived(nodes.filter((n) => matches(n)));
	const familyCounts = $derived(
		Object.fromEntries(FAMILIES.map((f) => [f.id, nodes.filter((n) => n.family === f.id && matches(n, true)).length])),
	);
	const allCount = $derived(nodes.filter((n) => matches(n, true)).length);
	const filtered = $derived(!!(q.trim() || family || works || needs || tool || fresh));

	const byName = (a: CatalogNode, b: CatalogNode) => Number(a.deprecated) - Number(b.deprecated) || a.name.localeCompare(b.name);
	const sections = $derived(
		FAMILIES.map((f) => {
			const list = results.filter((n) => n.family === f.id).sort(byName);
			const sub =
				f.id === 'integration'
					? [
							...groups.map((g) => ({ id: g.id, label: g.label, nodes: list.filter((n) => n.group === g.id) })),
							{ id: 'ungrouped', label: 'Other apps', nodes: list.filter((n) => !n.group || !groupLabel.has(n.group)) },
						].filter((g) => g.nodes.length)
					: undefined;
			return { ...f, nodes: list, sub };
		}).filter((s) => s.nodes.length),
	);

	const status = $derived(
		results.length === nodes.length
			? `${nodes.length} nodes`
			: `${results.length} of ${nodes.length} nodes${results.length === 0 ? ' match' : ''}`,
	);

	function readUrl() {
		try {
			const p = new URL(window.location.href).searchParams;
			q = p.get('q') ?? '';
			const f = p.get('family') as CatalogFamily | null;
			family = f && FAMILY[f] ? f : '';
			const w = p.get('works');
			works = w === 'web' || w === 'extension' ? w : '';
			const nd = p.get('needs');
			needs = NEEDS.some((x) => x.id === nd) ? (nd as CatalogNeeds) : '';
			tool = p.get('tool') === '1';
			fresh = p.get('new') === '1';
		} catch {
			/* keep defaults */
		}
	}

	onMount(() => {
		readUrl();
		ready = true;
		const onPop = () => readUrl();
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	});

	// Keep the URL in sync (replaceState: filtering doesn't flood the back button).
	$effect(() => {
		const state = { q: q.trim(), family, works, needs, tool: tool ? '1' : '', new: fresh ? '1' : '' };
		if (!ready) return;
		try {
			const url = new URL(window.location.href);
			for (const [k, v] of Object.entries(state)) {
				if (v) url.searchParams.set(k, v);
				else url.searchParams.delete(k);
			}
			if (url.href !== window.location.href) history.replaceState(history.state, '', url);
		} catch {
			/* ignore */
		}
	});

	function reset() {
		q = '';
		family = '';
		works = '';
		needs = '';
		tool = false;
		fresh = false;
	}

	function badges(n: CatalogNode): { text: string; variant: string }[] {
		const out: { text: string; variant: string }[] = [];
		if (n.deprecated) out.push({ text: 'Deprecated', variant: 'deprecated' });
		if (n.isNew) out.push({ text: 'New', variant: 'new' });
		if (n.needs === 'connection') out.push({ text: 'Needs a connection', variant: 'connections' });
		else if (n.needs === 'on-device') out.push({ text: 'On-device', variant: 'on-device' });
		else out.push({ text: 'No setup', variant: 'no-setup' });
		if (n.ops.length) out.push({ text: `${n.ops.length} operation${n.ops.length === 1 ? '' : 's'}`, variant: 'neutral' });
		if (!n.web) out.push({ text: 'Extension only', variant: 'extension' });
		if (n.agentTool) out.push({ text: 'Agent tool', variant: 'agent-tool' });
		return out;
	}

	const initials = (name: string) =>
		name
			.replace(/[^A-Za-z0-9 ]/g, ' ')
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0].toUpperCase())
			.join('');
</script>

<div class="awf-catalog not-content">
	<div class="awf-catalog__search">
		<label class="awf-catalog__label" for={`${uid}-q`}>Filter nodes by name or task</label>
		<div class="awf-catalog__field">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
				><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg
			>
			<input
				id={`${uid}-q`}
				type="search"
				bind:value={q}
				placeholder="Try “click”, “pdf”, “summarise”, “slack send”"
				autocomplete="off"
				spellcheck="false"
				aria-describedby={`${uid}-status`}
			/>
		</div>
	</div>

	<div class="awf-catalog__facets">
		<div class="awf-catalog__facet" role="group" aria-labelledby={`${uid}-fam`}>
			<span class="awf-catalog__facet-label" id={`${uid}-fam`}>Family</span>
			<div class="awf-catalog__chips">
				<button type="button" class="awf-catalog__chip" aria-pressed={family === ''} onclick={() => (family = '')}>
					All <span class="awf-catalog__n">{allCount}</span>
				</button>
				{#each FAMILIES as f (f.id)}
					<button
						type="button"
						class="awf-catalog__chip"
						style={`--fc: ${f.color}`}
						aria-pressed={family === f.id}
						onclick={() => (family = family === f.id ? '' : f.id)}
					>
						<span class="awf-catalog__dot" aria-hidden="true"></span>{f.label}
						<span class="awf-catalog__n">{familyCounts[f.id]}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="awf-catalog__facet-row">
			<div class="awf-catalog__facet" role="group" aria-labelledby={`${uid}-works`}>
				<span class="awf-catalog__facet-label" id={`${uid}-works`}>Works in</span>
				<div class="awf-catalog__chips">
					{#each WORKS as w (w.id)}
						<button
							type="button"
							class="awf-catalog__chip awf-catalog__chip--soft"
							aria-pressed={works === w.id}
							onclick={() => (works = works === w.id ? '' : w.id)}>{w.label}</button
						>
					{/each}
				</div>
			</div>
			<div class="awf-catalog__facet" role="group" aria-labelledby={`${uid}-needs`}>
				<span class="awf-catalog__facet-label" id={`${uid}-needs`}>Needs</span>
				<div class="awf-catalog__chips">
					{#each NEEDS as nd (nd.id)}
						<button
							type="button"
							class="awf-catalog__chip awf-catalog__chip--soft"
							aria-pressed={needs === nd.id}
							onclick={() => (needs = needs === nd.id ? '' : nd.id)}>{nd.label}</button
						>
					{/each}
				</div>
			</div>
			<div class="awf-catalog__facet" role="group" aria-labelledby={`${uid}-more`}>
				<span class="awf-catalog__facet-label" id={`${uid}-more`}>Only</span>
				<div class="awf-catalog__chips">
					<button type="button" class="awf-catalog__chip awf-catalog__chip--soft" aria-pressed={tool} onclick={() => (tool = !tool)}
						>Agent tools</button
					>
					<button type="button" class="awf-catalog__chip awf-catalog__chip--soft" aria-pressed={fresh} onclick={() => (fresh = !fresh)}
						>New</button
					>
				</div>
			</div>
		</div>
	</div>

	<div class="awf-catalog__status">
		<p id={`${uid}-status`} role="status" aria-live="polite" aria-atomic="true">
			Showing <strong>{status}</strong>
		</p>
		{#if filtered}
			<button type="button" class="awf-catalog__reset" onclick={reset}>Clear filters</button>
		{/if}
	</div>

	{#if results.length === 0}
		<div class="awf-catalog__empty">
			<p><strong>No node matches.</strong> Try a shorter word, or clear the filters.</p>
		</div>
	{/if}

	{#snippet card(n: CatalogNode)}
		<li>
			<a class="awf-catalog__card" href={n.href} style={`--fc: ${FAMILY[n.family]?.color ?? '#4338ca'}`}>
				<span class="awf-catalog__card-head">
					<span class="awf-catalog__icon" aria-hidden="true">{initials(n.name)}</span>
					<span class="awf-catalog__name">{n.name}</span>
				</span>
				{#if n.description}<span class="awf-catalog__desc">{n.description}</span>{/if}
				<span class="awf-catalog__badges">
					{#each badges(n) as b (b.text)}
						<span class={`awf-badge awf-badge--${b.variant}`}>{b.text}</span>
					{/each}
				</span>
			</a>
		</li>
	{/snippet}

	{#each sections as s (s.id)}
		<section class="awf-catalog__family" style={`--fc: ${s.color}`} aria-labelledby={`${uid}-h-${s.id}`}>
			<h2 id={`${uid}-h-${s.id}`} class="awf-catalog__h2">
				<span class="awf-catalog__dot" aria-hidden="true"></span>{s.label}
				<span class="awf-catalog__n">{s.nodes.length}</span>
			</h2>
			{#if s.sub}
				{#each s.sub as g (g.id)}
					<h3 class="awf-catalog__h3">{g.label}</h3>
					<ul class="awf-catalog__grid">
						{#each g.nodes as n (n.id)}{@render card(n)}{/each}
					</ul>
				{/each}
			{:else}
				<ul class="awf-catalog__grid">
					{#each s.nodes as n (n.id)}{@render card(n)}{/each}
				</ul>
			{/if}
		</section>
	{/each}

	<aside class="awf-catalog__missing" aria-labelledby={`${uid}-missing`}>
		<h2 id={`${uid}-missing`} class="awf-catalog__missing-title">Missing an app?</h2>
		<p>
			Call any API with <a href="/nodes/builtin/core/http-request/">HTTP Request</a> or
			<a href="/nodes/builtin/integration/custom-api/">Custom API</a> and your own key, or ask for it on the
			<a href="/app/request-board/">request board</a>.
		</p>
	</aside>
</div>

<style>
	.awf-catalog {
		--fc: var(--awf-section-nodes);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-block: 1.5rem 2rem;
	}
	.awf-catalog__label,
	.awf-catalog__facet-label {
		display: block;
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		color: var(--awf-muted);
		margin-bottom: 0.375rem;
	}
	.awf-catalog__field {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.625rem 0.875rem;
		border-radius: 14px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--awf-muted);
	}
	.awf-catalog__field:focus-within {
		border-color: var(--awf-section-nodes);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--awf-section-nodes) 22%, transparent);
	}
	.awf-catalog__field input {
		flex: 1;
		min-width: 0;
		font: inherit;
		font-size: 1rem;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--sl-color-white);
	}
	.awf-catalog__facets {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}
	.awf-catalog__facet-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.875rem 1.5rem;
	}
	.awf-catalog__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.awf-catalog__chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.2;
		padding: 0.4375rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--sl-color-gray-1);
		cursor: pointer;
		transition:
			transform var(--awf-fast, 150ms) var(--awf-ease, ease),
			background-color var(--awf-fast, 150ms);
	}
	.awf-catalog__chip:hover {
		transform: translateY(-1px);
	}
	.awf-catalog__chip:focus-visible,
	.awf-catalog__reset:focus-visible,
	.awf-catalog__card:focus-visible {
		outline: 2px solid var(--awf-section-nodes);
		outline-offset: 2px;
	}
	.awf-catalog__chip[aria-pressed='true'] {
		background: var(--sl-color-white);
		border-color: var(--sl-color-white);
		color: var(--sl-color-black);
	}
	.awf-catalog__chip--soft {
		border-style: dashed;
	}
	.awf-catalog__chip--soft[aria-pressed='true'] {
		border-style: solid;
	}
	.awf-catalog__dot {
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 3px;
		background: var(--fc);
	}
	.awf-catalog__n {
		font-family: var(--__sl-font-mono);
		font-size: 0.6875rem;
		opacity: 0.75;
	}
	.awf-catalog__status {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--awf-line-soft);
	}
	.awf-catalog__status p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--sl-color-gray-2);
	}
	.awf-catalog__reset {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--sl-color-text-accent);
		cursor: pointer;
	}
	.awf-catalog__empty {
		padding: 1rem 1.25rem;
		border-radius: 16px;
		border: 1px dashed var(--awf-line);
	}
	.awf-catalog__empty p {
		margin: 0;
	}
	.awf-catalog__family {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.awf-catalog__h2 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.75rem 0 0;
		font-size: 1.375rem;
		letter-spacing: -0.015em;
		color: var(--sl-color-white);
	}
	.awf-catalog__h3 {
		margin: 0.5rem 0 0;
		font-family: var(--__sl-font-mono);
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--awf-muted);
		text-transform: lowercase;
	}
	.awf-catalog__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
		gap: 0.75rem;
	}
	.awf-catalog__grid li {
		margin: 0;
		display: flex;
	}
	.awf-catalog__card {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding: 0.875rem 1rem 1rem;
		border-radius: 16px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		transition:
			transform var(--awf-base, 300ms) var(--awf-ease, ease),
			box-shadow var(--awf-base, 300ms),
			border-color var(--awf-base, 300ms);
	}
	.awf-catalog__card::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: var(--fc);
		transform: scaleX(0.18);
		transform-origin: left;
		transition: transform 450ms var(--awf-ease, ease);
	}
	.awf-catalog__card:hover {
		transform: translateY(-3px);
		box-shadow: var(--awf-shadow);
		border-color: color-mix(in srgb, var(--fc) 45%, var(--awf-line));
		color: inherit;
	}
	.awf-catalog__card:hover::before {
		transform: scaleX(1);
	}
	.awf-catalog__card-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.awf-catalog__icon {
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 10px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--fc);
		background: color-mix(in srgb, var(--fc) 12%, var(--awf-surface));
		border: 1px solid color-mix(in srgb, var(--fc) 28%, transparent);
	}
	.awf-catalog__name {
		font-weight: 650;
		line-height: 1.3;
		color: var(--sl-color-white);
	}
	.awf-catalog__desc {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--sl-color-gray-2);
	}
	.awf-catalog__badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: auto;
	}
	.awf-catalog__badges .awf-badge {
		font-size: 0.6875rem;
		padding: 2px 8px;
	}
	.awf-catalog__missing {
		margin-top: 0.5rem;
		padding: 1.125rem 1.25rem;
		border-radius: 18px;
		border: 1px dashed color-mix(in srgb, var(--awf-section-nodes) 45%, var(--awf-line));
		background: var(--awf-surface);
	}
	.awf-catalog__missing-title {
		margin: 0 0 0.25rem;
		font-size: 1.0625rem;
		color: var(--sl-color-white);
	}
	.awf-catalog__missing p {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--sl-color-gray-2);
	}
	@media (max-width: 639.98px) {
		.awf-catalog__facet-row {
			flex-direction: column;
		}
		.awf-catalog__facet .awf-catalog__chips {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 0.25rem;
			scrollbar-width: thin;
		}
		.awf-catalog__chip {
			flex: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-catalog__chip,
		.awf-catalog__card,
		.awf-catalog__card::before {
			transition: none;
		}
		.awf-catalog__chip:hover,
		.awf-catalog__card:hover {
			transform: none;
		}
	}
</style>
