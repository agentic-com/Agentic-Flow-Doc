/**
 * Slim catalog entries for <NodeCatalog> (awflow/Agentic-Flow#1337), derived at build time from
 * nodes.json (generated from the app's node registry by scripts/nodes/generate.ts) and
 * integration-groups.json. Only these fields reach the browser, not the whole nodes.json.
 */
import NODES from './nodes.json';
import GROUPS from './integration-groups.json';
import { groupIntegrations, newestMinor } from '../../scripts/nodes/shared.mjs';

export type CatalogFamily = 'trigger' | 'inpage' | 'flow' | 'data' | 'core' | 'ai' | 'integration' | 'lambda';
export type CatalogNeeds = 'none' | 'connection' | 'on-device';

export interface CatalogNode {
	id: string;
	name: string;
	href: string;
	family: CatalogFamily;
	description: string;
	web: boolean;
	needs: CatalogNeeds;
	agentTool: boolean;
	isNew: boolean;
	deprecated: boolean;
	/** Operations as "Resource · Operation", for the text filter and the count. */
	ops: string[];
	/** Integration use-case group id. */
	group?: string;
}

export interface CatalogGroup {
	id: string;
	label: string;
}

type RawNode = {
	id: string;
	docLink: string;
	name: string;
	family: CatalogFamily;
	description?: string;
	worksIn: string[];
	credentials: { required: boolean }[];
	agentTool?: boolean;
	deprecated?: boolean;
	since?: string;
	operations?: { resourceLabel?: string; operations: { label: string }[] }[];
};

/** Models and AI tasks that run on the reader's own machine (browser or local server). */
const ON_DEVICE = /\/localai\/|\/(chrome-ai|localclassifier|localqamodel|transformerschat|wbellm|localembeddings|ollama|ollamaembeddings)$/;

const nodes = NODES as unknown as RawNode[];

export function catalogNodes(): CatalogNode[] {
	const latest = newestMinor(nodes);
	const groupOf = new Map<string, string>();
	for (const g of groupIntegrations(nodes, GROUPS)) for (const id of g.nodes) groupOf.set(id, g.id);
	return nodes.map((n) => ({
		id: n.id,
		name: n.name,
		href: n.docLink,
		family: n.family,
		description: n.description ?? '',
		web: n.worksIn.includes('web'),
		needs: ON_DEVICE.test(n.id) ? 'on-device' : n.credentials.some((c) => c.required) ? 'connection' : 'none',
		agentTool: !!n.agentTool,
		isNew: !!latest && !!n.since?.startsWith(latest + '.'),
		deprecated: !!n.deprecated,
		ops: (n.operations ?? []).flatMap((g) => g.operations.map((o) => (g.resourceLabel ? `${g.resourceLabel} · ${o.label}` : o.label))),
		...(groupOf.has(n.id) ? { group: groupOf.get(n.id) } : {}),
	}));
}

export function catalogGroups(): CatalogGroup[] {
	return (GROUPS as { groups: CatalogGroup[] }).groups.map(({ id, label }) => ({ id, label }));
}
