/**
 * Search & Ask Aria helpers (awflow/Agentic-Flow#1340). Pure functions, shared by the Search
 * override and the SearchDialog island; no DOM access here.
 */
import { SECTION_PALETTE } from '../palette';

export interface SearchGroup {
	id: string;
	label: string;
	color: string;
	tint: string;
}

/** Display order of result groups. "Fix it" (troubleshooting) beats the section it lives in. */
export const SEARCH_GROUPS: SearchGroup[] = [
	{ id: 'get-started', label: 'Get started', ...SECTION_PALETTE['get-started'] },
	{ id: 'recipes', label: 'Recipes', ...SECTION_PALETTE.recipes },
	{ id: 'nodes', label: 'Nodes', ...SECTION_PALETTE.nodes },
	{ id: 'app', label: 'Guides', ...SECTION_PALETTE.app },
	{ id: 'concepts', label: 'Concepts', ...SECTION_PALETTE.concepts },
	{ id: 'fix', label: 'Fix it', color: '#DC2626', tint: '#FEE2E2' },
	{ id: 'releases', label: 'Releases', ...SECTION_PALETTE.releases },
	{ id: 'other', label: 'More', color: '#57534E', tint: '#F5F0E8' },
];

/**
 * URL prefix → group. Covers the target information architecture (#1334) and today's paths
 * (/usage/, /advanced-ai/), since both exist while the move lands. First match wins.
 */
const PREFIXES: [RegExp, string][] = [
	[/\/troubleshooting(\/|$)/, 'fix'],
	[/^\/(get-started|usage\/getting-started)(\/|$)/, 'get-started'],
	[/^\/recipes(\/|$)/, 'recipes'],
	[/^\/nodes(\/|$)/, 'nodes'],
	[/^\/(releases|usage\/releases)(\/|$)/, 'releases'],
	[/^\/(concepts|advanced-ai|usage\/key-concepts)(\/|$)/, 'concepts'],
	[/^\/(app|usage)(\/|$)/, 'app'],
];

/** Group id for a result URL (absolute or root-relative); `base` is the site's base path. */
export function groupFor(url: string, base = '/'): string {
	let path = url;
	try {
		path = new URL(url, 'https://x.invalid').pathname;
	} catch {
		/* keep as is */
	}
	const b = base.replace(/\/$/, '');
	if (b && path.startsWith(b)) path = path.slice(b.length) || '/';
	for (const [re, id] of PREFIXES) if (re.test(path)) return id;
	return 'other';
}

export function groupById(id: string): SearchGroup {
	return SEARCH_GROUPS.find((g) => g.id === id) ?? SEARCH_GROUPS[SEARCH_GROUPS.length - 1];
}

/**
 * Pagefind excerpts are plain text with <mark> around matches. Escape everything and restore only
 * <mark>, so an excerpt can never inject markup.
 */
export function safeExcerpt(html: string): string {
	const escaped = html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
	return escaped
		.replace(/&amp;(amp|lt|gt|quot|#39|#x27);/g, '&$1;')
		.replace(/&lt;mark&gt;/g, '<mark>')
		.replace(/&lt;\/mark&gt;/g, '</mark>');
}

export interface AriaSource {
	title: string;
	url: string;
}

export type AriaIntent = 'ask' | 'build';

/** Longest prompt the app accepts from a launch link (MAX_PROMPT in the app's quickChat protocol). */
export const MAX_ARIA_PROMPT = 8000;

/** The prompt Aria receives: the question plus the page and docs it should lean on. */
export function buildAriaPrompt(opts: {
	question: string;
	intent: AriaIntent;
	page?: AriaSource;
	sources: AriaSource[];
	llmsTxt?: string;
}): string {
	const q = opts.question.trim();
	const lines: string[] = [];
	if (opts.intent === 'build') {
		lines.push(`Build a workflow for this: ${q}`);
		lines.push('', 'Follow the AWFlow docs below and tell me which nodes and connections it needs.');
	} else {
		lines.push(q);
		lines.push(
			'',
			"Answer from the AWFlow docs and cite the pages you use. If the docs don't cover it, say so."
		);
	}
	if (opts.page) lines.push('', `I'm reading: ${opts.page.title} (${opts.page.url})`);
	if (opts.sources.length) {
		lines.push('', 'Relevant docs (each page also has a Markdown copy at <url>.md):');
		opts.sources.forEach((s, i) => lines.push(`[${i + 1}] ${s.title}: ${s.url}`));
	}
	if (opts.llmsTxt) lines.push('', `Docs index for AI: ${opts.llmsTxt}`);
	return lines.join('\n').slice(0, MAX_ARIA_PROMPT);
}

/** Web-app fallback when the extension hand-off isn't on the page. */
export function ariaAppUrl(appBase: string, prompt: string, intent: AriaIntent): string {
	const params = new URLSearchParams();
	// The app opens plain chat unless `mode=build` (assistantLaunchHash in the app).
	params.set('mode', intent === 'build' ? 'build' : 'chat');
	params.set('source', 'docs');
	params.set('prompt', prompt);
	return `${appBase.replace(/\/$/, '')}/#/app/assistant?${params.toString()}`;
}
