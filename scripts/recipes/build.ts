/**
 * Builds src/data/recipes.json from the recipe pages and their workflows (awflow/Agentic-Flow#1342).
 *
 *   bun run recipes:build
 *
 * For every src/content/docs/recipes/**\/*.mdx with `kind: recipe`, reads the `recipe` frontmatter
 * and the .awf it points at, then records:
 *  - the card data the Recipes index filters on (goal, level, minutes, setup, apps);
 *  - the nodes the workflow uses (registry ids, read by node pages for "Recipes with this node");
 *  - "You'll need" (extension, connections, on-device model) from the workflow's requiredInputs;
 *  - "It touches", derived the way the app derives a marketplace listing's permission manifest
 *    (agentic-flow src/lib/security/permissionManifest.ts: runtime → capability, NODE_CAPABILITY,
 *    NODE_HOSTS, URL extraction from persisted config). Keep the tables below in sync with it.
 *
 * Fails (exit 1) when a recipe has no workflow, or when scripts/examples/validate.ts rejects it.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, resolve, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { YAML } from 'bun';

const ROOT = resolve(import.meta.dir, '../..');
const RECIPES_DIR = join(ROOT, 'src/content/docs/recipes');
const OUT = join(ROOT, 'src/data/recipes.json');

interface NodeEntry {
	registryId: string;
	name: string;
	docLink: string;
	family: string;
	runtime: string;
	worksIn: string[];
	credentials: { key: string; label: string }[];
}
const NODES = new Map<string, NodeEntry>(
	(JSON.parse(readFileSync(join(ROOT, 'src/data/nodes.json'), 'utf8')) as NodeEntry[]).map((n) => [n.registryId, n]),
);
const NODE_MAP = JSON.parse(readFileSync(join(ROOT, 'src/data/flow-node-map.json'), 'utf8')) as Record<
	string,
	{ label: string; docLink: string | null }
>;

// ---------- permission manifest (port of the app's permissionManifest.ts) ----------

type Capability = 'code-execution' | 'network' | 'page-read' | 'page-write' | 'local-file' | 'clipboard' | 'storage' | 'credentials';

const RUNTIME_CAPABILITY: Record<string, Capability | undefined> = {
	extension: 'page-read',
	external: 'network',
	backend: 'network',
	client: undefined,
};

const NODE_CAPABILITY: Record<string, Capability[]> = {
	code: ['code-execution'],
	httpRequest: ['network'],
	getHTMLFromLinkNode: ['network'],
	getAllTextFromLinkNode: ['network'],
	getImagesFromLinkNode: ['network'],
	getLinksFromLinkNode: ['network'],
	customApi: ['network'],
	hubspot: ['network'],
	raindrop: ['network'],
	trello: ['network'],
	pushNotification: ['network'],
	baserowNocoDB: ['network'],
	supabase: ['network'],
	obsidian: ['network'],
	pollUntil: ['network'],
	rssFeedRead: ['network'],
	urlDocumentLoaderNode: ['network'],
	'mcp-client-tool': ['network'],
	'http-request-tool': ['network'],
	'web-search': ['network'],
	searchNode: ['network'],
	'wikipedia-query': ['network'],
	showNotificationNode: ['network'],
	browserNotificationNode: ['network'],
	'chat-anthropic': ['network'],
	'chat-openai': ['network'],
	'chat-google': ['network'],
	'chat-groq': ['network'],
	'chat-mistral': ['network'],
	'chat-openrouter': ['network'],
	'chat-deepseek': ['network'],
	'chat-xai': ['network'],
	'chat-azure-openai': ['network'],
	ollama: ['network'],
	ollamaEmbeddings: ['network'],
	'openai-embeddings': ['network'],
	'huggingface-embeddings': ['network'],
	'voyage-embeddings': ['network'],
	'cohere-embeddings': ['network'],
	'google-embeddings': ['network'],
	downloadAsFile: ['local-file'],
	saveAsFile: ['local-file'],
	localFileReadNode: ['local-file'],
	clipboardWriteNode: ['clipboard'],
	dataStore: ['storage'],
	submitFormNode: ['page-write'],
	formFillNode: ['page-write'],
	uiAutomationNode: ['page-write'],
	deleteUIElementsNode: ['page-write'],
	setElementAttributeStyleNode: ['page-write'],
	tabControlNode: ['page-write', 'network'],
	'browser-tool': ['page-read', 'page-write'],
};

const SEARCH_ENGINE_HOSTS: Record<string, string> = {
	duckduckgo: 'html.duckduckgo.com',
	bing: 'www.bing.com',
	brave: 'search.brave.com',
};
type HostSet = { hosts: string[]; dynamic: boolean };
const fixed = (...hosts: string[]) => (): HostSet => ({ hosts, dynamic: false });
const cfg = (inputs: Record<string, unknown>, f: string) =>
	typeof inputs[f] === 'string' && (inputs[f] as string).trim() ? (inputs[f] as string).trim() : undefined;
const NODE_HOSTS: Record<string, (inputs: Record<string, unknown>) => HostSet> = {
	'chat-anthropic': fixed('api.anthropic.com'),
	'chat-openai': fixed('api.openai.com'),
	'openai-embeddings': fixed('api.openai.com'),
	'chat-google': (i) => fixed(cfg(i, 'platformType') === 'gcp' ? 'aiplatform.googleapis.com' : 'generativelanguage.googleapis.com')(),
	'google-embeddings': fixed('generativelanguage.googleapis.com'),
	'chat-groq': fixed('api.groq.com'),
	'chat-mistral': fixed('api.mistral.ai'),
	'chat-openrouter': fixed('openrouter.ai'),
	'chat-deepseek': fixed('api.deepseek.com'),
	'chat-xai': fixed('api.x.ai'),
	'chat-azure-openai': (i) => {
		const inst = cfg(i, 'instanceName');
		if (!inst) return { hosts: [], dynamic: false };
		if (inst.includes('{{')) return { hosts: [], dynamic: true };
		return { hosts: [`${inst.toLowerCase()}.openai.azure.com`], dynamic: false };
	},
	ollama: fixed('localhost'),
	ollamaEmbeddings: fixed('localhost'),
	'huggingface-embeddings': fixed('router.huggingface.co'),
	'voyage-embeddings': fixed('api.voyageai.com'),
	'cohere-embeddings': fixed('api.cohere.ai'),
	'wikipedia-query': fixed('en.wikipedia.org'),
	'web-search': (i) => fixed(SEARCH_ENGINE_HOSTS[cfg(i, 'engine') ?? 'duckduckgo'] ?? 'html.duckduckgo.com')(),
	searchNode: (i) => fixed(SEARCH_ENGINE_HOSTS[cfg(i, 'engine') ?? 'duckduckgo'] ?? 'html.duckduckgo.com')(),
	'http-request-tool': () => ({ hosts: [], dynamic: true }),
};

function extractHosts(v: unknown, depth = 0, acc: HostSet = { hosts: [], dynamic: false }): HostSet {
	if (depth > 6 || v == null) return acc;
	if (typeof v === 'string') {
		if (v.includes('{{')) acc.dynamic = true;
		else {
			try {
				const u = new URL(v);
				if ((u.protocol === 'http:' || u.protocol === 'https:') && !acc.hosts.includes(u.hostname.toLowerCase()))
					acc.hosts.push(u.hostname.toLowerCase());
			} catch {
				/* not an absolute URL */
			}
		}
	} else if (Array.isArray(v)) v.forEach((x) => extractHosts(x, depth + 1, acc));
	else if (typeof v === 'object') Object.values(v as object).forEach((x) => extractHosts(x, depth + 1, acc));
	return acc;
}

