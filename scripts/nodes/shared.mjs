// @ts-check
/**
 * Pure helpers shared by the Nodes sidebar (astro.config.mjs → sidebar.mjs) and the catalog
 * (src/data/nodeCatalog.ts). No file access, so they also run inside the site bundle.
 */

/**
 * Major.minor of the newest `since` among all nodes: nodes added in that release count as new.
 * @param {{ since?: string }[]} nodes
 */
export function newestMinor(nodes) {
	/** @type {[number, number][]} */
	const minors = [];
	for (const n of nodes) {
		const m = n.since?.match(/^(\d+)\.(\d+)/);
		if (m) minors.push([Number(m[1]), Number(m[2])]);
	}
	if (!minors.length) return undefined;
	minors.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
	return `${minors[0][0]}.${minors[0][1]}`;
}

/**
 * Integration nodes by use case, from integration-groups.json. Integrations missing from the
 * file land in "Other", so a new node never disappears; deprecated ones are left out.
 * @param {{ id: string; family: string; deprecated?: boolean }[]} nodes
 * @param {{ groups: { id: string; label: string; nodes: string[] }[] } | undefined} data
 */
export function groupIntegrations(nodes, data) {
	const integrations = nodes.filter((n) => n.family === 'integration' && !n.deprecated);
	const known = new Set(integrations.map((n) => n.id));
	const groups = (data?.groups ?? []).map((g) => ({ id: g.id, label: g.label, nodes: g.nodes.filter((id) => known.has(id)) }));
	const listed = new Set(groups.flatMap((g) => g.nodes));
	const rest = integrations.filter((n) => !listed.has(n.id)).map((n) => n.id);
	if (rest.length) {
		const other = groups.find((g) => g.id === 'other');
		if (other) other.nodes.push(...rest);
		else groups.push({ id: 'other', label: 'Other', nodes: rest });
	}
	return groups.filter((g) => g.nodes.length);
}
