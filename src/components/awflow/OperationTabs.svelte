<script lang="ts">
	/**
	 * Settings switcher for nodes whose form changes with a choice (awflow/Agentic-Flow#1338):
	 * operations grouped by resource ("What it can do"), and the settings of the picked one.
	 * Every panel is in the HTML (search indexes all of them); only the picked one is shown.
	 * The node page generator writes it into the AUTO:settings block:
	 *
	 *   <OperationTabs client:visible pick="Resource and Operation" common={[…]} groups={[…]} />
	 */
	import ParamTable from './ParamTable.svelte';

	interface Row {
		name: string;
		type?: string;
		required?: boolean;
		default?: string | number | boolean;
		description?: string;
	}
	interface Option {
		label: string;
		rows: Row[];
	}
	interface Group {
		/** Resource, e.g. "Message". Omitted when the node has a single list of choices. */
		label?: string;
		options: Option[];
	}
	interface Props {
		groups: Group[];
		/** Settings shared by every operation (e.g. the connection). */
		common?: Row[];
		/** What the reader picks, e.g. "Resource and Operation". */
		pick?: string;
	}

	let { groups = [], common = [], pick = 'Operation' }: Props = $props();

	const uid = $props.id();
	const optionName = (g: Group, o: Option) => (g.label ? `${g.label} · ${o.label}` : o.label);
	const all = $derived(
		groups.flatMap((g, gi) => g.options.map((o, oi) => ({ key: `${gi}-${oi}`, name: optionName(g, o), option: o }))),
	);
	let selected = $state('0-0');
	const current = $derived(all.find((x) => x.key === selected) ?? all[0]);
	const total = $derived(all.length);
</script>

<div class="awf-optabs">
	{#if common.length}
		<ParamTable rows={common} caption="For every choice" />
	{/if}

	<div class="awf-optabs__picker" role="group" aria-label={`Pick ${pick.toLowerCase()} to see its settings`}>
		<p class="awf-optabs__lead">
			<span class="awf-optabs__count">{total} {total === 1 ? 'choice' : 'choices'}</span> · pick
			{pick.toLowerCase()} to see its settings
		</p>
		{#each groups as group, gi (gi)}
			<div class="awf-optabs__row">
				{#if group.label}<span class="awf-optabs__resource" id={`${uid}-g${gi}`}>{group.label}</span>{/if}
				<div
					class="awf-optabs__ops"
					role="group"
					aria-labelledby={group.label ? `${uid}-g${gi}` : undefined}
					aria-label={group.label ? undefined : pick}
				>
					{#each group.options as option, oi (oi)}
						{@const key = `${gi}-${oi}`}
						<button
							type="button"
							class="awf-optabs__op"
							aria-pressed={current?.key === key}
							aria-controls={`${uid}-p${key}`}
							onclick={() => (selected = key)}>{option.label}</button
						>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#each all as item (item.key)}
		<section
			class="awf-optabs__panel"
			id={`${uid}-p${item.key}`}
			aria-label={`Settings for ${item.name}`}
			hidden={current?.key !== item.key}
		>
			<p class="awf-optabs__for">Settings for <strong>{item.name}</strong></p>
			{#if item.option.rows.length}
				<ParamTable rows={item.option.rows} />
			{:else}
				<p class="awf-optabs__none">No further settings.</p>
			{/if}
		</section>
	{/each}
	<p class="sr-only" aria-live="polite">{current ? `Showing settings for ${current.name}` : ''}</p>
</div>

<style>
	.awf-optabs {
		margin-block: 1rem;
	}
	.awf-optabs__picker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.875rem;
		border: 1px solid var(--awf-line);
		border-radius: var(--awf-radius, 14px);
		background: var(--awf-surface-2);
	}
	.awf-optabs__lead {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--awf-muted);
	}
	.awf-optabs__count {
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
	}
	.awf-optabs__row {
		display: flex;
		align-items: center;
		gap: 0.5rem 0.75rem;
		margin: 0;
	}
	.awf-optabs__resource {
		flex: none;
		width: 8.5rem;
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		color: var(--awf-muted);
		overflow-wrap: anywhere;
	}
	.awf-optabs__ops {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		min-width: 0;
		margin: 0;
	}
	.awf-optabs__op {
		font: inherit;
		font-size: 0.875rem;
		line-height: 1.3;
		margin: 0;
		padding: 0.375rem 0.75rem;
		border-radius: 10px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--sl-color-white);
		cursor: pointer;
		white-space: nowrap;
		transition:
			background-color var(--awf-fast, 150ms),
			border-color var(--awf-fast, 150ms);
	}
	.awf-optabs__op:hover {
		border-color: var(--awf-section-nodes);
	}
	.awf-optabs__op:focus-visible {
		outline: 2px solid var(--awf-section-nodes);
		outline-offset: 2px;
	}
	.awf-optabs__op[aria-pressed='true'] {
		background: var(--awf-section-nodes);
		border-color: var(--awf-section-nodes);
		color: #fff;
		font-weight: 600;
	}
	.awf-optabs__panel {
		margin-top: 1rem;
	}
	.awf-optabs__panel[hidden] {
		display: none;
	}
	.awf-optabs__for,
	.awf-optabs__none {
		margin: 0;
		font-size: 0.9375rem;
	}
	.awf-optabs__for strong {
		color: var(--awf-section-nodes);
	}
	:global(:root:not([data-theme='light'])) .awf-optabs__for strong {
		color: #a5b4fc;
	}
	.awf-optabs__none {
		margin-top: 0.5rem;
		color: var(--awf-muted);
	}
	/* Phones: each resource on its own line, its operations scroll sideways (#1338). */
	@media (max-width: 639.98px) {
		.awf-optabs__row {
			flex-direction: column;
			align-items: stretch;
		}
		.awf-optabs__resource {
			width: auto;
		}
		.awf-optabs__ops {
			flex-wrap: nowrap;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: thin;
			padding-bottom: 0.25rem;
			margin-inline: -0.875rem;
			padding-inline: 0.875rem;
			scroll-padding-inline: 0.875rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-optabs__op {
			transition: none;
		}
	}
</style>
