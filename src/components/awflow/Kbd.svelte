<script lang="ts">
	/**
	 * A fixed key combination, e.g. <Kbd keys="⌘+K" />. For shortcuts that differ per OS, use
	 * starlight-kbd's <Kbd mac="…" windows="…" /> instead. Keys are never translated, so this
	 * component has no interface text; it takes `lang` only to match the other islands.
	 */
	import type { Lang } from '../../i18n/locales';
	interface Props {
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		/** "Ctrl+Shift+K" or an array of keys. */
		keys: string | string[];
	}

	let { lang = 'en', keys }: Props = $props();

	const list = $derived(Array.isArray(keys) ? keys : keys.split(/\s*\+\s*/).filter(Boolean));
</script>

<kbd class="awf-kbd"
	>{#each list as key, i (i)}{#if i > 0}<span class="awf-kbd__plus" aria-hidden="true">+</span>{/if}<kbd>{key}</kbd
		>{/each}</kbd
>
