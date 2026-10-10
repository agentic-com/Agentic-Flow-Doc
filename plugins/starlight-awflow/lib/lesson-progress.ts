/**
 * Learning-path progress (awflow/Agentic-Flow#1341), kept in the reader's browser.
 *
 * - No account: the list of finished lessons lives in `localStorage` under `awf-learn-done`.
 * - Storage can be blocked (private windows, strict cookie settings). Every access is wrapped in
 *   try/catch and falls back to an in-memory set, so the page still works; progress just isn't kept
 *   after a reload.
 * - The lesson rail (overrides/Sidebar.astro) and `<LessonDone>` both import this module, so Vite
 *   bundles one shared copy and the in-memory fallback is shared too.
 *
 * Lesson ids are page paths without slashes, e.g. `get-started/install`.
 */

const KEY = 'awf-learn-done';
export const LESSON_PROGRESS_EVENT = 'awf:lesson-progress';

let memory: Set<string> | undefined;

/** `/get-started/install/` → `get-started/install`. */
export const lessonIdFromPath = (path: string) => path.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');

function read(): Set<string> {
	try {
		const raw = window.localStorage.getItem(KEY);
		const list = raw ? JSON.parse(raw) : [];
		if (Array.isArray(list)) memory = new Set(list.filter((x): x is string => typeof x === 'string'));
	} catch {
		// Blocked or corrupt storage: keep whatever this page load already knows.
	}
	return (memory ??= new Set());
}

function write(done: Set<string>) {
	memory = done;
	try {
		window.localStorage.setItem(KEY, JSON.stringify([...done]));
	} catch {
		// Blocked storage: progress stays in memory for this page only.
	}
	try {
		window.dispatchEvent(new CustomEvent(LESSON_PROGRESS_EVENT, { detail: [...done] }));
	} catch {
		/* no window events (tests, very old browsers) */
	}
}

export function getDoneLessons(): Set<string> {
	return new Set(read());
}

export function isLessonDone(id: string): boolean {
	return read().has(id);
}

export function setLessonDone(id: string, done = true) {
	const next = new Set(read());
	if (done) next.add(id);
	else next.delete(id);
	write(next);
}

/** Calls `fn` now and whenever progress changes, in this tab or another one. Returns an unsubscribe. */
export function onLessonProgress(fn: (done: Set<string>) => void): () => void {
	const run = () => fn(getDoneLessons());
	const onStorage = (e: StorageEvent) => {
		if (e.key === null || e.key === KEY) run();
	};
	window.addEventListener(LESSON_PROGRESS_EVENT, run);
	window.addEventListener('storage', onStorage);
	run();
	return () => {
		window.removeEventListener(LESSON_PROGRESS_EVENT, run);
		window.removeEventListener('storage', onStorage);
	};
}
