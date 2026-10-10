<script lang="ts">
	import Badge from './Badge.svelte';

	type Env = 'extension' | 'web';
	interface Props {
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

	let { envs, extension, web, showMissing = true, label = false }: Props = $props();

	const ALL: Env[] = ['extension', 'web'];
	const NAMES: Record<Env, string> = { extension: 'Extension', web: 'Web app' };
	const list = $derived<Env[]>(envs ?? ALL.filter((e) => (e === 'extension' ? extension : web)));
</script>

<span class="awf-worksin">
	{#if label}<span class="awf-worksin__label">Works in</span>{/if}
	{#each ALL as env (env)}
		{#if list.includes(env)}
			<Badge variant={env} text={NAMES[env]} />
		{:else if showMissing && list.length > 0}
			<span class="awf-badge awf-badge--missing">{NAMES[env]} — not available</span>
		{/if}
	{/each}
</span>
