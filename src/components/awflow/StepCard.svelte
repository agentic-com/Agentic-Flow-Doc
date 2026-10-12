<script lang="ts">
	import type { Lang } from '../../i18n/locales';
	import type { Snippet } from 'svelte';
	import { createT } from '../../i18n/ui';

	interface Props {
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		/** Step number shown in the dot. */
		n?: number;
		title: string;
		/** What the reader should see when the step worked. Rendered as "Check: …" (translated). */
		check?: string;
		/** Heading level for the title (default 3, under the page's H2 sections). */
		level?: 2 | 3 | 4;
		children?: Snippet;
	}

	let { lang = 'en', n, title, check, level = 3, children }: Props = $props();
	const t = $derived(createT(lang));
</script>

<section class="awf-step">
	{#if n !== undefined}<span class="awf-step__n" aria-hidden="true">{n}</span>{/if}
	<div class="awf-step__body">
		<svelte:element this={`h${level}`} class="awf-step__title"
			>{#if n !== undefined}<span class="sr-only">{t('shot.step', { n })} </span>{/if}{title}</svelte:element
		>
		{#if children}<div class="awf-step__content">{@render children()}</div>{/if}
		{#if check}<p class="awf-step__check"><strong>{t('shot.check')}</strong> {check}</p>{/if}
	</div>
</section>
