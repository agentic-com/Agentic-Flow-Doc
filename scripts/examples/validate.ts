/**
 * Validates every example workflow in public/examples/ (awflow/Agentic-Flow#1336).
 *
 *   bun scripts/examples/validate.ts [file.awf ...]
 *
 * Three layers, all must pass:
 *  1. Import schema — the app's own `ExportedWorkflowSchema` (what "Open in AWFlow" and a file
 *     import use). Loaded from the app repo when it is checked out next to the docs
 *     (AWFLOW_APP_DIR, default ../agentic-flow) and its dependencies are installed; otherwise a
 *     faithful copy below (keep it in sync with src/lib/schemas/{workflow/workflow,node,edge}.ts).
 *  2. Graph structure — the same registry-driven checks as the app's awfValidateCore.ts and the
 *     marketplace validator: known node ids, node.type == nodeType, edge ends and handles,
 *     blanked credential/resetOnPublish fields listed in requiredInputs, no embedded secrets.
 *     Uses scripts/examples/registry.json (refresh it from the app: `bun run registry:dump`).
 *  3. Docs fit — every node resolves in src/data/flow-node-map.json (so <FlowPreview> can label
 *     and link it), and no example depends on a Knowledge Base (it would not import cleanly).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { z } from 'astro/zod';

const ROOT = resolve(import.meta.dir, '../..');
const EXAMPLES = join(ROOT, 'public/examples');
const APP = resolve(process.env.AWFLOW_APP_DIR ?? join(ROOT, '../agentic-flow'));

type Schema = { safeParse: (v: unknown) => { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } } };

// ---------- 1 · import schema ----------

/** Faithful copy of the app's ExportedWorkflowSchema (zod v4), used when the app is not available. */
function fallbackSchema(): Schema {
	const node = z.object({
		id: z.string(),
		position: z.object({ x: z.number(), y: z.number() }),
		data: z.record(z.string(), z.any()),
		type: z.string().optional(),
		hidden: z.boolean().optional(),
		draggable: z.boolean().optional(),
		deletable: z.boolean().optional(),
		parentId: z.string().optional(),
		expandParent: z.boolean().optional(),
		ariaLabel: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
	});
	const edge = z.object({
		id: z.string(),
		type: z.string().optional(),
		animated: z.boolean().optional(),
		source: z.string(),
		target: z.string(),
		hidden: z.boolean().optional(),
		data: z.record(z.string(), z.any()).optional(),
		ariaLabel: z.string().optional(),
		label: z.string().optional(),
		sourceHandle: z.string().optional(),
		targetHandle: z.string().optional(),
	});
	return z.object({
		name: z.string().max(120),
		description: z.string().max(1000).optional(),
		tags: z.array(z.string().max(40)).max(20).optional(),
		type: z.enum(['triggered', 'lambda']).default('triggered'),
		status: z.enum(['active', 'inactive']).optional(),
		visibility: z.enum(['private', 'team', 'public']).optional(),
		installedFrom: z.string().nullish(),
		// The app validates the full permission manifest; examples never ship one.
		permissionManifest: z.null().optional(),
		basedOn: z.object({ listingId: z.string(), name: z.string(), author: z.string().nullable() }).nullish(),
		nodes: z.array(node),
		edges: z.array(edge),
		requiredInputs: z.array(z.object({ nodeId: z.string(), field: z.string() })).optional(),
		minExtensionVersion: z.string().optional(),
	});
}

async function loadSchema(): Promise<{ schema: Schema; source: string }> {
	const file = join(APP, 'src/lib/schemas/workflow/workflow.ts');
	if (existsSync(file) && existsSync(join(APP, 'node_modules'))) {
		try {
			const mod = (await import(file)) as { ExportedWorkflowSchema?: Schema };
			if (mod.ExportedWorkflowSchema) return { schema: mod.ExportedWorkflowSchema, source: `app (${relative(ROOT, file)})` };
		} catch (e) {
			console.warn(`! Could not load the app schema (${(e as Error).message.split('\n')[0]}); using the built-in copy.`);
		}
	}
	return { schema: fallbackSchema(), source: 'built-in copy' };
}

