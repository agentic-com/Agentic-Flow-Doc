import { statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

export type Theme = 'light' | 'dark';

/** Minimal shapes of the Playwright objects we use (Playwright is loaded from the app repo at runtime). */
export type Box = { x: number; y: number; width: number; height: number };
export interface Locator {
	first(): Locator;
	last(): Locator;
	nth(i: number): Locator;
	filter(o: { hasText?: string | RegExp; has?: Locator; visible?: boolean }): Locator;
	locator(sel: string): Locator;
	getByRole(role: string, o?: { name?: string | RegExp; exact?: boolean }): Locator;
	getByText(t: string | RegExp, o?: { exact?: boolean }): Locator;
	getByPlaceholder(t: string | RegExp): Locator;
	click(o?: { timeout?: number }): Promise<void>;
	dblclick(o?: { timeout?: number }): Promise<void>;
	fill(v: string, o?: { timeout?: number }): Promise<void>;
	waitFor(o?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number }): Promise<void>;
	setInputFiles(f: string | { name: string; mimeType: string; buffer: Buffer }): Promise<void>;
	boundingBox(): Promise<Box | null>;
	count(): Promise<number>;
	isVisible(): Promise<boolean>;
}
export interface Page extends Pick<Locator, 'locator' | 'getByRole' | 'getByText' | 'getByPlaceholder'> {
	goto(url: string): Promise<unknown>;
	url(): string;
	waitForURL(re: RegExp, o?: { timeout?: number }): Promise<void>;
	waitForTimeout(ms: number): Promise<void>;
	waitForLoadState(s: string): Promise<void>;
	waitForEvent(e: 'filechooser', o?: { timeout?: number }): Promise<{ setFiles(f: string): Promise<void> }>;
	waitForFunction(fn: (arg: string) => boolean, arg: string, o?: { timeout?: number }): Promise<unknown>;
	addStyleTag(o: { content: string }): Promise<unknown>;
	setViewportSize(v: { width: number; height: number }): Promise<void>;
	viewportSize(): { width: number; height: number } | null;
	screenshot(o?: { fullPage?: boolean }): Promise<Buffer>;
	keyboard: { press(k: string): Promise<void> };
	mouse: { move(x: number, y: number): Promise<void> };
}

/** localStorage entries: anonymous local workspace, telemetry notice seen, first-run tours dismissed, theme. */
export function seedStorage(theme: Theme): Record<string, string> {
	const tours = ['workflows', 'home', 'knowledges', 'marketplace', 'credentials', 'memory', 'local-models', 'history', 'settings'];
	return {
		app_mode: 'anonymous',
		awf_telemetry_prefs: JSON.stringify({
			usageStats: false,
			errorReports: false,
			installId: 'inst_00000000000000000000000000000000',
			noticeSeen: true,
			lastAppOpenedDay: null,
			reportedSchedules: null
		}),
		...Object.fromEntries(tours.map((t) => [`onboarding-app/${t}`, 'true'])),
		// The Assistant's one-time "Meet Aria" model-choice card.
		'assistant.firstRunSeen': 'true',
		// mode-watcher (the app's theme library) reads this key on load.
		'mode-watcher-mode': theme
	};
}

export function buildAge(buildDir: string, now: number = Date.now()): { exists: boolean; hours: number } {
	try {
		return { exists: true, hours: (now - statSync(join(buildDir, 'index.html')).mtimeMs) / 3_600_000 };
	} catch {
		return { exists: false, hours: 0 };
	}
}

export async function step<T>(name: string, fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (e) {
		throw new Error(`${name}: ${e instanceof Error ? e.message : String(e)}`);
	}
}

/** A 2x PNG screenshot as WebP, at most `maxWidth` px wide. */
export async function toWebp(png: Buffer, maxWidth = 2000, quality = 85): Promise<{ data: Buffer; width: number; height: number }> {
	const { data, info } = await sharp(png)
		.resize({ width: maxWidth, withoutEnlargement: true })
		.webp({ quality, effort: 6 })
		.toBuffer({ resolveWithObject: true });
	return { data, width: info.width, height: info.height };
}

export type Hotspot = {
	/** Legend text, as the <Screenshot> component's `hotspots[].label`. */
	label: string;
	/** Centre of the element, in % of the image (the component's `x` / `y`). */
	x: number;
	y: number;
	/** The element's bounding box, in % of the image. */
	box: { x: number; y: number; w: number; h: number };
};

const pct = (v: number, of: number) => Math.round((v / of) * 1000) / 10;

/** Measures elements on screen as percentages of the viewport (the screenshot is the viewport). */
export async function measure(page: Page, spots: { label: string; locate: (p: Page) => Locator }[]): Promise<Hotspot[]> {
	const vp = page.viewportSize();
	if (!vp) return [];
	const out: Hotspot[] = [];
	for (const s of spots) {
		const box = await s.locate(page).filter({ visible: true }).first().boundingBox().catch(() => null);
		if (!box || box.width === 0) throw new Error(`hotspot "${s.label}" not found on screen`);
		const x0 = Math.max(0, box.x), y0 = Math.max(0, box.y);
		const x1 = Math.min(vp.width, box.x + box.width), y1 = Math.min(vp.height, box.y + box.height);
		out.push({
			label: s.label,
			x: pct((x0 + x1) / 2, vp.width),
			y: pct((y0 + y1) / 2, vp.height),
			box: { x: pct(x0, vp.width), y: pct(y0, vp.height), w: pct(x1 - x0, vp.width), h: pct(y1 - y0, vp.height) }
		});
	}
	return out;
}
