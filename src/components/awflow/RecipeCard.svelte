<script lang="ts">
	import type { Lang } from '../../i18n/locales';
	import { createT, type UIKey } from '../../i18n/ui';
	interface Props {
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		title: string;
		href: string;
		/** One-line outcome. */
		goal?: string;
		level?: 'beginner' | 'intermediate' | 'advanced';
		minutes?: number;
		/** Apps or connections used, e.g. ["Slack"]. */
		apps?: string[];
		setup?: 'none' | 'connection' | 'on-device';
	}

	let { lang = 'en', title, href, goal, level, minutes, apps = [], setup }: Props = $props();

	const t = $derived(createT(lang));
	const meta = $derived(
		[level ? t(`recipe.levelInline.${level}`) : undefined, minutes ? t('common.minutes', { n: minutes }) : undefined].filter(Boolean).join(' · '),
	);
	const SETUP: Record<NonNullable<Props['setup']>, { labelKey: UIKey; variant: string }> = {
		none: { labelKey: 'recipe.setup.none', variant: 'no-setup' },
		connection: { labelKey: 'recipe.setup.connection', variant: 'neutral' },
		'on-device': { labelKey: 'recipe.setup.onDeviceShort', variant: 'on-device' },
	};
</script>

<a class="awf-recipe awf-lift" href={t.href(href)}>
	<span class="awf-recipe__bar" aria-hidden="true"></span>
	<span class="awf-recipe__title">{title}</span>
	{#if goal}<span class="awf-recipe__goal">{goal}</span>{/if}
	<span class="awf-recipe__meta">
		{#if meta}<span class="awf-mono">{meta}</span>{/if}
		{#if setup}<span class="awf-badge awf-badge--{SETUP[setup].variant}">{t(SETUP[setup].labelKey)}</span>{/if}
		{#each apps as app (app)}<span class="awf-chip">{app}</span>{/each}
	</span>
</a>
