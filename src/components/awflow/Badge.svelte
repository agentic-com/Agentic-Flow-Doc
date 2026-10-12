<script lang="ts">
	import type { Lang } from '../../i18n/locales';
	import type { Snippet } from 'svelte';
	import { createT, type UIKey } from '../../i18n/ui';

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
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		/** Visual + semantic variant. */
		variant?: BadgeVariant;
		/** Overrides the default label for the variant (e.g. "New in 0.8"). */
		text?: string;
		/** For `connections`: how many connections the page needs. */
		count?: number;
		class?: string;
		children?: Snippet;
	}

	let { lang = 'en', variant = 'neutral', text, count, class: className = '', children }: Props = $props();

	const t = $derived(createT(lang));
	const LABELS: Record<BadgeVariant, UIKey | null> = {
		new: 'badge.new',
		deprecated: 'badge.deprecated',
		admin: 'badge.admin',
		'on-device': 'badge.onDevice',
		'no-setup': 'badge.noSetup',
		connections: 'badge.connections',
		'agent-tool': 'badge.agentTool',
		extension: 'badge.extension',
		web: 'badge.web',
		beta: 'badge.beta',
		neutral: null,
	};
	const DOT = new Set<BadgeVariant>(['extension', 'web', 'on-device']);

	const label = $derived(
		text ??
			(variant === 'connections'
				? t.plural('badge.connections', count ?? 1)
				: LABELS[variant]
					? t(LABELS[variant]!)
					: ''),
	);
</script>

<span class="awf-badge awf-badge--{variant} {className}"
	>{#if DOT.has(variant)}<span class="awf-badge__dot" aria-hidden="true"></span>{/if}{#if children}{@render children()}{:else}{label}{/if}</span
>
