<script lang="ts">
	type Src = string | { src: string; width?: number; height?: number };
	interface Hotspot {
		/** Horizontal position in % of the image width. */
		x: number;
		/** Vertical position in % of the image height. */
		y: number;
		/** Legend text for this number. */
		label: string;
	}
	interface Props {
		/** Light-theme capture (public path or imported image). */
		src: Src;
		/** Dark-theme capture. Without it, `src` shows in both themes. */
		srcDark?: Src;
		alt: string;
		caption?: string;
		hotspots?: Hotspot[];
		width?: number;
		height?: number;
	}

	let { src, srcDark, alt, caption, hotspots = [], width, height }: Props = $props();

	const url = (s: Src | undefined) => (typeof s === 'string' ? s : s?.src);
	const w = $derived(width ?? (typeof src === 'object' ? src.width : undefined));
	const h = $derived(height ?? (typeof src === 'object' ? src.height : undefined));
</script>

<figure class="awf-shot">
	<div class="awf-shot__frame">
		<img
			class="awf-shot__img"
			class:awf-shot__img--light={!!srcDark}
			src={url(src)}
			{alt}
			width={w}
			height={h}
			loading="lazy"
			decoding="async"
		/>
		{#if srcDark}
			<img
				class="awf-shot__img awf-shot__img--dark"
				src={url(srcDark)}
				{alt}
				width={w}
				height={h}
				loading="lazy"
				decoding="async"
			/>
		{/if}
		{#each hotspots as spot, i (i)}
			<span class="awf-hotspot awf-ping" style="left: {spot.x}%; top: {spot.y}%" aria-hidden="true">{i + 1}</span>
		{/each}
	</div>
	{#if hotspots.length || caption}
		<figcaption>
			{#if caption}<span class="awf-shot__caption">{caption}</span>{/if}
			{#if hotspots.length}
				<ol class="awf-shot__legend">
					{#each hotspots as spot, i (i)}<li>
							<span class="awf-shot__num" aria-hidden="true">{i + 1}</span>{spot.label}
						</li>{/each}
				</ol>
			{/if}
		</figcaption>
	{/if}
</figure>
