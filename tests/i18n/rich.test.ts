import { describe, expect, test } from 'bun:test';
import { richParts } from '../../src/i18n/rich';

describe('richParts', () => {
	test('splits slots and bold around plain text', () => {
		expect(richParts('Call {http} or {custom}, **now**.')).toEqual([
			{ kind: 'text', text: 'Call ' },
			{ kind: 'slot', name: 'http' },
			{ kind: 'text', text: ' or ' },
			{ kind: 'slot', name: 'custom' },
			{ kind: 'text', text: ', ' },
			{ kind: 'strong', text: 'now' },
			{ kind: 'text', text: '.' },
		]);
	});
	test('plain text is one part and stray markers survive', () => {
		expect(richParts('Just text')).toEqual([{ kind: 'text', text: 'Just text' }]);
		expect(richParts('a * b {')).toEqual([
			{ kind: 'text', text: 'a ' },
			{ kind: 'text', text: '*' },
			{ kind: 'text', text: ' b ' },
			{ kind: 'text', text: '{' },
		]);
	});
});
