/**
 * Renders the generated parts of a node page (AUTO blocks + frontmatter) from a NodeDoc
 * (template v2, awflow/Agentic-Flow#1338). Blocks render AWFlow components with their data
 * inlined as props, so the page works without any lookup at build time:
 *
 *   callout   credential callout, end of the intro         <AwfCallout>
 *   tryit     "Try it" section                               <AwfFlowPreview>
 *   settings  "Inputs and settings"                          <AwfOperationTabs> / <AwfParamTable>
 *   outputs   "Outputs"                                      <AwfOutputPorts> + fields + sample item
 *   deps      "Dependencies and credentials"                 <AwfParamTable> of slots
 *   recipes   "Recipes with this node"                       <AwfRecipeCard>
 *
 * Components are imported under an `Awf` alias so hand-written imports never collide.
 */
import type { NodeDoc, SettingField, SettingsVariant } from './extract.ts';

export const SECTION_ORDER = [
	'Try it',
	'What it does',
	'When to use it',
	'Inputs and settings',
	'Outputs',
	'Dependencies and credentials',
	'Example workflow',
	'Common issues',
	'Recipes with this node',
	'Related nodes'
] as const;
export type SectionName = (typeof SECTION_ORDER)[number];

/** Old heading → template v2 heading. */
export const RENAMED_SECTIONS: Record<string, SectionName> = {
	Troubleshooting: 'Common issues'
};

/** The import lines the AUTO blocks need. Each ends with the marker so reruns can find them. */
export const IMPORT_MARKER = '// AUTO:imports';
export const IMPORT_LINES = [
	`import { Callout as AwfCallout, OperationTabs as AwfOperationTabs, OutputPorts as AwfOutputPorts, ParamTable as AwfParamTable, RecipeCard as AwfRecipeCard } from '@components/awflow'; ${IMPORT_MARKER}`,
	`import AwfFlowPreview from '@components/awflow/FlowPreview.astro'; ${IMPORT_MARKER}`
];

/** Context the generator resolves from the file system (so a rerun picks up new pages). */
export type RenderContext = {
	/** Href of the connection page for this node's service, or the generic one. */
	connectionHref: string;
	/** True when a per-service connection page exists. */
	connectionPage: boolean;
	/** Site path of an example that uses the node, e.g. /examples/x.awf. */
	example?: string;
	recipes: { title: string; href: string; level?: string; minutes?: number; setup?: string }[];
};

