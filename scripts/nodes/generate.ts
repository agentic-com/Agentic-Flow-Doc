/**
 * Node reference generator.
 *
 *   bun scripts/nodes/generate.ts           write src/data/nodes.json + refresh node pages
 *   bun scripts/nodes/generate.ts --check   exit 1 if anything is out of date or missing
 *
 * Reads the node definitions straight from the app (sibling `agentic-flow`
 * checkout, or AWFLOW_APP_DIR) and regenerates, for every registered node:
 *   - its entry in src/data/nodes.json
 *   - the AUTO blocks on its page ({/* AUTO:settings|outputs|deps:start *\/} … end)
 *   - the generator-owned frontmatter keys (kind, section, worksIn, node)
 * Prose outside the AUTO markers is never touched.
 */
import './stubs.ts';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { extractNodes, type NodeDoc } from './extract.ts';
import { updatePage } from './page.ts';

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
	const next = updatePage(src, n);
	if (next !== src) {
		if (check) problems.push(`${page.slice(ROOT.length + 1)} is out of date`);
		else {
			writeFileSync(page, next);
			written++;
		}
	}
}

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
