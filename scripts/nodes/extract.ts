/**
 * Reads the app's node registry and turns every registered node into plain,
 * serialisable reference data (see NodeDoc below).
 *
 * It mirrors what the node settings panel shows: a field's label is its
 * `title` (or the capitalised key), it is required unless it is optional or
 * has a default, `hidden` fields are skipped, and resource/operation unions
 * are expanded through the node's own `pickSchema`, exactly like the panel.
 */

export type Family = 'trigger' | 'lambda' | 'inpage' | 'flow' | 'data' | 'core' | 'ai' | 'integration';
export type WorksIn = 'extension' | 'web';

export type SettingField = {
	key: string;
	label: string;
	/** Parent label(s) for fields nested in an object or list item. */
	group?: string;
	type: string;
	required: boolean;
	default?: unknown;
	options?: { value: string; label: string }[];
	description?: string;
	/** For a field whose form changes with a choice inside it (e.g. a schedule rule's interval). */
	variants?: SettingsVariant[];
};

export type SettingsVariant = {
	/** Discriminator values that select this variant, e.g. resource + operation. */
	when: { key: string; label: string; value: string; valueLabel: string }[];
	fields: SettingField[];
};

export type OutputField = { name: string; type: string; description?: string };

export type NodeDoc = {
	id: string;
	docLink: string;
	registryId: string;
	name: string;
	family: Family;
	category: string;
	nodeType: string;
	description?: string;
	worksIn: WorksIn[];
	runtime: string;
	since?: string;
	deprecated?: boolean;
	agentTool?: boolean;
	isDependency?: boolean;
	dependencyType?: string;
	/** For dependency nodes: the nodes that accept them, by slot. */
	plugsInto?: { node: string; nodeId: string; slot: string }[];
	credentials: { key: string; label: string; authType?: string; required: boolean }[];
	dependencies: {
		name: string;
		label: string;
		required: boolean;
		multiple: boolean;
		accepts: string[];
		max?: number;
	}[];
	settings: SettingField[];
	variants?: { key: string; fields: SettingsVariant[] };
	operations?: { resource?: string; resourceLabel?: string; operations: { value: string; label: string }[] }[];
	inputs: number;
	outputs: { ports: { id: string; label: string }[]; dynamic?: boolean };
	outputFields?: OutputField[];
	outputShape?: 'object' | 'list' | 'value';
};

type AnySchema = Record<string, any>;

const GROUP_FAMILY: Record<string, Family> = {
	Triggers: 'trigger',
	Trigger: 'trigger',
	Lambda: 'lambda',
	'In Page Action': 'inpage',
	Flow: 'flow',
	'Data Transformation': 'data',
	Core: 'core',
	AI: 'ai',
	Integrations: 'integration',
	Integration: 'integration'
};

function familyFor(groupName: string, groupLabel: string, docLink: string): Family {
	if (GROUP_FAMILY[groupName]) return GROUP_FAMILY[groupName];
	if (GROUP_FAMILY[groupLabel]) return GROUP_FAMILY[groupLabel];
	const n = `${groupName} ${groupLabel}`.toLowerCase();
	if (n.includes('trigger')) return 'trigger';
	if (n.includes('lambda')) return 'lambda';
	if (n.includes('page') || docLink.startsWith('/nodes/extension/')) return 'inpage';
	if (n.includes('flow')) return 'flow';
	if (n.includes('data')) return 'data';
	if (n.includes('core')) return 'core';
	if (n.includes('ai')) return 'ai';
	if (n.includes('integration')) return 'integration';
	throw new Error(`Unknown node group "${groupName}" / "${groupLabel}"`);
}

/** The docs tree already groups nodes by family; prefer it over the palette group. */
function familyFromDocLink(docLink: string): Family | undefined {
	const slug = slugFromDocLink(docLink);
	if (slug.startsWith('extension/')) return 'inpage';
	const seg = slug.split('/')[1];
	const map: Record<string, Family> = {
		trigger: 'trigger',
		lambda: 'lambda',
		flow: 'flow',
		datatransformation: 'data',
		core: 'core',
		ai: 'ai',
		integration: 'integration'
	};
	return seg ? map[seg] : undefined;
}

/** Port labels drawn by dedicated canvas components rather than declared on the node. */
const CANVAS_PORT_LABELS: Record<string, string[]> = {
	loop: ['Done', 'Loop'],
	filter: ['Kept']
};

// ---------------------------------------------------------------- zod helpers

