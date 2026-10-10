#!/usr/bin/env bun
/**
 * Draft a release entry from the app's git history (awflow/Agentic-Flow#1345).
 *
 *   bun scripts/releases/draft.ts --repo ../agentic-flow --from v0.8.1 --to v0.8.2 --version 0.8.2
 *
 * Reads `git log <from>..<to>` in the app repo, keeps conventional commits that
 * users notice, and prints a `Release` object to paste into src/data/releases.ts:
 *
 *   feat            → new        (needs a docs link before it can ship)
 *   fix             → fixed
 *   perf, refactor,
 *   improve, ux     → improved
 *   docs, test, ci, build, chore, style, revert, i18n-only → skipped (listed at the end)
 *
 * A `!` after the type or a `BREAKING CHANGE:` footer flags the release as breaking.
 * The output is a DRAFT: rewrite each line for users, merge duplicates, pick a
 * headline, and add links. Then run `bun scripts/releases/check.ts`.
 *
 * Options:
 *   --repo <path>      app repository (default: ../agentic-flow next to this repo)
 *   --from <ref>       older ref, exclusive (required)
 *   --to <ref>         newer ref, inclusive (default: HEAD)
 *   --version <x.y.z>  version for the entry (default: TODO)
 *   --date <yyyy-mm-dd> release date (default: date of the --to commit)
 *   --json             print JSON instead of a TypeScript snippet
 */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Area, ChangeKind } from '../../src/data/releases';

function arg(name: string): string | undefined {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : undefined;
}

const repo = resolve(arg('repo') ?? join(import.meta.dir, '..', '..', '..', 'agentic-flow'));
const from = arg('from');
const to = arg('to') ?? 'HEAD';
const version = arg('version') ?? 'TODO';
const asJson = process.argv.includes('--json');

if (!from || process.argv.includes('--help')) {
	console.error('Usage: bun scripts/releases/draft.ts --from <ref> [--to <ref>] [--repo <path>] [--version x.y.z] [--json]');
	process.exit(from ? 0 : 1);
}
if (!existsSync(join(repo, '.git'))) {
	console.error(`Not a git repository: ${repo} (pass --repo)`);
	process.exit(1);
}

function git(...args: string[]): string {
	const res = Bun.spawnSync(['git', '-C', repo, ...args], { stdout: 'pipe', stderr: 'pipe' });
	if (res.exitCode !== 0) {
		console.error(res.stderr.toString().trim());
		process.exit(1);
	}
	return res.stdout.toString();
}

const KIND_BY_TYPE: Record<string, ChangeKind | undefined> = {
	feat: 'new',
	feature: 'new',
	fix: 'fixed',
	bugfix: 'fixed',
	hotfix: 'fixed',
	perf: 'improved',
	refactor: 'improved',
	improve: 'improved',
	improvement: 'improved',
	ux: 'improved',
	ui: 'improved',
};

/** Scope keyword → area. First match wins; unknown scopes fall back to "App". */
const AREA_BY_SCOPE: [RegExp, Area][] = [
	[/aria|assistant|agent|team|chat|notch|harness|skill|project/, 'Aria & agents'],
	[/memor|awmem/, 'Memory'],
	[/knowledge|\bkb\b|\brag\b|embed/, 'Knowledge'],
	[/market|publish|listing|moderat|template|request/, 'Marketplace'],
	[/local-?ai|webllm|tfjs|transformers|ollama|local-?model|onnx/, 'Local AI'],
	[/oauth|integration|github|discord|telegram|linear|todoist|google|gmail|notion|slack|hubspot|trello|supabase|attio|pipedrive|readwise/, 'Integrations'],
	[/node|trigger|loop|wait|poll|code/, 'Nodes'],
	[/engine|executor|scheduler|workflow|canvas|execution|run|expression/, 'Workflows'],
	[/security|auth|vault|consent|permission|privacy|encrypt/, 'Security'],
];

interface Draft {
	kind: ChangeKind;
	area: Area;
	text: string;
	ref: string;
	breaking: boolean;
}

const RS = '\x1e';
const US = '\x1f';
const log = git('log', '--no-merges', `--format=%h${US}%s${US}%b${RS}`, `${from}..${to}`);
const conventional = /^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;

const drafts: Draft[] = [];
const skipped: string[] = [];
const seen = new Set<string>();

for (const raw of log.split(RS)) {
	const [hash, subject = '', body = ''] = raw.trim().split(US);
	if (!hash) continue;
	const m = subject.match(conventional);
	const kind = m ? KIND_BY_TYPE[m[1].toLowerCase()] : undefined;
	if (!m || !kind) {
		skipped.push(`${hash} ${subject}`);
		continue;
	}
	const scope = (m[2] ?? '').toLowerCase();
	const pr = m[4].match(/\(#(\d+)\)\s*$/)?.[1];
	const text = m[4].replace(/\s*\(#\d+\)\s*$/, '').replace(/^./, (c) => c.toUpperCase());
	const key = `${kind}:${text.toLowerCase()}`;
	if (seen.has(key)) continue;
	seen.add(key);
	const haystack = `${scope} ${text.toLowerCase()}`;
	drafts.push({
		kind,
		area: AREA_BY_SCOPE.find(([re]) => re.test(haystack))?.[1] ?? 'App',
		text: text.endsWith('.') ? text : `${text}.`,
		ref: pr ? `#${pr}` : hash,
		breaking: Boolean(m[3]) || /BREAKING[ -]CHANGE:/.test(body),
	});
}

const order: ChangeKind[] = ['new', 'improved', 'fixed'];
drafts.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.area.localeCompare(b.area));

const date = arg('date') ?? git('log', '-1', '--format=%cs', to).trim();
const breaking = drafts.some((d) => d.breaking);

const release = {
	version,
	date,
	browsers: ['Chrome', 'Web app'],
	headline: 'TODO: what this release means for users — plus N fixes',
	summary: 'TODO: one sentence.',
	...(breaking ? { breaking: true } : {}),
	changes: drafts.map((d) =>
		d.kind === 'new'
			? { kind: d.kind, area: d.area, text: d.text, link: 'TODO', label: 'TODO' }
			: { kind: d.kind, area: d.area, text: d.text },
	),
};

if (asJson) {
	console.log(JSON.stringify({ release, refs: drafts.map((d) => d.ref), skipped }, null, 2));
} else {
	const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
	const lines = drafts.map((d) => {
		const link = d.kind === 'new' ? `, link: 'TODO', label: 'TODO'` : '';
		const flag = d.breaking ? ' BREAKING' : '';
		return `\t\t\t{ kind: '${d.kind}', area: ${q(d.area)}, text: ${q(d.text)}${link} }, // ${d.ref}${flag}`;
	});
	console.log(`// Draft from ${repo} ${from}..${to}: ${drafts.length} change(s), ${skipped.length} skipped.
// Rewrite every line for users, merge duplicates, add links, then run: bun scripts/releases/check.ts
	{
		version: ${q(version)},
		date: ${q(date)},
		browsers: ['Chrome', 'Web app'],
		headline: ${q(release.headline)},
		summary: ${q(release.summary)},${breaking ? '\n\t\tbreaking: true, // update src/content/docs/releases/breaking-changes.mdx' : ''}
		changes: [
${lines.join('\n')}
		],
	},`);
	if (skipped.length) {
		console.log(`\n// Skipped (not a user-facing conventional commit):\n${skipped.map((s) => `//   ${s}`).join('\n')}`);
	}
}
