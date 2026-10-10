<script lang="ts">
	/**
	 * Interactive part of <GuidedShot> (GuideB.dc.html, "13B"). Rendered on the server with step 1
	 * active, then hydrated: hovering, focusing or clicking a step highlights its marker, and clicking a
	 * marker selects its step. Use it through GuidedShot.astro, which resolves the images and boxes.
	 */
	type Box = { x: number; y: number; w: number; h: number };
	type Img = { src: string; srcset: string; width: number; height: number };
	interface Item {
		n: number;
		title: string;
		/** Pre-rendered inline HTML (escaped by GuidedShot.astro). */
		bodyHtml?: string;
		check?: string;
		label: string;
		box: Box;
	}
	interface Props {
		uid: string;
		alt: string;
		light: Img;
		dark: Img;
		items: Item[];
		caption?: string;
	}

	let { uid, alt, light, dark, items, caption }: Props = $props();
	let active = $state(0);
	let stepEls: HTMLButtonElement[] = $state([]);

	const sizes = '(max-width: 50rem) 100vw, 46rem';
	const pct = (v: number) => `${Math.round(v * 100) / 100}%`;
	const summary = $derived(items.map((it) => `${it.n}. ${it.label}`).join('; '));

	// Hover follows real pointer moves only: when the page scrolls under a still mouse (after a marker
	// click, or Tab), the browser fires enter events that must not steal the selection.
	let last = { x: -1, y: -1 };
	function hover(e: PointerEvent, i: number) {
		if (e.pointerType !== 'mouse' || (e.clientX === last.x && e.clientY === last.y)) return;
		last = { x: e.clientX, y: e.clientY };
		active = i;
	}

	function fromMarker(i: number) {
		active = i;
		const el = stepEls[i];
		if (!el) return;
		el.focus({ preventScroll: true });
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
	}
</script>

<figure class="awf-guided not-content">
	<div class="awf-guided__layout">
		<div class="awf-guided__frame" style="aspect-ratio: {light.width} / {light.height}">
			<img
				class="awf-guided__img awf-shot__img--light"
				src={light.src}
				srcset={light.srcset}
				{sizes}
				{alt}
				width={light.width}
				height={light.height}
				loading="lazy"
				decoding="async"
				data-zoom-off
			/>
			<img
				class="awf-guided__img awf-shot__img--dark"
				src={dark.src}
				srcset={dark.srcset}
				{sizes}
				{alt}
				width={dark.width}
				height={dark.height}
				loading="lazy"
				decoding="async"
				data-zoom-off
			/>
			{#each items as it, i (it.n)}
				<span
					class="awf-guided__ring"
					class:is-active={active === i}
					style="left: {pct(it.box.x)}; top: {pct(it.box.y)}; width: {pct(it.box.w)}; height: {pct(it.box.h)}"
					aria-hidden="true"
				></span>
			{/each}
			{#each items as it, i (it.n)}
				<button
					type="button"
					class="awf-guided__marker"
					class:is-active={active === i}
					class:awf-ping={active === i}
					style="--x: {pct(it.box.x)}; --y: {pct(it.box.y + it.box.h / 2)}"
					aria-label="Step {it.n}: {it.title}"
					aria-controls="{uid}-step-{it.n}"
					onclick={() => fromMarker(i)}>{it.n}</button
				>
			{/each}
		</div>
		<ol class="awf-guided__steps" aria-label="Steps">
			{#each items as it, i (it.n)}
				<li>
					<button
						bind:this={stepEls[i]}
						id="{uid}-step-{it.n}"
						type="button"
						class="awf-guided__step"
						class:is-active={active === i}
						aria-current={active === i ? 'step' : undefined}
						onpointermove={(e) => hover(e, i)}
						onfocus={() => (active = i)}
						onclick={() => (active = i)}
					>
						<span class="awf-guided__num" aria-hidden="true">{it.n}</span>
						<span class="awf-guided__text">
							<span class="awf-guided__title"><span class="sr-only">Step {it.n}: </span>{it.title}</span>
							{#if it.bodyHtml}<span class="awf-guided__body">{@html it.bodyHtml}</span>{/if}
							{#if it.check}<span class="awf-guided__check"><strong>Check:</strong> {it.check}</span>{/if}
						</span>
					</button>
				</li>
			{/each}
		</ol>
	</div>
	<p class="sr-only">Numbered areas in the screenshot: {summary}.</p>
	{#if caption}<figcaption class="awf-guided__caption">{caption}</figcaption>{/if}
</figure>
