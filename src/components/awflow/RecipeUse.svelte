<script lang="ts">
	/**
	 * <RecipeUse> — the "Use this recipe" card (awflow/Agentic-Flow#1342): install, copy the .awf,
	 * what you'll need and what the workflow touches. On wide screens it sits in a sticky column
	 * beside the recipe; on narrow ones it stays where it is placed (after the <FlowPreview>).
	 *
	 *   import { RecipeUse } from '@components/awflow';
	 *   <RecipeUse slug="summarize-this-page" hydrate="idle" />
	 *
	 * "Install in AWFlow" uses the same extension handoff as <FlowPreview> (FlowPreviewHandoff.ts),
	 * falling back to the web app's import page. "It touches" is derived by scripts/recipes/build.ts
	 * the way the app derives a marketplace listing's permission manifest.
	 */
	import type { Lang } from '../../i18n/locales';
	import { onMount } from 'svelte';
	import { createT, type UIKey } from '../../i18n/ui';
	import { appImportUrl, handoffAvailable, requestHandoff, watchHandoff } from './FlowPreviewHandoff';
	import { MARKETPLACE_URL, getRecipe, marketplaceHref } from './recipes';

	let { lang = 'en', slug }: { lang?: Lang; slug: string } = $props();
	const t = $derived(createT(lang));
	// svelte-ignore state_referenced_locally
	const r = getRecipe(slug);
	const fileName = r.awf.split('/').pop()!;
	const listing = marketplaceHref(r);

	let appHref = $state(appImportUrl(r.awf));
	let status = $state<{ message: string; tone: 'ok' | 'info' | 'warn'; link?: string } | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		appHref = appImportUrl(r.awf);
		return watchHandoff(() => {});
	});

	function say(message: string, tone: 'ok' | 'info' | 'warn' = 'ok', link?: string, ms = 4500) {
		clearTimeout(timer);
		status = { message, tone, link };
		if (ms) timer = setTimeout(() => (status = null), ms);
	}

	function install(event: MouseEvent) {
		if (!handoffAvailable()) return; // the link opens the web app's import page
		event.preventDefault();
		// Posted synchronously inside the click: the extension only accepts user-initiated requests.
		const answer = requestHandoff(r.awf);
		say(t('flow.opening'), 'info', undefined, 0);
		answer.then((res) => {
			if (res.ok) return say(t('flow.sent'));
			const win = window.open(appHref, '_blank');
			if (win) {
				win.opener = null;
				say(t('flow.openedApp'));
			} else say(t('flow.blocked'), 'warn', appHref, 0);
		});
	}

	async function copy() {
		try {
			const res = await fetch(r.awf, { headers: { Accept: 'application/json' } });
			if (!res.ok) throw new Error(String(res.status));
			const text = await res.text();
			try {
				await navigator.clipboard.writeText(text);
			} catch {
				const area = Object.assign(document.createElement('textarea'), { value: text });
				area.setAttribute('readonly', '');
				area.style.cssText = 'position:fixed;opacity:0';
				document.body.append(area);
				area.select();
				const ok = document.execCommand('copy');
				area.remove();
				if (!ok) throw new Error('copy refused');
			}
			say(t('recipe.use.copied', { file: fileName }));
		} catch {
			say(t('flow.copyFailed'), 'warn', r.awf, 0);
		}
	}

	const CAPS: Record<string, { key: UIKey; tone: string }> = {
		'page-read': { key: 'recipe.touch.page', tone: 'page' },
		'page-write': { key: 'recipe.touch.pageWrite', tone: 'page' },
		clipboard: { key: 'recipe.touch.clipboard', tone: 'local' },
		'local-file': { key: 'recipe.touch.file', tone: 'local' },
		storage: { key: 'recipe.touch.storage', tone: 'local' },
		'code-execution': { key: 'recipe.touch.code', tone: 'page' },
	};
	// The sentence holds a {link} placeholder so each language puts the link where it belongs.
	const [marketBefore, marketAfter] = $derived(t('recipe.use.market.also', { link: '{link}' }).split('{link}'));
	const touch = r.touches;
	const touches = $derived([
		...touch.capabilities.filter((c) => CAPS[c]).map((c) => ({ label: t(CAPS[c].key), tone: CAPS[c].tone })),
		...touch.models.map((m) => ({ label: m.toLowerCase().startsWith('an on-device') ? t('recipe.touch.model') : m, tone: 'model' })),
		...touch.apps.map((a) => ({ label: t('recipe.touch.app', { app: a }), tone: 'app' })),
		...touch.domains.map((d) => ({ label: d, tone: 'site' })),
		...(touch.dynamic ? [{ label: t('recipe.touch.dynamic'), tone: 'site' }] : []),
	]);
</script>

