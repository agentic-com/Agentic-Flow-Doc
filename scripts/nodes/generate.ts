/**
 * Node reference generator.
 *
 *   bun scripts/nodes/generate.ts           write src/data/nodes.json + refresh node pages
 *   bun scripts/nodes/generate.ts --check   exit 1 if anything is out of date or missing
 *
 * Reads the node definitions straight from the app (sibling `agentic-flow`
 * checkout, or AWFLOW_APP_DIR) and regenerates, for every registered node:
 *   - its entry in src/data/nodes.json
 *   - the AUTO blocks on its page ({/* AUTO:callout|tryit|settings|outputs|deps|recipes:start *\/} … end)
 *   - the generator-owned frontmatter keys (kind, section, worksIn, node)
 * Prose outside the AUTO markers is never touched.
 */
import './stubs.ts';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { extractNodes, type NodeDoc } from './extract.ts';
import { updatePage } from './page.ts';
import { findFiller } from './filler.mjs';
import type { RenderContext } from './render.ts';

const ROOT = resolve(import.meta.dir, '../..');
const DOCS = join(ROOT, 'src/content/docs');
const DATA = join(ROOT, 'src/data/nodes.json');
const check = process.argv.includes('--check');

function findApp(): string {
	const fromEnv = process.env.AWFLOW_APP_DIR;
	if (fromEnv) return resolve(fromEnv);
	let dir = ROOT;
	for (let i = 0; i < 8; i++) {
		const candidate = join(dir, '..', 'agentic-flow');
		if (existsSync(join(candidate, 'src/lib/Nodes-Blocks/nodesListing.ts'))) return resolve(candidate);
		dir = resolve(dir, '..');
	}
	throw new Error('Cannot find the agentic-flow app checkout. Set AWFLOW_APP_DIR.');
}

/** The page file for a node: src/content/docs/nodes/<id>.mdx (or .md). */
function pageFor(n: NodeDoc): string | undefined {
	for (const ext of ['.mdx', '.md']) {
		const p = join(DOCS, 'nodes', `${n.id}${ext}`);
		if (existsSync(p)) return p;
	}
	return undefined;
}

/** First existing page among candidate slugs (src/content/docs/<slug>.mdx|.md|/index.mdx). */
function pageExists(slug: string): boolean {
	return ['.mdx', '.md', '/index.mdx', '/index.md'].some((ext) => existsSync(join(DOCS, slug + ext)));
}

/** Connection page for a node's service, checked now so a rerun picks up pages added later. */
function connectionFor(n: NodeDoc): Pick<RenderContext, 'connectionHref' | 'connectionPage'> {
	const service = n.id.split('/').pop()!;
	if (pageExists(`app/connections/${service}`)) return { connectionHref: `/app/connections/${service}/`, connectionPage: true };
	const generic = pageExists('app/connections') ? '/app/connections/' : '/app/connections/create/';
	return { connectionHref: generic, connectionPage: false };
}

/** registryId → example files (public/examples/*.awf) that use it, smallest workflow first. */
function exampleIndex(): Map<string, string[]> {
	const dir = join(ROOT, 'public/examples');
	const byNode = new Map<string, { src: string; size: number }[]>();
	if (!existsSync(dir)) return new Map();
	for (const file of readdirSync(dir).filter((f) => f.endsWith('.awf')).sort()) {
		let wf: { nodes?: { type?: string; data?: { instance?: { id?: string } } }[] };
		try {
			wf = JSON.parse(readFileSync(join(dir, file), 'utf8'));
		} catch {
			continue;
		}
		const steps = (wf.nodes ?? []).filter((x) => x.type !== 'stickyNote');
		for (const id of new Set(steps.map((x) => x.data?.instance?.id).filter(Boolean) as string[])) {
			const list = byNode.get(id) ?? [];
			list.push({ src: `/examples/${file}`, size: steps.length });
			byNode.set(id, list);
		}
	}
	return new Map([...byNode].map(([k, v]) => [k, v.sort((a, b) => a.size - b.size || a.src.localeCompare(b.src)).map((x) => x.src)]));
}

