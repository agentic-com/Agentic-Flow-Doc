<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeVariant =
		| 'new'
		| 'deprecated'
		| 'admin'
		| 'on-device'
		| 'no-setup'
		| 'connections'
		| 'agent-tool'
		| 'extension'
		| 'web'
		| 'beta'
		| 'neutral';

	interface Props {
		/** Visual + semantic variant. */
		variant?: BadgeVariant;
		/** Overrides the default label for the variant (e.g. "New in 0.8"). */
		text?: string;
		/** For `connections`: how many connections the page needs. */
		count?: number;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'neutral', text, count, class: className = '', children }: Props = $props();

	const LABELS: Record<BadgeVariant, string> = {
		new: 'New',
		deprecated: 'Deprecated',
		admin: 'Admin',
		'on-device': 'On-device',
		'no-setup': 'No setup',
		connections: 'Connections',
		'agent-tool': 'Agent tool',
		extension: 'Extension',
		web: 'Web app',
		beta: 'Beta',
		neutral: '',
	};
	const DOT = new Set<BadgeVariant>(['extension', 'web', 'on-device']);

	const label = $derived(
		text ??
			(variant === 'connections'
				? `${count ?? 1} connection${(count ?? 1) === 1 ? '' : 's'}`
				: LABELS[variant]),
	);
</script>

<span class="awf-badge awf-badge--{variant} {className}"
	>{#if DOT.has(variant)}<span class="awf-badge__dot" aria-hidden="true"></span>{/if}{#if children}{@render children()}{:else}{label}{/if}</span
>
