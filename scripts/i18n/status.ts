/** bun run i18n:status [--json] [--locale fr] [--section app] — which translations are missing or stale. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { gitBlobHash } from '../../src/i18n/blob';
import en from '../../src/i18n/ui/en';

const PREFIXES = ['fr', 'de', 'zh-cn'] as const;
type Prefix = (typeof PREFIXES)[number];
export interface LocaleStatus {
	upToDate: string[];
	stale: { page: string; source: string }[];
	missing: string[];
	orphaned: string[];
	unsourced: string[];
}
export interface Report {
	locales: Record<Prefix, LocaleStatus>;
	dictionary: { keys: number };
}

const walk = (dir: string): string[] =>
	readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(n) ? [p] : [];
	});

/**
 * The `i18n.source` hash of a translated page. The failsafe schema keeps every scalar a string, so
 * an unquoted all-digit hash is not turned into a (lossy) YAML number.
 */
const sourceOf = (file: string): string | undefined => {
	const fm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'));
	if (!fm) return undefined;
	const source = (parseYaml(fm[1], { schema: 'failsafe' }) as { i18n?: { source?: unknown } } | null)?.i18n?.source;
	return source === undefined || source === null ? undefined : String(source);
};

export function statusOf(root: string): Report {
	const docs = join(root, 'src/content/docs');
	const all = walk(docs).map((f) => relative(docs, f).replaceAll('\\', '/'));
	const english = all.filter((p) => !/^(fr|de|zh-cn)\//.test(p));
	const locales = {} as Record<Prefix, LocaleStatus>;
	for (const prefix of PREFIXES) {
		const s: LocaleStatus = { upToDate: [], stale: [], missing: [], orphaned: [], unsourced: [] };
		const translated = new Set(
			all.filter((p) => p.startsWith(prefix + '/')).map((p) => p.slice(prefix.length + 1)),
		);
		for (const page of english) {
			if (!translated.has(page)) {
				// Release notes stay English on purpose (fallback pages), so they are never "missing".
				if (!page.startsWith('releases/')) s.missing.push(page);
				continue;
			}
			const source = sourceOf(join(docs, prefix, page));
			if (!source) s.unsourced.push(page);
			else if (source === gitBlobHash(readFileSync(join(docs, page)))) s.upToDate.push(page);
			else s.stale.push({ page, source });
		}
		for (const page of translated) if (!english.includes(page)) s.orphaned.push(page);
		for (const list of [s.upToDate, s.missing, s.orphaned, s.unsourced]) list.sort();
		s.stale.sort((a, b) => a.page.localeCompare(b.page));
		locales[prefix] = s;
	}
	return { locales, dictionary: { keys: Object.keys(en).length } };
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const opt = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
	const report = statusOf(process.cwd());
	const locale = opt('--locale') as Prefix | undefined;
	const section = opt('--section');
	const keep = (p: string) =>
		!section || p.startsWith(section + '/') || p === `${section}.mdx`;
	for (const p of PREFIXES) {
		if (locale && p !== locale) {
			delete (report.locales as Partial<Report['locales']>)[p];
			continue;
		}
		const s = report.locales[p];
		s.upToDate = s.upToDate.filter(keep);
		s.missing = s.missing.filter(keep);
		s.orphaned = s.orphaned.filter(keep);
		s.unsourced = s.unsourced.filter(keep);
		s.stale = s.stale.filter((x) => keep(x.page));
	}
	if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
	else {
		for (const [p, s] of Object.entries(report.locales)) {
			console.log(
				`${p}: ${s.upToDate.length} up to date · ${s.stale.length} stale · ` +
					`${s.missing.length} missing · ${s.orphaned.length} orphaned · ${s.unsourced.length} without source`,
			);
			for (const x of s.stale) console.log(`  stale     ${x.page}`);
			for (const x of s.orphaned) console.log(`  orphaned  ${x}`);
			for (const x of s.unsourced) console.log(`  no source ${x}`);
		}
		console.log(`dictionary: ${report.dictionary.keys} keys`);
	}
}
