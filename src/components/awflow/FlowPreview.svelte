<script lang="ts">
	/**
	 * <FlowPreview> — a real .awf workflow, drawn read-only (awflow/Agentic-Flow#1336).
	 *
	 * In MDX:
	 *   import FlowPreview from '@components/awflow/FlowPreview.svelte';
	 *   <FlowPreview src="/examples/summarize-this-page.awf" client:visible />
	 * or, rendered at build time (no layout shift, works without JS):
	 *   import FlowPreview from '@components/awflow/FlowPreview.astro';
	 *   <FlowPreview src="/examples/summarize-this-page.awf" />
	 */
	import { onMount } from 'svelte';
	import { buildFlowModel, type FlowModel } from '../../data/flowPreview';
	import { appImportUrl, handoffAvailable, requestHandoff, watchHandoff } from './FlowPreviewHandoff';

	interface Props {
		/** Path or URL of the .awf file, e.g. "/examples/summarize-this-page.awf". */
		src: string;
		/** Optional caption under the preview. */
		caption?: string;
		/** The file's text, when already read at build time (FlowPreview.astro passes it). */
		raw?: string;
	}

	let { src, caption, raw }: Props = $props();

	function parse(text: string): { model: FlowModel | null; error: string | null } {
		try {
			return { model: buildFlowModel(JSON.parse(text)), error: null };
		} catch (e) {
			return { model: null, error: e instanceof SyntaxError ? 'This file is not valid JSON.' : (e as Error).message };
		}
	}

	// svelte-ignore state_referenced_locally
	const initial = raw ? parse(raw) : { model: null, error: null };
	// svelte-ignore state_referenced_locally
	let text = $state<string | null>(raw ?? null);
	let model = $state<FlowModel | null>(initial.model);
	let error = $state<string | null>(initial.error);
	// svelte-ignore state_referenced_locally
	let appHref = $state(appImportUrl(src));
	let status = $state<{ message: string; tone: 'ok' | 'info' | 'warn'; link?: string } | null>(null);
	let statusTimer: ReturnType<typeof setTimeout> | undefined;

	const lastLayer = $derived(model ? model.layers.length - 1 : 0);
	/** Seconds between two layers lighting up; the whole run replays every 4.8 s (motion.css). */
	const step = $derived(model ? Math.min(1.2, 4.8 / Math.max(1, model.layers.length)) : 1.2);
	const fileName = $derived(src.split('/').pop() ?? src);

	async function load(): Promise<string> {
		if (text !== null) return text;
		const res = await fetch(src, { headers: { Accept: 'application/json' } });
		if (!res.ok) throw new Error(`Couldn't load ${fileName} (error ${res.status}).`);
		text = await res.text();
		return text;
	}

	onMount(() => {
		appHref = appImportUrl(src);
		if (!model && !error) {
			load()
				.then((t) => ({ model, error } = parse(t)))
				.catch((e: Error) => (error = e.message));
		}
		return watchHandoff(() => {});
	});

	function say(message: string, tone: 'ok' | 'info' | 'warn' = 'ok', link?: string, ms = 4000) {
		clearTimeout(statusTimer);
		status = { message, tone, link };
		if (ms) statusTimer = setTimeout(() => (status = null), ms);
	}

	function openInApp(event: MouseEvent) {
		if (!handoffAvailable()) return; // the link itself opens the web app's import page
		event.preventDefault();
		// Posted synchronously inside the click: the extension only accepts user-initiated requests.
		const answer = requestHandoff(src);
		say('Opening in AWFlow…', 'info', undefined, 0);
		answer.then((r) => {
			if (r.ok) return say('Sent to AWFlow. Review it in the extension and confirm the import.');
			const win = window.open(appHref, '_blank');
			if (win) {
				win.opener = null;
				say('Opened the AWFlow web app to import it.');
			} else say("Your browser blocked the new tab.", 'warn', appHref, 0);
		});
	}

	async function copy() {
		try {
			const t = await load();
			try {
				await navigator.clipboard.writeText(t);
			} catch {
				const area = Object.assign(document.createElement('textarea'), { value: t });
				area.setAttribute('readonly', '');
				area.style.cssText = 'position:fixed;opacity:0';
				document.body.append(area);
				area.select();
				const ok = document.execCommand('copy');
				area.remove();
				if (!ok) throw new Error('copy refused');
			}
			say(`Copied ${fileName}. In AWFlow, use Import workflow and paste it.`);
		} catch {
			say("Couldn't copy. Download the file instead.", 'warn', src, 0);
		}
	}
</script>

