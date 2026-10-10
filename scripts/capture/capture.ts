/**
 * Docs screenshot pipeline: captures the AWFlow app's production web build with Playwright.
 *
 *   bun run docs:capture [--build] [--only a,b] [--theme light|dark|both] [--app <dir>] [--port <n>]
 *
 * Writes src/assets/screenshots/<shot>.<theme>.webp and src/assets/screenshots/manifest.json.
 * See CONTRIBUTING.md (Screenshots) for how to refresh and add shots.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { SHOTS, Session, type ShotDef } from './shots.ts';
import { serveStatic } from './lib/static-server.ts';
import { buildAge, measure, seedStorage, step, toWebp, type Hotspot, type Page, type Theme } from './lib/util.ts';

const ROOT = resolve(import.meta.dir, '..', '..');
const OUT = join(ROOT, 'src', 'assets', 'screenshots');
const MANIFEST = join(OUT, 'manifest.json');
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;
const MAX_WIDTH = 2000;
const QUALITY = 85;
const API = 'https://api.awflow.io';
const DEBUG = join(tmpdir(), 'awflow-docs-capture-debug');

const argv = process.argv.slice(2);
const flag = (n: string) => argv.includes(n);
const opt = (n: string) => {
	const i = argv.indexOf(n);
	return i >= 0 ? argv[i + 1] : undefined;
};
const fail = (m: string): never => {
	console.error(m);
	process.exit(1);
};

/** The app repo: --app, else agentic-flow next to this repo (next to the main checkout when run from a git worktree). */
function findApp(): string {
	const arg = opt('--app');
	if (arg) return resolve(process.cwd(), arg);
	const common = Bun.spawnSync(['git', '-C', ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir']).stdout.toString().trim();
	const roots = [ROOT, ...(common ? [resolve(common, '..')] : [])];
	return roots.map((r) => resolve(r, '..', 'agentic-flow')).find((d) => existsSync(join(d, 'package.json'))) ?? resolve(ROOT, '..', 'agentic-flow');
}
const appDir = findApp();
const port = Number(opt('--port') ?? 4440);
const only = opt('--only')?.split(',').map((s) => s.trim()).filter(Boolean);
const themeArg = opt('--theme') ?? 'both';
if (!['light', 'dark', 'both'].includes(themeArg)) fail('--theme must be light, dark or both');
const themes: Theme[] = themeArg === 'both' ? ['light', 'dark'] : [themeArg as Theme];
if (!Number.isInteger(port) || port <= 0) fail('--port needs a number');
if (only) for (const n of only) if (!SHOTS.some((s) => s.name === n)) fail(`Unknown shot "${n}". Shots: ${SHOTS.map((s) => s.name).join(', ')}`);
const wanted = SHOTS.filter((s) => !only || only.includes(s.name));
if (!existsSync(join(appDir, 'package.json'))) fail(`App repo not found at ${appDir}. Pass --app <dir>.`);

if (flag('--build')) {
	console.log(`Building the app (build:prod:web) in ${appDir}…`);
	const p = Bun.spawnSync(['bun', 'run', 'build:prod:web'], { cwd: appDir, stdio: ['inherit', 'inherit', 'inherit'] });
	if (p.exitCode !== 0) fail('App build failed.');
}
const age = buildAge(join(appDir, 'build'));
if (!age.exists) fail('No app build found. Run with --build.');
if (age.hours > 24) console.warn(`Warning: app build is ${Math.round(age.hours)} h old. Re-run with --build for a current UI.`);

const git = (...a: string[]) => Bun.spawnSync(['git', '-C', appDir, ...a]).stdout.toString().trim();
const commit = (git('rev-parse', '--short', 'HEAD') || 'unknown') + (git('status', '--porcelain', '--untracked-files=no') ? '-dirty' : '');
const appVersion = (JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')) as { version?: string }).version ?? 'unknown';

// Playwright comes from the app repo (it is one of its dev dependencies), so the docs need no extra install.
const { chromium } = createRequire(join(appDir, 'package.json'))('playwright') as {
	chromium: { launch(): Promise<Browser> };
};
type Route = {
	request(): { method(): string; headers(): Record<string, string> };
	fetch(): Promise<{ headers(): Record<string, string> }>;
	fulfill(o: Record<string, unknown>): Promise<void>;
	abort(): Promise<void>;
};
type Context = {
	addInitScript(fn: (e: Record<string, string>) => void, arg: Record<string, string>): Promise<void>;
	route(m: string | ((u: URL) => boolean), h: (r: Route) => Promise<void>): Promise<void>;
	newPage(): Promise<Page>;
	close(): Promise<void>;
};
type Browser = {
	newContext(o: Record<string, unknown>): Promise<Context>;
	close(): Promise<void>;
};

type Entry = {
	shot: string;
	page: string | null;
	route: string;
	alt: string;
	note?: string;
	status: 'ok' | 'skipped' | 'failed';
	reason?: string;
	files: Partial<Record<Theme, string>>;
	width?: number;
	height?: number;
	hotspots: Hotspot[];
	appCommit: string;
	appVersion: string;
	capturedAt: string;
};

const results = new Map<string, Entry>();
const tmp = join(OUT, '.tmp-capture');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

/** Waits for toasts to leave; capture-only CSS then guarantees none is left in the frame. */
async function clearTransients(page: Page) {
	await page
		.locator('[data-sonner-toast]')
		.first()
		.waitFor({ state: 'detached', timeout: 10_000 })
		.catch(() => {});
	await page.addStyleTag({ content: '[data-sonner-toaster] { display: none !important; }' });
	const vp = page.viewportSize() ?? VIEWPORT;
	await page.mouse.move(vp.width - 2, vp.height - 2);
}

async function shoot(session: Session, def: ShotDef) {
	const { page, theme } = session;
	const vp = def.viewport ?? VIEWPORT;
	if (vp.width !== page.viewportSize()?.width || vp.height !== page.viewportSize()?.height) await page.setViewportSize(vp);
	try {
		await def.prepare(session);
		await clearTransients(page);
		if (def.css) await page.addStyleTag({ content: def.css });
		await page.waitForTimeout(300);
		const png = await page.screenshot();
		const hotspots = await measure(page, def.hotspots);
		const webp = await toWebp(png, MAX_WIDTH, QUALITY);
		const file = `${def.name}.${theme}.webp`;
		writeFileSync(join(tmp, file), webp.data);
		return { file, width: webp.width, height: webp.height, hotspots };
	} catch (err) {
		// Keep what the page looked like, to fix the locator quickly.
		mkdirSync(DEBUG, { recursive: true });
		const shot = join(DEBUG, `${def.name}.${theme}.png`);
		await page.screenshot().then((b) => writeFileSync(shot, b)).catch(() => {});
		await (page.locator('body') as unknown as { ariaSnapshot(): Promise<string> })
			.ariaSnapshot()
			.then((t) => writeFileSync(shot.replace(/\.png$/, '.aria.txt'), t))
			.catch(() => {});
		console.log(`  debug screenshot: ${shot}`);
		throw err;
	} finally {
		if (def.viewport) await page.setViewportSize(VIEWPORT);
	}
}

/** Adds CORS headers to app → api.awflow.io calls: the API only allows the extension's and site's origins, not 127.0.0.1. */
async function corsProxy(route: Route, origin: string) {
	const req = route.request();
	const cors = {
		'access-control-allow-origin': origin,
		'access-control-allow-credentials': 'true',
		'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
		'access-control-allow-headers': req.headers()['access-control-request-headers'] ?? '*'
	};
	if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
	try {
		const response = await route.fetch();
		await route.fulfill({ response, headers: { ...response.headers(), ...cors } });
	} catch {
		await route.abort();
	}
}

let hardFail = false;
const server = serveStatic(join(appDir, 'build'), port);
const base = `http://127.0.0.1:${server.port}/`;
const browser = await chromium.launch();
try {
	for (const theme of themes) {
		const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, colorScheme: theme, locale: 'en-US', timezoneId: 'Europe/Paris' });
		await context.addInitScript((entries) => {
			for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
		}, seedStorage(theme));
		// Reproducibility: never show models from a local Ollama on the capturing machine.
		await context.route((u) => u.port === '11434', (r) => r.abort());
		await context.route(`${API}/**`, (r) => corsProxy(r, base.slice(0, -1)));
		const page = await context.newPage();
		const session = new Session(page, base, theme);
		for (const def of wanted) {
			const prev = results.get(def.name);
			if (prev && prev.status !== 'ok') continue; // skipped/failed in the first theme: don't half-capture
			try {
				const r = await step(`${def.name} (${theme})`, () => shoot(session, def));
				const e: Entry = prev ?? {
					shot: def.name,
					page: def.page,
					route: def.route,
					alt: def.alt,
					...(def.note ? { note: def.note } : {}),
					status: 'ok',
					files: {},
					hotspots: r.hotspots,
					appCommit: commit,
					appVersion,
					capturedAt: new Date().toISOString()
				};
				e.files[theme] = r.file;
				e.width = r.width;
				e.height = r.height;
				results.set(def.name, e);
				console.log(`${def.name} (${theme}): ok`);
			} catch (err) {
				const reason = (err instanceof Error ? err.message : String(err)).split('\n')[0];
				const status = def.needsNetwork ? 'skipped' : 'failed';
				if (status === 'failed') hardFail = true;
				results.set(def.name, {
					shot: def.name,
					page: def.page,
					route: def.route,
					alt: def.alt,
					status,
					reason,
					files: {},
					hotspots: [],
					appCommit: commit,
					appVersion,
					capturedAt: new Date().toISOString()
				});
				console.log(`${def.name} (${theme}): ${status.toUpperCase()} (${reason})`);
			}
		}
		await context.close();
	}
} catch (err) {
	hardFail = true;
	console.error(err instanceof Error ? err.message : String(err));
} finally {
	await browser.close();
	server.stop(true);
}

// Promote: images of shots that succeeded replace the old ones. A failed shot keeps its old
// images and manifest entry; a skipped one (network) loses them, so files and manifest agree.
type Manifest = { $comment: string; app: Record<string, string>; viewport: typeof VIEWPORT; deviceScaleFactor: number; maxWidth: number; format: string; shots: Entry[] };
const old: Manifest | null = existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, 'utf8')) as Manifest) : null;
const byName = new Map((old?.shots ?? []).map((e) => [e.shot, e]));
for (const [name, e] of results) {
	if (e.status === 'failed') continue;
	const before = byName.get(name);
	for (const theme of themes) {
		const dest = join(OUT, `${name}.${theme}.webp`);
		if (e.status === 'ok' && e.files[theme]) writeFileSync(dest, readFileSync(join(tmp, e.files[theme]!)));
		else if (e.status === 'skipped') rmSync(dest, { force: true });
	}
	// A one-theme run keeps the other theme's file from the previous capture.
	for (const theme of ['light', 'dark'] as Theme[])
		if (!e.files[theme] && e.status === 'ok' && before?.files[theme] && existsSync(join(OUT, before.files[theme]!))) e.files[theme] = before.files[theme];
	byName.set(name, e);
}
rmSync(tmp, { recursive: true, force: true });
const manifest: Manifest = {
	$comment: 'Generated by `bun run docs:capture` (scripts/capture). Do not edit by hand: change scripts/capture/shots.ts and re-run.',
	app: { repo: 'awflow/Agentic-Flow', version: appVersion, commit },
	viewport: VIEWPORT,
	deviceScaleFactor: SCALE,
	maxWidth: MAX_WIDTH,
	format: 'webp',
	shots: SHOTS.map((s) => byName.get(s.name)).filter((e): e is Entry => !!e)
};
writeFileSync(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');

const summary = [...results.values()];
console.log(
	`\n${summary.filter((e) => e.status === 'ok').length} ok, ${summary.filter((e) => e.status === 'skipped').length} skipped, ${summary.filter((e) => e.status === 'failed').length} failed. Manifest: ${MANIFEST}`
);
process.exit(hardFail ? 1 : 0);
