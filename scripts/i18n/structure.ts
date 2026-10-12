/**
 * What must not differ between an English page and its translation (spec §3 i18n:check):
 * headings (count, depth), components and their non-text props, code, inline code, link and
 * image targets, imports, and frontmatter except text fields. Prose is free.
 */
import { posix } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { parse as parseYaml } from 'yaml';

/**
 * Ruling R6: every JSX attribute name and every object key inside expression props used in the
 * English corpus is classified. TEXT may differ in a translation; STRUCTURAL must match. The corpus
 * test (tests/i18n/check.test.ts) fails when a name appears in neither set, forcing a decision.
 */
// Attribute names whose value is human-readable (string, or array of strings): skipped when comparing.
export const TEXT_PROPS = [
	'title', 'body', 'check', 'caption', 'alt', 'label', 'description', 'tweak',
	'text', 'meta', 'before', 'youWill', 'pick', 'linkLabel', 'descriptionLabel', 'nameLabel', 'typeLabel',
];
// Attribute names that must match: ids, urls, icons, variants, numbers, shots and data-bearing expressions
// (whose own text keys are masked through TEXT_KEYS).
export const STRUCTURAL_PROPS = [
	'cards', 'common', 'groups', 'height', 'hotspots', 'href', 'hydrate', 'icon', 'id', 'level', 'minutes', 'n',
	'next', 'nodes', 'onDevice', 'order', 'ports', 'rel', 'release', 'releases', 'rows', 'selected', 'setup',
	'shot', 'slot', 'slug', 'spot', 'src', 'srcDark', 'start', 'steps', 'syncKey', 'target', 'total', 'type',
	'variant', 'view', 'zoom',
];
// Object keys inside expression props whose string literal values are prose: masked.
export const TEXT_KEYS = [
	'title', 'body', 'check', 'caption', 'alt', 'label', 'description', 'tweak', 'when', 'example', 'note', 'meta',
	'name', 'count', 'response', 'summary', 'text', 'message', 'selection', 'query', 'chatInput', 'type', 'default',
];
// Object keys that must match (ids, urls, icons, kinds, coordinates, flags, sample-data identifiers, containers).
export const STRUCTURAL_KEYS = [
	'also', 'args', 'batch', 'batchIndex', 'canonicalUrl', 'company', 'done', 'durationMs', 'email', 'first',
	'href', 'icon', 'input', 'isLast', 'items', 'kind', 'last', 'length', 'links', 'node', 'nodeLabel', 'options',
	'required', 'rows', 'runs', 'score', 'size', 'source', 'sources', 'spot', 'status', 'steps', 'total', 'url',
	'x', 'y',
];
export const TEXT_FRONTMATTER = [
	'title',
	'description',
	'sidebar.label',
	'sidebar.badge.text',
	'hero.title',
	'hero.tagline',
	'hero.actions.*.text',
	'head',
	'i18n',
];

const globToRegExp = (glob: string) =>
	new RegExp(`^${glob.replace(/\./g, '\\.').replace(/\*/g, '[^.]+')}(\\.|$)`);
const TEXT_FRONTMATTER_RES = TEXT_FRONTMATTER.map(globToRegExp);
const TEXT_PROP_SET = new Set(TEXT_PROPS);
const TEXT_KEY_SET = new Set(TEXT_KEYS);

export interface Item {
	kind: 'heading' | 'component' | 'code' | 'inlineCode' | 'link' | 'image' | 'esm';
	sig: string;
	line: number;
}
export interface Structure {
	frontmatter: Record<string, unknown>;
	fmLine: number;
	items: Item[];
}

const flatten = (v: unknown, prefix = '', out: Record<string, unknown> = {}) => {
	if (v && typeof v === 'object') {
		for (const [k, x] of Object.entries(v as Record<string, unknown>)) flatten(x, prefix ? `${prefix}.${k}` : k, out);
	} else out[prefix] = v;
	return out;
};

const isStringLiteral = (n: any) =>
	(n?.type === 'Literal' && typeof n.value === 'string') || (n?.type === 'TemplateLiteral' && n.expressions.length === 0);
const stringValue = (n: any) => (n.type === 'Literal' ? n.value : n.quasis.map((q: any) => q.value.cooked).join(''));

/** Canonical form of an expression prop: literals normalised, prose under TEXT_KEYS masked, the rest as source. */
const serializeExpression = (n: any, body: string): string => {
	switch (n?.type) {
		case 'Literal':
			return typeof n.value === 'string' ? JSON.stringify(n.value) : (n.raw ?? String(n.value));
		case 'TemplateLiteral':
			return n.expressions.length === 0 ? JSON.stringify(stringValue(n)) : body.slice(n.start, n.end);
		case 'ArrayExpression':
			return `[${n.elements.map((e: any) => (e ? serializeExpression(e, body) : '')).join(',')}]`;
		case 'ObjectExpression':
			return `{${n.properties.map((p: any) => serializeExpression(p, body)).join(',')}}`;
		case 'Property': {
			if (n.computed || n.kind !== 'init' || n.method) return body.slice(n.start, n.end);
			const key = n.key.name ?? String(n.key.value);
			const masked = TEXT_KEY_SET.has(key) && isStringLiteral(n.value);
			return `${key}:${masked ? '"…"' : serializeExpression(n.value, body)}`;
		}
		default:
			return body.slice(n.start, n.end);
	}
};