const def = (s: AnySchema | undefined) => (s?._zod?.def ?? s?._def ?? {}) as AnySchema;
const kind = (s: AnySchema | undefined): string => def(s).type ?? 'unknown';
function metaOf(s: AnySchema | undefined): AnySchema | undefined {
	if (!s || typeof s.meta !== 'function') return undefined;
	try {
		return s.meta() as AnySchema | undefined;
	} catch {
		return undefined;
	}
}

/** Same peeling as the settings panel's unwrapFieldSchema. */
function unwrap(s: AnySchema | undefined) {
	let inner = s;
	let optional = false;
	let dflt: unknown = undefined;
	let meta = metaOf(s);
	const wrappers = new Set(['optional', 'default', 'nullable', 'prefault', 'readonly', 'catch', 'nonoptional']);
	let guard = 0;
	while (inner && wrappers.has(kind(inner)) && guard++ < 20) {
		const k = kind(inner);
		if (k === 'optional' || k === 'default' || k === 'prefault') optional = true;
		if ((k === 'default' || k === 'prefault') && dflt === undefined) {
			try {
				dflt = def(inner).defaultValue;
				if (typeof dflt === 'function') dflt = (dflt as () => unknown)();
			} catch {
				/* ignore */
			}
		}
		inner = def(inner).innerType;
		meta ??= metaOf(inner);
	}
	// zod pipes (e.g. .transform) render as their input side
	if (inner && kind(inner) === 'pipe') {
		const pipeIn = def(inner).in;
		meta ??= metaOf(pipeIn);
		const u = unwrap(pipeIn);
		return { inner: u.inner, optional: optional || u.optional, dflt: dflt ?? u.dflt, meta: meta ?? u.meta };
	}
	return { inner, optional, dflt, meta };
}

function shapeOf(s: AnySchema | undefined): Record<string, AnySchema> | undefined {
	if (!s || kind(s) !== 'object') return undefined;
	const shape = s.shape ?? def(s).shape;
	return typeof shape === 'function' ? shape() : shape;
}

function enumOptions(inner: AnySchema, meta?: AnySchema) {
	const d = def(inner);
	let values: unknown[] = [];
	if (kind(inner) === 'enum') values = Object.values(d.entries ?? {});
	else if (kind(inner) === 'literal') values = d.values ?? [];
	const map = (meta?.enumDataMap ?? {}) as Record<string, { label?: string }>;
	return values.map((v) => ({ value: String(v), label: map[String(v)]?.label ?? String(v) }));
}

const TYPE_LABEL: Record<string, string> = {
	ifConditions: 'Conditions',
	uiActions: 'Page actions',
	uiActionsRecorder: 'Recorded page actions',
	tags: 'Tags',
	outputFieldsDefinition: 'Field list',
	inputFieldsDefinition: 'Field list',
	code: 'Code',
	credential: 'Credential',
	memory: 'Memory picker',
	knowledge: 'Knowledge base picker',
	ollamaModel: 'Model picker',
	webllmModel: 'Model picker',
	localModel: 'Model picker',
	mediaInput: 'Media',
	datetime: 'Date and time',
	markdown: 'Markdown',
	autocomplete: 'Choice (loaded from your account)',
	dynamicSchema: 'Field list',
	urlWithPermission: 'URL',
	domAttribute: 'Page element',
	keysMap: 'Key mapping',
	workflowSelect: 'Workflow picker'
};

function typeLabel(inner: AnySchema | undefined, meta?: AnySchema): string {
	if (meta?.type && TYPE_LABEL[meta.type]) return TYPE_LABEL[meta.type];
	if (meta?.type === 'enum') return meta?.multiSelectable ? 'Multiple choice' : 'Choice';
	switch (kind(inner)) {
		case 'string':
			return meta?.useTextArea ? 'Long text' : 'Text';
		case 'number':
		case 'int':
		case 'bigint':
			return 'Number';
		case 'boolean':
			return 'Toggle';
		case 'enum':
		case 'literal':
			return meta?.multiSelectable ? 'Multiple choice' : 'Choice';
		case 'array': {
			const el = unwrap(def(inner).element).inner;
			if (kind(el) === 'enum') return 'Multiple choice';
			if (kind(el) === 'object') return 'List of entries';
			return 'List';
		}
		case 'object':
			return 'Group';
		case 'record':
			return 'Key-value pairs';
		case 'date':
			return 'Date';
		case 'union':
			return 'One of several shapes';
		case 'file':
			return 'File';
		case 'custom':
			return 'File';
		default:
			return 'Value';
	}
}

