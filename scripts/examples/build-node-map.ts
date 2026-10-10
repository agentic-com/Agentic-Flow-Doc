/**
 * Regenerates src/data/flow-node-map.json — the static node-name → {label, docLink} map that
 * <FlowPreview> uses to label nodes and link them to their doc pages (awflow/Agentic-Flow#1336).
 *
 * Reads the app's node definitions (the `this.description = { label, name, docLink, … }` blocks
 * under src/lib/Nodes-Blocks) straight from source, so it needs no app build.
 *
 *   AWFLOW_APP_DIR=../agentic-flow bun scripts/examples/build-node-map.ts
 *
 * The key is the node `name`, i.e. the last segment of an .awf node's `data.instance.id`
 * (`af-base-node:basic:getAllTextNode` → `getAllTextNode`).
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '../..');
const APP = resolve(process.env.AWFLOW_APP_DIR ?? join(ROOT, '../agentic-flow'));
const SRC = join(APP, 'src/lib/Nodes-Blocks');
const OUT = join(ROOT, 'src/data/flow-node-map.json');

function walk(dir: string, out: string[] = []): string[] {
	for (const e of readdirSync(dir)) {
		const p = join(dir, e);
		if (e === '__tests__' || p === join(SRC, 'tools')) continue;
		if (statSync(p).isDirectory()) walk(p, out);
		else if (p.endsWith('.ts') && !p.endsWith('.test.ts')) out.push(p);
	}
	return out;
}

const str = (block: string, key: string): string | undefined => {
	const m = block.match(new RegExp(`\\b${key}:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`));
	return m?.[2];
};

/** True when the docs site has a page for this docLink (pages missing from the docs get no link). */
const hasPage = (link: string) => {
	const base = join(ROOT, 'src/content/docs', link.replace(/^\/|\/$/g, ''));
	return ['.mdx', '.md', '/index.mdx', '/index.md'].some((ext) => existsSync(base + ext));
};

const map: Record<string, { label: string; docLink: string | null }> = {};
for (const file of walk(SRC)) {
	const text = readFileSync(file, 'utf8');
	// Each docLink belongs to the description object that encloses it; look back for its label/name.
	const re = /docLink:\s*(['"`])([^'"`]+)\1/g;
	for (let m = re.exec(text); m; m = re.exec(text)) {
		const start = Math.max(text.lastIndexOf('description = {', m.index), text.lastIndexOf('description: {', m.index), 0);
		const block = text.slice(start, m.index);
		const name = [...block.matchAll(/\bname:\s*(['"`])([A-Za-z0-9_-]+)\1/g)].at(-1)?.[2];
		const label = str(block, 'label');
		if (!name || !label) continue;
		const docLink = m[2].endsWith('/') ? m[2] : `${m[2]}/`;
		map[name] ??= { label, docLink: hasPage(docLink) ? docLink : null };
	}
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, '\t') + '\n');
console.log(`Wrote ${Object.keys(sorted).length} nodes to ${OUT}`);