/** Every attribute name and expression-prop object key in a page: used by the classification test. */
export function collectNames(source: string): { attrs: Set<string>; keys: Set<string> } {
	const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
	const tree: any = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkDirective).parse(fm ? source.slice(fm[0].length) : source);
	const attrs = new Set<string>();
	const keys = new Set<string>();
	const visit = (n: any) => {
		if (!n || typeof n !== 'object') return;
		if (Array.isArray(n)) return n.forEach(visit);
		if (n.type === 'Property' && !n.computed) keys.add(n.key.name ?? String(n.key.value));
		for (const [k, c] of Object.entries(n)) if (k !== 'loc' && k !== 'range') visit(c);
	};
	const walk = (n: any) => {
		if (n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement') {
			for (const a of n.attributes ?? []) {
				if (a.type !== 'mdxJsxAttribute') continue;
				attrs.add(a.name);
				if (a.value && typeof a.value !== 'string') visit(a.value.data?.estree);
			}
		}
		n.children?.forEach(walk);
	};
	walk(tree);
	return { attrs, keys };
}

/** Resolve relative import specifiers against the file's own directory (project-relative). */
const resolveImports = (esm: string, filePath?: string) => {
	if (!filePath) return esm;
	const dir = posix.dirname(filePath.replace(/\\/g, '/'));
	return esm.replace(/(from\s*|import\s*)(["'])(\.{1,2}\/[^"']*)\2/g, (_m, kw, q, spec) =>
		`${kw}${q}${posix.join(dir, spec)}${q}`,
	);
};

export function structureOf(source: string, filePath?: string): Structure {
	const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
	const frontmatter = flatten(fm ? (parseYaml(fm[1]) ?? {}) : {});
	for (const key of Object.keys(frontmatter)) if (TEXT_FRONTMATTER_RES.some((re) => re.test(key))) delete frontmatter[key];
	const offset = fm ? fm[0].split('\n').length - 1 : 0;
	const body = fm ? source.slice(fm[0].length) : source;
	const tree: any = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkDirective).parse(body);
	const items: Item[] = [];
	const line = (n: any) => (n.position?.start.line ?? 0) + offset;
	const walk = (n: any) => {
		switch (n.type) {
			case 'heading': items.push({ kind: 'heading', sig: `h${n.depth}`, line: line(n) }); break;
			case 'code': items.push({ kind: 'code', sig: `${n.lang ?? ''} ${n.meta ?? ''}\n${n.value}`, line: line(n) }); break;
			case 'inlineCode': items.push({ kind: 'inlineCode', sig: n.value, line: line(n) }); break;
			case 'link': items.push({ kind: 'link', sig: n.url, line: line(n) }); break;
			case 'image': items.push({ kind: 'image', sig: n.url, line: line(n) }); break;
			case 'mdxjsEsm': items.push({ kind: 'esm', sig: resolveImports(n.value.trim(), filePath), line: line(n) }); break;
			case 'mdxJsxFlowElement':
			case 'mdxJsxTextElement': {
				const props = (n.attributes ?? [])
					.filter((a: any) => a.type !== 'mdxJsxAttribute' || !TEXT_PROP_SET.has(a.name))
					.map((a: any) => {
						if (a.type !== 'mdxJsxAttribute') return `{${a.value}}`;
						if (typeof a.value === 'string') return `${a.name}=${JSON.stringify(a.value)}`;
						if (a.value?.value == null) return `${a.name}=true`;
						const expr = a.value.data?.estree?.body?.[0]?.expression;
						return `${a.name}=${expr ? serializeExpression(expr, body) : a.value.value}`;
					})
					.sort();
				items.push({ kind: 'component', sig: `<${n.name ?? ''} ${props.join(' ')}>`, line: line(n) });
				break;
			}
		}
		n.children?.forEach(walk);
	};
	walk(tree);
	return { frontmatter, fmLine: 2, items };
}

const specifiers = (esm: string) => [...esm.matchAll(/(?:from\s*|import\s*)(["'])([^"']*)\1/g)].map((m) => m[2]);

export function compareStructures(en: Structure, tr: Structure): { line: number; message: string }[] {
	const out: { line: number; message: string }[] = [];
	for (const key of new Set([...Object.keys(en.frontmatter), ...Object.keys(tr.frontmatter)])) {
		if (JSON.stringify(en.frontmatter[key]) !== JSON.stringify(tr.frontmatter[key])) {
			out.push({ line: tr.fmLine, message: `frontmatter ${key}: expected ${JSON.stringify(en.frontmatter[key])}, found ${JSON.stringify(tr.frontmatter[key])}` });
		}
	}
	for (const kind of ['heading', 'component', 'code', 'inlineCode', 'link', 'image', 'esm'] as const) {
		const a = en.items.filter((i) => i.kind === kind);
		const b = tr.items.filter((i) => i.kind === kind);
		for (let i = 0; i < Math.max(a.length, b.length); i++) {
			if (a[i]?.sig !== b[i]?.sig) {
				let detail = '';
				if (kind === 'esm') {
					const sa = specifiers(a[i]?.sig ?? '');
					const sb = specifiers(b[i]?.sig ?? '');
					const j = [...Array(Math.max(sa.length, sb.length)).keys()].find((x) => sa[x] !== sb[x]);
					if (j !== undefined) detail = ` (import specifier: expected ${JSON.stringify(sa[j] ?? '(none)')}, found ${JSON.stringify(sb[j] ?? '(none)')})`;
				}
				out.push({
					line: b[i]?.line ?? b[b.length - 1]?.line ?? 1,
					message: `${kind} #${i + 1}: expected ${a[i] ? JSON.stringify(a[i].sig) : '(none)'}, found ${b[i] ? JSON.stringify(b[i].sig) : '(none)'}${detail}`,
				});
				break; // one report per kind: later items are usually shifted by the same cause
			}
		}
	}
	return out;
}
