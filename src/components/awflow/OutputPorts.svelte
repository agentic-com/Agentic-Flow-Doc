<script lang="ts">
	interface Port {
		/** Port name as shown on the node, e.g. "true", "done", "item". */
		name: string;
		description?: string;
		/** What flows out, e.g. "items", "binary", "1 item". */
		type?: string;
	}
	interface Props {
		ports: Port[];
		/** Accessible name of the list. */
		label?: string;
	}

	let { ports = [], label = 'Output ports' }: Props = $props();
</script>

<ul class="awf-ports" aria-label={label}>
	{#each ports as port, i (port.name + i)}
		<li class="awf-port">
			<span class="awf-port__handle" aria-hidden="true"></span>
			<code class="awf-port__name">{port.name}</code>
			{#if port.type}<span class="awf-port__type">{port.type}</span>{/if}
			{#if port.description}<span class="awf-port__desc">{port.description}</span>{/if}
		</li>
	{/each}
</ul>
