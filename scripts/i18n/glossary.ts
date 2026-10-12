/**
 * bun run i18n:glossary — builds src/i18n/glossary/<locale>.json from the app's catalogs
 * (agentic-flow/src/locales/{fr,de,zh}.po) plus the hand-kept terms.json, so the docs name every
 * UI label exactly as the app shows it. Commit the output: translators don't need the app repo.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parsePo } from './po';

const APP = resolve(process.env.AWFLOW_APP_DIR ?? '../agentic-flow');
const terms = JSON.parse(readFileSync('src/i18n/glossary/terms.json', 'utf8')) as {
	doNotTranslate: string[];
	terms: Record<string, { fr: string; de: string; 'zh-CN': string }>;
};
const TARGETS = [
	{ po: 'fr', out: 'fr', lang: 'fr' },
	{ po: 'de', out: 'de', lang: 'de' },
	{ po: 'zh', out: 'zh-cn', lang: 'zh-CN' },
] as const;

for (const t of TARGETS) {
	const poPath = join(APP, 'src/locales', `${t.po}.po`);
	if (!existsSync(poPath)) throw new Error(`[i18n:glossary] ${poPath} not found. Set AWFLOW_APP_DIR to the agentic-flow checkout.`);
	const app = Object.fromEntries(
		[...parsePo(readFileSync(poPath, 'utf8'))]
			.filter(([en, tr]) => en.length <= 80 && !/[{<(=\/]/.test(en) && !en.endsWith('.') && en !== tr) // labels, not sentences or templates
			.sort(([a], [b]) => a.localeCompare(b)),
	);
	const out = {
		generatedFrom: `agentic-flow/src/locales/${t.po}.po`,
		doNotTranslate: terms.doNotTranslate,
		terms: Object.fromEntries(Object.entries(terms.terms).map(([en, tr]) => [en, tr[t.lang]])),
		app,
	};
	writeFileSync(`src/i18n/glossary/${t.out}.json`, JSON.stringify(out, null, '\t') + '\n');
	console.log(`glossary ${t.out}: ${Object.keys(app).length} app labels, ${Object.keys(out.terms).length} terms`);
}
