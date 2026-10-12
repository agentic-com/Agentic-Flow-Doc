<script lang="ts">
	import type { Lang } from '../../i18n/locales';
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
		/** Marker centre: a point on the box edge (%) plus an offset in px (GuidedShot.astro). */
		marker: { x: number; y: number; dx: number; dy: number };
	}
	interface Props {
		/** Page language, passed by the Astro wrapper. */
		lang?: Lang;
		uid: string;
		alt: string;
		light: Img;
		dark: Img;
		items: Item[];
		caption?: string;
		/** Window of the image to show, in % of the image (GuidedShot.astro focuses on the spots). */
		crop?: Box;
	}

	let { lang = 'en', uid, alt, light, dark, items, caption, crop = { x: 0, y: 0, w: 100, h: 100 } }: Props = $props();
	// The image is drawn larger than the frame and shifted so only the crop window shows.
	const imgStyle = $derived(
		crop.w >= 100 && crop.h >= 100
			? ''
			: `position: absolute; max-width: none; width: ${(100 / crop.w) * 100}%; left: ${(-crop.x / crop.w) * 100}%; top: ${(-crop.y / crop.h) * 100}%`
	);
	let active = $state(0);
	let stepEls: HTMLButtonElement[] = $state([]);

	const zoom = $derived(100 / Math.min(crop.w, 100));
	const sizes = $derived(`(max-width: 50rem) ${Math.round(100 * zoom)}vw, ${Math.round(46 * zoom)}rem`);
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
		<div class="awf-guided__frame" style="aspect-ratio: {light.width * crop.w} / {light.height * crop.h}; overflow: hidden">
			<img
				class="awf-guided__img awf-shot__img--light"
				style={imgStyle}
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
				style={imgStyle}
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
					style="--x: calc({pct(it.marker.x)} + {it.marker.dx}px); --y: calc({pct(it.marker.y)} + {it.marker.dy}px)"
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