const cleanText = (t: unknown): string | undefined => {
	if (typeof t !== 'string') return undefined;
	const s = t
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	return s || undefined;
};

function normaliseDefault(v: unknown): unknown {
	if (v === undefined || v === null) return undefined;
	if (typeof v === 'function') return undefined;
	if (v instanceof Date) return undefined;
	if (typeof v === 'object') {
		try {
			const json = JSON.stringify(v);
			if (json === '{}' || json === '[]') return undefined;
			return json.length > 80 ? undefined : v;
		} catch {
			return undefined;
		}
	}
	return v;
}

/** Flatten an object schema into the rows the settings panel renders. */
async function fieldsOf(
	obj: AnySchema | undefined,
	opts: { skip?: Set<string>; group?: string; depth?: number; parentRequired?: boolean } = {}
): Promise<SettingField[]> {
	const shape = shapeOf(obj);
	if (!shape) return [];
	const out: SettingField[] = [];
	const parentRequired = opts.parentRequired ?? true;
	for (const [key, raw] of Object.entries(shape)) {
		if (opts.skip?.has(key)) continue;
		const { inner, optional, dflt, meta } = unwrap(raw);
		if (meta?.hidden) continue;
		const label = (typeof meta?.title === 'string' && meta.title) || key.charAt(0).toUpperCase() + key.slice(1);
		const field: SettingField = {
			key,
			label,
			type: typeLabel(inner, meta),
			// A field inside an optional group is only needed once you use the group.
			required: !optional && parentRequired
		};
		if (opts.group) field.group = opts.group;
		const d = normaliseDefault(dflt ?? meta?.defaultValue);
		if (d !== undefined) field.default = d;
		const k = kind(inner);
		if (k === 'enum' || k === 'literal') field.options = enumOptions(inner!, meta);
		if (k === 'array') {
			const el = unwrap(def(inner).element);
			if (kind(el.inner) === 'enum') field.options = enumOptions(el.inner!, el.meta ?? meta);
		}
		const description = cleanText(meta?.description) ?? cleanText(meta?.tooltip) ?? cleanText(raw?.description);
		if (description) field.description = description;
		out.push(field);

		// Nested groups render their own labelled inputs in the panel.
		const depth = opts.depth ?? 0;
		if (depth < 2 && !meta?.type) {
			const childGroup = opts.group ? `${opts.group} › ${label}` : label;
			const childRequired = field.required;
			if (k === 'object') out.push(...(await fieldsOf(inner, { group: childGroup, depth: depth + 1, parentRequired: childRequired })));
			if (k === 'union') {
				const v = await expandUnion(inner!, meta, undefined, undefined, []);
				if (v.length > 1) field.variants = v;
			}
			if (k === 'array') {
				const el = unwrap(def(inner).element);
				if (kind(el.inner) === 'object')
					out.push(...(await fieldsOf(el.inner, { group: `${childGroup} (each entry)`, depth: depth + 1, parentRequired: true })));
				if (kind(el.inner) === 'union') {
					const v = await expandUnion(el.inner!, el.meta, undefined, undefined, []);
					if (v.length > 1) field.variants = v;
				}
			}
		}
	}
	return out;
}

/** Field names the settings panel uses to switch between operation forms. */
const DISCRIMINATORS = new Set(['resource', 'operation', 'provider']);

/** Keys shared by every union option whose value is a choice — the discriminators. */
function discriminatorKeys(options: AnySchema[]): string[] {
	const shapes = options.map(shapeOf);
	if (shapes.some((s) => !s)) return [];
	const shared = Object.keys(shapes[0]!).filter((k) =>
		shapes.every((s) => {
			const f = s![k];
			if (!f) return false;
			const kk = kind(unwrap(f).inner);
			return kk === 'enum' || kk === 'literal';
		})
	);
	const named = shared.filter((k) => DISCRIMINATORS.has(k));
	if (named.length) return named;
	// Otherwise the panel switches forms on the first shared choice (e.g. Trigger Interval).
	return shared.length && Object.keys(shapes[0]!)[0] === shared[0] ? [shared[0]] : [];
}

