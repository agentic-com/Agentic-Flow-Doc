<script lang="ts">
	/**
	 * Model choice tabs for lessons (awflow/Agentic-Flow#1341): on-device, API key, Ollama.
	 * Pass each path as a named slot; the reader's choice is remembered across lessons (best effort).
	 *
	 *   <ModelTabs client:load>
	 *     <div slot="ondevice">…</div>
	 *     <div slot="apikey">…</div>
	 *     <div slot="ollama">…</div>
	 *   </ModelTabs>
	 */
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	type ModelId = 'ondevice' | 'apikey' | 'ollama';

	interface Props {
		ondevice?: Snippet;
		apikey?: Snippet;
		ollama?: Snippet;
		/** Accessible name of the tab list. */
		label?: string;
	}

	let { ondevice, apikey, ollama, label = 'Model choice' }: Props = $props();

	const KEY = 'awf-learn-model';
	const pid = $props.id();
	const uid = `awf-mt-${pid}`;
	const tabs = $derived(
		(
			[
				{ id: 'ondevice', label: 'On-device (free)', panel: ondevice },
				{ id: 'apikey', label: 'API key', panel: apikey },
				{ id: 'ollama', label: 'Ollama', panel: ollama },
			] as { id: ModelId; label: string; panel?: Snippet }[]
		).filter((t) => t.panel),
	);

	let selected = $state<ModelId>('ondevice');
	let buttons: HTMLButtonElement[] = $state([]);

	onMount(() => {
		try {
			const saved = localStorage.getItem(KEY) as ModelId | null;
			if (saved && tabs.some((t) => t.id === saved)) selected = saved;
		} catch {
			/* storage blocked: keep the default */
		}
	});

	function pick(id: ModelId) {
		selected = id;
		try {
			localStorage.setItem(KEY, id);
		} catch {
			/* storage blocked: the choice lasts for this page */
		}
	}

	function onKey(e: KeyboardEvent, i: number) {
		const n = tabs.length;
		let j = -1;
		if (e.key === 'ArrowRight') j = (i + 1) % n;
		else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
		else if (e.key === 'Home') j = 0;
		else if (e.key === 'End') j = n - 1;
		if (j < 0) return;
		e.preventDefault();
		pick(tabs[j].id);
		buttons[j]?.focus();
	}
</script>

<div class="awf-mt">
	<div class="awf-mt__list not-content" role="tablist" aria-label={label}>
		{#each tabs as t, i (t.id)}
			<button
				bind:this={buttons[i]}
				type="button"
				role="tab"
				id="{uid}-tab-{t.id}"
				aria-controls="{uid}-panel-{t.id}"
				aria-selected={selected === t.id}
				tabindex={selected === t.id ? 0 : -1}
				class="awf-mt__tab"
				onclick={() => pick(t.id)}
				onkeydown={(e) => onKey(e, i)}>{t.label}</button
			>
		{/each}
	</div>
	{#each tabs as t (t.id)}
		<div
			class="awf-mt__panel"
			role="tabpanel"
			id="{uid}-panel-{t.id}"
			aria-labelledby="{uid}-tab-{t.id}"
			hidden={selected !== t.id}
		>
			{@render t.panel?.()}
		</div>
	{/each}
</div>

<style>
	.awf-mt {
		margin-block: 1rem;
	}
	.awf-mt__list {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		padding: 0.3125rem;
		border-radius: var(--awf-radius, 14px);
		background: var(--sl-color-gray-7, #f5f0e8);
		border: 1px solid var(--sl-color-hairline);
	}
	.awf-mt__tab {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.5rem 0.875rem;
		border-radius: 10px;
		border: 0;
		background: transparent;
		color: var(--sl-color-gray-3);
		cursor: pointer;
		transition:
			background var(--awf-base, 300ms),
			color var(--awf-base, 300ms);
	}
	.awf-mt__tab[aria-selected='true'] {
		background: var(--sl-color-black);
		color: var(--sl-color-white);
		font-weight: 600;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}
	.awf-mt__tab:focus-visible {
		outline: 2px solid var(--sl-color-accent);
		outline-offset: 2px;
	}
	.awf-mt__panel {
		margin-top: 0.75rem;
	}
	.awf-mt__panel > :global(:first-child > :first-child) {
		margin-top: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-mt__tab {
			transition: none;
		}
	}
</style>