/** Escape text for Markdown prose, leaving `code spans` alone. */
export function mdx(text: string): string {
	return text
		.split(/(`[^`]*`)/)
		.map((part, i) => {
			if (i % 2 === 1) return part;
			return part
				.replace(/\\/g, '\\\\')
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

/** Plain text for component props (rendered as text, not Markdown). */
const plain = (s: string) => s.replace(/`/g, '').replace(/\s+/g, ' ').trim();

/** A JSX attribute value holding JSON data. */
const prop = (v: unknown) => `{${JSON.stringify(v)}}`;

export type Row = { name: string; type?: string; required?: boolean; default?: string; description?: string };

function formatDefault(f: SettingField): string | undefined {
	if (f.default === undefined) return undefined;
	if (f.options) {
		const opt = f.options.find((o) => o.value === String(f.default));
		if (opt) return plain(opt.label);
	}
	if (typeof f.default === 'boolean') return f.default ? 'On' : 'Off';
	if (typeof f.default === 'string') return f.default === '' ? undefined : f.default;
	if (typeof f.default === 'number') return String(f.default);
	return JSON.stringify(f.default);
}

function describe(f: SettingField): string | undefined {
	const parts: string[] = [];
	if (f.description) parts.push(plain(f.description).replace(/\.?$/, '.'));
	if (f.options?.length && f.options.length <= 12) parts.push(`Options: ${f.options.map((o) => plain(o.label)).join(', ')}.`);
	else if (f.options?.length) parts.push(`${f.options.length} options.`);
	return parts.length ? parts.join(' ') : undefined;
}

function row(f: SettingField): Row {
	const r: Row = { name: f.group ? `${plain(f.group)} › ${plain(f.label)}` : plain(f.label), type: f.type };
	if (f.required) r.required = true;
	const d = formatDefault(f);
	if (d !== undefined) r.default = d;
	const desc = describe(f);
	if (desc) r.description = desc;
	return r;
}

type TabOption = { label: string; rows: Row[] };
type TabGroup = { label?: string; options: TabOption[] };

const whenText = (v: SettingsVariant) => v.when.map((w) => plain(w.valueLabel)).join(' → ');

/** Operations grouped by resource, each with its own settings. */
function operationGroups(n: NodeDoc): TabGroup[] {
	const variants = n.variants?.fields ?? [];
	if (n.operations?.length) {
		return n.operations.map((g) => ({
			label: g.resourceLabel ? plain(g.resourceLabel) : undefined,
			options: g.operations.map((o) => {
				const v =
					variants.find(
						(x) => x.when.some((w) => w.value === o.value) && (!g.resource || x.when.some((w) => w.value === g.resource))
					) ?? variants.find((x) => x.when.at(-1)?.valueLabel === o.label && (!g.resourceLabel || x.when[0]?.valueLabel === g.resourceLabel));
				return { label: plain(o.label), rows: (v?.fields ?? []).map(row) };
			})
		}));
	}
	// Variants without declared operations: group by the first choice when there are two.
	const groups = new Map<string, TabGroup>();
	for (const v of variants) {
		const two = v.when.length >= 2;
		const key = two ? plain(v.when[0].valueLabel) : '';
		const label = two ? v.when.slice(1).map((w) => plain(w.valueLabel)).join(' → ') : whenText(v);
		if (!groups.has(key)) groups.set(key, { label: key || undefined, options: [] });
		groups.get(key)!.options.push({ label, rows: v.fields.map(row) });
	}
	return [...groups.values()];
}

export function renderSettings(n: NodeDoc): string {
	const out: string[] = [];
	const common = n.settings;

	if (n.variants || n.operations?.length) {
		const keys = n.variants?.fields[0]?.when.map((w) => plain(w.label)) ?? ['Operation'];
		out.push(
			`<AwfOperationTabs client:visible pick=${prop(keys.join(' and '))} common=${prop(common.map(row))} groups=${prop(operationGroups(n))} />`
		);
	} else if (common.length) {
		out.push(`<AwfParamTable rows=${prop(common.map(row))} />`);
	} else {
		out.push('This node has no settings.');
	}

	// A single field whose sub-form changes with a choice (e.g. Schedule's rule).
	for (const f of n.settings.filter((x) => x.variants?.length)) {
		const key = f.variants![0].when.map((w) => plain(w.label)).join(' and ');
		const groups: TabGroup[] = [{ options: f.variants!.map((v) => ({ label: whenText(v), rows: v.fields.map(row) })) }];
		out.push(
			'',
			`**${mdx(f.label)}** changes shape with its **${mdx(key)}** choice:`,
			'',
			`<AwfOperationTabs client:visible pick=${prop(key)} groups=${prop(groups)} />`
		);
	}
	return out.join('\n').trim();
}

/** Integration pages: what to do when the operation you need is missing. */
export function renderFallback(n: NodeDoc): string {
	if (n.family !== 'integration' || n.id.endsWith('/custom-api')) return '';
	return [
		`<AwfCallout type="tip" title="Need an operation that isn't listed?" href="/nodes/builtin/core/http-request/" linkLabel="Use HTTP Request">`,
		`  Call the ${mdx(n.name)} API yourself with the HTTP Request node, and pick the same connection in its **Credential** field.`,
		`</AwfCallout>`
	].join('\n');
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

/** A plausible value for an output field of a given type, for the sample item. */
function sampleValue(type: string): unknown {
	const always = type.match(/^Always (.+)$/);
	if (always) {
		try {
			return JSON.parse(always[1]);
		} catch {
			return always[1];
		}
	}
	switch (type) {
		case 'Number':
			return 0;
		case 'True/false':
			return true;
		case 'List':
		case 'List of entries':
			return [];
		case 'Object':
		case 'Key-value pairs':
			return {};
		case 'Any':
			return null;
		default:
			return '…';
	}
}

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
			out.push('');
			for (const [slot, nodes] of bySlot) out.push(`- **${mdx(slot)}** slot of ${nodes.join(', ')}`);
		}
	} else if (!ports.length) {
		out.push('This node has no output port: nothing runs after it on this branch.');
	} else {
		out.push(`<AwfOutputPorts ports=${prop(ports.map((p) => ({ name: plain(p.label) })))} />`);
		if (n.outputs.dynamic) out.push('', 'More ports appear as you add them in the settings (one per rule).');
	}

	// `routed` is the engine's envelope for multi-port nodes, not something you read.
	const fields = (n.outputFields ?? []).filter((f) => !(n.outputFields!.length === 1 && f.name === 'routed'));
	if (fields.length) {
		const lead = n.outputShape === 'list' ? 'Each run returns a list of items with these fields:' : 'Each output item has these fields:';
		const rows: Row[] = fields.map((f) => {
			const r: Row = { name: f.name, type: f.type };
			if (f.description) r.description = plain(f.description);
			return r;
		});
		const sample = Object.fromEntries(fields.map((f) => [f.name, sampleValue(f.type)]));
		const json = JSON.stringify(n.outputShape === 'list' ? [sample] : sample, null, 2);
		out.push(
			'',
			lead,
			'',
			`<AwfParamTable nameLabel="Field" descriptionLabel="What it holds" rows=${prop(rows)} />`,
			'',
			'```json title="Shape of an output item"',
			json,
			'```'
		);
	}
	return out.join('\n').trim();
}

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

