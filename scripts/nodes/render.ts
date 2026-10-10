/**
 * Renders the generated parts of a node page (AUTO blocks + frontmatter) from
 * a NodeDoc. Everything here is plain Markdown so it works in any .mdx page.
 */
import type { NodeDoc, SettingField, SettingsVariant } from './extract.ts';

export const SECTION_ORDER = [
	'What it does',
	'When to use it',
	'Inputs and settings',
	'Outputs',
	'Dependencies and credentials',
	'Example workflow',
	'Troubleshooting',
	'Related nodes'
] as const;

/** Which AUTO block lives in which section. */
export const BLOCK_SECTION: Record<string, (typeof SECTION_ORDER)[number]> = {
	settings: 'Inputs and settings',
	outputs: 'Outputs',
	deps: 'Dependencies and credentials'
};

/** Escape text for an MDX table cell, leaving `code spans` alone. */
export function mdx(text: string): string {
	return text
		.split(/(`[^`]*`)/)
		.map((part, i) => {
			if (i % 2 === 1) return part.replace(/\|/g, '\\|');
			return part
				.replace(/\\/g, '\\\\')
				.replace(/\|/g, '\\|')
				.replace(/\{/g, '\\{')
				.replace(/\}/g, '\\}')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\[/g, '\\[')
				.replace(/\]/g, '\\]')
				.replace(/\*/g, '\\*')
				.replace(/_/g, '\\_');
		})
		.join('');
}

const code = (v: string) => '`' + v.replace(/`/g, "'") + '`';

function formatDefault(f: SettingField): string {
	if (f.default === undefined) return '';
	if (f.options) {
		const opt = f.options.find((o) => o.value === String(f.default));
		if (opt) return mdx(opt.label);
	}
	if (typeof f.default === 'boolean') return f.default ? 'On' : 'Off';
	if (typeof f.default === 'string') return f.default === '' ? '' : code(f.default);
	if (typeof f.default === 'number') return String(f.default);
	return code(JSON.stringify(f.default));
}

function describe(f: SettingField): string {
	const parts: string[] = [];
	if (f.description) parts.push(mdx(f.description.replace(/\.?$/, '.')));
	if (f.options?.length && f.options.length <= 12) {
		parts.push(`Options: ${f.options.map((o) => mdx(o.label)).join(', ')}.`);
	} else if (f.options?.length) {
		parts.push(`${f.options.length} options.`);
	}
	return parts.join(' ');
}

function settingsTable(fields: SettingField[]): string[] {
	const rows = fields.map((f) => {
		const label = f.group ? `${mdx(f.group)} › **${mdx(f.label)}**` : `**${mdx(f.label)}**`;
		return `| ${label} | ${mdx(f.type)} | ${formatDefault(f)} | ${f.required ? 'Yes' : 'No'} | ${describe(f)} |`;
	});
	return ['| Setting | Type | Default | Required | Description |', '| --- | --- | --- | --- | --- |', ...rows];
}

const whenText = (v: SettingsVariant) => v.when.map((w) => mdx(w.valueLabel)).join(' → ');

function variantTables(variants: SettingsVariant[], intro: (v: SettingsVariant) => string): string[] {
	const out: string[] = [];
	for (const v of variants) {
		out.push('', intro(v), '');
		if (v.fields.length) out.push(...settingsTable(v.fields));
		else out.push('No further settings.');
	}
	return out;
}

export function renderSettings(n: NodeDoc): string {
	const out: string[] = [];
	const common = n.settings;
	const fieldVariants = common.filter((f) => f.variants?.length);

	if (!common.length && !n.variants) {
		out.push('This node has no settings.');
	} else if (common.length) {
		out.push(...settingsTable(common));
	}

	for (const f of fieldVariants) {
		const key = f.variants![0].when.map((w) => mdx(w.label)).join(' / ');
		out.push(
			'',
			`**${mdx(f.label)}** changes shape with its **${key}** choice${f.variants!.length ? ` (${f.variants!.map((v) => whenText(v)).join(', ')})` : ''}:`
		);
		out.push(...variantTables(f.variants!, (v) => `*${mdx(f.label)} — ${key}: ${whenText(v)}*`));
	}

	if (n.variants) {
		const keys = n.variants.fields[0]?.when.map((w) => w.label) ?? [];
		const pick = keys.length ? keys.map((k) => `**${mdx(k)}**`).join(' and ') : 'the form';
		out.push('', `Pick ${pick} first; the fields below change with your choice.`);
		out.push(...variantTables(n.variants.fields, (v) => `**${whenText(v)}**`));
	}
	return out.join('\n').trim();
}

export function renderOperations(n: NodeDoc): string {
	if (!n.operations?.length) return '';
	const rows = n.operations.map((g) =>
		`| ${g.resourceLabel ? mdx(g.resourceLabel) : '—'} | ${g.operations.map((o) => mdx(o.label)).join(', ')} |`
	);
	return ['| Resource | Operations |', '| --- | --- |', ...rows].join('\n');
}

const DEP_TYPE_LABEL: Record<string, string> = {
	model: 'chat model',
	memory: 'chat memory',
	tools: 'tools',
	embeddings: 'embeddings',
	outputParser: 'output parser',
	textSplitter: 'text splitter',
	vectorStore: 'vector store'
};
const depType = (t: string) => DEP_TYPE_LABEL[t] ?? t.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

export function renderOutputs(n: NodeDoc): string {
	const out: string[] = [];
	const ports = n.outputs.ports;
	if (n.isDependency && !ports.length) {
		const targets = n.plugsInto ?? [];
		out.push('This node has no output port. It plugs into a slot on another node instead of passing items along.');
		if (targets.length) {
			const bySlot = new Map<string, string[]>();
			for (const t of targets) {
				const list = bySlot.get(t.slot) ?? [];
				list.push(`[${mdx(t.node)}](/nodes/${t.nodeId}/)`);
				bySlot.set(t.slot, list);
			}
			out.push('', '| Slot | Accepted by |', '| --- | --- |');
			for (const [slot, nodes] of bySlot) out.push(`| ${mdx(slot)} | ${nodes.join(', ')} |`);
		}
	} else if (!ports.length) {
		out.push('This node has no output port: nothing runs after it on this branch.');
	} else if (ports.length === 1 && !n.outputs.dynamic && /^(Output|Kept)$/.test(ports[0].label)) {
		out.push(`One output port${ports[0].label === 'Kept' ? ', **Kept**' : ''}.`);
	} else {
		out.push(
			`${ports.length === 1 ? 'One output port' : `${ports.length} output ports`}: ${ports.map((p) => `**${mdx(p.label)}**`).join(', ')}.`
		);
		if (n.outputs.dynamic) out.push('', 'More ports appear as you add them in the settings (one per rule).');
	}

	// `routed` is the engine's envelope for multi-port nodes, not something you read.
	const fields = (n.outputFields ?? []).filter((f) => !(n.outputFields!.length === 1 && f.name === 'routed'));
	const lead = n.outputShape === 'list' ? 'Each run returns a list of items with' : 'Each output item has';
	if (fields.some((f) => f.description)) {
		out.push(
			'',
			`${lead} these fields:`,
			'',
			'| Field | Type | Description |',
			'| --- | --- | --- |',
			...fields.map((f) => `| ${code(f.name)} | ${mdx(f.type)} | ${f.description ? mdx(f.description) : ''} |`)
		);
	} else if (fields.length) {
		out.push('', `${lead} the fields ${fields.map((f) => `${code(f.name)} (${mdx(f.type.startsWith("Always") ? "a" + f.type.slice(1) : f.type.toLowerCase())})`).join(', ')}.`);
	}
	return out.join('\n').trim();
}

export function renderDeps(n: NodeDoc): string {
	const out: string[] = [];
	if (n.credentials.length) {
		for (const c of n.credentials) {
			out.push(
				`- **${mdx(c.label)}** (credential${c.authType ? `, ${mdx(c.authType)}` : ''}): ${c.required ? 'required' : 'optional'}. Pick a saved connection or create one from this field.`
			);
		}
	}
	if (n.dependencies.length) {
		if (out.length) out.push('');
		out.push('| Slot | Accepts | Required | Connections |', '| --- | --- | --- | --- |');
		for (const d of n.dependencies) {
			const conns = d.multiple ? 'Several' : d.max === 1 || !d.max ? 'One' : String(d.max);
			out.push(`| **${mdx(d.label)}** | ${d.accepts.map(depType).map(mdx).join(', ')} | ${d.required ? 'Yes' : 'No'} | ${conns} |`);
		}
	}
	if (!out.length) out.push('None. This node needs no credential and has no slots for other nodes.');
	return out.join('\n').trim();
}

export function renderBlock(name: string, body: string): string {
	return `{/* AUTO:${name}:start */}\n${body}\n{/* AUTO:${name}:end */}`;
}

/** Frontmatter keys owned by the generator. */
export function frontmatterFor(n: NodeDoc): string {
	const lines = ['kind: node', 'section: nodes', `worksIn: [${n.worksIn.join(', ')}]`, 'node:', `  id: ${n.id}`, `  family: ${n.family}`];
	if (n.agentTool) lines.push('  agentTool: true');
	if (n.deprecated) lines.push('  deprecated: true');
	if (n.since) lines.push(`  since: "${n.since}"`);
	return lines.join('\n');
}
