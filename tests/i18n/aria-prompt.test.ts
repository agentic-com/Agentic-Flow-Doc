import { describe, expect, test } from 'bun:test';
import { MAX_ARIA_PROMPT, buildAriaPrompt } from '../../plugins/starlight-awflow/lib/search';
import { familyLabel } from '../../plugins/starlight-awflow/lib/nodes';
import { createT } from '../../src/i18n/ui';

const sources = [{ title: 'Loop', url: 'https://x.test/nodes/loop/' }];
const extra = { page: { title: 'Nodes', url: 'https://x.test/nodes/' }, llmsTxt: 'https://x.test/llms.txt' };

describe('buildAriaPrompt', () => {
	test('English output is exactly the original prompt (no language line)', () => {
		expect(buildAriaPrompt('How do I loop?', sources, 'ask', createT('en'), extra)).toBe(
			[
				'How do I loop?',
				'',
				"Answer from the AWFlow docs and cite the pages you use. If the docs don't cover it, say so.",
				'',
				"I'm reading: Nodes (https://x.test/nodes/)",
				'',
				'Relevant docs (each page also has a Markdown copy at <url>.md):',
				'[1] Loop: https://x.test/nodes/loop/',
				'',
				'Docs index for AI: https://x.test/llms.txt',
			].join('\n'),
		);
		expect(buildAriaPrompt('Repeat a step', [], 'build', createT('en'))).toBe(
			'Build a workflow for this: Repeat a step\n\nFollow the AWFlow docs below and tell me which nodes and connections it needs.',
		);
	});
	test('other languages frame the prompt in the page language and end with the answer-in line', () => {
		for (const lang of ['fr', 'de', 'zh-CN']) {
			const t = createT(lang);
			const p = buildAriaPrompt('Q', sources, 'ask', t, extra);
			expect(p.endsWith(`\n\n${t('aria.answerIn')}`)).toBe(true);
			expect(p).not.toContain('Answer from the AWFlow docs');
		}
	});
	test('a very long question is cut but the language line survives', () => {
		const t = createT('fr');
		const p = buildAriaPrompt('x'.repeat(MAX_ARIA_PROMPT * 2), [], 'ask', t);
		expect(p.length).toBeLessThanOrEqual(MAX_ARIA_PROMPT);
		expect(p.endsWith(t('aria.answerIn'))).toBe(true);
	});
});

describe('familyLabel', () => {
	test('reads node.family.<id> in the page language', () => {
		expect(familyLabel('inpage', createT('en'))).toBe('In-page action');
		expect(familyLabel('flow', createT('fr'))).toBe('Flux');
	});
});
