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

export const TEXT_PROPS = ['title', 'body', 'check', 'caption', 'alt', 'label', 'description', 'tweak'];
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

const maskTextInExpression = (src: string) =>
	src.replace(
		new RegExp(`\\b(${TEXT_PROPS.join('|')})\\s*:\\s*(["'\`])(?:\\\\.|(?!\\2).)*\\2`, 'g'),
		'$1:"…"',
	);

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
						return `${a.name}=${a.value?.value != null ? maskTextInExpression(a.value.value) : 'true'}`;
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
				out.push({
					line: b[i]?.line ?? b[b.length - 1]?.line ?? 1,
					message: `${kind} #${i + 1}: expected ${a[i] ? JSON.stringify(a[i].sig) : '(none)'}, found ${b[i] ? JSON.stringify(b[i].sig) : '(none)'}`,
				});
				break; // one report per kind: later items are usually shifted by the same cause
			}
		}
	}
	return out;
}
