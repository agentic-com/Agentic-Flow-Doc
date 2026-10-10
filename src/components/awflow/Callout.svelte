<script lang="ts">
	import type { Snippet } from 'svelte';

	type CalloutType = 'tip' | 'info' | 'credential' | 'careful' | 'danger' | 'new';
	interface Props {
		type?: CalloutType;
		/** Bold lead-in, e.g. "Needs a Slack connection". Defaults to the type name. */
		title?: string;
		/** Optional action link shown after the text. */
		href?: string;
		linkLabel?: string;
		children?: Snippet;
	}

	let { type = 'tip', title, href, linkLabel, children }: Props = $props();

	const NAMES: Record<CalloutType, string> = {
		tip: 'Tip',
		info: 'Note',
		credential: 'Needs a connection',
		careful: 'Careful',
		danger: 'Danger',
		new: 'New',
	};
	// Lucide-style 24px stroke icons.
	const ICONS: Record<CalloutType, string> = {
		tip: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
		info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8h.01M11 12h1v4h1',
		credential: 'M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM8 10V7a4 4 0 0 1 8 0v3',
		careful: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
		danger: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9l-6 6M9 9l6 6',
		new: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z',
	};
	const heading = $derived(title ?? NAMES[type]);
</script>

<aside class="awf-callout awf-callout--{type}" aria-label={heading}>
	<svg
		class="awf-callout__icon"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"><path d={ICONS[type]} /></svg
	>
	<div class="awf-callout__body">
		<strong class="awf-callout__title">{heading}</strong>{#if children}<span class="awf-callout__sep">&nbsp;—&nbsp;</span
			>{@render children()}{/if}
		{#if href}
			<a class="awf-callout__link" {href}>{linkLabel ?? 'Learn more'} <span class="awf-arr" aria-hidden="true">→</span></a>
		{/if}
	</div>
</aside>
