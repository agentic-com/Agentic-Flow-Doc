<script lang="ts">
	/**
	 * Docs search + Ask Aria (awflow/Agentic-Flow#1340, Search.dc.html).
	 *
	 * Rendered by the starlight-awflow `Search` override as a `client:load` island: the header
	 * button and a modal <dialog>. Uses Pagefind's index through its JS API (the index only exists
	 * after `astro build`). Ask Aria never answers on the docs server: the question is handed to the
	 * reader's own AWFlow, through the extension hand-off when it's on the page, else the web app.
	 *
	 * Opens with ⌘K / Ctrl+K or `/` (Search) and ⌘I / Ctrl+I (Ask Aria). Any `[data-awf-ask-aria]`
	 * or `a[href="#ask-aria"]` (the floating pill, <PageActions>) opens the Ask Aria tab, and any
	 * `[data-awf-search-open]` opens Search.
	 */
	import { onMount, tick } from 'svelte';
	import {
		SEARCH_GROUPS,
		ariaAppUrl,
		buildAriaPrompt,
		groupById,
		groupFor,
		safeExcerpt,
		type AriaIntent,
		type AriaSource,
	} from '../../../plugins/starlight-awflow/lib/search';

	interface Props {
		/** Base URL of the AWFlow web app (fallback when the extension hand-off is absent). */
		appUrl?: string;
		/** Site base path, e.g. `/`. */
		base?: string;
		/** Placeholder of the search field. */
		placeholder?: string;
	}

	let { appUrl = 'https://app.awflow.io', base = '/', placeholder = 'Search the docs' }: Props = $props();

	type Tab = 'search' | 'aria';
	interface Result {
		id: string;
		url: string;
		title: string;
		heading?: string;
		excerpt: string;
		group: string;
	}

	const RECENT_KEY = 'awf:docs:recent-searches';
	const MAX_RESULTS = 30;
	const uid = 'awf-search';

	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let open = $state(false);
	let tab = $state<Tab>('search');
	let query = $state('');
	let results = $state<Result[]>([]);
	let searched = $state(''); // query the current results belong to
	let loading = $state(false);
	/** Results match only some words of the query (see runSearch). */
	let loose = $state(false);
	let unavailable = $state(false);
	let filter = $state('all');
	let active = $state(0);
	let recent = $state<string[]>([]);
	let isMac = $state(false);
	let hydrated = $state(false);
	let handoff = $state<{ version?: string } | null>(null);
	let ariaStatus = $state('');
	let fallbackUrl = $state('');

	let opener: HTMLElement | null = null;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let token = 0;
	let pagefind: Promise<any> | null = null;

	const base_ = $derived(base.endsWith('/') ? base : base + '/');
	const mod = $derived(isMac ? '⌘' : 'Ctrl');
	/** starlight-md-txt serves `<page>.md`; the home page has none. */
	const mdTwin = $derived.by(() => {
		if (!open) return '';
		const path = location.pathname.replace(/\/$/, '');
		return path && path !== base_.replace(/\/$/, '') ? `${path}.md` : '';
	});

	const counts = $derived.by(() => {
		const c: Record<string, number> = {};
		for (const r of results) c[r.group] = (c[r.group] ?? 0) + 1;
		return c;
	});
	const chips = $derived(SEARCH_GROUPS.filter((g) => counts[g.id]));
	/** Visible results, in display order (group order, then rank), so ↑↓ follows what you see. */
	const visible = $derived.by(() => {
		const order = (id: string) => SEARCH_GROUPS.findIndex((g) => g.id === id);
		return results
			.filter((r) => filter === 'all' || r.group === filter)
			.map((r, i) => ({ r, i }))
			.sort((a, b) => order(a.r.group) - order(b.r.group) || a.i - b.i)
			.map(({ r }) => r);
	});
	const showRecent = $derived(tab === 'search' && !query.trim() && recent.length > 0);
	/** Options the listbox currently offers (results, or recent searches when the field is empty). */
	const optionCount = $derived(showRecent ? recent.length : visible.length);
	const activeId = $derived(
		tab === 'search' && optionCount ? `${uid}-opt-${Math.min(active, optionCount - 1)}` : undefined
	);
	const sources = $derived<AriaSource[]>(
		(searched && searched === query.trim() ? results : []).slice(0, 3).map((r) => ({
			title: r.heading ? `${r.title}: ${r.heading}` : r.title,
			url: absolute(r.url),
		}))
	);

	function absolute(url: string) {
		try {
			return new URL(url, location.origin).href;
		} catch {
			return url;
		}
	}

	// ---------- Pagefind ----------

	function loadPagefind() {
		if (!pagefind) {
			pagefind = import(/* @vite-ignore */ `${base_}pagefind/pagefind.js`).then(async (pf) => {
				await pf.options?.({ baseUrl: base_, excerptLength: 24 });
				pf.init?.();
				return pf;
			});
			pagefind.catch(() => {
				pagefind = null;
			});
		}
		return pagefind;
	}

	function bestSub(d: any): { url: string; title: string; excerpt: string } | null {
		const subs: any[] = (d.sub_results ?? []).filter((s: any) => s.url?.includes('#'));
		let best: any = null;
		let bestMarks = 0;
		for (const s of subs) {
			const marks = (s.excerpt?.match(/<mark>/g) ?? []).length;
			if (marks > bestMarks) {
				best = s;
				bestMarks = marks;
			}
		}
		return best;
	}

	async function runSearch(q: string) {
		const mine = ++token;
		if (!q) {
			results = [];
			searched = '';
			loading = false;
			return;
		}
		loading = true;
		try {
			const pf = await loadPagefind();
			let hits: any[] = (await pf.search(q)).results;
			let isLoose = false;
			// Pagefind matches every word, so a full question often finds nothing: fall back to
			// pages matching any of its meaningful words, best score first.
			const words = keywords(q);
			if (!hits.length && words.length > 1) {
				const per = await Promise.all(words.map((w) => pf.search(w)));
				const byId = new Map<string, any>();
				for (const r of per.flatMap((s: any) => s.results)) {
					const prev = byId.get(r.id);
					byId.set(r.id, prev ? { ...r, score: prev.score + r.score, data: r.data } : r);
				}
				hits = [...byId.values()].sort((a, b) => b.score - a.score);
				isLoose = hits.length > 0;
			}
			if (mine !== token) return;
			const data = await Promise.all(hits.slice(0, MAX_RESULTS).map((r: any) => r.data()));
			if (mine !== token) return;
			const seen = new Set<string>();
			const next: Result[] = [];
			for (const d of data) {
				const sub = bestSub(d);
				const title = d.meta?.title ?? d.url;
				const url = sub?.url ?? d.url;
				if (seen.has(url)) continue;
				seen.add(url);
				next.push({
					id: url,
					url,
					title,
					heading: sub && sub.title !== title ? sub.title : undefined,
					excerpt: safeExcerpt(sub?.excerpt ?? d.excerpt ?? ''),
					group: groupFor(d.url, base_),
				});
			}
			results = next;
			loose = isLoose;
			searched = q;
			unavailable = false;
			if (filter !== 'all' && !next.some((r) => r.group === filter)) filter = 'all';
			active = 0;
		} catch {
			if (mine !== token) return;
			unavailable = true;
			results = [];
			searched = q;
		} finally {
			if (mine === token) loading = false;
		}
	}

	const STOPWORDS = new Set(
		'a an and are can do does for from how i in into is it my of on or the this to what when where which with you your'.split(' ')
	);
	function keywords(q: string) {
		return [...new Set(q.toLowerCase().split(/[^\p{L}\p{N}]+/u))]
			.filter((w) => w.length > 2 && !STOPWORDS.has(w))
			.slice(0, 6);
	}

	function onInput() {
		clearTimeout(timer);
		ariaStatus = '';
		fallbackUrl = '';
		const q = query.trim();
		timer = setTimeout(() => runSearch(q), 140);
	}

	// ---------- Recent searches (per browser, best effort) ----------

	function readRecent(): string[] {
		try {
			const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
			return Array.isArray(v) ? v.filter((s) => typeof s === 'string').slice(0, 5) : [];
		} catch {
			return [];
		}
	}

	function remember(q: string) {
		q = q.trim();
		if (!q) return;
		recent = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
		} catch {
			/* private mode or blocked storage: keep it in memory */
		}
	}

	function clearRecent() {
		recent = [];
		try {
			localStorage.removeItem(RECENT_KEY);
		} catch {
			/* ignore */
		}
		input?.focus();
	}

	// ---------- Open / close ----------

	async function show(which: Tab = 'search') {
		tab = which;
		ariaStatus = '';
		if (!open) {
			opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			recent = readRecent();
			open = true;
			dialog?.showModal();
			document.body.toggleAttribute('data-search-modal-open', true);
			loadPagefind()?.catch(() => (unavailable = true));
		}
		await tick();
		input?.focus();
		input?.select();
	}

	function close() {
		if (!open) return;
		open = false;
		dialog?.close();
		document.body.toggleAttribute('data-search-modal-open', false);
		opener?.focus?.();
		opener = null;
	}

	function setTab(next: Tab) {
		tab = next;
		ariaStatus = '';
		input?.focus();
	}

	// ---------- Keyboard ----------

	function isTyping(el: EventTarget | null) {
		const t = el as HTMLElement | null;
		return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
	}

	function onWindowKey(e: KeyboardEvent) {
		const k = e.key.toLowerCase();
		if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && k === 'k') {
			e.preventDefault();
			if (open && tab === 'search') close();
			else show('search');
		} else if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && k === 'i') {
			e.preventDefault();
			if (open && tab === 'aria') close();
			else show('aria');
		} else if (e.key === '/' && !open && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
			e.preventDefault();
			show('search');
		}
	}

	function move(delta: number) {
		if (!optionCount) return;
		active = (Math.min(active, optionCount - 1) + delta + optionCount) % optionCount;
		tick().then(() => {
			if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
		});
	}

	function onInputKey(e: KeyboardEvent) {
		if (e.isComposing) return;
		if (tab === 'aria') {
			if (e.key === 'Enter') {
				e.preventDefault();
				ask(e.metaKey || e.ctrlKey ? 'build' : 'ask');
			}
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			move(1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			move(-1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (showRecent) {
				const r = recent[Math.min(active, recent.length - 1)];
				if (r) useRecent(r);
			} else {
				const r = visible[Math.min(active, visible.length - 1)];
				if (r) go(r, e.metaKey || e.ctrlKey);
				else if (query.trim() && !loading) setTab('aria');
			}
		}
	}

	/** Keep Tab inside the dialog (showModal makes the page inert; this also stops it reaching the browser UI). */
	function onDialogKey(e: KeyboardEvent) {
		// A type=search field swallows Esc to clear itself, so the dialog's `cancel` never fires.
		if (e.key === 'Escape' && !e.isComposing) {
			e.preventDefault();
			close();
			return;
		}
		if (e.key !== 'Tab' || !dialog) return;
		const focusable = [
			...dialog.querySelectorAll<HTMLElement>(
				'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input, [tabindex="0"]'
			),
		].filter((el) => el.offsetParent !== null || el === document.activeElement);
		if (!focusable.length) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function onTabKey(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			const next: Tab = tab === 'search' ? 'aria' : 'search';
			tab = next;
			document.getElementById(`${uid}-tab-${next}`)?.focus();
		}
	}

	// ---------- Actions ----------

	function go(r: Result, newTab = false) {
		remember(query);
		if (newTab) {
			window.open(r.url, '_blank', 'noopener');
			return;
		}
		const target = new URL(r.url, location.href);
		close();
		location.href = target.href;
	}

	function onResultClick(e: MouseEvent, r: Result) {
		remember(query);
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
		const target = new URL(r.url, location.href);
		// Same page, other anchor: the dialog would stay open over the target.
		if (target.pathname === location.pathname) close();
	}

	function useRecent(q: string) {
		query = q;
		runSearch(q);
		input?.focus();
	}

	function pageContext(): AriaSource {
		const title =
			document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content ||
			document.title;
		const url = location.href.split('#')[0];
		return { title, url };
	}

	function ask(intent: AriaIntent) {
		const q = query.trim();
		if (!q) {
			ariaStatus = 'Type a question first.';
			input?.focus();
			return;
		}
		remember(q);
		const prompt = buildAriaPrompt({
			question: q,
			intent,
			page: pageContext(),
			sources,
			llmsTxt: absolute(`${base_}llms.txt`),
		});
		const fallback = ariaAppUrl(appUrl, prompt, intent);
		if (handoff) {
			// Must stay synchronous inside the click: the extension checks for a user gesture.
			const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
			window.postMessage({ type: 'awflow:docs-handoff', id, action: 'aria', prompt }, location.origin);
			ariaStatus = 'Sending to Aria in your AWFlow extension…';
			fallbackUrl = '';
			const timeout = setTimeout(() => settle(false), 1500);
			const onReply = (e: MessageEvent) => {
				if (e.source !== window || e.data?.type !== 'awflow:docs-handoff-result' || e.data.id !== id) return;
				settle(!!e.data.ok);
			};
			const settle = (ok: boolean) => {
				clearTimeout(timeout);
				window.removeEventListener('message', onReply);
				if (ok) ariaStatus = 'Sent to Aria in your AWFlow extension.';
				else openApp(fallback, 'The extension did not take it, so Aria opens in the AWFlow app.');
			};
			window.addEventListener('message', onReply);
		} else {
			openApp(fallback, 'Aria opens in the AWFlow app, in a new tab.');
		}
	}

	function openApp(url: string, message: string) {
		window.open(url, '_blank', 'noopener');
		// `noopener` makes window.open return null even on success: keep a link in case a blocker ate it.
		fallbackUrl = url;
		ariaStatus = message;
	}

	// ---------- Wiring ----------

	function onDocClick(e: MouseEvent) {
		const el = (e.target as Element | null)?.closest?.(
			'[data-awf-ask-aria], a[href="#ask-aria"], [data-awf-search-open]'
		);
		if (!el || dialog?.contains(el)) return;
		e.preventDefault();
		show(el.hasAttribute('data-awf-search-open') ? 'search' : 'aria');
	}

	function onMessage(e: MessageEvent) {
		if (e.source !== window || e.data?.type !== 'awflow:docs-handoff-ready') return;
		handoff = { version: e.data.version };
	}

	function onHash() {
		if (location.hash === '#ask-aria') {
			history.replaceState(null, '', location.pathname + location.search);
			show('aria');
		}
	}

	onMount(() => {
		hydrated = true;
		// Deprecated but reliable: the UA is spoofed when devtools emulate a device.
		isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		// The extension's content script marks <html data-awflow-docs-handoff="<version>">…
		const attr = document.documentElement.getAttribute('data-awflow-docs-handoff');
		if (attr !== null) handoff = { version: attr || undefined };
		window.addEventListener('message', onMessage);
		// …and re-announces itself with "ready" when probed (it may have loaded before us).
		window.postMessage({ type: 'awflow:docs-handoff-probe' }, location.origin);
		document.addEventListener('click', onDocClick);
		window.addEventListener('hashchange', onHash);
		onHash();
		return () => {
			window.removeEventListener('message', onMessage);
			document.removeEventListener('click', onDocClick);
			window.removeEventListener('hashchange', onHash);
			clearTimeout(timer);
		};
	});
</script>

<svelte:window onkeydown={onWindowKey} />

<button
	type="button"
	class="awf-search-btn"
	aria-label={placeholder}
	aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
	aria-haspopup="dialog"
	disabled={!hydrated}
	onclick={() => show('search')}
>
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
		stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
	<span class="awf-search-btn__label" aria-hidden="true">{placeholder}</span>
	{#if hydrated}
		<kbd class="awf-search-btn__kbd" aria-hidden="true"><kbd>{mod}</kbd><kbd>K</kbd></kbd>
	{/if}
</button>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog
	bind:this={dialog}
	class="awf-search"
	aria-label={tab === 'aria' ? 'Ask Aria' : 'Search the docs'}
	oncancel={(e) => {
		e.preventDefault();
		close();
	}}
	onclose={() => open && close()}
	onclick={(e) => e.target === dialog && close()}
	onkeydown={onDialogKey}
>
	{#if open}
		<div class="awf-search__frame">
			<div class="awf-search__bar">
				<svg class="awf-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					stroke-width="2" stroke-linecap="round" aria-hidden="true">
					{#if tab === 'search'}<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />{:else}<path
							d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"
						/>{/if}
				</svg>
				<input
					bind:this={input}
					bind:value={query}
					oninput={onInput}
					onkeydown={onInputKey}
					class="awf-search__input"
					type="search"
					enterkeyhint={tab === 'aria' ? 'send' : 'go'}
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					placeholder={tab === 'aria' ? 'Ask Aria a question about AWFlow' : placeholder}
					aria-label={tab === 'aria' ? 'Your question for Aria' : placeholder}
					role={tab === 'search' ? 'combobox' : undefined}
					aria-expanded={tab === 'search' ? optionCount > 0 : undefined}
					aria-controls={tab === 'search' ? `${uid}-list` : undefined}
					aria-autocomplete={tab === 'search' ? 'list' : undefined}
					aria-activedescendant={activeId}
				/>
				<div class="awf-search__tabs" role="tablist" aria-label="Mode">
					<button
						type="button"
						role="tab"
						id="{uid}-tab-search"
						aria-selected={tab === 'search'}
						aria-controls="{uid}-panel-search"
						tabindex={tab === 'search' ? 0 : -1}
						onclick={() => setTab('search')}
						onkeydown={onTabKey}>Search</button
					>
					<button
						type="button"
						role="tab"
						id="{uid}-tab-aria"
						aria-selected={tab === 'aria'}
						aria-controls="{uid}-panel-aria"
						tabindex={tab === 'aria' ? 0 : -1}
						onclick={() => setTab('aria')}
						onkeydown={onTabKey}
						>Ask Aria <span class="awf-wave" aria-hidden="true"><i></i><i></i><i></i></span></button
					>
				</div>
				<button type="button" class="awf-search__close" onclick={close}>
					<span class="awf-search__esc" aria-hidden="true">esc</span><span class="sr-only">Close</span>
				</button>
			</div>

			{#if tab === 'search'}
				<div id="{uid}-panel-search" role="tabpanel" aria-labelledby="{uid}-tab-search" class="awf-search__panel">
					{#if query.trim() && results.length}
						<div class="awf-search__chips" role="group" aria-label="Filter by section">
							<button type="button" class="awf-chip" aria-pressed={filter === 'all'}
								onclick={() => ((filter = 'all'), (active = 0), input?.focus())}>
								All <span class="awf-chip__n">{results.length}</span>
							</button>
							{#each chips as g (g.id)}
								<button type="button" class="awf-chip" aria-pressed={filter === g.id} style="--awf-chip:{g.color}"
									onclick={() => ((filter = g.id), (active = 0), input?.focus())}>
									<span class="awf-chip__dot" aria-hidden="true"></span>{g.label}
									<span class="awf-chip__n">{counts[g.id]}</span>
								</button>
							{/each}
						</div>
					{/if}

					<div class="awf-search__body">
						<div class="awf-search__results">
							{#if showRecent}
								<div class="awf-search__head">
									<span id="{uid}-recent">Recent searches</span>
									<button type="button" class="awf-search__link" onclick={clearRecent}>Clear</button>
								</div>
								<ul id="{uid}-list" role="listbox" aria-labelledby="{uid}-recent" class="awf-search__list">
									{#each recent as r, i (r)}
										<li
											id="{uid}-opt-{i}"
											role="option"
											aria-selected={i === Math.min(active, recent.length - 1)}
											class="awf-res awf-res--recent"
											onmousemove={() => (active = i)}
											onclick={() => useRecent(r)}
										>
											<span class="awf-res__icon awf-res__icon--recent" aria-hidden="true">
												<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
													stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" /><path
														d="M12 7v5l3 2"
													/></svg>
											</span>
											<span class="awf-res__title">{r}</span>
										</li>
									{/each}
								</ul>
							{:else if !query.trim()}
								<ul id="{uid}-list" role="listbox" aria-label="Results" class="awf-search__list"></ul>
								<div class="awf-search__empty">
									<p>Search recipes, nodes, guides and fixes.</p>
									<p class="awf-search__try">
										Try
										{#each ['slack', 'google sheets', 'loop', 'scrape a table'] as s (s)}
											<button type="button" class="awf-chip awf-chip--suggest" onclick={() => useRecent(s)}>{s}</button>
										{/each}
									</p>
								</div>
							{:else if unavailable}
								<ul id="{uid}-list" role="listbox" aria-label="Results" class="awf-search__list"></ul>
								<div class="awf-search__empty">
									<p><strong>Search isn't available here.</strong></p>
									<p>The search index is built with the site (<code>bun run build</code>), so it doesn't exist in <code>astro dev</code>. You can still ask Aria.</p>
									<button type="button" class="awf-btn awf-btn--primary awf-press" onclick={() => setTab('aria')}>Ask Aria</button>
								</div>
							{:else if loading && !visible.length}
								<ul id="{uid}-list" role="listbox" aria-label="Results" class="awf-search__list"></ul>
								<div class="awf-search__skel" aria-hidden="true">
									<span class="awf-skel"></span><span class="awf-skel"></span><span class="awf-skel"></span>
								</div>
							{:else if !visible.length && searched === query.trim()}
								<ul id="{uid}-list" role="listbox" aria-label="Results" class="awf-search__list"></ul>
								<div class="awf-search__empty">
									<p><strong>No results for “{query.trim()}”.</strong></p>
									<p>Try another word, or ask Aria: she answers in your own AWFlow, using these docs.</p>
									<button type="button" class="awf-btn awf-btn--primary awf-press" onclick={() => setTab('aria')}>
										Ask Aria instead
									</button>
								</div>
							{:else}
								{#if loose}
									<p class="awf-search__loose">No page has every word. Showing pages that match some of them.</p>
								{/if}
								<ul id="{uid}-list" role="listbox" aria-label="Results" class="awf-search__list">
									{#each visible as r, i (r.id)}
										{@const g = groupById(r.group)}
										{#if i === 0 || visible[i - 1].group !== r.group}
											<li role="presentation" class="awf-search__group">{g.label}</li>
										{/if}
										<li
											id="{uid}-opt-{i}"
											role="option"
											aria-selected={i === Math.min(active, visible.length - 1)}
											class="awf-res"
											style="--awf-res:{g.color}"
											onmousemove={() => (active = i)}
										>
											<a href={r.url} tabindex="-1" onclick={(e) => onResultClick(e, r)}>
												<span class="awf-res__icon" aria-hidden="true">{g.id === 'fix' ? '!' : g.label[0]}</span>
												<span class="awf-res__text">
													<span class="awf-res__title"
														>{r.title}{#if r.heading}<span class="awf-res__heading">{` › ${r.heading}`}</span>{/if}</span
													>
													<!-- Escaped by safeExcerpt: only <mark> survives. -->
													<span class="awf-res__excerpt">{@html r.excerpt}</span>
												</span>
												<span class="awf-res__enter" aria-hidden="true">↵</span>
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						{#if query.trim()}
							<aside class="awf-search__aside" aria-label="Ask Aria">
								{@render ariaPanel(true)}
							</aside>
						{/if}
					</div>
				</div>
			{:else}
				<div id="{uid}-panel-aria" role="tabpanel" aria-labelledby="{uid}-tab-aria" class="awf-search__panel awf-search__panel--aria">
					{@render ariaPanel(false)}
				</div>
			{/if}

			<div class="awf-search__foot">
				<span class="awf-search__keys" aria-hidden="true">
					<span><kbd>↑</kbd><kbd>↓</kbd> move</span>
					<span><kbd>↵</kbd> open</span>
					<span><kbd>esc</kbd> close</span>
					<span><kbd>{mod}</kbd><kbd>I</kbd> ask Aria</span>
				</span>
				<span class="awf-search__ai">
					For AI tools: <a href="{base_}llms.txt">llms.txt</a>
					{#if mdTwin}· <a href={mdTwin}>this page as Markdown</a>{:else}· every page has a <code>.md</code> twin{/if}
				</span>
			</div>
			<p class="sr-only" role="status" aria-live="polite">
				{#if tab === 'search' && searched && !loading}{visible.length} results{/if}
				{ariaStatus}
			</p>
		</div>
	{/if}
</dialog>

{#snippet ariaPanel(compact: boolean)}
	<div class="awf-aria" class:awf-aria--compact={compact}>
		<div class="awf-aria__head">
			<span class="awf-aria__mark awf-ping" aria-hidden="true">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					stroke-linecap="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /></svg>
			</span>
			<span class="awf-aria__title">Ask Aria</span>
			<span class="awf-aria__badge">{handoff ? 'in your extension' : 'in your AWFlow'}</span>
		</div>
		<p class="awf-aria__note">
			Aria answers in <strong>your own AWFlow</strong>, not on this site.
			{#if handoff}
				Your extension is connected: the question goes straight to Aria with this page and the sources below.
			{:else}
				The question opens in the AWFlow app (<span translate="no">{appUrl.replace(/^https?:\/\//, '')}</span>) with this
				page and the sources below. Nothing is sent until you press Ask.
			{/if}
		</p>

		{#if query.trim()}
			<div class="awf-aria__sources">
				<span class="awf-aria__label">{sources.length ? 'Start with these pages' : loading ? 'Finding sources…' : 'No matching pages'}</span>
				{#each sources as s, i (s.url)}
					{@const g = groupById(groupFor(s.url, base_))}
					<a class="awf-cite" href={s.url} style="--awf-cite:{g.color}" onclick={() => remember(query)}>
						<span class="awf-cite__n">{i + 1}</span><span class="awf-cite__t">{g.label} · {s.title}</span>
					</a>
				{/each}
			</div>
		{:else if !compact}
			<div class="awf-aria__sources">
				<span class="awf-aria__label">Try asking</span>
				{#each ['How do I copy a table from a page into Google Sheets?', 'Post a message to Slack when a page changes', 'What runs on-device and what needs a connection?'] as s (s)}
					<button type="button" class="awf-cite awf-cite--ask" onclick={() => ((query = s), onInput(), input?.focus())}>{s}</button>
				{/each}
			</div>
		{/if}

		<div class="awf-aria__actions">
			<button type="button" class="awf-btn awf-btn--primary awf-press" onclick={() => ask('ask')}>
				Ask Aria{#if !handoff}<span class="sr-only"> (opens the AWFlow app in a new tab)</span>{/if}
			</button>
			<button type="button" class="awf-btn awf-press" onclick={() => ask('build')}>Build this with Aria</button>
		</div>
		{#if ariaStatus}
			<p class="awf-aria__status" aria-hidden="true">
				{ariaStatus}
				{#if fallbackUrl}<a href={fallbackUrl} target="_blank" rel="noopener">Open the app</a>{/if}
			</p>
		{/if}
	</div>
{/snippet}
