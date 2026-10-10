<script lang="ts">
	/**
	 * <RecipeMeta> — the level · time · setup · apps row under a recipe's title (awflow/Agentic-Flow#1342).
	 *
	 *   <RecipeMeta slug="summarize-this-page" />
	 */
	import { LEVEL_LABEL, SETUP, getRecipe } from './recipes';

	let { slug }: { slug: string } = $props();
	// svelte-ignore state_referenced_locally
	const r = getRecipe(slug);
</script>

<p class="awf-rmeta not-content">
	<span class="awf-chip">{LEVEL_LABEL[r.level]}</span>
	<span class="awf-chip">{r.minutes} min</span>
	<span class="awf-badge awf-badge--{SETUP[r.setup].variant}">{SETUP[r.setup].label}{r.apps.length ? ` · ${r.apps.join(', ')}` : ''}</span>
	{#if r.touches.models.length && r.setup !== 'on-device'}<span class="awf-badge awf-badge--on-device">On-device model</span>{/if}
	<a class="awf-chip awf-rmeta__goal" href={`/recipes/?goal=${encodeURIComponent(r.goal)}`}>{r.goal}</a>
</p>

<style>
	.awf-rmeta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin: 0 0 1.25rem;
	}
	.awf-rmeta :global(.awf-chip) {
		font-size: 0.8125rem;
		padding: 3px 10px;
	}
	.awf-rmeta__goal {
		text-decoration: none;
	}
	.awf-rmeta__goal:hover {
		border-color: var(--awf-section-recipes);
		color: var(--sl-color-white);
	}
</style>
