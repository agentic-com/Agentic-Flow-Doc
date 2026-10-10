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
	}

	let { rows = [], caption }: Props = $props();
</script>

<div class="awf-params">
	<table>
		{#if caption}<caption>{caption}</caption>{/if}
		<thead>
			<tr><th scope="col">Setting</th><th scope="col">Type</th><th scope="col">What it does</th></tr>
		</thead>
		<tbody>
			{#each rows as row, i (row.name + i)}
				<tr>
					<th scope="row">
						{row.name}
						{#if row.required}<span class="awf-req"><span aria-hidden="true">REQ</span><span class="sr-only">(required)</span></span>{/if}
					</th>
					<td><code>{row.type ?? '—'}</code></td>
					<td>
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