/** Short service name for a node, e.g. "Chat OpenAI" → "OpenAI". */
function serviceName(n: NodeDoc): string {
	return n.name.replace(/^(Chat|Embeddings)\s+/i, '').replace(/\s+(Chat Model|Embeddings|Tool)$/i, '');
}

export function renderCallout(n: NodeDoc, ctx: RenderContext): string {
	const c = n.credentials[0];
	if (!c) return '';
	const service = serviceName(n);
	const title = c.required ? `Needs ${article(service)} ${service} connection` : `Can use ${article(service)} ${service} connection`;
	const how = c.authType ? ` It signs in with ${article(c.authType)} ${c.authType}.` : '';
	const body = c.required
		? `Pick a saved connection in the **${mdx(c.label)}** field, or create one from there.${how}`
		: `Optional: pick a saved connection in the **${mdx(c.label)}** field when the service needs one.${how}`;
	const linkLabel = ctx.connectionPage ? `Connect ${service}` : 'Create a connection';
	return [`<AwfCallout type="credential" title=${prop(title)} href="${ctx.connectionHref}" linkLabel=${prop(linkLabel)}>`, `  ${body}`, '</AwfCallout>'].join('\n');
}

export function renderDeps(n: NodeDoc, ctx: RenderContext): string {
	const out: string[] = [];
	for (const c of n.credentials) {
		out.push(
			`- **${mdx(c.label)}** (connection${c.authType ? `, ${mdx(c.authType)}` : ''}): ${c.required ? 'required' : 'optional'}. See [${ctx.connectionPage ? `Connect ${mdx(serviceName(n))}` : 'Create a connection'}](${ctx.connectionHref}).`
		);
	}
	if (n.dependencies.length) {
		if (out.length) out.push('');
		const rows: Row[] = n.dependencies.map((d) => {
			const conns = d.multiple ? 'Several nodes can plug in.' : d.max && d.max > 1 ? `Up to ${d.max} nodes.` : 'One node.';
			const r: Row = { name: plain(d.label), type: d.accepts.map(depType).join(', '), description: conns };
			if (d.required) r.required = true;
			return r;
		});
		out.push(`<AwfParamTable nameLabel="Slot" typeLabel="Accepts" descriptionLabel="Connections" rows=${prop(rows)} />`);
	}
	if (!out.length) out.push('None. This node needs no connection and has no slots for other nodes.');
	return out.join('\n').trim();
}

export function renderTryIt(_n: NodeDoc, ctx: RenderContext): string {
	if (!ctx.example) return '';
	return `<AwfFlowPreview src="${ctx.example}" />`;
}

export function renderRecipes(_n: NodeDoc, ctx: RenderContext): string {
	if (!ctx.recipes.length) return '';
	const cards = ctx.recipes.map((r) => {
		const attrs = [`title=${prop(r.title)}`, `href="${r.href}"`];
		if (r.level) attrs.push(`level=${prop(r.level)}`);
		if (r.minutes) attrs.push(`minutes={${Number(r.minutes)}}`);
		if (r.setup) attrs.push(`setup=${prop(r.setup)}`);
		return `<AwfRecipeCard ${attrs.join(' ')} />`;
	});
	return cards.join('\n');
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
