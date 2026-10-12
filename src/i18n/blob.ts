/** Git blob hashes, so a translation records exactly which English text it came from (spec §3). */
import { createHash } from 'node:crypto';

export function gitBlobHash(content: string | Uint8Array): string {
	const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content;
	return createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex');
}

/** `…/src/content/docs/fr/app/x.mdx` → `…/src/content/docs/app/x.mdx`; null for an English file. */
export function englishFileFor(path: string): string | null {
	const m = /^(.*\/src\/content\/docs\/)(?:fr|de|zh-cn)\/(.+)$/.exec(path.replaceAll('\\', '/'));
	return m ? m[1] + m[2] : null;
}