// ---------- 2 · graph structure (port of the app's awfValidateCore.ts) ----------

interface NodeManifest {
	nodeType: string;
	outPorts: string[] | null;
	outCount: number;
	deps: string[];
	inCount: number;
	credentialPaths: string[];
	resetPaths: string[];
}
const REGISTRY = JSON.parse(readFileSync(join(import.meta.dir, 'registry.json'), 'utf8')) as {
	nodeCount: number;
	nodes: Record<string, NodeManifest>;
};
const DYNAMIC_OUT = new Set(['af-base-node:basic:switch']);
const SECRETS: [RegExp, string][] = [
	[/xox[baprs]-[0-9A-Za-z-]{10,}/, 'Slack token'],
	[/ghp_[0-9A-Za-z]{20,}/, 'GitHub PAT'],
	[/github_pat_[0-9A-Za-z_]{20,}/, 'GitHub fine-grained PAT'],
	[/sk-[0-9A-Za-z]{20,}/, 'OpenAI-style key'],
	[/AIza[0-9A-Za-z_-]{30,}/, 'Google API key'],
	[/\b[0-9]{8,10}:[A-Za-z0-9_-]{30,}\b/, 'Telegram bot token'],
	[/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, 'JWT'],
];

const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object' && !Array.isArray(x);
const getPath = (o: unknown, p: string) => p.split('.').reduce<unknown>((a, k) => (isObj(a) ? a[k] : undefined), o);

function scanSecrets(v: unknown, path: string, err: (m: string) => void) {
	if (typeof v === 'string') for (const [re, label] of SECRETS) re.test(v) && err(`embedded secret (${label}) at ${path}`);
	else if (Array.isArray(v)) v.forEach((x, i) => scanSecrets(x, `${path}[${i}]`, err));
	else if (isObj(v)) for (const [k, x] of Object.entries(v)) scanSecrets(x, `${path}.${k}`, err);
}

function checkGraph(wf: any, err: (m: string) => void, warn: (m: string) => void) {
	const required = new Map<string, Set<string>>();
	for (const r of wf.requiredInputs ?? []) {
		if (!required.has(r.nodeId)) required.set(r.nodeId, new Set());
		required.get(r.nodeId)!.add(r.field);
	}
	const ids = new Set<string>();
	let triggers = 0;
	for (const n of wf.nodes) {
		if (ids.has(n.id)) err(`node ${n.id}: duplicate id`);
		ids.add(n.id);
		if (n.type === 'stickyNote') continue;
		const instId = n.data?.instance?.id;
		const m = REGISTRY.nodes[instId];
		if (!m) {
			err(`node ${n.id}: unknown instance id ${instId}`);
			continue;
		}
		if (n.type !== m.nodeType) err(`node ${n.id}: type "${n.type}" != nodeType "${m.nodeType}"`);
		if (m.nodeType === 'trigger') triggers++;
		for (const path of [...m.credentialPaths, ...m.resetPaths]) {
			const v = getPath(n.data.inputs ?? {}, path);
			if (v === undefined) continue;
			if (v !== '' && v !== null) err(`node ${n.id}: "${path}" must be blank in a shared example`);
			else if (!required.get(n.id)?.has(path.split('.').pop()!)) warn(`node ${n.id}: blank "${path}" should be in requiredInputs`);
		}
	}
	if (wf.type === 'triggered' && triggers === 0) err('a "triggered" workflow needs a trigger node');

	const byId = new Map<string, any>(wf.nodes.map((n: any) => [n.id, n]));
	for (const e of wf.edges) {
		if (!ids.has(e.source)) err(`edge ${e.id}: source "${e.source}" is not a node`);
		if (!ids.has(e.target)) err(`edge ${e.id}: target "${e.target}" is not a node`);
		const srcId = byId.get(e.source)?.data?.instance?.id;
		const src = REGISTRY.nodes[srcId];
		if (e.sourceHandle && src) {
			const h: string = e.sourceHandle;
			if (h.startsWith('dependency-')) {
				const i = Number(h.slice(11));
				if (!(i >= 0 && i < src.deps.length)) err(`edge ${e.id}: ${h} but node has ${src.deps.length} dependency port(s)`);
			} else if (h.startsWith('output-')) {
				const pid = h.slice(7);
				const ok = DYNAMIC_OUT.has(srcId)
					? pid.length > 0
					: src.outPorts
						? src.outPorts.includes(pid)
						: Number.isInteger(Number(pid)) && Number(pid) < src.outCount;
				if (!ok) err(`edge ${e.id}: invalid output handle ${h}`);
			} else err(`edge ${e.id}: sourceHandle "${h}" must be output-<port> or dependency-<n>`);
		}
		const tgt = REGISTRY.nodes[byId.get(e.target)?.data?.instance?.id];
		if (e.targetHandle && tgt) {
			const th = String(e.targetHandle);
			const i = Number(th.slice(6));
			if (!(th.startsWith('input-') && i >= 0 && i < tgt.inCount)) err(`edge ${e.id}: targetHandle ${th} but ${tgt.inCount} input port(s)`);
		}
	}
	for (const r of wf.requiredInputs ?? []) if (!ids.has(r.nodeId)) err(`requiredInputs: "${r.nodeId}" is not a node`);
	scanSecrets(wf, 'workflow', err);
}

