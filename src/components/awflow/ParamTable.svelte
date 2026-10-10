<script lang="ts">
	interface ParamRow {
		/** Label as the app shows it (e.g. "Open Focused"). */
		name: string;
		/** Field type, e.g. "text", "number · 20", "toggle · on". */
		type?: string;
		required?: boolean;
		default?: string | number | boolean;
		description?: string;
	}
	interface Props {
		rows: ParamRow[];
		/** Table caption, e.g. "Settings for Message · Send". */
		caption?: string;
		/** Column headers (defaults fit settings; node pages reuse it for output fields and slots). */
		nameLabel?: string;
		typeLabel?: string;
		descriptionLabel?: string;
	}

	let {
		rows = [],
		caption,
		nameLabel = 'Setting',
		typeLabel = 'Type',
		descriptionLabel = 'What it does',
	}: Props = $props();
</script>

<!-- Below 640px the rows become stacked cards (#1338); the column name is repeated from data-label. -->
<div class="awf-params">
	<table>
		{#if caption}<caption>{caption}</caption>{/if}
		<thead>
			<tr><th scope="col">{nameLabel}</th><th scope="col">{typeLabel}</th><th scope="col">{descriptionLabel}</th></tr>
		</thead>
		<tbody>
			{#each rows as row, i (row.name + i)}
				<tr>
					<th scope="row">
						{row.name}
						{#if row.required}<span class="awf-req"><span aria-hidden="true">REQ</span><span class="sr-only">(required)</span></span>{/if}
					</th>
					<td data-label={typeLabel}><code>{row.type ?? '—'}</code></td>
					<td data-label={descriptionLabel}>
						{row.description ?? ''}
						{#if row.default !== undefined && row.default !== ''}
							<span class="awf-params__default">Default: <code>{String(row.default)}</code></span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@media (max-width: 639.98px) {
		div.awf-params {
			overflow: visible;
			border: 0;
			background: transparent;
		}
		div.awf-params :global(table),
		div.awf-params tbody,
		div.awf-params tr,
		div.awf-params th,
		div.awf-params td {
			display: block;
			width: 100%;
			background: transparent;
		}
		div.awf-params thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		div.awf-params caption {
			display: block;
			padding-inline: 0;
			border: 0;
		}
		div.awf-params tr {
			margin-block-end: 0.625rem;
			padding: 0.75rem 0.875rem;
			border: 1px solid var(--awf-line);
			border-radius: 12px;
			background: var(--awf-surface);
		}
		div.awf-params th,
		div.awf-params td {
			border: 0;
			padding: 0;
			white-space: normal;
		}
		div.awf-params td[data-label] {
			margin-top: 0.25rem;
		}
		div.awf-params td:empty {
			display: none;
		}
	}
</style>
