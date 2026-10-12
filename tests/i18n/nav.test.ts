import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { NAV_LABELS } from '../../src/i18n/nav-labels';
import { nav, topicLabel } from '../../src/i18n/nav';

describe('nav labels', () => {
	test('nav() returns Starlight translations', () => {
		const out = nav('Overview');
		expect(out.label).toBe('Overview');
		expect(Object.keys(out.translations).sort()).toEqual(['de', 'fr', 'zh-CN']);
	});
	test('nav() throws on an unknown label', () => {
		expect(() => nav('No such label')).toThrow('[i18n] No translation for sidebar label "No such label"');
	});
	test('topicLabel() has both zh spellings', () => {
		const out = topicLabel('Nodes');
		expect(out.en).toBe('Nodes');
		expect(out['zh-CN']).toBe(out['zh-cn']);
	});
	test('every literal label in the configs is covered', () => {
		const sources = readFileSync('astro.config.mjs', 'utf8') + readFileSync('scripts/nodes/sidebar.mjs', 'utf8');
		const used = [...sources.matchAll(/\bnav\(\s*["']([^"']+)["']\s*\)|topicLabel\(\s*["']([^"']+)["']\s*\)|family\(\s*["']([^"']+)["']/g)].map(
			(m) => m[1] ?? m[2] ?? m[3],
		);
		expect(used.length).toBeGreaterThan(150);
		for (const label of used) expect({ label, ok: label in NAV_LABELS }).toEqual({ label, ok: true });
	});
	test('no sidebar label left untranslated in astro.config.mjs', () => {
		const config = readFileSync('astro.config.mjs', 'utf8');
		const sidebar = config.slice(config.indexOf('starlightSidebarTopics(['), config.indexOf('starlightAwflow({'));
		expect(sidebar.match(/\blabel:\s*["'{]/g) ?? []).toEqual([]);
	});
});