// ---------- 3 · docs fit ----------

const NODE_MAP = JSON.parse(readFileSync(join(ROOT, 'src/data/flow-node-map.json'), 'utf8')) as Record<string, unknown>;
const KNOWLEDGE = /knowledge/i;

function checkDocs(wf: any, err: (m: string) => void) {
	for (const n of wf.nodes) {
		if (n.type === 'stickyNote') continue;
		const id: string = n.data?.instance?.id ?? '';
		if (!NODE_MAP[id.split(':').pop()!]) err(`node ${n.id}: ${id} is missing from src/data/flow-node-map.json (run build-node-map.ts)`);
		if (KNOWLEDGE.test(id) || JSON.stringify(n.data?.inputs ?? {}).match(/"knowledge(Id|BaseId)"\s*:/))
			err(`node ${n.id}: examples must not depend on a Knowledge Base`);
	}
}

// ---------- main ----------

const files = process.argv.slice(2).length
	? process.argv.slice(2).map((f) => resolve(f))
	: readdirSync(EXAMPLES)
			.filter((f) => f.endsWith('.awf'))
			.sort()
			.map((f) => join(EXAMPLES, f));

const { schema, source } = await loadSchema();
console.log(`Import schema: ${source} · registry: ${REGISTRY.nodeCount} nodes\n`);

let errors = 0;
let warnings = 0;
for (const file of files) {
	const rel = relative(ROOT, file);
	const errs: string[] = [];
	const warns: string[] = [];
	let wf: any;
	try {
		wf = JSON.parse(readFileSync(file, 'utf8'));
	} catch (e) {
		errs.push(`invalid JSON: ${(e as Error).message}`);
	}
	if (wf) {
		const parsed = schema.safeParse(wf);
		if (!parsed.success) for (const i of parsed.error?.issues ?? []) errs.push(`schema: ${i.path.join('.') || '(root)'} ${i.message}`);
		else {
			checkGraph(wf, (m) => errs.push(m), (m) => warns.push(m));
			checkDocs(wf, (m) => errs.push(m));
		}
	}
	errors += errs.length;
	warnings += warns.length;
	console.log(`${errs.length ? '✗' : warns.length ? '⚠' : '✓'} ${rel}`);
	for (const m of errs) console.log(`    ERROR ${m}`);
	for (const m of warns) console.log(`    warn  ${m}`);
}
console.log(`\n${files.length} file(s), ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
