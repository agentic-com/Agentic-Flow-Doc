/**
 * Heading ids of the English page a translation mirrors (spec §1 "Heading anchors"). The ids are
 * what Astro's own heading-id plugin assigns: github-slugger over each heading's text, in order.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { markdownToHast, mdxToHast } from 'satteri';
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

const textOf = (node: any): string =>
	node.type === 'text' ? node.value : Array.isArray(node.children) ? node.children.map(textOf).join('') : '';

export async function englishHeadings(source: string, format: 'md' | 'mdx'): Promise<EnglishHeading[]> {
	const options = { features: { rawHtml: true }, position: false };
	const tree: any = format === 'mdx' ? mdxToHast(source, options) : markdownToHast(source, options);
	const slugger = new GithubSlugger();
	const out: EnglishHeading[] = [];
	const walk = (node: any) => {
		if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
			const id = node.properties?.id;
			out.push({ depth: Number(node.tagName[1]), slug: typeof id === 'string' ? id : slugger.slug(textOf(node)) });
			return;
		}
		node.children?.forEach(walk);
	};
	walk(tree);
	return out;
}

const cache = new Map<string, Promise<EnglishHeading[]>>();
export function englishHeadingsFor(englishPath: string): Promise<EnglishHeading[]> {
	if (!cache.has(englishPath)) {
		cache.set(
			englishPath,
			existsSync(englishPath)
				? englishHeadings(readFileSync(englishPath, 'utf8'), englishPath.endsWith('.mdx') ? 'mdx' : 'md')
				: Promise.resolve([]),
		);
	}
	return cache.get(englishPath)!;
}