<aside class="awf-ruse not-content" aria-labelledby="awf-ruse-title-{r.slug}" data-pagefind-ignore>
	<div class="awf-ruse__card">
		<h2 class="awf-ruse__title" id="awf-ruse-title-{r.slug}">{t('recipe.use.title')}</h2>
		<a class="awf-ruse__install" href={appHref} target="_blank" rel="noopener" onclick={install}>{t('recipe.use.install')}</a>
		<div class="awf-ruse__row">
			<button type="button" class="awf-ruse__ghost" onclick={copy}>{t('recipe.use.copy')}</button>
			<a class="awf-ruse__ghost" href={r.awf} download={fileName}>{t('recipe.use.download')}</a>
		</div>
		{#if status}
			<p class="awf-ruse__status awf-ruse__status--{status.tone}" role="status">
				{status.message}
				{#if status.link}<a href={status.link} target="_blank" rel="noopener">{t('recipe.use.openIt')}</a>{/if}
			</p>
		{/if}

		<div class="awf-ruse__section">
			<h3 class="awf-ruse__label">{t('recipe.use.needs')}</h3>
			<ul>
				{#each r.needs as n (n.label)}
					<li>{#if n.href}<a href={t.href(n.href)}>{n.label}</a>{:else}{n.label}{/if}</li>
				{:else}
					<li>{t('recipe.use.nothing')}</li>
				{/each}
			</ul>
		</div>

		<div class="awf-ruse__section">
			<h3 class="awf-ruse__label">{t('recipe.use.touches')}</h3>
			{#if touches.length}
				<ul class="awf-ruse__chips">
					{#each touches as x (x.label)}<li class="awf-ruse__chip awf-ruse__chip--{x.tone}">{x.label}</li>{/each}
				</ul>
			{:else}
				<p>{t('recipe.use.nothingOutside')}</p>
			{/if}
			<p class="awf-ruse__note">{t('recipe.use.note')}</p>
		</div>
	</div>
	<p class="awf-ruse__market">
		{#if listing}
			{marketBefore}<a href={listing} target="_blank" rel="noopener">{t('recipe.use.market.link')}</a>{marketAfter}
		{:else}
			{t('recipe.use.market.none')} <a href={MARKETPLACE_URL} target="_blank" rel="noopener">{t('recipe.use.market.browse')}</a>
		{/if}
	</p>
</aside>

<style>
	.awf-ruse {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}
	.awf-ruse__card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		border-radius: 20px;
		background: var(--awf-surface);
		border: 1px solid var(--awf-line);
		box-shadow:
			0 0 0 3px color-mix(in srgb, var(--awf-section-recipes) 18%, transparent),
			var(--awf-shadow);
	}
	.awf-ruse__title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 650;
		color: var(--sl-color-white);
	}
	.awf-ruse__install {
		display: block;
		text-align: center;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		color: #fff;
		background: var(--awf-section-recipes);
		padding: 0.75rem;
		border-radius: 12px;
		transition:
			transform var(--awf-fast),
			box-shadow var(--awf-base);
	}
	.awf-ruse__install:hover {
		color: #fff;
		transform: translateY(-1px);
		box-shadow: 0 10px 22px -10px rgba(21, 128, 61, 0.6);
	}
	.awf-ruse__row {
		display: flex;
		gap: 0.5rem;
	}
	.awf-ruse__ghost {
		flex: 1;
		font: inherit;
		font-size: 0.875rem;
		text-align: center;
		text-decoration: none;
		color: var(--sl-color-white);
		background: transparent;
		border: 1px solid var(--awf-line);
		padding: 0.5rem;
		border-radius: 12px;
		cursor: pointer;
	}
	.awf-ruse__ghost:hover {
		border-color: var(--awf-section-recipes);
		color: var(--sl-color-white);
	}
	.awf-ruse__install:focus-visible,
	.awf-ruse__ghost:focus-visible {
		outline: 2px solid var(--awf-section-recipes);
		outline-offset: 2px;
	}
	.awf-ruse__status {
		margin: 0;
		font-size: 0.8125rem;
		padding: 0.5rem 0.625rem;
		border-radius: 10px;
		background: var(--awf-surface-2);
	}
	.awf-ruse__status--warn {
		color: var(--sl-color-orange-high);
	}
	.awf-ruse__section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--awf-line-soft);
	}
	.awf-ruse__section ul {
		margin: 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.awf-ruse__section p {
		margin: 0;
	}
	.awf-ruse__label {
		margin: 0;
		font-family: var(--__sl-font-mono);
		font-size: 0.6875rem;
		font-weight: 400;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		color: var(--awf-muted);
	}
	.awf-ruse .awf-ruse__chips {
		list-style: none;
		padding: 0;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.awf-ruse__chip {
		margin: 0;
		font-size: 0.75rem;
		padding: 3px 9px;
		border-radius: 999px;
	}
	.awf-ruse__chip--page {
		background: #fce7f3;
		color: #9d174d;
	}
	.awf-ruse__chip--model {
		background: #ede9fe;
		color: #5b21b6;
	}
	.awf-ruse__chip--site {
		background: #dcfce7;
		color: #166534;
		font-family: var(--__sl-font-mono);
	}
	.awf-ruse__chip--app {
		background: #dbeafe;
		color: #1e40af;
	}
	.awf-ruse__chip--local {
		background: #f5f0e8;
		color: #44403c;
	}
	.awf-ruse__note {
		font-size: 0.75rem;
		color: var(--awf-muted);
	}
	.awf-ruse__market {
		margin: 0;
		padding: 0.75rem 0.875rem;
		border-radius: 14px;
		background: var(--awf-surface-2);
		border: 1px solid var(--awf-line);
		font-size: 0.8125rem;
		color: var(--sl-color-gray-2);
	}

	/* Wide screens: the card moves into a sticky column beside the recipe. */
	@media (min-width: 72rem) {
		:global(:root:has(.awf-ruse)) {
			--sl-content-width: 64rem;
		}
		:global(.sl-markdown-content:has(> astro-island > .awf-ruse)) {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 18.5rem;
			column-gap: 2.25rem;
			align-items: start;
		}
		/* Islands are display: contents, so their content is the grid item. */
		:global(.sl-markdown-content:has(> astro-island > .awf-ruse) > *),
		:global(.sl-markdown-content:has(> astro-island > .awf-ruse) > astro-island > *) {
			grid-column: 1;
		}
		.awf-ruse.awf-ruse {
			grid-column: 2;
			grid-row: 1 / span 400;
			position: sticky;
			top: calc(var(--sl-nav-height, 4rem) + 1.5rem);
			margin: 0;
		}
	}
</style>
