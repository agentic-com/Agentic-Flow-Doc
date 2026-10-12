/**
 * Heading ids of the English page a translation mirrors (spec §1 "Heading anchors"). The ids are
 * what Astro's own heading-id plugin assigns: github-slugger over each heading's text, in order.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { markdownToJs, mdxToJs } from 'satteri';
import { langFromPath, type Lang } from '../locales';

export interface EnglishHeading {
	depth: number;
	slug: string;
}

const DOCS_RE = /^(.*\/src\/content\/docs\/)((?:fr|de|zh-cn)\/)(.+)$/;

export function translatedInfo(fileURL: URL | undefined): { lang: Lang; englishPath: string } | null {
	if (!fileURL) return null;
	const m = DOCS_RE.exec(fileURLToPath(fileURL).replaceAll('\\', '/'));
	if (!m) return null;
	return { lang: langFromPath(m[2]), englishPath: m[1] + m[3] };
}

/** Mirrors collectHastText in @astrojs/markdown-satteri (used when a heading mentions "frontmatter"). */
const collectText = (node: any): string => {
	let text = '';
	if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') text += node.value ?? '';
	else if (node.value != null) text += node.value;
	for (const child of node.children ?? []) text += collectText(child);
	return text;
};

/** The features the site's Sätteri processor runs with (Astro defaults + rawHtml). */
const FEATURES = { gfm: true, smartPunctuation: true, rawHtml: true };

export async function englishHeadings(source: string, format: 'md' | 'mdx'): Promise<EnglishHeading[]> {
	const slugger = new GithubSlugger();
	const out: EnglishHeading[] = [];
	// Same slugging as Astro's heading-ids plugin: ctx.textContent, github-slugger, existing id wins.
	const collector = {
		name: 'awf-english-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node: any, ctx: any) {
				const raw: string = ctx.textContent(node);
				const text = raw.includes('frontmatter') ? collectText(node) : raw;
				const id = node.properties?.id;
				out.push({ depth: Number(node.tagName[1]), slug: typeof id === 'string' ? id : slugger.slug(text) });
			},
		},
	};
	const options = { features: FEATURES, hastPlugins: [collector] } as any;
	await (format === 'mdx' ? mdxToJs(source, options) : markdownToJs(source, options));
	return out;
}

const cache = new Map<string, { mtime: number; value: Promise<EnglishHeading[]> }>();
export function englishHeadingsFor(englishPath: string): Promise<EnglishHeading[]> {
	if (!existsSync(englishPath)) return Promise.resolve([]);
	const mtime = statSync(englishPath).mtimeMs;
	const hit = cache.get(englishPath);
	if (hit && hit.mtime === mtime) return hit.value;
	const value = englishHeadings(readFileSync(englishPath, 'utf8'), englishPath.endsWith('.mdx') ? 'mdx' : 'md');
	cache.set(englishPath, { mtime, value });
	return value;
}