/** Hosted-model / local-model node names, to say which model a recipe talks to. */
const LOCAL_MODELS = new Set(['webLLM', 'tfjs', 'transformers-chat', 'transformersChat']);

// ---------- recipes ----------

interface Frontmatter {
	title: string;
	description?: string;
	kind?: string;
	recipe?: {
		goal: string;
		level: 'beginner' | 'intermediate' | 'advanced';
		minutes: number;
		setup: 'none' | 'connection' | 'on-device';
		apps?: string[];
		awf?: string;
		marketplaceId?: string;
	};
}

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(f) ? [p] : [];
	});
}

function frontmatter(file: string): Frontmatter | null {
	const m = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
	return m ? (YAML.parse(m[1]) as Frontmatter) : null;
}

const errors: string[] = [];
const recipes = [];
const awfFiles: string[] = [];

for (const file of walk(RECIPES_DIR).sort()) {
	const fm = frontmatter(file);
	if (fm?.kind !== 'recipe') continue;
	const rel = relative(ROOT, file);
	const r = fm.recipe;
	if (!r) {
		errors.push(`${rel}: kind: recipe needs a \`recipe:\` block`);
		continue;
	}
	if (!r.awf) {
		errors.push(`${rel}: recipe.awf is missing`);
		continue;
	}
	const awfPath = join(ROOT, 'public', r.awf);
	let wf: any;
	try {
		wf = JSON.parse(readFileSync(awfPath, 'utf8'));
	} catch (e) {
		errors.push(`${rel}: cannot read ${r.awf} (${(e as Error).message})`);
		continue;
	}
	awfFiles.push(awfPath);

	const href = '/' + relative(join(ROOT, 'src/content/docs'), file).replace(/\.mdx?$/, '').replace(/\/index$/, '') + '/';
	const slug = basename(file).replace(/\.mdx?$/, '');

	const caps = new Set<Capability>();
	const domains = new Set<string>();
	let dynamic = false;
	const apps = new Map<string, string>();
	const models: string[] = [];
	const graph: {
		id: string;
		label: string;
		registryId: string;
		type: string;
		family: string;
		/** Model, memory, parser or tool plugged into another step (not a step of its own). */
		attachment: boolean;
		docLink: string | null;
	}[] = [];
	const nodeIds = new Set<string>();
	let extension = false;

	for (const n of wf.nodes ?? []) {
		if (n.type === 'stickyNote') continue;
		const registryId: string = n.data?.instance?.id ?? '';
		const name = registryId.split(':').pop()!;
		const entry = NODES.get(registryId);
		const mapped = NODE_MAP[name];
		const inputs = (n.data?.inputs ?? {}) as Record<string, unknown>;
		nodeIds.add(registryId);
		graph.push({
			id: n.id,
			label: n.data?.label ?? mapped?.label ?? name,
			registryId,
			type: mapped?.label ?? entry?.name ?? name,
			family: entry?.family ?? 'core',
			attachment: registryId.includes(':dependency:'),
			docLink: mapped?.docLink ?? entry?.docLink ?? null,
		});
		if (entry && !entry.worksIn.includes('web')) extension = true;

		const runtime = entry?.runtime ?? 'client';
		const bound = (entry?.credentials ?? []).some((c) => typeof inputs[c.key] === 'string' && (inputs[c.key] as string).length > 0);
		const nodeCaps = new Set<Capability>();
		const base = RUNTIME_CAPABILITY[runtime];
		if (base) nodeCaps.add(base);
		for (const c of NODE_CAPABILITY[name] ?? []) nodeCaps.add(c);
		if (bound) nodeCaps.add('credentials');
		nodeCaps.forEach((c) => caps.add(c));
		if (nodeCaps.has('network')) {
			const h = extractHosts(inputs);
			for (const x of NODE_HOSTS[name]?.(inputs).hosts ?? []) h.hosts.push(x);
			if (NODE_HOSTS[name]?.(inputs).dynamic) h.dynamic = true;
			h.hosts.forEach((x) => domains.add(x));
			if (h.dynamic) dynamic = true;
		}
		// "Apps" = the touches panel's FlowApps, limited to integrations (not every networked utility).
		if (entry?.family === 'integration' && (bound || nodeCaps.has('network') || entry.credentials.length))
			apps.set(name, entry.name);
		if (LOCAL_MODELS.has(name)) models.push('An on-device model');
		else if (name.startsWith('chat-') || name === 'ollama') models.push(entry?.name ?? name);
	}

	// "You'll need": the extension, each connection, each on-device model the import leaves blank.
	const needs: { label: string; href?: string }[] = [];
	if (extension) needs.push({ label: 'The AWFlow browser extension', href: '/get-started/install/' });
	for (const req of wf.requiredInputs ?? []) {
		const node = graph.find((g) => g.id === req.nodeId);
		if (!node) continue;
		if (req.field === 'credential' || req.field === 'credentials') {
			needs.push({ label: `A connection to ${node.type}`, href: node.docLink ?? undefined });
		} else if (req.field === 'model') {
			needs.push({ label: 'An on-device model, downloaded once', href: '/app/local-models/' });
		} else {
			needs.push({ label: `${node.label}: set ${req.field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, href: node.docLink ?? undefined });
		}
	}

	recipes.push({
		slug,
		href,
		title: fm.title,
		description: fm.description ?? '',
		goal: r.goal,
		level: r.level,
		minutes: r.minutes,
		setup: r.setup,
		apps: r.apps ?? [...apps.values()],
		nodes: [...nodeIds],
		awf: r.awf,
		marketplaceId: r.marketplaceId ?? null,
		graph,
		needs,
		touches: {
			capabilities: [...caps].sort(),
			domains: [...domains].sort(),
			dynamic,
			apps: [...apps.values()].sort(),
			models: [...new Set(models)],
		},
	});
}

// Every recipe workflow must pass the examples validator (import schema, graph, docs fit).
if (awfFiles.length) {
	const res = spawnSync('bun', [join(ROOT, 'scripts/examples/validate.ts'), ...awfFiles], { cwd: ROOT, encoding: 'utf8' });
	if (res.status !== 0) errors.push(`workflow validation failed:\n${res.stdout}${res.stderr}`);
}

if (errors.length) {
	console.error(`✗ recipes:build\n  ${errors.join('\n  ')}`);
	process.exit(1);
}

const slugs = new Set<string>();
for (const r of recipes) {
	if (slugs.has(r.slug)) {
		console.error(`✗ duplicate recipe slug "${r.slug}"`);
		process.exit(1);
	}
	slugs.add(r.slug);
}

writeFileSync(OUT, JSON.stringify(recipes, null, '\t') + '\n');
console.log(`✓ ${recipes.length} recipe(s) → ${relative(ROOT, OUT)}`);
