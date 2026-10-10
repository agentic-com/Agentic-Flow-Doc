/**
 * Turns an exported AWFlow workflow (.awf) into the read-only model <FlowPreview> draws
 * (awflow/Agentic-Flow#1336): steps grouped into layers in run order, attached dependencies
 * (models, memories, tools) folded into the step that uses them, and every node resolved to
 * its doc page.
 *
 * Node labels and doc links come from flow-node-map.json, generated from the app's node
 * definitions by scripts/examples/build-node-map.ts. Pure: no DOM, safe in SSR and islands.
 */
import NODE_MAP from './flow-node-map.json';

export type FlowFamily = 'trigger' | 'lambda' | 'inpage' | 'flow' | 'data' | 'core' | 'ai' | 'integration';

export const FLOW_FAMILY_LABELS: Record<FlowFamily, string> = {
	trigger: 'Trigger',
	lambda: 'Lambda',
	inpage: 'In-page action',
	flow: 'Flow',
	data: 'Data',
	core: 'Core',
	ai: 'AI',
	integration: 'Integration',
};

export interface FlowNodeInfo {
	/** Catalogue name of the node type, e.g. "Get All Text". */
	label: string;
	/** Doc page path, e.g. "/nodes/extension/getalltext/", or null when the docs have no page. */
	docLink: string | null;
	family: FlowFamily;
}

export interface FlowStep {
	id: string;
	/** Name the author gave this step (falls back to the node type's name). */
	name: string;
	/** Short second line: the node type when the author renamed it, else its family. */
	subtitle: string;
	family: FlowFamily;
	docLink: string | null;
	/** Author's note on the step, if any. */
	notes?: string;
	/** Branch that leads here, e.g. "true", "false", "Billing", "otherwise". */
	via?: string;
	/** Models, memories, parsers or tools plugged into this step. */
	attachments: { id: string; name: string; docLink: string | null }[];
}

export interface FlowModel {
	name: string;
	description?: string;
	/** Steps grouped by layer, in run order. A layer with several steps is a branch. */
	layers: FlowStep[][];
	/** All steps flattened in run order. */
	steps: FlowStep[];
	/** One-sentence summary for screen readers. */
	summary: string;
}

const MAP = NODE_MAP as Record<string, { label: string; docLink: string | null }>;

type Raw = Record<string, any>;
const isObj = (v: unknown): v is Raw => !!v && typeof v === 'object' && !Array.isArray(v);

function familyOf(nodeType: string | undefined, docLink: string | null): FlowFamily {
	const d = docLink ?? '';
	if (nodeType === 'trigger' || d.includes('/trigger/')) return 'trigger';
	if (d.includes('/lambda/')) return 'lambda';
	if (d.startsWith('/nodes/extension/')) return 'inpage';
	if (d.includes('/flow/')) return 'flow';
	if (d.includes('/datatransformation/')) return 'data';
	if (d.includes('/integration/')) return 'integration';
	if (d.includes('/ai/') || nodeType === 'agent' || nodeType === 'dependency') return 'ai';
	return 'core';
}

/** Resolve a node instance id (`af-base-node:basic:getAllTextNode`) to its label, doc page and family. */
export function resolveFlowNode(instanceId: string): FlowNodeInfo {
	const [, nodeType, ...rest] = instanceId.split(':');
	const name = rest.join(':') || instanceId;
	const hit = MAP[name];
	const fallbackLabel = name.replace(/Node$/, '').replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
	const docLink = hit?.docLink ?? null;
	return {
		label: hit?.label ?? fallbackLabel.charAt(0).toUpperCase() + fallbackLabel.slice(1),
		docLink,
		family: familyOf(nodeType, docLink),
	};
}

function branchLabel(sourceInstance: string, handle: string | undefined): string | undefined {
	if (!handle?.startsWith('output-')) return undefined;
	const port = handle.slice(7);
	if (port === '__fallback__') return 'otherwise';
	if (/:if$/.test(sourceInstance) || /:filter$/.test(sourceInstance)) return port === '0' ? 'true' : port === '1' ? 'false' : undefined;
	if (/^\d+$/.test(port)) return port === '0' ? undefined : `output ${Number(port) + 1}`;
	return port;
}

