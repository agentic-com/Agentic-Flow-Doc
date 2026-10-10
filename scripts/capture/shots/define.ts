import type { Session } from '../lib/session.ts';
import type { Locator, Page } from '../lib/util.ts';

/** A Playwright locator, written against the page: `(p) => p.getByRole('button', { name: 'Save' })`. */
export type Locate = (p: Page) => Locator;

/**
 * A named area of the screenshot. Its bounding box is measured at capture time and written to the
 * shot's JSON (`hotspots[]`), where <GuidedShot> and <StepShot> look it up by `id`.
 */
export type SpotDef = {
	/** Stable kebab-case id, unique within the shot: pages reference it (`spot="auth-type"`). */
	id: string;
	/** What the area is, in a few words: used for alt text and legends. */
	label: string;
	/** The control to outline. Use visible roles and text, never CSS classes when a role exists. */
	locator: Locate;
};

export type ShotDef = {
	name: string;
	/** Docs page (slug under src/content/docs) the image is meant for; null when no page exists yet. */
	page: string | null;
	/** Route shown, with placeholders for generated ids. */
	route: string;
	alt: string;
	note?: string;
	viewport?: { width: number; height: number };
	/** Runs as the fictional signed-in user "Alex Doe": the app's backend is the fake API in lib/fakeApi.ts. */
	signedIn?: boolean;
	/** Set when the shot depends on the network: a failure is then recorded as skipped. */
	needsNetwork?: boolean;
	/** Extra capture-only CSS (never product changes): hides headless-only artefacts. */
	css?: string;
	/**
	 * Legacy numbered hotspots (the <Screenshot> legend). `id` is optional here: without one it is derived
	 * from the label, so give one when a page references the hotspot.
	 */
	hotspots?: { id?: string; label: string; locate: Locate }[];
	/** Areas for <GuidedShot> / <StepShot>. Recorded with the hotspots, after them. */
	spots?: SpotDef[];
	prepare: (s: Session) => Promise<void>;
};

export const btn = (name: string | RegExp, exact = false): Locate => (p) => p.getByRole('button', { name, exact });
export const link = (name: string | RegExp): Locate => (p) => p.getByRole('link', { name });
export const text = (t: string | RegExp): Locate => (p) => p.getByText(t);
/** Inside the open dialog. */
export const inDialog = (fn: (d: Locator) => Locator): Locate => (p) => fn(p.getByRole('dialog').filter({ visible: true }).last());
export const NO_MINIMAP = '.svelte-flow__minimap { display: none !important; }';

/** Kebab-case id from a label ("Name it so you can find it" → "name-find"). Only for legacy hotspots without an `id`. */
export function slugId(label: string): string {
	const stop = new Set(['the', 'a', 'an', 'it', 'so', 'you', 'can', 'your', 'of', 'to', 'or', 'and', 'with', 'in', 'for', 'this']);
	const words = label
		.split(/[:,(;]| — | - /)[0]
		.toLowerCase()
		.replace(/[’']/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.split(/\s+/)
		.filter((w) => w && !stop.has(w));
	return words.slice(0, 4).join('-') || 'spot';
}

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** All areas of a shot, in manifest order (hotspots, then spots), with ids checked. */
export function spotsOf(def: ShotDef): { id: string; label: string; locate: Locate }[] {
	const all = [
		...(def.hotspots ?? []).map((h) => ({ id: h.id ?? slugId(h.label), label: h.label, locate: h.locate })),
		...(def.spots ?? []).map((s) => ({ id: s.id, label: s.label, locate: s.locator }))
	];
	const seen = new Set<string>();
	for (const s of all) {
		if (!ID.test(s.id)) throw new Error(`shot "${def.name}": spot id "${s.id}" is not kebab-case`);
		if (seen.has(s.id)) throw new Error(`shot "${def.name}": duplicate spot id "${s.id}"`);
		seen.add(s.id);
	}
	return all;
}
