// @ts-check
/**
 * Placeholder text from the first docs pass ("Source-backed field…", "…source tests…") must never
 * render (awflow/Agentic-Flow#1338). Used by `generate.ts --check` and by astro.config.mjs (via
 * sidebar.mjs), so both the generator check and `astro build` fail when it comes back.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const FILLER_PATTERNS = [/Source-backed field/i, /\bsource tests?\b/i];

/** Files under `dir` (recursive, .md/.mdx) that contain placeholder text. */
export function findFiller(/** @type {string} */ dir) {
	/** @type {string[]} */
	const hits = [];
	const walk = (/** @type {string} */ d) => {
		for (const name of readdirSync(d)) {
			const p = join(d, name);
			if (statSync(p).isDirectory()) walk(p);
			else if (/\.mdx?$/.test(name) && FILLER_PATTERNS.some((re) => re.test(readFileSync(p, 'utf8')))) hits.push(p);
		}
	};
	walk(dir);
	return hits;
}

/** Throws when any node page contains placeholder text. */
export function assertNoFiller(/** @type {string} */ dir) {
	const hits = findFiller(dir);
	if (hits.length) {
		throw new Error(
			`Placeholder text found in ${hits.length} node page(s):\n  - ${hits.join('\n  - ')}\n` +
				'Replace it with real content (awflow/Agentic-Flow#1338).',
		);
	}
}