type Recipe = { slug: string; href?: string; title: string; nodes?: string[]; level?: string; minutes?: number; setup?: string };

/** src/data/recipes.json (written by the recipes workstream); tolerated when absent. */
function loadRecipes(): Recipe[] {
	const file = join(ROOT, 'src/data/recipes.json');
	if (!existsSync(file)) return [];
	try {
		const data = JSON.parse(readFileSync(file, 'utf8'));
		const list = Array.isArray(data) ? data : Array.isArray(data?.recipes) ? data.recipes : [];
		return list.filter((r: Recipe) => r && typeof r.slug === 'string' && typeof r.title === 'string');
	} catch {
		return [];
	}
}

/** Recipes that use a node, matched by doc id, registry id or its last segment; only pages that exist. */
function recipesFor(n: NodeDoc, recipes: Recipe[]): RenderContext['recipes'] {
	const keys = new Set([n.id, n.registryId, n.id.split('/').pop()!, n.registryId.split(':').pop()!].map((k) => k.toLowerCase()));
	return recipes
		.filter((r) => (r.nodes ?? []).some((x) => keys.has(String(x).toLowerCase().replace(/^\/?nodes\//, '').replace(/\/$/, ''))))
		.map((r) => ({ r, path: (r.href ?? `/recipes/${r.slug}/`).replace(/^\/|\/$/g, '') }))
		.filter(({ path }) => pageExists(path))
		.map(({ r, path }) => ({ title: r.title, href: `/${path}/`, level: r.level, minutes: r.minutes, setup: r.setup }));
}

const app = findApp();
const nodes = await extractNodes(app);
const json = JSON.stringify(nodes, null, '\t') + '\n';

const problems: string[] = [];
let written = 0;

const currentJson = existsSync(DATA) ? readFileSync(DATA, 'utf8') : '';
if (currentJson !== json) {
	if (check) problems.push('src/data/nodes.json is out of date');
	else {
		mkdirSync(dirname(DATA), { recursive: true });
		writeFileSync(DATA, json);
		written++;
	}
}

const examples = exampleIndex();
const recipes = loadRecipes();

for (const n of nodes) {
	const page = pageFor(n);
	if (!page) {
		problems.push(`missing page for ${n.name}: ${n.docLink} (expected src/content/docs/nodes/${n.id}.mdx)`);
		continue;
	}
	if (!page.endsWith('.mdx')) {
		problems.push(`${page.slice(ROOT.length + 1)} must be .mdx to hold AUTO blocks`);
		continue;
	}
	const src = readFileSync(page, 'utf8');
	const ctx: RenderContext = {
		...connectionFor(n),
		example: examples.get(n.registryId)?.[0],
		recipes: recipesFor(n, recipes)
	};
	const next = updatePage(src, n, ctx);
	if (next !== src) {
		if (check) problems.push(`${page.slice(ROOT.length + 1)} is out of date`);
		else {
			writeFileSync(page, next);
			written++;
		}
	}
}

// Placeholder text from the first docs pass must never ship (#1338).
for (const hit of findFiller(join(DOCS, 'nodes'))) problems.push(`placeholder text in ${hit.slice(ROOT.length + 1)}`);

if (check) {
	if (problems.length) {
		console.error(`Node reference drift (${problems.length}):\n  - ${problems.join('\n  - ')}`);
		console.error('\nRun `bun scripts/nodes/generate.ts` to refresh.');
		process.exit(1);
	}
	console.log(`Node reference up to date (${nodes.length} nodes).`);
} else {
	for (const p of problems) console.error(`! ${p}`);
	console.log(`${nodes.length} nodes, ${written} file(s) updated.`);
	if (problems.length) process.exit(1);
}
