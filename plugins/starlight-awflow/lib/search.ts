/**
 * Search & Ask Aria helpers (awflow/Agentic-Flow#1340). Pure functions, shared by the Search
 * override and the SearchDialog island; no DOM access here.
 */
import { stripLocale } from '../../../src/i18n/locales';
import type { T, UIKey } from '../../../src/i18n/ui';
import { SECTION_PALETTE } from '../palette';

export interface SearchGroup {
	id: string;
	labelKey: UIKey;
	color: string;
	tint: string;
}

/** Display order of result groups. "Fix it" (troubleshooting) beats the section it lives in. */
export const SEARCH_GROUPS: SearchGroup[] = [
	{ id: 'get-started', labelKey: 'search.group.get-started', ...SECTION_PALETTE['get-started'] },
	{ id: 'recipes', labelKey: 'search.group.recipes', ...SECTION_PALETTE.recipes },
	{ id: 'nodes', labelKey: 'search.group.nodes', ...SECTION_PALETTE.nodes },
	{ id: 'app', labelKey: 'search.group.app', ...SECTION_PALETTE.app },
	{ id: 'concepts', labelKey: 'search.group.concepts', ...SECTION_PALETTE.concepts },
	{ id: 'fix', labelKey: 'search.group.fix', color: '#DC2626', tint: '#FEE2E2' },
	{ id: 'releases', labelKey: 'search.group.releases', ...SECTION_PALETTE.releases },
	{ id: 'other', labelKey: 'search.group.other', color: '#57534E', tint: '#F5F0E8' },
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
	path = stripLocale(path);
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

/**
 * The prompt Aria receives: the question plus the page and docs it should lean on. The framing
 * sentences come from the dictionary (`aria.prompt.*`) in the page language. On a non-English page
 * `aria.answerIn` ends the prompt so Aria replies in that language; English output is unchanged.
 */
export function buildAriaPrompt(
	question: string,
	sources: AriaSource[],
	intent: AriaIntent,
	t: T,
	extra: { page?: AriaSource; llmsTxt?: string } = {}
): string {
	const q = question.trim();
	const lines: string[] = [];
	if (intent === 'build') {
		lines.push(t('aria.prompt.build', { question: q }));
		lines.push('', t('aria.prompt.buildHint'));
	} else {
		lines.push(q);
		lines.push('', t('aria.prompt.askHint'));
	}
	if (extra.page) lines.push('', t('aria.prompt.reading', { title: extra.page.title, url: extra.page.url }));
	if (sources.length) {
		lines.push('', t('aria.prompt.sources'));
		sources.forEach((s, i) => lines.push(`[${i + 1}] ${s.title}: ${s.url}`));
	}
	if (extra.llmsTxt) lines.push('', t('aria.prompt.llms', { url: extra.llmsTxt }));
	// The cut happens before the language line, so a long prompt never loses it.
	const body = lines.join('\n').slice(0, MAX_ARIA_PROMPT - 80);
	return t.lang === 'en' ? lines.join('\n').slice(0, MAX_ARIA_PROMPT) : `${body}\n\n${t('aria.answerIn')}`;
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
