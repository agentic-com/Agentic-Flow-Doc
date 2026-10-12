import { describe, expect, test } from 'bun:test';
import { readDocsLang, saveDocsLang } from '../../src/i18n/docs-lang';

const mem = (init: Record<string, string> = {}) => {
	const m = new Map(Object.entries(init));
	return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

describe('docs language choice', () => {
	test('round-trips', () => {
		const s = mem();
		saveDocsLang('zh-CN', s);
		expect(readDocsLang(s)).toBe('zh-CN');
	});
	test('garbage, missing and blocked storage', () => {
		expect(readDocsLang(mem({ 'awf:docs-lang': '{"x":1}' }))).toBeNull();
		expect(readDocsLang(mem())).toBeNull();
		expect(readDocsLang(null)).toBeNull();
		const throwing = { getItem: () => { throw new Error('SecurityError'); }, setItem: () => { throw new Error('QuotaExceeded'); } };
		expect(readDocsLang(throwing)).toBeNull();
		expect(() => saveDocsLang('fr', throwing)).not.toThrow();
	});
});
