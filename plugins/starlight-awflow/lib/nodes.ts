import type { AwflowNodeFamily, AwflowNodeMeta } from '../types';

export const FAMILY_LABELS: Record<AwflowNodeFamily, string> = {
	trigger: 'Trigger',
	lambda: 'Lambda',
	inpage: 'In-page action',
	flow: 'Flow',
	data: 'Data',
	core: 'Core',
	ai: 'AI',
	integration: 'Integration',
};

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * nodes.json is produced by another workstream (#1313) and its exact shape is not frozen.
 * Accept an array, `{ nodes: [...] }`, or a record keyed by id, and look entries up by `id`,
 * `docId`, `slug` or `docLink`.
 */
export function findNodeEntry(data: unknown, id: string): Raw | undefined {
	if (!data) return undefined;
	let list: Raw[] = [];
	if (Array.isArray(data)) list = data.filter(isObj);
	else if (isObj(data) && Array.isArray(data.nodes)) list = data.nodes.filter(isObj);
	else if (isObj(data)) {
		const direct = data[id];
		if (isObj(direct)) return direct;
		list = Object.entries(data)
			.filter(([, v]) => isObj(v))
			.map(([k, v]) => ({ id: k, ...(v as Raw) }));
	}
	const norm = (s: unknown) => (typeof s === 'string' ? s.replace(/^\/|\/$/g, '').toLowerCase() : '');
	const want = norm(id);
	return list.find((n) =>
		[n.id, n.docId, n.slug, n.docLink].some((k) => {
			const v = norm(k);
			return v === want || v.endsWith('/' + want);
		}),
	);
}

const count = (v: unknown): number | undefined =>
	typeof v === 'number' ? v : Array.isArray(v) ? v.length : isObj(v) ? Object.keys(v).length : undefined;

/** nodes.json groups operations by resource ({ resource, operations: [...] }); count the operations. */
const countOperations = (v: unknown): number | undefined => {
	if (!Array.isArray(v)) return count(v);
	const grouped = v.every((g) => isObj(g) && Array.isArray(g.operations));
	return grouped ? v.reduce((n, g) => n + (g.operations as unknown[]).length, 0) : v.length;
};

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);

export function normaliseNode(
	front: { id: string; family?: AwflowNodeFamily; agentTool?: boolean; deprecated?: boolean; since?: string },
	worksIn: ('extension' | 'web')[] | undefined,
	entry: Raw | undefined,
): AwflowNodeMeta {
	const e = entry ?? {};
	const family = (front.family ?? (str(e.family) as AwflowNodeFamily | undefined)) as AwflowNodeFamily | undefined;
	const credential = e.credentials ?? e.credential ?? e.needs;
	const needs = Array.isArray(credential)
		? credential.map((c) => (isObj(c) ? str(c.label) ?? str(c.name) : str(c))).filter(Boolean).join(', ') || undefined
		: isObj(credential)
			? str(credential.label) ?? str(credential.name)
			: str(credential);
	const entryWorksIn = Array.isArray(e.worksIn) ? (e.worksIn as ('extension' | 'web')[]) : undefined;
	return {
		id: front.id,
		family,
		familyLabel: family ? FAMILY_LABELS[family] : undefined,
		agentTool: front.agentTool ?? (typeof e.agentTool === 'boolean' ? e.agentTool : undefined),
		deprecated: front.deprecated ?? (typeof e.deprecated === 'boolean' ? e.deprecated : undefined),
		since: front.since ?? str(e.since),
		worksIn: worksIn ?? entryWorksIn,
		icon: str(e.icon),
		needs,
		operations: countOperations(e.operations),
		outputs: count(e.outputs ?? e.ports),
		data: entry,
	};
}
