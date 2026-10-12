/** Fails when a component renders English text that is not in the dictionary. */
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { Glob } from 'bun';
import allow from './hardcoded-allow.json';

const FILES = [
	'src/components/awflow/*.{svelte,astro}',
	'src/components/home/*.astro',
	'plugins/starlight-awflow/components/*.astro',
	'plugins/starlight-awflow/overrides/*.astro',
];

const markup = (src: string) =>
	src
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/^---[\s\S]*?\n---/, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\{[^{}]*\}/g, '{}')
		.replace(/&nbsp;/g, '\u00a0')
		.replace(/&amp;/g, '&');

const findings = (src: string) => [
	...[...markup(src).matchAll(/>([^<>{}]*[A-Za-z]{2,}[^<>{}]*)</g)].map((m) => m[1].trim()),
	...[...markup(src).matchAll(/\b(aria-label|title|placeholder|alt)="([^"]*[A-Za-z]{2,}[^"]*)"/g)].map((m) => m[2]),
]
	// JSX/Astro control flow that survives the brace stripping (`) : cond ? (`), not text.
	.filter((s) => s && !/^\)|\($|^[\s\S]*Astro\.slots/.test(s) && !(allow as string[]).includes(s));

describe('no hard-coded interface text', () => {
	test('components', async () => {
		const bad: string[] = [];
		for (const pattern of FILES) {
			for await (const f of new Glob(pattern).scan('.')) {
				for (const s of findings(readFileSync(f, 'utf8'))) bad.push(`${f}: ${s}`);
			}
		}
		expect(bad).toEqual([]);
	});
});