/** Throws a readable Error when the value is not a usable workflow. */
export function buildFlowModel(workflow: unknown): FlowModel {
	if (!isObj(workflow) || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges))
		throw new Error('This file is not an AWFlow workflow.');

	const nodes = (workflow.nodes as Raw[]).filter(
		(n) => isObj(n) && typeof n.id === 'string' && n.type !== 'stickyNote' && isObj(n.data) && isObj(n.data.instance),
	);
	const byId = new Map(nodes.map((n) => [n.id as string, n]));
	const edges = (workflow.edges as Raw[]).filter((e) => isObj(e) && byId.has(e.source) && byId.has(e.target));

	// Dependencies (dependency-N handles) attach to the step that uses them.
	const attachedTo = new Map<string, string[]>();
	const isAttachment = new Set<string>();
	for (const e of edges) {
		if (typeof e.sourceHandle === 'string' && e.sourceHandle.startsWith('dependency-')) {
			attachedTo.set(e.source, [...(attachedTo.get(e.source) ?? []), e.target]);
			isAttachment.add(e.target);
		}
	}
	const main = nodes.filter((n) => !isAttachment.has(n.id));
	const flowEdges = edges.filter(
		(e) => !(typeof e.sourceHandle === 'string' && e.sourceHandle.startsWith('dependency-')) && !isAttachment.has(e.target),
	);

	// Longest-path layering (Kahn). Nodes left over by a cycle go after the rest.
	const indeg = new Map(main.map((n) => [n.id as string, 0]));
	const out = new Map<string, Raw[]>();
	for (const e of flowEdges) {
		if (!indeg.has(e.target) || !indeg.has(e.source)) continue;
		indeg.set(e.target, indeg.get(e.target)! + 1);
		out.set(e.source, [...(out.get(e.source) ?? []), e]);
	}
	const layer = new Map<string, number>();
	const queue = main.filter((n) => indeg.get(n.id) === 0).map((n) => n.id as string);
	for (const id of queue) layer.set(id, 0);
	while (queue.length) {
		const id = queue.shift()!;
		for (const e of out.get(id) ?? []) {
			layer.set(e.target, Math.max(layer.get(e.target) ?? 0, layer.get(id)! + 1));
			indeg.set(e.target, indeg.get(e.target)! - 1);
			if (indeg.get(e.target) === 0) queue.push(e.target);
		}
	}
	const maxLayer = Math.max(-1, ...layer.values());
	for (const n of main) if (!layer.has(n.id)) layer.set(n.id, maxLayer + 1);

	// Branch label for each target, only when every way in is a named branch.
	const via = new Map<string, string>();
	for (const n of main) {
		const labels = flowEdges
			.filter((e) => e.target === n.id)
			.map((e) => branchLabel(byId.get(e.source)!.data.instance.id, e.sourceHandle));
		if (labels.length && labels.every(Boolean)) via.set(n.id, [...new Set(labels)].join(' / '));
	}

	const toStep = (n: Raw): FlowStep => {
		const info = resolveFlowNode(String(n.data.instance.id));
		const name = typeof n.data.label === 'string' && n.data.label.trim() ? n.data.label.trim() : info.label;
		const notes = isObj(n.data.parameters) && typeof n.data.parameters.notes === 'string' ? n.data.parameters.notes : undefined;
		return {
			id: n.id,
			name,
			subtitle: name.toLowerCase() === info.label.toLowerCase() ? FLOW_FAMILY_LABELS[info.family] : info.label,
			family: info.family,
			docLink: info.docLink,
			notes,
			via: via.get(n.id),
			attachments: (attachedTo.get(n.id) ?? []).map((aid) => {
				const a = byId.get(aid)!;
				const ai = resolveFlowNode(String(a.data.instance.id));
				return { id: aid, name: typeof a.data.label === 'string' && a.data.label.trim() ? a.data.label.trim() : ai.label, docLink: ai.docLink };
			}),
		};
	};

	// Order inside a layer: by the parents' order (keeps branches stable), then canvas y.
	const order = new Map<string, number>();
	const layers: FlowStep[][] = [];
	const count = Math.max(0, ...layer.values()) + 1;
	for (let i = 0; i < count; i++) {
		const inLayer = main.filter((n) => layer.get(n.id) === i);
		const parentRank = (id: string) => {
			const ranks = flowEdges.filter((e) => e.target === id && order.has(e.source)).map((e) => order.get(e.source)!);
			return ranks.length ? Math.min(...ranks) : 0;
		};
		inLayer.sort((a, b) => parentRank(a.id) - parentRank(b.id) || (a.position?.y ?? 0) - (b.position?.y ?? 0));
		inLayer.forEach((n, k) => order.set(n.id, k));
		if (inLayer.length) layers.push(inLayer.map(toStep));
	}

	const steps = layers.flat();
	const name = typeof workflow.name === 'string' && workflow.name.trim() ? workflow.name.trim() : 'Workflow';
	const branches = layers.filter((l) => l.length > 1).length;
	const summary =
		`${name}: a workflow with ${steps.length} step${steps.length === 1 ? '' : 's'}` +
		(steps[0] ? `, starting with ${steps[0].name}` : '') +
		(steps.length > 1 ? ` and ending with ${steps[steps.length - 1].name}` : '') +
		(branches ? `, with ${branches} branching point${branches === 1 ? '' : 's'}` : '') +
		'.';
	return {
		name,
		description: typeof workflow.description === 'string' ? workflow.description : undefined,
		layers,
		steps,
		summary,
	};
}
