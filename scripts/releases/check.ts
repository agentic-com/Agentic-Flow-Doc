#!/usr/bin/env bun
/**
 * Validate src/data/releases.ts against the docs content (awflow/Agentic-Flow#1345).
 *
 *   bun scripts/releases/check.ts
 *
 * Fails when a "new" change has no link, a link points to no docs page, or a
 * version has no /releases/v{x}-{y}-{z}/ page. The build runs the same check
 * (src/pages/releases/rss.xml.ts); this script is the fast loop while editing.
 */
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { findReleaseProblems } from '../../src/data/releases';

const root = join(import.meta.dir, '..', '..', 'src', 'content', 'docs');

function walk(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
		d.isDirectory() ? walk(join(dir, d.name)) : /\.mdx?$/.test(d.name) ? [join(dir, d.name)] : [],
	);
}

const paths = new Set(
	walk(root).map((file) => {
		const id = relative(root, file).split(sep).join('/').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
		return id ? `/${id.toLowerCase()}/` : '/';
	}),
);

const problems = findReleaseProblems(paths);
if (problems.length) {
	console.error(`✗ ${problems.length} release data problem(s):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log('✓ release data OK');
