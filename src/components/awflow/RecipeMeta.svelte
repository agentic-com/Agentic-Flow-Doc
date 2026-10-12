<script lang="ts">
	/**
	 * <RecipeMeta> — the level · time · setup · apps row under a recipe's title (awflow/Agentic-Flow#1342).
	 *
	 *   <RecipeMeta slug="summarize-this-page" />
	 */
	import type { Lang } from '../../i18n/locales';
	import { createT } from '../../i18n/ui';
	import { SETUP, getRecipe, goalLabel, levelLabel } from './recipes';

	let { lang = 'en', slug }: { lang?: Lang; slug: string } = $props();
	const t = $derived(createT(lang));
	// svelte-ignore state_referenced_locally
	const r = getRecipe(slug);
</script>

<p class="awf-rmeta not-content">
	<span class="awf-chip">{levelLabel(r.level, t)}</span>
	<span class="awf-chip">{t('common.minutes', { n: r.minutes })}</span>
	<span class="awf-badge awf-badge--{SETUP[r.setup].variant}">{t(SETUP[r.setup].labelKey)}{r.apps.length ? ` · ${r.apps.join(', ')}` : ''}</span>
	{#if r.touches.models.length && r.setup !== 'on-device'}<span class="awf-badge awf-badge--on-device">{t('recipe.modelBadge')}</span>{/if}
	<a class="awf-chip awf-rmeta__goal" href={t.href(`/recipes/?goal=${encodeURIComponent(r.goal)}`)}>{goalLabel(r.goal, t)}</a>
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
