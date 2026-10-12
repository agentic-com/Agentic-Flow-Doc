/** bun run i18n:check [--locale fr] [files…] — translations must keep the English structure. */
import { existsSync, readFileSync } from 'node:fs';
import { Glob } from 'bun';
import { compareStructures, structureOf } from './structure';

const args = process.argv.slice(2);
const only = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : undefined;
const explicit = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--locale');
const files: string[] = explicit.length ? explicit : [];
if (!explicit.length) {
	for await (const f of new Glob('src/content/docs/{fr,de,zh-cn}/**/*.{md,mdx}').scan('.')) files.push(f);
}

let failures = 0;
let checked = 0;
for (const file of files.sort()) {
	const m = /^src\/content\/docs\/(fr|de|zh-cn)\/(.+)$/.exec(file);
	if (!m || (only && m[1] !== only)) continue;
	const english = `src/content/docs/${m[2]}`;
	if (!existsSync(english)) continue; // orphans are reported by i18n:status
	checked++;
	const diffs = compareStructures(
		structureOf(readFileSync(english, 'utf8'), english),
		structureOf(readFileSync(file, 'utf8'), file),
	);
	for (const d of diffs) {
		console.error(`${file}:${d.line} ${d.message}`);
		failures++;
	}
}
if (failures) {
	console.error(`\ni18n:check — ${failures} difference(s). Translations may change prose and text props only.`);
	process.exit(1);
}
console.log(`i18n:check — ${checked} translated file(s) match their English structure.`);