async function expandUnion(
	union: AnySchema,
	meta: AnySchema | undefined,
	isValid: ((combo: Record<string, string>) => boolean) | undefined,
	ordered: Record<string, string>[] | undefined,
	warnings: string[]
): Promise<SettingsVariant[]> {
	const unreachable: AnySchema[] = [];
	const options = (def(union).options ?? []) as AnySchema[];
	const keys = discriminatorKeys(options);
	const pick = meta?.pickSchema as ((d: Record<string, string>) => Promise<AnySchema> | AnySchema) | undefined;
	const variants: SettingsVariant[] = [];
	const seen = new Set<AnySchema>();

	const describeWhen = (schema: AnySchema, combo: Record<string, string>) =>
		keys.map((k) => {
			const u = unwrap(shapeOf(schema)![k]);
			const label = (u.meta?.title as string) || k.charAt(0).toUpperCase() + k.slice(1);
			const opt = enumOptions(u.inner!, u.meta).find((o) => o.value === combo[k]);
			return { key: k, label, value: combo[k], valueLabel: opt?.label ?? combo[k] };
		});

	const cartesian = (o: AnySchema): Record<string, string>[] => {
		let combos: Record<string, string>[] = [{}];
		for (const k of keys) {
			const u = unwrap(shapeOf(o)![k]);
			const values = enumOptions(u.inner!, u.meta).map((x) => x.value);
			combos = combos.flatMap((c) => values.map((v) => ({ ...c, [k]: v })));
		}
		return combos;
	};

	for (const o of options) {
		if (kind(o) !== 'object') continue;
		const fields = await fieldsOf(o, { skip: new Set(keys) });
		let matched = 0;
		if (pick && keys.length) {
			// The combos the panel would actually show this option for.
			for (const combo of cartesian(o)) {
				if (isValid && !isValid(combo)) continue;
				let picked: AnySchema | undefined;
				try {
					picked = await pick(combo);
				} catch {
					picked = undefined;
				}
				if (picked !== o) continue;
				matched++;
				variants.push({ when: describeWhen(o, combo), fields });
			}
		}
		if (matched || seen.has(o)) continue;
		seen.add(o);
		const combo: Record<string, string> = {};
		for (const k of keys) {
			const u = unwrap(shapeOf(o)![k]);
			const opts = enumOptions(u.inner!, u.meta);
			if (opts.length === 1 || !pick) combo[k] = opts[0]?.value ?? '';
		}
		if (pick && keys.some((k) => !combo[k])) {
			unreachable.push(o);
			continue;
		}
		variants.push({ when: keys.length ? describeWhen(o, combo) : [], fields });
	}

	// pickSchema that skips options (an index slip in the node's switch) shows the
	// wrong form for some operations. When the options line up one-to-one with the
	// node's declared operations, document the intended pairing and warn.
	if (unreachable.length && ordered && ordered.length === options.length) {
		warnings.push(`pickSchema never selects ${unreachable.length} of ${options.length} forms; documented by declared operation order instead`);
		const byOrder: SettingsVariant[] = [];
		for (const [i, o] of options.entries()) {
			byOrder.push({ when: describeWhen(o, ordered[i]), fields: await fieldsOf(o, { skip: new Set(keys) }) });
		}
		return byOrder;
	} else if (unreachable.length) {
		warnings.push(`pickSchema never selects ${unreachable.length} of ${options.length} forms`);
	}

	const seenWhen = new Set<string>();
	return variants.filter((v) => {
		const sig = v.when.map((w) => `${w.key}=${w.value}`).join('&');
		if (seenWhen.has(sig)) return false;
		seenWhen.add(sig);
		return true;
	});
}

// ------------------------------------------------------------- output fields

function outputFieldsOf(schema: AnySchema | undefined): { shape: NodeDoc['outputShape']; fields: OutputField[] } {
	let { inner } = unwrap(schema);
	let shape: NodeDoc['outputShape'] = 'object';
	if (kind(inner) === 'array') {
		shape = 'list';
		inner = unwrap(def(inner).element).inner;
	}
	const s = shapeOf(inner);
	if (!s) return { shape: kind(inner) === 'object' ? shape : shape === 'list' ? 'list' : 'value', fields: [] };
	const fields: OutputField[] = [];
	for (const [name, raw] of Object.entries(s)) {
		const u = unwrap(raw);
		const description = cleanText(raw?.description) ?? cleanText(u.inner?.description) ?? cleanText(u.meta?.description);
		const literal = kind(u.inner) === 'literal' ? (def(u.inner).values ?? []) : [];
		const t = literal.length === 1 ? `Always ${JSON.stringify(literal[0])}` : typeLabel(u.inner, undefined);
		fields.push({
			name,
			type: t === 'Toggle' ? 'True/false' : t === 'Group' ? 'Object' : t === 'Value' ? 'Any' : t,
			...(description ? { description } : {})
		});
	}
	return { shape, fields };
}

