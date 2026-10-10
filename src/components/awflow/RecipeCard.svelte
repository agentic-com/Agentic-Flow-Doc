<script lang="ts">
	interface Props {
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

	let { title, href, goal, level, minutes, apps = [], setup }: Props = $props();

	const meta = $derived([level, minutes ? `${minutes} min` : undefined].filter(Boolean).join(' · '));
	const SETUP = {
		none: { label: 'No setup', variant: 'no-setup' },
		connection: { label: 'Needs a connection', variant: 'neutral' },
		'on-device': { label: 'On-device', variant: 'on-device' },
	} as const;
</script>

<a class="awf-recipe awf-lift" {href}>
	<span class="awf-recipe__bar" aria-hidden="true"></span>
	<span class="awf-recipe__title">{title}</span>
	{#if goal}<span class="awf-recipe__goal">{goal}</span>{/if}
	<span class="awf-recipe__meta">
		{#if meta}<span class="awf-mono">{meta}</span>{/if}
		{#if setup}<span class="awf-badge awf-badge--{SETUP[setup].variant}">{SETUP[setup].label}</span>{/if}
		{#each apps as app (app)}<span class="awf-chip">{app}</span>{/each}
	</span>
</a>
