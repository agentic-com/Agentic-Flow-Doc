/**
 * "Open in AWFlow" for <FlowPreview> (awflow/Agentic-Flow#1336).
 *
 * When the AWFlow extension is installed, its content script on the docs announces itself with
 * `<html data-awflow-docs-handoff="<version>">` and/or a `{type:'awflow:docs-handoff-ready'}`
 * window message (re-sent whenever the page posts `{type:'awflow:docs-handoff-probe'}`). The page
 * then asks it to import a workflow with
 * `{type:'awflow:docs-handoff', id, action:'import', src}` — posted synchronously inside the click
 * handler, because the extension requires a user gesture — and gets back
 * `{type:'awflow:docs-handoff-result', id, ok, error?}`.
 *
 * Without the extension (or when it refuses / does not answer within 1.5 s) the web app's import
 * route takes over: `${PUBLIC_APP_URL}/#/app/import?src=<absolute .awf URL>`. The app only accepts
 * files from https://docs.awflow.io (and localhost:4321 in its dev builds).
 */

export const APP_URL = ((import.meta.env.PUBLIC_APP_URL as string | undefined) || 'https://app.awflow.io').replace(/\/$/, '');

/** Absolute URL of an example file. During SSR it uses the configured site; in the browser, the page's origin. */
export function absoluteSrc(src: string): string {
	const base =
		typeof location !== 'undefined' ? location.href : ((import.meta.env.SITE as string | undefined) ?? 'https://docs.awflow.io');
	return new URL(src, base).href;
}

export function appImportUrl(src: string): string {
	return `${APP_URL}/#/app/import?src=${encodeURIComponent(absoluteSrc(src))}`;
}

type Result = { ok: true } | { ok: false; error: string };

let ready = false;
let listening = false;
const pending = new Map<string, (r: Result) => void>();
const readyWatchers = new Set<() => void>();

function onMessage(event: MessageEvent) {
	if (event.source !== window || event.origin !== location.origin) return;
	const data = event.data as { type?: string; id?: string; ok?: boolean; error?: string } | null;
	if (!data || typeof data.type !== 'string') return;
	if (data.type === 'awflow:docs-handoff-ready') {
		ready = true;
		readyWatchers.forEach((fn) => fn());
	} else if (data.type === 'awflow:docs-handoff-result' && typeof data.id === 'string') {
		const resolve = pending.get(data.id);
		if (!resolve) return;
		pending.delete(data.id);
		resolve(data.ok ? { ok: true } : { ok: false, error: data.error || 'extension refused' });
	}
}

/** Start listening (idempotent) and probe for the extension. Returns an unsubscribe for `onReady`. */
export function watchHandoff(onReady: () => void): () => void {
	if (typeof window === 'undefined') return () => {};
	readyWatchers.add(onReady);
	if (!listening) {
		listening = true;
		window.addEventListener('message', onMessage);
		window.postMessage({ type: 'awflow:docs-handoff-probe' }, location.origin);
	}
	if (handoffAvailable()) onReady();
	return () => readyWatchers.delete(onReady);
}

export function handoffAvailable(): boolean {
	return ready || (typeof document !== 'undefined' && document.documentElement.hasAttribute('data-awflow-docs-handoff'));
}

const uuid = () =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/**
 * Ask the extension to import `src`. MUST be called synchronously from a click handler: the
 * message is posted before this function returns; only the wait for the answer is async.
 */
export function requestHandoff(src: string, timeoutMs = 1500): Promise<Result> {
	const id = uuid();
	const answer = new Promise<Result>((resolve) => {
		pending.set(id, resolve);
		setTimeout(() => {
			if (pending.delete(id)) resolve({ ok: false, error: 'extension did not answer' });
		}, timeoutMs);
	});
	window.postMessage({ type: 'awflow:docs-handoff', id, action: 'import', src: absoluteSrc(src) }, location.origin);
	return answer;
}