// ------------------------------------------------------------------- nodes

export function slugFromDocLink(docLink: string): string {
	return docLink.replace(/^\/?nodes\//, '').replace(/^\//, '').replace(/\/+$/, '');
}

export async function extractNodes(appDir: string): Promise<NodeDoc[]> {
	const listingMod = await import(`${appDir}/src/lib/Nodes-Blocks/nodesListing.ts`);
	const typesMod = await import(`${appDir}/src/lib/Nodes-Blocks/types.ts`);
	const groups = listingMod.getNodesListing() as AnySchema[];

	// node instance -> family (from the palette group it is listed in)
	const entries: { node: AnySchema; family: Family }[] = [];
	for (const group of groups) {
		if (group instanceof typesMod.Divider || !group.categories) continue;
		const collect = (node: AnySchema) => {
			const docLink = node.description?.docLink ?? '';
			// A node listed in two palette groups (e.g. Code) is documented once.
			if (entries.some((e) => e.node.getId?.() === node.getId?.())) return;
			entries.push({ node, family: familyFromDocLink(docLink) ?? familyFor(group.name, group.label, docLink) });
		};
		for (const cat of group.categories) {
			cat.actions.forEach(collect);
			for (const service of cat.services ?? []) for (const c of service.categories) c.actions.forEach(collect);
		}
	}

	const docs: NodeDoc[] = [];
	for (const { node, family } of entries) {
		const d = node.description as AnySchema;
		const docLink = String(d.docLink ?? '');
		if (!docLink) continue;
		const runtime = String(node.getExecutionRuntime?.() ?? d.execution ?? 'client');
		const webCompatible = node.getWebCompatible?.() ?? d.webCompatible !== false;
		// Same rule the app uses to badge extension-only templates.
		const extensionOnly = runtime === 'extension' || (runtime === 'external' && webCompatible === false);

		const input = (node.getInputSchema?.() ?? node.inputSchema) as AnySchema;
		const settings: SettingField[] = [];
		let variants: NodeDoc['variants'];
		const credentials: NodeDoc['credentials'] = [];
		const shape = shapeOf(unwrap(input).inner) ?? {};
		const warnings: string[] = [];
		const searchable = safe(() => (node.getSearchableOperations?.() ?? []) as { resource?: string; operation: string }[]) ?? [];
		const validCombo = searchable.length
			? (combo: Record<string, string>) =>
					!('operation' in combo) ||
					searchable.some(
						(op) => op.operation === combo.operation && (op.resource === undefined || !('resource' in combo) || op.resource === combo.resource)
					)
			: undefined;
		for (const [key, raw] of Object.entries(shape)) {
			const u = unwrap(raw);
			if (u.meta?.type === 'credential') {
				credentials.push({
					key,
					label: (u.meta.title as string) || key,
					authType: d.integrationDetails?.authType,
					required: !u.optional
				});
			}
			if (kind(u.inner) === 'union' && !u.meta?.type) {
				const ordered = searchable.length
					? searchable.map((op) => ({ ...(op.resource !== undefined ? { resource: op.resource } : {}), operation: op.operation }))
					: undefined;
				const v = await expandUnion(u.inner!, u.meta, validCombo, ordered, warnings);
				for (const w of warnings.splice(0)) console.warn(`[nodes] ${d.label}: ${w}`);
				if (v.length) {
					variants = { key, fields: v };
					continue;
				}
			}
		}
		settings.push(
			...(await fieldsOf(unwrap(input).inner, { skip: new Set(variants ? [variants.key] : []) }))
		);

		const ports = (node.getOutputPorts?.() ?? d.outputsParams?.ports) as { id: string; label?: string }[] | undefined;
		const portCount = Number(d.outputsParams?.numberOfPorts ?? 1);
		const canvasLabels = CANVAS_PORT_LABELS[String(d.nodeType ?? '')];
		const outPorts = canvasLabels && !ports?.length
			? canvasLabels.map((label, i) => ({ id: String(i), label }))
			: ports?.length
			? ports.map((p, i) => ({ id: String(p.id), label: p.label ?? `Output ${i + 1}` }))
			: Array.from({ length: Number.isFinite(portCount) ? portCount : 0 }, (_, i) => ({
					id: String(i),
					label: portCount === 1 ? 'Output' : `Output ${i + 1}`
				}));

		let outputFields: OutputField[] | undefined;
		let outputShape: NodeDoc['outputShape'];
		try {
			if (node.hasDeclaredOutputSchema?.() && typeof node.outputSchema !== 'function') {
				const r = outputFieldsOf(await node.getOutputSchema());
				outputShape = r.shape;
				if (r.fields.length) outputFields = r.fields;
			}
		} catch {
			/* undeclared or configuration-dependent */
		}

		let operations: NodeDoc['operations'];
		try {
			const ops = (node.getSearchableOperations?.() ?? []) as { resource?: string; operation: string; label: string }[];
			if (ops.length) {
				const byRes = new Map<string, { value: string; label: string }[]>();
				for (const op of ops) {
					const k = op.resource ?? '';
					if (!byRes.has(k)) byRes.set(k, []);
					const label = op.label.includes(':') ? op.label.split(':').slice(1).join(':').trim() : op.label;
					byRes.get(k)!.push({ value: op.operation, label });
				}
				operations = [...byRes.entries()].map(([resource, list]) => {
					const resLabel = variants?.fields
						.flatMap((v) => v.when)
						.find((w) => w.key === 'resource' && w.value === resource)?.valueLabel;
					return { ...(resource ? { resource, resourceLabel: resLabel ?? resource } : {}), operations: list };
				});
			}
		} catch {
			/* no operations */
		}

		const doc: NodeDoc = {
			id: slugFromDocLink(docLink),
			docLink: `/nodes/${slugFromDocLink(docLink)}/`,
			registryId: String(node.getId?.() ?? d.name),
			name: String(d.label),
			family,
			category: String(d.category ?? ''),
			nodeType: String(d.nodeType ?? 'basic'),
			...(cleanText(d.description) ? { description: cleanText(d.description) } : {}),
			worksIn: extensionOnly ? ['extension'] : ['extension', 'web'],
			runtime,
			...(d.since ? { since: String(d.since) } : {}),
			...(d.hidden ? { deprecated: true } : {}),
			...(d.isDependency ? { isDependency: true } : {}),
			...(d.dependencyType ? { dependencyType: String(d.dependencyType) } : {}),
			...(d.isDependency && d.dependencyType === 'tools' ? { agentTool: true } : {}),
			credentials,
			dependencies: ((d.dependencies ?? []) as AnySchema[]).map((dep) => ({
				name: String(dep.name),
				label: String(dep.label),
				required: Boolean(dep.required),
				multiple: Boolean(dep.multiple),
				accepts: (dep.acceptedDependencyTypes ?? []).map(String),
				...(Number.isFinite(dep.numberOfConnections) && dep.numberOfConnections > 0
					? { max: Number(dep.numberOfConnections) }
					: {})
			})),
			settings,
			...(variants ? { variants } : {}),
			...(operations ? { operations } : {}),
			inputs: Number(d.inputsParams?.numberOfPorts ?? 1),
			outputs: { ports: outPorts, ...(typeof node.getOutputPorts === 'function' && d.nodeType !== 'if' && isDynamicPorts(node) ? { dynamic: true } : {}) },
			...(outputFields ? { outputFields } : {}),
			...(outputShape ? { outputShape } : {})
		};
		docs.push(doc);
	}

	// Reverse dependency map: which nodes accept each dependency type.
	for (const doc of docs) {
		if (!doc.isDependency || !doc.dependencyType) continue;
		const into: NodeDoc['plugsInto'] = [];
		for (const other of docs) {
			for (const dep of other.dependencies) {
				if (dep.accepts.includes(doc.dependencyType)) into.push({ node: other.name, nodeId: other.id, slot: dep.label });
			}
		}
		doc.plugsInto = into;
	}

	docs.sort((a, b) => a.id.localeCompare(b.id));
	return docs;
}

function safe<T>(f: () => T): T | undefined {
	try {
		return f();
	} catch {
		return undefined;
	}
}

/** True when a node overrides getOutputPorts (ports depend on its settings, e.g. Switch). */
function isDynamicPorts(node: AnySchema): boolean {
	const own = Object.getOwnPropertyDescriptor(node, 'getOutputPorts');
	if (!own || typeof own.value !== 'function') return false;
	const src = String(own.value);
	return !src.includes('this.description.outputsParams.ports');
}
