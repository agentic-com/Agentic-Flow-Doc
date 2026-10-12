<script lang="ts">
	import type { Lang } from '../../i18n/locales';
	import { createT } from '../../i18n/ui';
	import Badge from './Badge.svelte';

	type Env = 'extension' | 'web';
	interface Props {
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		/** Where the node or feature runs. Same values as the `worksIn` frontmatter. */
		envs?: Env[];
		/** Shorthand flags for MDX: `<WorksIn extension />`. */
		extension?: boolean;
		web?: boolean;
		/** Show a dashed "not available" badge for the missing environment. */
		showMissing?: boolean;
		/** Show a "Works in" label before the badges. */
		label?: boolean;
	}

	let { lang = 'en', envs, extension, web, showMissing = true, label = false }: Props = $props();

	const ALL: Env[] = ['extension', 'web'];
	const t = $derived(createT(lang));
	const name = (env: Env) => t(env === 'web' ? 'badge.web' : 'badge.extension');
	const list = $derived<Env[]>(envs ?? ALL.filter((e) => (e === 'extension' ? extension : web)));
</script>

<span class="awf-worksin">
	{#if label}<span class="awf-worksin__label">{t('node.worksIn')}</span>{/if}
	{#each ALL as env (env)}
		{#if list.includes(env)}
			<Badge {lang} variant={env} text={name(env)} />
		{:else if showMissing && list.length > 0}
			<span class="awf-badge awf-badge--missing">{t('node.notAvailable', { env: name(env) })}</span>
		{/if}
	{/each}
</span>
