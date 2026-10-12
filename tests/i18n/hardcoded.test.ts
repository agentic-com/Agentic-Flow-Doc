/** Fails when a component renders English text that is not in the dictionary. */
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { Glob } from 'bun';
import allow from './hardcoded-allow.json';

// Task 9 covers these files; Task 10 widens the list to every component.
const FILES = [
	'src/components/awflow/Recipe{Grid,Card,Meta,Use,Steps}.svelte',
	'src/components/awflow/Lesson{Progress,Done}.svelte',
	'src/components/awflow/Release{Timeline,Changes}.svelte',
	'src/components/awflow/FlowPreview.svelte',
];

const markup = (src: string) =>
	src
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/^---[\s\S]*?\n---/, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\{[^{}]*\}/g, '{}');

const findings = (src: string) => [
	...[...markup(src).matchAll(/>([^<>{}]*[A-Za-z]{2,}[^<>{}]*)</g)].map((m) => m[1].trim()),
	...[...markup(src).matchAll(/\b(aria-label|title|placeholder|alt)="([^"]*[A-Za-z]{2,}[^"]*)"/g)].map((m) => m[2]),
].filter((s) => s && !(allow as string[]).includes(s));

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
