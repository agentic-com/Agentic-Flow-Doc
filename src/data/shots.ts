/**
 * Build-time access to the generated app screenshots (scripts/capture → src/assets/screenshots):
 * one `<shot>.json` per shot plus `<shot>.light.webp` / `<shot>.dark.webp`.
 * Used by <GuidedShot> and <StepShot>; every lookup throws a clear error when a shot or spot is missing,
 * so a typo fails `bun run build` instead of shipping a broken figure.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export type ShotBox = { x: number; y: number; w: number; h: number };
export type ShotSpot = { id: string; label: string; x: number; y: number; box: ShotBox };
export type ShotEntry = {
	shot: string;
	page: string | null;
	route: string;
	alt: string;
	status: 'ok' | 'skipped' | 'failed';
	reason?: string;
	files: { light?: string; dark?: string };
	width?: number;
	height?: number;
	hotspots: ShotSpot[];
};
/** A rendered theme image: what an <img> needs. */
export type ShotImage = { src: string; srcset: string; width: number; height: number };
export type ResolvedShot = { entry: ShotEntry; light: ShotImage; dark: ShotImage; width: number; height: number };

const entries = import.meta.glob<ShotEntry>('/src/assets/screenshots/*.json', { eager: true, import: 'default' });
const images = import.meta.glob<ImageMetadata>('/src/assets/screenshots/*.webp', { eager: true, import: 'default' });

const DIR = '/src/assets/screenshots/';
const names = () => Object.keys(entries).map((k) => k.slice(DIR.length, -'.json'.length)).sort();

/** The shot's JSON entry. Throws if it does not exist or was not captured. */
export function getShot(name: string, component = 'shot'): ShotEntry {
	const entry = entries[`${DIR}${name}.json`];
	if (!entry) throw new Error(`<${component}>: no screenshot "${name}" in src/assets/screenshots/. Shots: ${names().join(', ')}.`);
	if (entry.status !== 'ok') throw new Error(`<${component}>: screenshot "${name}" is ${entry.status}${entry.reason ? ` (${entry.reason})` : ''}; re-run \`bun run docs:capture --only ${name}\`.`);
	return entry;
}

/** One spot of a shot, by id. Throws with the shot's ids when it does not exist. */
export function getSpot(entry: ShotEntry, id: string, component = 'shot'): ShotSpot {
	const spot = entry.hotspots.find((h) => h.id === id);
	if (!spot)
		throw new Error(
			`<${component}>: shot "${entry.shot}" has no spot "${id}". Spots: ${entry.hotspots.map((h) => h.id).join(', ') || '(none)'}. ` +
				'Add it to the shot in scripts/capture/shots/<area>.ts and re-capture.'
		);
	return spot;
}

async function render(name: string, theme: 'light' | 'dark', file: string | undefined, component: string): Promise<ShotImage> {
	const meta = file ? images[`${DIR}${file}`] : undefined;
	if (!meta) throw new Error(`<${component}>: screenshot "${name}" has no ${theme} image (${file ?? 'not captured'}).`);
	const widths = [800, 1400, meta.width].filter((w, i, a) => w <= meta.width && a.indexOf(w) === i);
	const img = await getImage({ src: meta, widths, format: 'webp' });
	return { src: img.src, srcset: img.srcSet.attribute, width: meta.width, height: meta.height };
}

/** Escapes text and renders inline **bold**, *italic* and `code` (no links: they would escape the links validator). */
export function inlineMarkdown(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, '$1<em>$2</em>');
}

/** The shot with both theme images run through Astro's image pipeline (srcset at 800/1400/full width). */
export async function resolveShot(name: string, component = 'shot'): Promise<ResolvedShot> {
	const entry = getShot(name, component);
	const light = await render(name, 'light', entry.files.light, component);
	const dark = entry.files.dark ? await render(name, 'dark', entry.files.dark, component) : light;
	return { entry, light, dark, width: light.width, height: light.height };
}
