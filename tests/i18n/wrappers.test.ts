import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { Glob } from 'bun';

describe('island wrappers', () => {
	test('index.ts exports no .svelte file directly', () => {
		const index = readFileSync('src/components/awflow/index.ts', 'utf8');
		expect(index.match(/from '\.\/\w+\.svelte'/g) ?? []).toEqual([]);
	});
	test('every island takes a lang prop', async () => {
		for await (const f of new Glob('src/components/awflow/*.svelte').scan('.')) {
			const src = readFileSync(f, 'utf8');
			expect({ f, ok: /\blang\b[^,}]*=\s*['"]en['"]/.test(src) || /\blang\s*\??:\s*Lang/.test(src) }).toEqual({ f, ok: true });
		}
	});
	test('no MDX page uses client:* on an awflow component', async () => {
		const bad: string[] = [];
		for await (const f of new Glob('src/content/docs/**/*.mdx').scan('.')) {
			if (/client:(load|idle|visible)/.test(readFileSync(f, 'utf8'))) bad.push(f);
		}
		expect(bad).toEqual([]);
	});
});