<figure class="awf-flow not-content">
	<div class="awf-flow__panel">
		<div class="awf-flow__head">
			<span class="awf-flow__eyebrow">workflow · {fileName}</span>
			{#if model}<span class="awf-flow__count">{model.steps.length} steps</span>{/if}
		</div>

		{#if model}
			<p class="awf-flow__sr">{model.summary}</p>
			<ol class="awf-flow__graph" aria-label="Steps of {model.name}, in run order">
				{#each model.layers as layer, i (i)}
					<li class="awf-flow__layer">
						{#snippet card(s: (typeof layer)[number])}
							<div
								class="awf-flow__node awf-run awf-flow__node--{s.family}"
								style="animation-delay: {(i * step).toFixed(2)}s"
								title={s.notes}
							>
								<span class="awf-flow__num" aria-hidden="true">{i + 1}</span>
								<span class="awf-flow__text">
									{#if s.docLink}
										<a class="awf-flow__name" href={s.docLink}>{s.name}<span class="awf-flow__sr"> ({s.subtitle} — open its doc page)</span></a>
									{:else}
										<span class="awf-flow__name">{s.name}</span>
									{/if}
									<span class="awf-flow__sub" aria-hidden={s.docLink ? 'true' : undefined}>{s.subtitle}</span>
									{#if s.via}<span class="awf-flow__via">if {s.via}</span>{/if}
									{#if s.attachments.length}
										<span class="awf-flow__deps">
											{#each s.attachments as a (a.id)}
												{#if a.docLink}<a class="awf-flow__dep" href={a.docLink}>+ {a.name}</a>
												{:else}<span class="awf-flow__dep">+ {a.name}</span>{/if}
											{/each}
										</span>
									{/if}
								</span>
							</div>
						{/snippet}

						{#if layer.length === 1}
							{@render card(layer[0])}
						{:else}
							<ul class="awf-flow__branch" aria-label="{layer.length} branches">
								{#each layer as s (s.id)}<li>{@render card(s)}</li>{/each}
							</ul>
						{/if}

						{#if i < lastLayer}
							<span class="awf-wire awf-flow__wire-h" aria-hidden="true"><i style="animation-delay: {(i * step).toFixed(2)}s"></i></span>
							<span class="awf-wire awf-wire--v awf-flow__wire-v" aria-hidden="true"><i style="animation-delay: {(i * step).toFixed(2)}s"></i></span>
						{/if}
					</li>
				{/each}
			</ol>
		{:else if error}
			<p class="awf-flow__error" role="alert">{error} <a href={src}>Open the file</a></p>
		{:else}
			<div class="awf-flow__loading" aria-label="Loading workflow preview" role="img">
				<span class="awf-skel"></span><span class="awf-wire" aria-hidden="true"></span><span class="awf-skel"></span><span
					class="awf-wire"
					aria-hidden="true"
				></span><span class="awf-skel"></span>
			</div>
		{/if}

		<div class="awf-flow__actions">
			<a class="awf-flow__btn awf-flow__btn--primary awf-press" href={appHref} target="_blank" rel="noopener" onclick={openInApp}>
				Open in AWFlow
			</a>
			<button type="button" class="awf-flow__btn" onclick={copy}>Copy .awf</button>
			<span class="awf-flow__status awf-flow__status--{status?.tone ?? 'ok'}" role="status" aria-live="polite">
				{#if status}
					{status.message}
					{#if status.link}<a href={status.link} target="_blank" rel="noopener">{status.link === src ? 'Download .awf' : 'Open the web app'}</a>{/if}
				{/if}
			</span>
		</div>
	</div>
	{#if caption}<figcaption class="awf-flow__caption">{caption}</figcaption>{/if}
</figure>

<style>
	.awf-flow {
		container: awf-flow / inline-size;
		margin: 1.5rem 0;
	}
	.awf-flow__panel {
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
		padding: 1.25rem;
		border-radius: var(--awf-radius-xl, 22px);
		background-color: #1a1714;
		background-image: radial-gradient(rgba(255, 243, 227, 0.08) 1px, transparent 1px);
		background-size: 16px 16px;
		color: #fff3e3;
	}
	.awf-flow__head {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-family: var(--__sl-font-mono, monospace);
		font-size: 0.75rem;
		color: #d6d3d1;
	}
	.awf-flow__count {
		flex: none;
		white-space: nowrap;
	}
	.awf-flow__eyebrow {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.awf-flow__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Graph: vertical on narrow containers, a wrapping row once there is room. */
	.awf-flow__graph,
	.awf-flow__branch {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.awf-flow__graph {
		display: flex;
		flex-direction: column;
	}
	.awf-flow__layer {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin: 0;
	}
	.awf-flow__branch {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.awf-flow__branch > li {
		margin: 0;
	}
	.awf-flow__wire-h {
		display: none;
	}
	.awf-flow__wire-v {
		align-self: center;
		margin: 0.25rem 0;
	}

	@container awf-flow (min-width: 36rem) {
		.awf-flow__graph {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			row-gap: 1rem;
		}
		.awf-flow__layer {
			flex-direction: row;
			align-items: center;
		}
		.awf-flow__node {
			max-width: 13.5rem;
		}
		.awf-flow__wire-h {
			display: inline-block;
			width: 2.5rem;
		}
		.awf-flow__wire-v {
			display: none;
		}
	}

	/* Node card, tinted by family. */
	.awf-flow__node {
		--tint: var(--awf-family-core);
		position: relative;
		display: flex;
		gap: 0.625rem;
		align-items: flex-start;
		padding: 0.625rem 0.75rem;
		border-radius: 12px;
		background: var(--tint);
		border: 1px solid color-mix(in srgb, var(--tint) 70%, #1c1917);
		color: #1c1917;
		line-height: 1.3;
		transition: transform var(--awf-fast, 150ms) var(--awf-ease, ease);
	}
	.awf-flow__node:hover {
		transform: translateY(-2px);
	}
	.awf-flow__node--trigger { --tint: var(--awf-family-trigger); }
	.awf-flow__node--lambda { --tint: var(--awf-family-lambda); }
	.awf-flow__node--inpage { --tint: var(--awf-family-inpage); }
	.awf-flow__node--flow { --tint: var(--awf-family-flow); }
	.awf-flow__node--data { --tint: var(--awf-family-data); }
	.awf-flow__node--core { --tint: var(--awf-family-core); }
	.awf-flow__node--ai { --tint: var(--awf-family-ai); }
	.awf-flow__node--integration { --tint: var(--awf-family-integration); }

	.awf-flow__num {
		flex: none;
		display: grid;
		place-items: center;
		width: 1.375rem;
		height: 1.375rem;
		border-radius: 50%;
		background: #1c1917;
		color: #fff3e3;
		font-family: var(--__sl-font-mono, monospace);
		font-size: 0.6875rem;
	}
	.awf-flow__text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}
	.awf-flow__name {
		font-size: 0.875rem;
		font-weight: 650;
		color: #1c1917;
		text-decoration: none;
		overflow-wrap: anywhere;
	}
	/* The whole card is the name's click target; attachment links sit above it. */
	a.awf-flow__name::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}
	a.awf-flow__name:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	a.awf-flow__name:focus-visible {
		outline: none;
	}
	a.awf-flow__name:focus-visible::after {
		outline: 3px solid var(--awf-gold, #fbbf24);
		outline-offset: 2px;
	}
	.awf-flow__sub {
		font-size: 0.75rem;
		color: #44403c;
	}
	.awf-flow__via {
		align-self: flex-start;
		margin-top: 0.125rem;
		padding: 0 0.375rem;
		border-radius: 999px;
		background: #1c1917;
		color: #fde68a;
		font-family: var(--__sl-font-mono, monospace);
		font-size: 0.6875rem;
	}
	.awf-flow__deps {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-top: 0.25rem;
	}
	.awf-flow__dep {
		position: relative;
		z-index: 1;
		padding: 0.0625rem 0.375rem;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.65);
		border: 1px dashed #a8a29e;
		color: #44403c;
		font-size: 0.6875rem;
		text-decoration: none;
	}
	a.awf-flow__dep:hover,
	a.awf-flow__dep:focus-visible {
		color: #1c1917;
		border-color: #1c1917;
	}

	.awf-flow__loading {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0;
		min-height: 3rem;
	}
	.awf-flow__loading .awf-skel {
		display: inline-block;
		width: 8rem;
		height: 2.75rem;
		border-radius: 12px;
		opacity: 0.25;
	}
	.awf-flow__error {
		margin: 0;
		color: #fecaca;
	}
	.awf-flow__error a {
		color: #fbbf24;
	}

	.awf-flow__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.625rem;
	}
	.awf-flow__btn {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.875rem;
		border-radius: 11px;
		border: 1px solid #3f362f;
		background: transparent;
		color: #fff3e3;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.4;
		text-decoration: none;
		cursor: pointer;
	}
	.awf-flow__btn:hover {
		border-color: #78716c;
	}
	.awf-flow__btn--primary {
		border-color: #fbbf24;
		background: #fbbf24;
		color: #1c1917;
		font-weight: 600;
	}
	.awf-flow__btn--primary:hover {
		border-color: #fcd34d;
		background: #fcd34d;
		color: #1c1917;
	}
	.awf-flow__btn:focus-visible {
		outline: 3px solid #fbbf24;
		outline-offset: 2px;
	}
	.awf-flow__status {
		flex: 1 1 12rem;
		font-size: 0.8125rem;
		color: #86efac;
	}
	.awf-flow__status--info {
		color: #d6d3d1;
	}
	.awf-flow__status--warn {
		color: #fcd34d;
	}
	.awf-flow__status a {
		color: #fbbf24;
	}
	.awf-flow__caption {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--sl-color-gray-3);
	}

	@media (prefers-reduced-motion: reduce) {
		.awf-flow__node {
			transition: none;
		}
		.awf-flow__node:hover {
			transform: none;
		}
	}
</style>
