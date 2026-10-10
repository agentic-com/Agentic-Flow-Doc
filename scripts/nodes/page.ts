/**
 * Rewrites the generated parts of a node page in place: the AUTO blocks and
 * the generator-owned frontmatter keys. Hand-written prose is left alone.
 */
import type { NodeDoc } from './extract.ts';
import {
	BLOCK_SECTION,
	SECTION_ORDER,
	frontmatterFor,
	renderBlock,
	renderDeps,
	renderOperations,
	renderOutputs,
	renderSettings
} from './render.ts';

/** Scaffold lines from the first docs pass that must never come back. */
const FILLER = [
	/^\s*\|.*Source-backed field from the node schema\..*\|\s*$/,
	/^\s*-?\s*This node has source tests;.*$/,
	/^\s*-?\s*No dedicated source test.*$/,
	/^\s*-?\s*No explicit credential or node dependency is declared.*$/,
	/^Returns the extracted page data or the result of the page interaction\.$/,
	/^Returns a chat model dependency that can be connected to AI agent nodes\.$/,
	/^Returns transformed data for downstream nodes\.$/,
	/^Returns node-specific output described by the implementation.*$/,
	/^Returns the service response or a success object from the selected operation\.$/,
	/^Returns an embeddings dependency for vector stores and retrieval workflows\.$/,
	/^Starts the workflow and passes trigger context to downstream nodes when context is available\.$/,
	/^Returns the original input, filtered input, branched output, merged items, loop state, or an intentional error depending on the node\.$/,
	/^Passes data into or out of a lambda workflow, or exposes a lambda workflow as a reusable node\.$/,
	/^Returns a text splitter dependency used before indexing or retrieval\.$/
];

const START = (name: string) => `{/* AUTO:${name}:start */}`;
const END = (name: string) => `{/* AUTO:${name}:end */}`;

function splitFrontmatter(src: string): { fm: string[]; body: string } {
	const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { fm: [], body: src };
	return { fm: m[1].split('\n'), body: src.slice(m[0].length) };
}

/** Drop top-level keys (and their indented children) from frontmatter lines. */
function dropKeys(lines: string[], keys: string[]): string[] {
	const out: string[] = [];
	let skipping = false;
	for (const line of lines) {
		const top = line.match(/^([A-Za-z][\w-]*):/);
		if (top) skipping = keys.includes(top[1]);
		else if (!/^\s/.test(line) && line.trim() !== '') skipping = false;
		if (!skipping) out.push(line);
	}
	return out;
}

/** Remove the first Markdown table in a block of lines (the old hand-written settings table). */
function removeFirstTable(lines: string[]): string[] {
	const start = lines.findIndex((l) => /^\s*\|/.test(l));
	if (start === -1) return lines;
	let end = start;
	while (end < lines.length && /^\s*\|/.test(lines[end])) end++;
	return [...lines.slice(0, start), ...lines.slice(end)];
}

type Section = { heading: string; lines: string[] };

function parseSections(body: string): { preamble: string[]; sections: Section[] } {
	const lines = body.split('\n');
	const preamble: string[] = [];
	const sections: Section[] = [];
	let current: Section | undefined;
	let inFence = false;
	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
		const h = !inFence && line.match(/^## (.+?)\s*$/);
		if (h) {
			current = { heading: h[1], lines: [] };
			sections.push(current);
		} else if (current) current.lines.push(line);
		else preamble.push(line);
	}
	return { preamble, sections };
}

function trimBlank(lines: string[]): string[] {
	let a = 0;
	let b = lines.length;
	while (a < b && lines[a].trim() === '') a++;
	while (b > a && lines[b - 1].trim() === '') b--;
	return lines.slice(a, b);
}

function setBlock(section: Section, name: string, body: string, opts: { replaceTable: boolean }) {
	const block = renderBlock(name, body).split('\n');
	const s = section.lines.findIndex((l) => l.trim() === START(name));
	const e = section.lines.findIndex((l) => l.trim() === END(name));
	if (s !== -1 && e > s) {
		section.lines = [...section.lines.slice(0, s), ...block, ...section.lines.slice(e + 1)];
		return;
	}
	let rest = section.lines;
	if (opts.replaceTable) rest = removeFirstTable(rest);
	section.lines = ['', ...block, '', ...trimBlank(rest)];
}

export function updatePage(src: string, n: NodeDoc): string {
	const { fm, body } = splitFrontmatter(src);
	const fmLines = [...dropKeys(fm, ['kind', 'section', 'worksIn', 'node']), ...frontmatterFor(n).split('\n')];

	const { preamble, sections } = parseSections(body);
	for (const s of sections) s.lines = s.lines.filter((l) => !FILLER.some((re) => re.test(l)));

	// Make sure the three generated sections exist, in template order.
	for (const [name, heading] of Object.entries(BLOCK_SECTION)) {
		let sec = sections.find((s) => s.heading === heading);
		if (!sec) {
			sec = { heading, lines: [] };
			const idx = SECTION_ORDER.indexOf(heading);
			const after = sections.findIndex((s) => SECTION_ORDER.indexOf(s.heading as never) > idx);
			if (after === -1) sections.push(sec);
			else sections.splice(after, 0, sec);
		}
		let content = '';
		if (name === 'settings') {
			const ops = renderOperations(n);
			content = renderSettings(n);
			if (ops) content = `${ops}\n\n${content}`;
		} else if (name === 'outputs') content = renderOutputs(n);
		else content = renderDeps(n);
		setBlock(sec, name, content, { replaceTable: name === 'settings' });
	}

	const parts: string[] = [];
	parts.push(trimBlank(preamble).join('\n'));
	for (const s of sections) {
		const lines = trimBlank(s.lines);
		parts.push(`## ${s.heading}${lines.length ? '\n\n' + lines.join('\n') : ''}`);
	}
	const out = `---\n${fmLines.join('\n')}\n---\n\n${parts.filter((p) => p !== '').join('\n\n')}\n`;
	return out.replace(/\n{3,}/g, '\n\n');
}
