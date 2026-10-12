# Docs i18n · Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The docs build in English, French, German and Simplified Chinese: every interface string is translated, links and heading anchors work in every language, a build gate keeps translations structurally identical to English, and Home, 404 and Get started are translated, with the language picker live.

**Architecture:** Starlight's built-in i18n (`root` = English, `fr`, `de`, `zh-cn`), one translated MDX file per English page at the same slug. A typed dictionary (`src/i18n/ui.ts` + one file per locale) feeds `.astro` components (`useT(Astro)`) and Svelte islands (`lang` prop + `createT(lang)`, passed by thin `.astro` wrappers). Two Sätteri hast plugins rewrite internal links to the page's locale and copy English heading ids by position. `i18n:check` (structure diff, part of `bun run build`) and `i18n:status` (stale/missing report) keep translations in sync; a `docs-translate` Claude Code skill writes them.

**Tech Stack:** Astro 7.3, Starlight 0.42, Svelte 5 (runes), `@astrojs/markdown-satteri` (hast plugins), `starlight-sidebar-topics` 0.9, unified + remark-parse/remark-mdx/remark-gfm/remark-directive (for `i18n:check`), `bun test`, Playwright (already used by `scripts/capture`).

**Spec:** `docs/superpowers/specs/2026-10-11-docs-i18n-design.md` (sections 1, 3, 5 and the Foundation phase). Phases 2–6 get their own plans after this one ships, because each builds on the interfaces created here.

## Global Constraints

- Locales: `root` (lang `en`, no prefix, current URLs unchanged), `fr` (`/fr/`), `de` (`/de/`), `zh-cn` (`/zh-cn/`, lang `zh-CN`). The app's `zh` maps to `zh-cn`.
- Translated pages mirror the English path and slug. Slugs are never translated.
- `en` is the dictionary's source of truth; `fr`, `de` and `zh-CN` define every key (type-checked and unit-tested). Every task that adds a key adds it in all four locales in the same commit.
- Tone matches the app: French "vous" with a non-breaking space (U+00A0) before `: ; ? !`; German "Sie"; Chinese full-width punctuation, no spaces between Chinese characters, spaces kept around Latin words and numbers.
- Never translated: AWFlow, Agentic Workflow, Aria, Chrome Web Store, Firefox Add-ons, provider and app names, node ids, keyboard keys.
- Sources keep English links; translators never edit links or heading ids.
- Release notes stay English (fallback pages); RSS stays English; `llms.txt` stays English.
- English screenshots everywhere in this phase.
- No translation API at build time; no API key or paid service.
- localStorage access is always wrapped in try/catch.
- Never run a repo-wide formatter; format only the files you touched.
- Work on branch `feat/docs-i18n-foundation` from `Dev`; merge locally into `Dev` at the end; do not push (the owner asks for pushes).
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A translated page linking to a page that has no translation yet** — the link must land on `/fr/<path>/` (Starlight's English fallback with its notice), never 404, and the links validator must not fail the build. Pinned in Task 4 (`localizeHref` test) and Task 14 (built-site link check).
2. **A link to a file, not a page** (`/examples/x.awf`, `/og/x.png`, `/releases/rss.xml`, `/recipes/listings.json`, `/x.md`, `/llms.txt`) — must stay unprefixed or the download breaks. Pinned in Task 1 tests.
3. **An anchor link into a translated page** (`/fr/app/connections/oauth-client/#google`) — the French heading must carry the English id. Pinned in Task 4 (plugin test) and Task 14 (dist assertion).
4. **A reader with an old `localStorage` value or blocked storage** (private window, `awf:docs-lang` = garbage) — picker and lesson rail must still render and work. Pinned in Task 7 (`readDocsLang` test).
5. **Chinese text in places sized for Latin text** (OG image titles, section tabs, the eyebrow, search groups) — glyphs must render (no tofu) and nothing overflows at 375 px. Pinned in Task 6 (OG font test) and Task 14 (Playwright screenshots at 375 px in zh-cn).

---

## File Structure

New (docs repo):

| Path | Responsibility |
| --- | --- |
| `src/i18n/locales.ts` | Locale list, `Lang` type, `langFromPath`, `stripLocale`, `localizeHref`. No Astro imports (usable in scripts, config, islands). |
| `src/i18n/ui/en.ts` · `fr.ts` · `de.ts` · `zh-cn.ts` | Interface strings, flat keys. |
| `src/i18n/ui/types.ts` | `UIKey`, `Dict` types derived from `en.ts`. |
| `src/i18n/ui.ts` | `createT(lang)`, `useT(astro)`, `pageLang(astro)`. |
| `src/i18n/nav-labels.ts` | Sidebar/topic label translations keyed by English label. |
| `src/i18n/nav.ts` | `nav(label)`, `topicLabel(label)` helpers for `astro.config.mjs` and `scripts/nodes/sidebar.mjs`. |
| `src/i18n/blob.ts` | `gitBlobHash(content)`, `englishSourceFor(file)`. |
| `src/i18n/markdown/links.ts` | Sätteri hast plugin: localize internal links in translated pages. |
| `src/i18n/markdown/heading-ids.ts` | Sätteri hast plugin: English heading ids by position. |
| `src/i18n/markdown/english-headings.ts` | Extract `{depth, slug}[]` from an English source file. |
| `src/i18n/docs-lang.ts` | `readDocsLang()` / `saveDocsLang()` (localStorage `awf:docs-lang`). |
| `src/components/awflow/*.astro` (one per island) | Wrappers that pass `lang` and keep hydration. |
| `scripts/i18n/structure.ts` | MDX → comparable structure (headings, components, code, links, frontmatter). |
| `scripts/i18n/check.ts` | `bun run i18n:check`. |
| `scripts/i18n/status.ts` | `bun run i18n:status [--json]`. |
| `scripts/i18n/glossary.ts` | `bun run i18n:glossary` (reads the app's `.po`). |
| `scripts/i18n/po.ts` | Minimal `.po` parser. |
| `src/i18n/glossary/terms.json` | Hand-kept: do-not-translate list + key terms. |
| `src/i18n/glossary/{fr,de,zh-cn}.json` | Generated glossary (committed). |
| `src/i18n/style/{fr,de,zh-cn}.md` | Style notes. |
| `.claude/skills/docs-translate/SKILL.md` | Translation skill. |
| `tests/i18n/*.test.ts` | Unit tests (`bun test`). |
| `tests/fixtures/i18n/**` | Fixture pages for `i18n:check`. |
| `src/content/docs/{fr,de,zh-cn}/index.mdx`, `404.md`, `get-started/*.mdx` | Phase 1 translations. |

Modified: `package.json`, `astro.config.mjs`, `src/content.config.ts`, `scripts/nodes/sidebar.mjs`, `plugins/starlight-awflow/{route-middleware.ts,types.ts,overrides/*.astro,components/*.astro,lib/levels.ts,lib/search.ts,lib/nodes.ts}`, `src/pages/og/[...slug].ts`, every `src/components/awflow/*.svelte`, `src/components/awflow/{index.ts,recipes.ts,GuidedShot.astro,StepShot.astro,FlowPreview.astro}`, `src/data/{releases.ts,flowPreview.ts}`, `src/components/home/{Home.astro,HeroStage.astro,SearchTyper.astro,data.ts}`, MDX pages that use `client:*` on islands, `CONTRIBUTING.md`.

---

### Task 0: Branch and tracking issues

**Files:** none (git + GitHub only)

- [ ] **Step 1: Branch**

```bash
cd /Users/dannickstark/Documents/Projets/Agentic-Flow/awflow-code/Agentic-Flow-Doc
git checkout Dev && git checkout -b feat/docs-i18n-foundation
```

- [ ] **Step 2: Create the label, epic and phase issues** (in `awflow/Agentic-Flow`, like epic #1308)

```bash
gh label create docs-i18n -R awflow/Agentic-Flow --color 0E8A16 --description "Docs in French, German and Chinese" || true
gh issue create -R awflow/Agentic-Flow --label docs-i18n --title "Epic: docs in French, German and Chinese" --body-file - <<'EOF'
The docs ship in the extension's four languages (en, fr, de, zh-CN). Design: `docs/superpowers/specs/2026-10-11-docs-i18n-design.md` in agentic-com/Agentic-Flow-Doc. Supersedes the "English only for now" decision of #1332.

Phases (each ships on its own; untranslated pages fall back to English):
- [ ] Phase 1 · Foundation + Home, 404, Get started, picker live
- [ ] Phase 2 · Use the app + Concepts, screenshot text overlays
- [ ] Phase 3 · Recipes, per-locale recipe data, goal ids, listings.json i18n
- [ ] Phase 4 · Nodes: locale-aware generator, translation memory
- [ ] Phase 5 · App side (`docsUrl()`) + hint bar + localized Ask Aria
- [ ] Phase 6 · Follow-ups: localized captures; app catalog gaps
EOF
```

Then create one issue per phase with the phase's bullet list from the spec's Rollout section, label `docs-i18n`, body linking the epic. Add the epic and the six issues to org Project #2:

```bash
gh project item-add 2 --owner awflow --url <issue-url>   # once per issue
```

Edit the epic body to replace each phase line with `- [ ] #<number> Phase N · …`. Record the issue numbers; commit messages in later tasks reference the Phase 1 issue as `(awflow/Agentic-Flow#<phase1>)`.

---

### Task 1: Test runner, locale helpers, `localizeHref`

**Files:**
- Modify: `package.json`
- Create: `src/i18n/locales.ts`
- Test: `tests/i18n/locales.test.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'en' | 'fr' | 'de' | 'zh-CN'`
  - `const LOCALES: readonly { lang: Lang; prefix: '' | 'fr' | 'de' | 'zh-cn'; label: string }[]`
  - `const TRANSLATED_PREFIXES: readonly ['fr', 'de', 'zh-cn']`
  - `toLang(value: string | undefined | null): Lang` (accepts `zh`, `zh-cn`, `zh-CN`, `fr-CA`…; unknown → `'en'`)
  - `prefixOf(lang: Lang): '' | 'fr' | 'de' | 'zh-cn'`
  - `langFromPath(path: string): Lang` (path or content id, leading slash optional)
  - `stripLocale(path: string): string` (`/fr/app/x/` → `/app/x/`, `fr/app/x` → `app/x`, `/fr/` → `/`, `fr` → `` )
  - `localizeHref(href: string, lang: Lang): string`

- [ ] **Step 1: Add the test script and explicit dev dependencies**

In `package.json` `scripts` add `"test": "bun test tests"`. Add to `devDependencies` (they are already in `node_modules` transitively; pin the installed versions so they can't vanish):

```bash
bun add -d unified remark-parse remark-mdx remark-gfm remark-directive yaml github-slugger @types/bun
```

- [ ] **Step 2: Write the failing test**

```ts
// tests/i18n/locales.test.ts
import { describe, expect, test } from 'bun:test';
import { langFromPath, localizeHref, prefixOf, stripLocale, toLang } from '../../src/i18n/locales';

describe('toLang', () => {
	test('maps app and browser codes', () => {
		expect(toLang('zh')).toBe('zh-CN');
		expect(toLang('zh-cn')).toBe('zh-CN');
		expect(toLang('zh-CN')).toBe('zh-CN');
		expect(toLang('fr-CA')).toBe('fr');
		expect(toLang('de')).toBe('de');
		expect(toLang('en-US')).toBe('en');
		expect(toLang('es')).toBe('en');
		expect(toLang(undefined)).toBe('en');
		expect(toLang('')).toBe('en');
	});
	test('prefixOf', () => {
		expect(prefixOf('en')).toBe('');
		expect(prefixOf('zh-CN')).toBe('zh-cn');
	});
});

describe('langFromPath / stripLocale', () => {
	test('paths and content ids', () => {
		expect(langFromPath('/fr/app/x/')).toBe('fr');
		expect(langFromPath('zh-cn/get-started')).toBe('zh-CN');
		expect(langFromPath('/app/x/')).toBe('en');
		expect(langFromPath('/french-press/')).toBe('en');
		expect(stripLocale('/fr/app/x/')).toBe('/app/x/');
		expect(stripLocale('de/app/x')).toBe('app/x');
		expect(stripLocale('/zh-cn/')).toBe('/');
		expect(stripLocale('fr')).toBe('');
		expect(stripLocale('/app/fr/')).toBe('/app/fr/');
	});
});

describe('localizeHref', () => {
	test('English is unchanged', () => {
		expect(localizeHref('/app/connections/slack/', 'en')).toBe('/app/connections/slack/');
	});
	test('prefixes internal page links, keeps query and hash', () => {
		expect(localizeHref('/app/connections/slack/', 'fr')).toBe('/fr/app/connections/slack/');
		expect(localizeHref('/', 'zh-CN')).toBe('/zh-cn/');
		expect(localizeHref('/recipes/?goal=monitor-pages', 'de')).toBe('/de/recipes/?goal=monitor-pages');
		expect(localizeHref('/app/connections/oauth-client/#google', 'fr')).toBe('/fr/app/connections/oauth-client/#google');
		expect(localizeHref('/app/connections/slack', 'fr')).toBe('/fr/app/connections/slack');
	});
	test('leaves already-localized, external, relative and anchor links alone', () => {
		expect(localizeHref('/fr/app/x/', 'fr')).toBe('/fr/app/x/');
		expect(localizeHref('/de/app/x/', 'fr')).toBe('/de/app/x/');
		expect(localizeHref('https://awflow.io/', 'fr')).toBe('https://awflow.io/');
		expect(localizeHref('//cdn.example.com/x', 'fr')).toBe('//cdn.example.com/x');
		expect(localizeHref('#ask-aria', 'fr')).toBe('#ask-aria');
		expect(localizeHref('../x/', 'fr')).toBe('../x/');
		expect(localizeHref('mailto:a@example.com', 'fr')).toBe('mailto:a@example.com');
	});
	test('never prefixes files and machine endpoints', () => {
		for (const href of [
			'/examples/summarize-this-page.awf',
			'/og/app.png',
			'/releases/rss.xml',
			'/recipes/listings.json',
			'/app/connections/slack.md',
			'/llms.txt',
			'/llms-full.txt',
			'/favicon.svg',
			'/_astro/x.css',
			'/pagefind/pagefind.js',
		]) {
			expect(localizeHref(href, 'fr')).toBe(href);
		}
	});
});
```

- [ ] **Step 3: Run it to see it fail**

Run: `bun test tests/i18n/locales.test.ts`
Expected: FAIL — `Cannot find module '../../src/i18n/locales'`.

- [ ] **Step 4: Implement**

```ts
// src/i18n/locales.ts
/**
 * Docs languages (spec 2026-10-11-docs-i18n-design.md §1). English is the root locale and keeps
 * today's URLs; translations live under /fr/, /de/ and /zh-cn/ with English slugs.
 * No Astro imports: used by astro.config.mjs, scripts, plugins and Svelte islands.
 */
export type Lang = 'en' | 'fr' | 'de' | 'zh-CN';
export type Prefix = '' | 'fr' | 'de' | 'zh-cn';

export const LOCALES = [
	{ lang: 'en', prefix: '', label: 'English' },
	{ lang: 'fr', prefix: 'fr', label: 'Français' },
	{ lang: 'de', prefix: 'de', label: 'Deutsch' },
	{ lang: 'zh-CN', prefix: 'zh-cn', label: '简体中文' },
] as const satisfies readonly { lang: Lang; prefix: Prefix; label: string }[];

export const TRANSLATED_PREFIXES = ['fr', 'de', 'zh-cn'] as const;
export const LANGS: readonly Lang[] = LOCALES.map((l) => l.lang);

/** Any language code (app `zh`, browser `fr-CA`, route `zh-CN`) → a docs language; unknown → English. */
export function toLang(value: string | undefined | null): Lang {
	const v = (value ?? '').toLowerCase();
	if (v === 'zh' || v.startsWith('zh-')) return 'zh-CN';
	const base = v.split('-')[0];
	return base === 'fr' || base === 'de' ? base : 'en';
}

export const prefixOf = (lang: Lang): Prefix => LOCALES.find((l) => l.lang === lang)?.prefix ?? '';

const PREFIX_RE = /^\/?(fr|de|zh-cn)(?=\/|$)/;

/** Language of a URL path or a content id (`fr/app/x`). */
export function langFromPath(path: string): Lang {
	const m = PREFIX_RE.exec(path);
	return m ? toLang(m[1]) : 'en';
}

/** Removes the locale segment, keeping the leading/trailing slash style of the input. */
export function stripLocale(path: string): string {
	const m = PREFIX_RE.exec(path);
	if (!m) return path;
	const rest = path.slice(m[0].length);
	if (path.startsWith('/')) return rest === '' ? '/' : rest;
	return rest.replace(/^\//, '');
}

/** Root paths that are files or machine endpoints, never pages: they exist once, unprefixed. */
const NOT_PAGES = /^\/(og|examples|_astro|pagefind)\/|^\/releases\/rss\.xml$|^\/recipes\/listings\.json$/;
const HAS_EXTENSION = /\/[^/]+\.[a-z0-9]+$/i;

/** Internal absolute page link → the same page in `lang`. Everything else is returned unchanged. */
export function localizeHref(href: string, lang: Lang): string {
	const prefix = prefixOf(lang);
	if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href;
	const cut = href.search(/[?#]/);
	const path = cut === -1 ? href : href.slice(0, cut);
	const tail = cut === -1 ? '' : href.slice(cut);
	if (PREFIX_RE.test(path) || NOT_PAGES.test(path) || HAS_EXTENSION.test(path)) return href;
	return `/${prefix}${path}${tail}`;
}
```

- [ ] **Step 5: Run the test**

Run: `bun test tests/i18n/locales.test.ts`
Expected: PASS (all tests).

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock src/i18n/locales.ts tests/i18n/locales.test.ts
git commit -m "feat(i18n): locale helpers and localizeHref"
```

---

### Task 2: Interface dictionary core (`createT`, `useT`)

**Files:**
- Create: `src/i18n/ui/en.ts`, `src/i18n/ui/fr.ts`, `src/i18n/ui/de.ts`, `src/i18n/ui/zh-cn.ts`, `src/i18n/ui/types.ts`, `src/i18n/ui.ts`
- Test: `tests/i18n/ui.test.ts`

**Interfaces:**
- Consumes: `Lang`, `toLang`, `localizeHref` (Task 1).
- Produces:
  - `type UIKey = keyof typeof en`; `type Dict = Record<UIKey, string>`
  - `createT(lang?: Lang | string): T` where
    `T = ((key: UIKey, vars?: Record<string, string | number>) => string) & { lang: Lang; plural(base: string, n: number, vars?: Record<string, string | number>): string; date(iso: string, opts?: Intl.DateTimeFormatOptions): string; href(href: string): string }`
  - `pageLang(astro: { locals: unknown }): Lang` (reads `locals.starlightRoute?.lang`)
  - `useT(astro: { locals: unknown }): T`
  - Key naming: `<area>.<name>`, plurals as `<base>_one` / `<base>_other` (every locale defines both; Chinese may use the same text), placeholders `{name}`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/ui.test.ts
import { describe, expect, test } from 'bun:test';
import en from '../../src/i18n/ui/en';
import fr from '../../src/i18n/ui/fr';
import de from '../../src/i18n/ui/de';
import zh from '../../src/i18n/ui/zh-cn';
import { createT } from '../../src/i18n/ui';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('dictionary completeness', () => {
	for (const [name, dict] of [['fr', fr], ['de', de], ['zh-cn', zh]] as const) {
		test(`${name} has exactly the English keys`, () => {
			expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
		});
		test(`${name} keeps every placeholder`, () => {
			for (const key of Object.keys(en) as (keyof typeof en)[]) {
				expect({ key, p: placeholders(dict[key]) }).toEqual({ key, p: placeholders(en[key]) });
			}
		});
		test(`${name} has no empty strings`, () => {
			for (const [key, value] of Object.entries(dict)) expect({ key, empty: value.trim() === '' }).toEqual({ key, empty: false });
		});
	}
	test('French puts a non-breaking space before : ; ? !', () => {
		for (const [key, value] of Object.entries(fr)) {
			const bad = /[^\u00a0\u202f\s{}][:;?!](\s|$)/.test(value.replace(/https?:\/\/\S+/g, ''));
			expect({ key, bad }).toEqual({ key, bad: false });
		}
	});
});

describe('createT', () => {
	test('looks up, interpolates, falls back to English for unknown langs', () => {
		const t = createT('fr');
		expect(t.lang).toBe('fr');
		expect(t('common.minutes', { n: 5 })).toBe(fr['common.minutes'].replace('{n}', '5'));
		expect(createT('es')('common.minutes', { n: 5 })).toBe(en['common.minutes'].replace('{n}', '5'));
	});
	test('plural picks the CLDR category', () => {
		expect(createT('en').plural('common.lessons', 1)).toBe('1 lesson');
		expect(createT('en').plural('common.lessons', 3)).toBe('3 lessons');
		expect(createT('zh-CN').plural('common.lessons', 1)).toBe(zh['common.lessons_other'].replace('{count}', '1'));
	});
	test('date uses the page language', () => {
		expect(createT('en').date('2026-10-11')).toBe('11 October 2026');
		expect(createT('fr').date('2026-10-11')).toBe('11 octobre 2026');
		expect(createT('de').date('2026-10-11')).toBe('11. Oktober 2026');
		expect(createT('zh-CN').date('2026-10-11')).toBe('2026年10月11日');
	});
	test('href localizes', () => {
		expect(createT('de').href('/app/')).toBe('/de/app/');
	});
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/ui.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the core and the seed keys**

```ts
// src/i18n/ui/en.ts
/**
 * Interface strings, English (source of truth). Flat keys `<area>.<name>`; plurals `<base>_one` /
 * `<base>_other`; placeholders `{name}`. fr.ts, de.ts and zh-cn.ts must define every key
 * (tests/i18n/ui.test.ts). Add a key in all four files in the same commit.
 */
export default {
	'common.minutes': '{n} min',
	'common.lessons_one': '{count} lesson',
	'common.lessons_other': '{count} lessons',
} as const;
```

```ts
// src/i18n/ui/types.ts
import type en from './en';
export type UIKey = keyof typeof en;
export type Dict = Record<UIKey, string>;
```

```ts
// src/i18n/ui/fr.ts
import type { Dict } from './types';
const fr: Dict = {
	'common.minutes': '{n} min',
	'common.lessons_one': '{count} leçon',
	'common.lessons_other': '{count} leçons',
};
export default fr;
```

```ts
// src/i18n/ui/de.ts
import type { Dict } from './types';
const de: Dict = {
	'common.minutes': '{n} Min.',
	'common.lessons_one': '{count} Lektion',
	'common.lessons_other': '{count} Lektionen',
};
export default de;
```

```ts
// src/i18n/ui/zh-cn.ts
import type { Dict } from './types';
const zh: Dict = {
	'common.minutes': '{n} 分钟',
	'common.lessons_one': '{count} 节课',
	'common.lessons_other': '{count} 节课',
};
export default zh;
```

```ts
// src/i18n/ui.ts
/**
 * Interface strings for components (spec §1).
 *   .astro:  const t = useT(Astro);            t('header.install')
 *   Svelte:  let { lang = 'en' } = $props();  const t = $derived(createT(lang));
 */
import { localizeHref, toLang, type Lang } from './locales';
import en from './ui/en';
import fr from './ui/fr';
import de from './ui/de';
import zh from './ui/zh-cn';
import type { Dict, UIKey } from './ui/types';

export type { Dict, UIKey };
type Vars = Record<string, string | number>;

const DICTS: Record<Lang, Dict> = { en, fr, de, 'zh-CN': zh };

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s);

export interface T {
	(key: UIKey, vars?: Vars): string;
	lang: Lang;
	plural(base: string, n: number, vars?: Vars): string;
	date(iso: string, opts?: Intl.DateTimeFormatOptions): string;
	href(href: string): string;
}

export function createT(lang?: Lang | string | null): T {
	const l = toLang(lang);
	const dict = DICTS[l];
	const t = ((key: UIKey, vars?: Vars) => fill(dict[key] ?? en[key] ?? key, vars)) as T;
	t.lang = l;
	t.plural = (base, n, vars) => {
		const cat = new Intl.PluralRules(l).select(n);
		const key = (`${base}_${cat}` in dict ? `${base}_${cat}` : `${base}_other`) as UIKey;
		return t(key, { count: n, ...vars });
	};
	// English keeps the British date format the docs already use (11 October 2026).
	t.date = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
		new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-GB' : l, { timeZone: 'UTC', ...opts });
	t.href = (href) => localizeHref(href, l);
	return t;
}

/** Language of the page being rendered (Starlight route data; `en` outside Starlight routes). */
export function pageLang(astro: { locals: unknown }): Lang {
	const route = (astro.locals as { starlightRoute?: { lang?: string } }).starlightRoute;
	return toLang(route?.lang);
}

export const useT = (astro: { locals: unknown }) => createT(pageLang(astro));
```

- [ ] **Step 4: Run the test**

Run: `bun test tests/i18n/ui.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui.ts src/i18n/ui tests/i18n/ui.test.ts
git commit -m "feat(i18n): typed interface dictionary with createT/useT"
```

---

### Task 3: Locale config, sidebar and topic translations, content schema

**Files:**
- Modify: `astro.config.mjs` (locales, every sidebar `label`, topic labels, links validator), `scripts/nodes/sidebar.mjs`, `src/content.config.ts`
- Create: `src/i18n/nav-labels.ts`, `src/i18n/nav.ts`
- Test: `tests/i18n/nav.test.ts`

**Interfaces:**
- Consumes: `LOCALES` (Task 1).
- Produces:
  - `NAV_LABELS: Record<string, { fr: string; de: string; 'zh-CN': string }>` keyed by the English label.
  - `nav(label: string): { label: string; translations: Record<string, string> }` — throws `[i18n] No translation for sidebar label "<label>"` when missing.
  - `topicLabel(label: string): Record<string, string>` — keys `en`, `fr`, `de`, `zh-CN` and `zh-cn` (sidebar-topics looks up by Astro's `currentLocale`; both spellings make it safe).
  - Frontmatter `i18n?: { source: string; reviewed?: boolean }` on the docs schema.

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/nav.test.ts
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
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/nav.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `nav.ts`**

```ts
// src/i18n/nav.ts
/**
 * Sidebar and topic label translations for astro.config.mjs and scripts/nodes/sidebar.mjs.
 * Labels are keyed by their English text in nav-labels.ts; a missing one fails the build.
 */
import { NAV_LABELS } from './nav-labels';

const lookup = (label: string) => {
	const tr = NAV_LABELS[label];
	if (!tr) throw new Error(`[i18n] No translation for sidebar label "${label}" (add it to src/i18n/nav-labels.ts)`);
	return tr;
};

/** Spread into a sidebar item: `{ ...nav('Overview'), link: 'app' }`. */
export const nav = (label: string) => ({ label, translations: { ...lookup(label) } });

/** Value for a starlight-sidebar-topics `label`. */
export const topicLabel = (label: string) => {
	const tr = lookup(label);
	return { en: label, fr: tr.fr, de: tr.de, 'zh-CN': tr['zh-CN'], 'zh-cn': tr['zh-CN'] };
};
```

- [ ] **Step 4: Convert the configs**

In `astro.config.mjs`, add `import { nav, topicLabel } from "./src/i18n/nav.ts";` and inside `starlightSidebarTopics([...])`:
- every topic `label: "X"` (and the existing `label: { en: "Nodes", fr: "Nœuds" }`) → `label: topicLabel("X")`;
- every item or group `label: "X", …` → `...nav("X"), …`.

Mechanical rewrite for the item labels (run, then read the diff):

```bash
perl -0pi -e 's/(\{\s*)label: "([^"]+)",/$1...nav("$2"),/g' astro.config.mjs
```

Then fix the topic labels by hand (they must use `topicLabel`, not `nav`) and leave `label:` untouched outside the sidebar (social links, `starlightAwflow` sections, `starlightKbd` types, locales). In `scripts/nodes/sidebar.mjs`, import `nav` from `'../../src/i18n/nav.ts'`; `family(label, directory)` returns `{ ...nav(label), collapsed: true, … }`; wrap `'Node catalog'`, `'Built-in overview'`, `'Integrations'`, `'Rate limits'`, `'Unknown node'`, `'Deprecated'` and each integration group `g.label` with `nav(...)`. Node names (`n.name`) and the `New` / `Deprecated` badges stay English in this phase (phase 4 localizes node data).

- [ ] **Step 5: Write `nav-labels.ts`**

List every label the test finds (sidebar labels, topic labels, `family()` labels, integration group labels from `src/data/integration-groups.json`). Dump them:

```bash
bun -e 'const s=(await Bun.file("astro.config.mjs").text())+(await Bun.file("scripts/nodes/sidebar.mjs").text());const g=JSON.parse(await Bun.file("src/data/integration-groups.json").text());const set=new Set([...s.matchAll(/nav\("([^"]+)"\)|topicLabel\("([^"]+)"\)|family\(\x27([^\x27]+)\x27/g)].map(m=>m[1]??m[2]??m[3]));for(const x of (g.groups??g)) if(x.label) set.add(x.label);console.log([...set].join("\n"))'
```

Write `src/i18n/nav-labels.ts` as `export const NAV_LABELS: Record<string, { fr: string; de: string; 'zh-CN': string }> = { … }` with one entry per label, translated per the Global Constraints (vous/Sie, product and app names unchanged: `"Slack": { fr: "Slack", de: "Slack", "zh-CN": "Slack" }`). Use the app's wording for UI areas: look the English label up in `../agentic-flow/src/locales/{fr,de,zh}.po` (`grep -n -A1 'msgid "Connections"'`) and reuse its `msgstr` when one exists. Header to the file:

```ts
/**
 * Sidebar, topic and group labels → translations, keyed by the English label used in
 * astro.config.mjs / scripts/nodes/sidebar.mjs (via nav() and topicLabel()). Where the app has
 * the same label, its translation from agentic-flow/src/locales/*.po is reused verbatim.
 */
```

- [ ] **Step 6: Locales, links validator, schema**

In `astro.config.mjs`, replace the `locales` block:

```js
    defaultLocale: "root",
    // Docs in the extension's four languages (spec docs/superpowers/specs/2026-10-11-docs-i18n-design.md).
    // Translated pages mirror English slugs under /fr/, /de/ and /zh-cn/.
    locales: {
      root: { label: "English", lang: "en" },
      fr: { label: "Français", lang: "fr" },
      de: { label: "Deutsch", lang: "de" },
      "zh-cn": { label: "简体中文", lang: "zh-CN" },
    },
```

In `starlightLinksValidator({...})` add `errorOnFallbackPages: false,` with the comment `// Translated pages may link to pages not translated yet (Starlight serves the English fallback).` Keep `errorOnInvalidHashes` at its default (on).

In `src/content.config.ts`, add to `awflowSchema`:

```ts
	/** Translation tracking (docs i18n): the git blob hash of the English file this page was translated from. */
	i18n: z
		.object({
			source: z.string().regex(/^[0-9a-f]{40}$/),
			/** True once a native speaker checked the page. Informational only. */
			reviewed: z.boolean().optional(),
		})
		.optional(),
```

- [ ] **Step 7: Run tests and build**

Run: `bun test tests/i18n && bun run build 2>&1 | tail -20`
Expected: tests PASS; build succeeds. `ls dist/fr/app/connections/slack/index.html dist/zh-cn/index.html` both exist (fallback pages). `grep -o 'lang="zh-CN"' dist/zh-cn/index.html | head -1` prints `lang="zh-CN"`.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs scripts/nodes/sidebar.mjs src/content.config.ts src/i18n/nav.ts src/i18n/nav-labels.ts tests/i18n/nav.test.ts
git commit -m "feat(i18n): fr, de and zh-cn locales with translated sidebar and topics"
```

---

### Task 4: Markdown plugins — localized links and English heading ids

**Files:**
- Create: `src/i18n/markdown/english-headings.ts`, `src/i18n/markdown/links.ts`, `src/i18n/markdown/heading-ids.ts`
- Modify: `astro.config.mjs` (`markdown.processor`)
- Test: `tests/i18n/markdown.test.ts`, `tests/i18n/heading-ids-dist.test.ts`

**Interfaces:**
- Consumes: `langFromPath`, `localizeHref`, `TRANSLATED_PREFIXES` (Task 1).
- Produces:
  - `englishHeadings(source: string, format: 'md' | 'mdx'): Promise<{ depth: number; slug: string }[]>` — the ids Astro's built-in heading-id plugin gives that source (github-slugger over each `h1`–`h6` element's text, in document order).
  - `translatedInfo(fileURL: URL | undefined): { lang: Lang; englishPath: string } | null` — `null` for English files.
  - `i18nLinks: HastPluginEntry`, `i18nHeadingIds: HastPluginEntry` (factory form `(ctx) => definition | null`).

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/markdown.test.ts
import { describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mdxToJs } from 'satteri';
import { englishHeadings, translatedInfo } from '../../src/i18n/markdown/english-headings';
import { i18nHeadingIds } from '../../src/i18n/markdown/heading-ids';
import { i18nLinks } from '../../src/i18n/markdown/links';

const root = mkdtempSync(join(tmpdir(), 'awf-i18n-'));
const docs = join(root, 'src/content/docs');
mkdirSync(join(docs, 'fr/app'), { recursive: true });
mkdirSync(join(docs, 'app'), { recursive: true });
writeFileSync(join(docs, 'app/page.mdx'), '# T\n\n## Before you start\n\n### Google\n\n## Use it\n');
writeFileSync(
	join(docs, 'fr/app/page.mdx'),
	'# T\n\n## Avant de commencer\n\n### Google\n\n## Utilisation\n\n[Slack](/app/connections/slack/) [fichier](/examples/a.awf) [ancre](/app/x/#google)\n',
);

const compile = async (file: string) =>
	String(
		(
			await mdxToJs(await Bun.file(file).text(), {
				fileURL: pathToFileURL(file),
				hastPlugins: [i18nLinks, i18nHeadingIds],
			})
		).code,
	);

describe('englishHeadings', () => {
	test('slugs in order', async () => {
		expect(await englishHeadings('# T\n\n## Before you start\n\n### Google\n\n## Use it\n', 'mdx')).toEqual([
			{ depth: 1, slug: 't' },
			{ depth: 2, slug: 'before-you-start' },
			{ depth: 3, slug: 'google' },
			{ depth: 2, slug: 'use-it' },
		]);
	});
	test('translatedInfo', () => {
		expect(translatedInfo(pathToFileURL(join(docs, 'app/page.mdx')))).toBeNull();
		expect(translatedInfo(pathToFileURL(join(docs, 'fr/app/page.mdx')))).toEqual({
			lang: 'fr',
			englishPath: join(docs, 'app/page.mdx'),
		});
	});
});

describe('plugins on a French page', () => {
	test('heading ids come from English by position', async () => {
		const code = await compile(join(docs, 'fr/app/page.mdx'));
		expect(code).toContain('before-you-start');
		expect(code).toContain('use-it');
		expect(code).not.toContain('avant-de-commencer');
	});
	test('internal page links are localized, files and anchors kept', async () => {
		const code = await compile(join(docs, 'fr/app/page.mdx'));
		expect(code).toContain('/fr/app/connections/slack/');
		expect(code).toContain('"/examples/a.awf"');
		expect(code).toContain('/fr/app/x/#google');
	});
	test('English pages are untouched', async () => {
		const code = await compile(join(docs, 'app/page.mdx'));
		expect(code).toContain('before-you-start');
	});
});
```

(If `satteri`'s `mdxToJs` option names differ, check `node_modules/satteri/dist/compile.d.ts` and adapt the call in the test only; the plugins' contract does not change.)

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/markdown.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

```ts
// src/i18n/markdown/english-headings.ts
/**
 * Heading ids of the English page a translation mirrors (spec §1 "Heading anchors"). The ids are
 * what Astro's own heading-id plugin assigns: github-slugger over each heading's text, in order.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { markdownToHast, mdxToHast } from 'satteri';
import { langFromPath, type Lang } from '../locales';

export interface EnglishHeading {
	depth: number;
	slug: string;
}

const DOCS_RE = /^(.*\/src\/content\/docs\/)((?:fr|de|zh-cn)\/)(.+)$/;

export function translatedInfo(fileURL: URL | undefined): { lang: Lang; englishPath: string } | null {
	if (!fileURL) return null;
	const m = DOCS_RE.exec(fileURLToPath(fileURL).replaceAll('\\', '/'));
	if (!m) return null;
	return { lang: langFromPath(m[2]), englishPath: m[1] + m[3] };
}

const textOf = (node: any): string =>
	node.type === 'text' ? node.value : Array.isArray(node.children) ? node.children.map(textOf).join('') : '';

export async function englishHeadings(source: string, format: 'md' | 'mdx'): Promise<EnglishHeading[]> {
	const tree: any = await (format === 'mdx' ? mdxToHast(source) : markdownToHast(source));
	const slugger = new GithubSlugger();
	const out: EnglishHeading[] = [];
	const walk = (node: any) => {
		if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
			const id = node.properties?.id;
			out.push({ depth: Number(node.tagName[1]), slug: typeof id === 'string' ? id : slugger.slug(textOf(node)) });
			return;
		}
		node.children?.forEach(walk);
	};
	walk(tree);
	return out;
}

const cache = new Map<string, Promise<EnglishHeading[]>>();
export function englishHeadingsFor(englishPath: string): Promise<EnglishHeading[]> {
	if (!cache.has(englishPath)) {
		cache.set(
			englishPath,
			existsSync(englishPath)
				? englishHeadings(readFileSync(englishPath, 'utf8'), englishPath.endsWith('.mdx') ? 'mdx' : 'md')
				: Promise.resolve([]),
		);
	}
	return cache.get(englishPath)!;
}
```

(Verify `markdownToHast` / `mdxToHast` signatures in `node_modules/satteri/dist/compile.d.ts`; if they return a handle rather than a tree, materialize it with `materializeHastTree` from the same package.)

```ts
// src/i18n/markdown/heading-ids.ts
/**
 * Translated pages keep the English heading ids (by position), so /fr/…/#google works like
 * /…/#google. Runs before Astro's heading-id plugin, which keeps an id that is already set.
 * i18n:check guarantees the heading structure matches English.
 */
import type { HastPluginEntry } from 'satteri';
import { englishHeadingsFor, translatedInfo } from './english-headings';

export const i18nHeadingIds: HastPluginEntry = (ctx) => {
	const info = translatedInfo(ctx.fileURL);
	if (!info) return null;
	let english: { depth: number; slug: string }[] = [];
	let i = 0;
	return {
		name: 'awf-i18n-heading-ids',
		async before() {
			english = await englishHeadingsFor(info.englishPath);
		},
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, c) {
				const match = english[i++];
				if (match && match.depth === Number(node.tagName[1]) && typeof node.properties?.id !== 'string') {
					c.setProperty(node, 'id', match.slug);
				}
			},
		},
	};
};
```

```ts
// src/i18n/markdown/links.ts
/**
 * Sources keep English links; in a translated page, internal page links point at the same
 * locale (/app/x/ → /fr/app/x/). Files and endpoints stay as they are (see localizeHref).
 */
import type { HastPluginEntry } from 'satteri';
import { localizeHref } from '../locales';
import { translatedInfo } from './english-headings';

export const i18nLinks: HastPluginEntry = (ctx) => {
	const info = translatedInfo(ctx.fileURL);
	if (!info) return null;
	return {
		name: 'awf-i18n-links',
		element: {
			filter: ['a'],
			visit(node, c) {
				const href = node.properties?.href;
				if (typeof href !== 'string') return;
				const next = localizeHref(href, info.lang);
				if (next !== href) c.setProperty(node, 'href', next);
			},
		},
	};
};
```

- [ ] **Step 4: Register them**

In `astro.config.mjs`:

```js
import { i18nLinks } from "./src/i18n/markdown/links.ts";
import { i18nHeadingIds } from "./src/i18n/markdown/heading-ids.ts";
…
    processor: satteri({ features: { rawHtml: true }, hastPlugins: [i18nLinks, i18nHeadingIds] }),
```

- [ ] **Step 5: Run the unit tests**

Run: `bun test tests/i18n/markdown.test.ts`
Expected: PASS.

- [ ] **Step 6: Pin the extractor to the real build** — the English ids it computes must equal the ids in the built English HTML for every page.

```ts
// tests/i18n/heading-ids-dist.test.ts
import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { Glob } from 'bun';
import { englishHeadings } from '../../src/i18n/markdown/english-headings';

const hasDist = existsSync('dist/index.html');

describe.skipIf(!hasDist)('English heading ids match the build', () => {
	test('every English page', async () => {
		const mismatches: string[] = [];
		for await (const file of new Glob('src/content/docs/**/*.{md,mdx}').scan('.')) {
			if (/^src\/content\/docs\/(fr|de|zh-cn)\//.test(file)) continue;
			const id = file.replace(/^src\/content\/docs\//, '').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
			const html = `dist/${id ? id + '/' : ''}index.html`;
			if (!existsSync(html)) continue;
			const built = [...readFileSync(html, 'utf8').matchAll(/<h([1-6])[^>]*\sid="([^"]+)"/g)]
				.map((m) => m[2])
				.filter((x) => x !== '_top' && x !== 'starlight__on-this-page');
			const ours = (await englishHeadings(readFileSync(file, 'utf8'), file.endsWith('.mdx') ? 'mdx' : 'md')).map((h) => h.slug);
			const missing = ours.filter((s) => !built.includes(s));
			if (missing.length) mismatches.push(`${file}: ${missing.join(', ')}`);
		}
		expect(mismatches).toEqual([]);
	});
});
```

Run: `bun run build >/dev/null && bun test tests/i18n/heading-ids-dist.test.ts`
Expected: PASS. If a page fails, the extractor differs from Astro's for some syntax (heading badges, inline code, emphasis): fix `englishHeadings` (e.g. mirror Astro's `collectHastText`), not the page.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/markdown astro.config.mjs tests/i18n/markdown.test.ts tests/i18n/heading-ids-dist.test.ts
git commit -m "feat(i18n): localize links and keep English heading ids in translated pages"
```

---

### Task 5: Locale-aware plugin plumbing (sections, tabs, eyebrow, lesson rail, search groups, pagination)

**Files:**
- Modify: `plugins/starlight-awflow/route-middleware.ts`, `plugins/starlight-awflow/types.ts`, `plugins/starlight-awflow/components/SectionTabs.astro`, `plugins/starlight-awflow/overrides/Header.astro`, `plugins/starlight-awflow/overrides/Sidebar.astro`, `plugins/starlight-awflow/lib/levels.ts`, `plugins/starlight-awflow/lib/search.ts`, `src/i18n/ui/*.ts`
- Test: `tests/i18n/plumbing.test.ts`

**Interfaces:**
- Consumes: `stripLocale`, `langFromPath`, `localizeHref` (Task 1); `createT`, `useT` (Task 2).
- Produces:
  - `AwflowRouteData` gains `lang: Lang` and `i18n?: { stale: boolean; englishHref: string }` (filled in Task 7; typed here as optional).
  - Tabs/sections keep English `label` in config; components render `t('section.<id>')`.
  - `groupFor(url, base)` strips the locale before matching; `SEARCH_GROUPS[i].label` is replaced by `labelKey: UIKey` (`search.group.<id>`).
  - `levelInfo(level, lang?)` returns a localized `title` (`t('level.<n>.title')`) and localized `href`.
  - New keys (all four locales): `section.get-started`, `section.app`, `section.recipes`, `section.nodes`, `section.concepts`, `section.releases`, `nav.docsSections`, `header.install`, `header.releaseNotes`, `level.1.title`, `level.2.title`, `level.3.title`, `level.fallback` (`Level {n}`), `rail.label`, `rail.level` (`Level {n}`), `rail.progress` (`{done} of {total} done · saved in this browser` — keep the `<span data-awf-done-count>` by splitting into `rail.progressBefore`/`rail.progressAfter` if the language needs a different order; test with zh), `rail.done`, `rail.next` (`next · level {n}`), `search.group.get-started`, `search.group.recipes`, `search.group.nodes`, `search.group.app`, `search.group.concepts`, `search.group.fix`, `search.group.releases`, `search.group.other`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/plumbing.test.ts
import { describe, expect, test } from 'bun:test';
import { groupFor, SEARCH_GROUPS } from '../../plugins/starlight-awflow/lib/search';
import { levelInfo } from '../../plugins/starlight-awflow/lib/levels';
import { createT } from '../../src/i18n/ui';

describe('search groups', () => {
	test('match after the locale prefix', () => {
		expect(groupFor('/fr/recipes/monitor-pages/x/')).toBe('recipes');
		expect(groupFor('https://docs.awflow.io/zh-cn/app/troubleshooting/x/')).toBe('fix');
		expect(groupFor('/de/nodes/builtin/flow/if/')).toBe('nodes');
		expect(groupFor('/recipes/')).toBe('recipes');
	});
	test('labels come from the dictionary', () => {
		for (const g of SEARCH_GROUPS) expect(createT('fr')(g.labelKey)).not.toBe('');
	});
});

describe('levels', () => {
	test('localized title and href', () => {
		expect(levelInfo(2, 'fr').href).toBe('/fr/get-started/working-with-data/');
		expect(levelInfo(2, 'fr').title).toBe(createT('fr')('level.2.title'));
		expect(levelInfo(1).href).toBe('/get-started/learning-path/');
		expect(levelInfo(9, 'de').title).toBe(createT('de')('level.fallback', { n: 9 }));
	});
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/plumbing.test.ts`
Expected: FAIL (`labelKey` undefined, `levelInfo` ignores lang).

- [ ] **Step 3: Implement**

`lib/search.ts`: `import { stripLocale } from '../../../src/i18n/locales';` and `import type { UIKey } from '../../../src/i18n/ui';`. Change `SearchGroup.label: string` to `labelKey: UIKey` and each entry to `labelKey: 'search.group.<id>'`. In `groupFor`, after removing `base`, add `path = stripLocale(path);`. Update every consumer of `.label` on a group (`grep -rn "groupById\|SEARCH_GROUPS" src plugins`) to call `t(group.labelKey)` (SearchDialog gets `t` in Task 8; until then pass `createT('en')`).

`lib/levels.ts`:

```ts
import { localizeHref, type Lang } from '../../../src/i18n/locales';
import { createT, type UIKey } from '../../../src/i18n/ui';

export interface LearningLevel { level: number; title: string; href: string }

const LEVELS: { level: number; href: string }[] = [
	{ level: 1, href: '/get-started/learning-path/' },
	{ level: 2, href: '/get-started/working-with-data/' },
	{ level: 3, href: '/get-started/agents-and-knowledge/' },
];

export const levelInfo = (level: number, lang: Lang = 'en'): LearningLevel => {
	const t = createT(lang);
	const found = LEVELS.find((l) => l.level === level);
	return {
		level,
		title: found ? t(`level.${level}.title` as UIKey) : t('level.fallback', { n: level }),
		href: localizeHref(found?.href ?? '/get-started/learning-path/', lang),
	};
};
```

Keep a `LEARNING_LEVELS` export only if something imports it (`grep -rn LEARNING_LEVELS`); otherwise delete it. Note `Sidebar.astro` used `!next.title.startsWith('Level ')` to detect "no next level": replace with `LEVELS.some(l => l.level === current.level + 1)` exposed as `export const hasLevel = (n: number) => LEVELS.some((l) => l.level === n);`.

`route-middleware.ts`:
- `import { langFromPath, localizeHref, stripLocale, toLang } from '../../src/i18n/locales';` and `import { createT } from '../../src/i18n/ui';`
- `const lang = toLang(route.lang); const t = createT(lang); const path = withSlashes(stripLocale(route.id));`
- `const baseId = stripLocale(route.id);` and use `baseId` wherever `route.id` is compared (`''`, `'index'`, `'404'`, segments, `markdownUrl` keeps the full `route.id`).
- Topic match: compare `withSlashes(stripLocale(currentTopicLink))` with `withSlashes(s.topic)` (sidebar-topics localizes topic links).
- `section.label` and each tab `label` → `t(\`section.${s.id}\`)`; tab `link` → `localizeHref(s.link, lang)`.
- `noPagination`: test against `path` (already stripped).
- OG image URL keeps the full `route.id` (one image per language page).
- eyebrow: `[section?.label.toLocaleLowerCase(lang), ...segments.map(...)]` — segments are English slugs; keep them (they are URL parts).
- Add `lang` to the `awflow` object; add `lang: Lang` and `i18n?: { stale: boolean; englishHref: string }` to `AwflowRouteData` in `types.ts`.

`SectionTabs.astro`: `aria-label={t('nav.docsSections')}` with `const t = useT(Astro);`.
`Header.astro`: `title={t('header.releaseNotes')}` on the version pill, `{t('header.install')}` for the install label (drop `awflow.install.label` use; keep the config field for backwards compatibility), brand `href` is `siteTitleHref` (already localized by Starlight).
`Sidebar.astro`:
- `const lang = toLang(route.lang); const t = createT(lang);`
- filter lessons to the current locale: `(e) => langFromPath(e.id) === lang && …` — note fallback pages: when the current page is a fallback (English content served at `/fr/…`), `route.entry.id` is the English id, so use `lang` from `route.lang`, and if no lesson of that level exists in `lang`, fall back to English lessons with `href: localizeHref('/' + e.id + '/', lang)`.
- `href: localizeHref(\`/${e.id}/\`, lang)` (ids of translated entries already start with `fr/`, so `localizeHref` leaves them alone — write `` `/${e.id}/` `` directly for those).
- `level = levelInfo(current.level, lang)`, `nextLevel = hasLevel(current.level + 1) ? levelInfo(current.level + 1, lang) : undefined`.
- Replace literals: `aria-label={t('rail.label')}`, `{t('rail.level', { n: level.level })}`, the progress note, `(done)` → `t('rail.done')`, `next · level` → `t('rail.next', { n: nextLevel.level })`, the minutes badge → `t('common.minutes', { n: l.minutes })`.
- Lesson progress storage key stays the lesson id (`data-lesson-id={l.id}`), so progress is per language by construction.

Add every key listed in **Produces** to `en.ts`, `fr.ts`, `de.ts`, `zh-cn.ts`. Section names follow the app/sidebar wording (`Use the app` → fr `Utiliser l'app`, de `App verwenden`, zh `使用应用` — use the same strings you put in `nav-labels.ts` for the topics).

- [ ] **Step 4: Run tests and build, check a French page**

Run: `bun test tests/i18n && bun run build >/dev/null && grep -o 'class="awf-tab"[^>]*href="[^"]*"' dist/fr/app/index.html | head -3 ; grep -c 'aria-current="true"' dist/fr/app/connections/slack/index.html`
Expected: tests PASS; tab hrefs start with `/fr/`; current-tab count ≥ 1.

- [ ] **Step 5: Commit**

```bash
git add plugins/starlight-awflow src/i18n/ui tests/i18n/plumbing.test.ts
git commit -m "feat(i18n): locale-aware sections, tabs, lesson rail and search groups"
```

---

### Task 6: OG images for every language (CJK font, prefixed sections)

**Files:**
- Modify: `src/pages/og/[...slug].ts`, `package.json`
- Test: `tests/i18n/og.test.ts`

**Interfaces:**
- Consumes: `stripLocale`, `langFromPath` (Task 1).
- Produces: `/og/<locale>/<id>.png` for every translated or fallback page; `ogFonts(lang): string[]` exported from `src/pages/og/fonts.ts`.

- [ ] **Step 1: Add the font**

```bash
bun add -d @fontsource/noto-sans-sc@5
ls node_modules/@fontsource/noto-sans-sc/files | grep -E '(400|700)-normal\.woff$' | head
```

Fontsource ships Noto Sans SC as numbered unicode-range chunks (`noto-sans-sc-<n>-<weight>-normal.woff`) — each is already a subset. Use the `.woff` files (canvaskit reads woff; it is what the Geist fonts already use).

- [ ] **Step 2: Write the failing test**

```ts
// tests/i18n/og.test.ts
import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { ogFonts } from '../../src/pages/og/fonts';

describe('ogFonts', () => {
	test('Latin pages only load Geist', () => {
		expect(ogFonts('fr').every((f) => f.includes('geist'))).toBe(true);
	});
	test('Chinese pages add Noto Sans SC files that exist', () => {
		const fonts = ogFonts('zh-CN');
		const cjk = fonts.filter((f) => f.includes('noto-sans-sc'));
		expect(cjk.length).toBeGreaterThan(10);
		for (const f of fonts) expect(existsSync(f)).toBe(true);
	});
});
```

- [ ] **Step 3: Implement**

```ts
// src/pages/og/fonts.ts
import { readdirSync } from 'node:fs';
import type { Lang } from '../../i18n/locales';

const GEIST = [
	'./node_modules/@fontsource/geist/files/geist-latin-700-normal.woff',
	'./node_modules/@fontsource/geist/files/geist-latin-400-normal.woff',
];
const NOTO_DIR = './node_modules/@fontsource/noto-sans-sc/files';

let noto: string[] | undefined;
const notoFiles = () =>
	(noto ??= readdirSync(NOTO_DIR)
		.filter((f) => /^noto-sans-sc-\d+-(400|700)-normal\.woff$/.test(f))
		.map((f) => `${NOTO_DIR}/${f}`));

/** Fonts for a page's OG image. Chinese titles need CJK glyphs (Geist is Latin only). */
export const ogFonts = (lang: Lang): string[] => (lang === 'zh-CN' ? [...GEIST, ...notoFiles()] : GEIST);

export const ogFamilies = (lang: Lang): string[] => (lang === 'zh-CN' ? ['Geist', 'Noto Sans SC'] : ['Geist']);
```

In `src/pages/og/[...slug].ts`: `import { langFromPath, stripLocale } from '../../i18n/locales';` and `import { ogFamilies, ogFonts } from './fonts';`. `sectionFor(stripLocale(id), page.section)`. In `getImageOptions`, `const lang = langFromPath(id);` then `families: ogFamilies(lang)` for title and description, and `fonts: ogFonts(lang)`. Fallback pages are not in `getCollection` under the locale id — add them so `/og/fr/<id>.png` exists for every page the middleware points at:

```ts
const english = entries.filter((e) => langFromPath(e.id) === 'en');
const translatedIds = new Set(entries.map((e) => e.id));
const pages = Object.fromEntries([
	...entries.map(({ id, data }) => [id === '' ? 'index' : id, data]),
	...['fr', 'de', 'zh-cn'].flatMap((p) =>
		english
			.filter((e) => !translatedIds.has(e.id ? `${p}/${e.id}` : p))
			.map(({ id, data }) => [id ? `${p}/${id}` : `${p}/index`, data]),
	),
]);
```

Make the middleware's OG URL use `${route.id || 'index'}` for root and `${route.id}` otherwise, and confirm a translated home id (`fr` → `og/fr.png`?) — normalize both sides: middleware uses `og/${route.id === '' ? 'index' : /^(fr|de|zh-cn)$/.test(route.id) ? route.id + '/index' : trimSlashes(route.id)}.png`.

- [ ] **Step 4: Run tests, build, look at one Chinese image**

Run: `bun test tests/i18n/og.test.ts && bun run build >/dev/null && ls dist/og/zh-cn/get-started.png dist/og/fr/app/connections/slack.png && du -sh dist/og`
Expected: PASS; both files exist. Open `dist/og/zh-cn/get-started.png` with the Read tool after Task 12 translates it (before that the title is English): no tofu boxes. Report the `du` size and the total build time (`time bun run build`) in the task summary.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock src/pages/og plugins/starlight-awflow/route-middleware.ts tests/i18n/og.test.ts
git commit -m "feat(i18n): OG images per language with a CJK font for Chinese"
```

---

### Task 7: Remembered language choice and the stale-translation note

**Files:**
- Create: `src/i18n/docs-lang.ts`, `src/i18n/blob.ts`
- Modify: `plugins/starlight-awflow/overrides/Header.astro`, `plugins/starlight-awflow/route-middleware.ts`, `plugins/starlight-awflow/overrides/PageTitle.astro`, `plugins/starlight-awflow/styles/components.css`, `src/i18n/ui/*.ts`
- Test: `tests/i18n/docs-lang.test.ts`, `tests/i18n/blob.test.ts`

**Interfaces:**
- Produces:
  - `DOCS_LANG_KEY = 'awf:docs-lang'`; `readDocsLang(storage?: Pick<Storage,'getItem'> | null): Lang | null` (null on missing/invalid/throwing storage); `saveDocsLang(lang: Lang, storage?)` (never throws).
  - `gitBlobHash(content: string | Uint8Array): string` (same as `git hash-object`); `englishFileFor(translatedFilePath: string): string | null`.
  - `route.awflow.i18n = { stale, englishHref }` on translated (non-fallback) pages.
  - Keys: `i18n.stale` ("The English version was updated since this translation."), `i18n.readEnglish` ("Read it in English").

- [ ] **Step 1: Write the failing tests**

```ts
// tests/i18n/docs-lang.test.ts
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
```

```ts
// tests/i18n/blob.test.ts
import { describe, expect, test } from 'bun:test';
import { gitBlobHash, englishFileFor } from '../../src/i18n/blob';

describe('gitBlobHash', () => {
	test('matches git hash-object', async () => {
		const file = 'src/content/docs/get-started/install.mdx';
		const expected = (await Bun.$`git hash-object ${file}`.text()).trim();
		expect(gitBlobHash(await Bun.file(file).bytes())).toBe(expected);
	});
	test('englishFileFor', () => {
		expect(englishFileFor('/r/src/content/docs/fr/app/x.mdx')).toBe('/r/src/content/docs/app/x.mdx');
		expect(englishFileFor('/r/src/content/docs/app/x.mdx')).toBeNull();
	});
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `bun test tests/i18n/docs-lang.test.ts tests/i18n/blob.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

```ts
// src/i18n/docs-lang.ts
/** The reader's docs language choice (header picker), remembered in this browser only. */
import { LANGS, type Lang } from './locales';

export const DOCS_LANG_KEY = 'awf:docs-lang';
type Store = { getItem(k: string): string | null; setItem?(k: string, v: string): void } | null | undefined;
const defaultStore = (): Store => {
	try {
		return globalThis.localStorage;
	} catch {
		return null;
	}
};

export function readDocsLang(storage: Store = defaultStore()): Lang | null {
	try {
		const v = storage?.getItem(DOCS_LANG_KEY);
		return v && (LANGS as readonly string[]).includes(v) ? (v as Lang) : null;
	} catch {
		return null;
	}
}

export function saveDocsLang(lang: Lang, storage: Store = defaultStore()): void {
	try {
		storage?.setItem?.(DOCS_LANG_KEY, lang);
	} catch {
		/* private mode or blocked storage: the choice just isn't remembered */
	}
}
```

```ts
// src/i18n/blob.ts
/** Git blob hashes, so a translation records exactly which English text it came from (spec §3). */
import { createHash } from 'node:crypto';

export function gitBlobHash(content: string | Uint8Array): string {
	const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content;
	return createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex');
}

/** `…/src/content/docs/fr/app/x.mdx` → `…/src/content/docs/app/x.mdx`; null for an English file. */
export function englishFileFor(path: string): string | null {
	const m = /^(.*\/src\/content\/docs\/)(?:fr|de|zh-cn)\/(.+)$/.exec(path.replaceAll('\\', '/'));
	return m ? m[1] + m[2] : null;
}
```

Header: after `<LanguageSelect />`, add

```astro
<script>
	import { langFromPath } from '../../../src/i18n/locales';
	import { saveDocsLang } from '../../../src/i18n/docs-lang';
	for (const select of document.querySelectorAll<HTMLSelectElement>('starlight-lang-select select')) {
		select.addEventListener('change', () => saveDocsLang(langFromPath(new URL(select.value, location.href).pathname)));
	}
</script>
```

Middleware: on translated, non-fallback pages (`route.locale && !route.isFallback && route.entry.filePath`):

```ts
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { englishFileFor, gitBlobHash } from '../../src/i18n/blob';
…
const source = (data.i18n as { source?: string } | undefined)?.source;
const english = route.entry.filePath ? englishFileFor(resolve(route.entry.filePath)) : null;
if (route.locale && !route.isFallback && source && english && existsSync(english)) {
	awflow.i18n = {
		stale: gitBlobHash(readFileSync(english)) !== source,
		englishHref: `/${stripLocale(route.id)}/`.replace(/\/+/g, '/'),
	};
}
```

PageTitle: after the title variant, render

```astro
{awflow.i18n?.stale && (
	<p class="awf-stale" data-pagefind-ignore>
		{t('i18n.stale')} <a href={awflow.i18n.englishHref} hreflang="en">{t('i18n.readEnglish')}</a>
	</p>
)}
```

(`const awflow = getAwflowRoute(Astro.locals); const t = useT(Astro);`) and a small `.awf-stale` style in `components.css` matching the existing callout tokens (muted background `var(--sl-color-gray-6)`, `font-size: 0.875rem`, `padding: 0.5rem 0.75rem`, `border-radius: 10px`).

Add the two keys in all four dictionaries.

- [ ] **Step 4: Run tests**

Run: `bun test tests/i18n`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/docs-lang.ts src/i18n/blob.ts src/i18n/ui plugins/starlight-awflow tests/i18n/docs-lang.test.ts tests/i18n/blob.test.ts
git commit -m "feat(i18n): remember the docs language and flag stale translations"
```

---

### Task 8: Island wrappers (lang in, hydration kept)

**Files:**
- Create: one `.astro` wrapper per Svelte island exported from `src/components/awflow/index.ts`, except `GuidedShot`/`StepShot`/`FlowPreview` (already `.astro`): `Badge.astro`, `WorksIn.astro`, `Callout.astro`, `ParamTable.astro`, `OutputPorts.astro`, `StepCard.astro`, `Screenshot.astro`, `PageActions.astro`, `RecipeCard.astro`, `Kbd.astro`, `ReleaseTimeline.astro`, `ReleaseChanges.astro`, `OperationTabs.astro`, `NodeCatalog.astro`, `LessonProgress.astro`, `LessonDone.astro`, `ModelTabs.astro`, `RecipeGrid.astro`, `RecipeMeta.astro`, `RecipeUse.astro`, `RecipeSteps.astro`, `ItemsPlayground.astro`, `CompareCards.astro`
- Modify: `src/components/awflow/index.ts`, `FlowPreview.astro`, `GuidedShot.astro`, `StepShot.astro`, `plugins/starlight-awflow/overrides/Search.astro`, every MDX file using `client:*` on an awflow component, the one page importing `NodeCatalog.svelte` directly, `scripts/nodes/render.ts` (if it emits `client:` attributes — check with `grep -n "client:" scripts`)
- Create: `scripts/i18n/hydrate-codemod.ts`
- Test: `tests/i18n/wrappers.test.ts`

**Interfaces:**
- Consumes: `pageLang` (Task 2).
- Produces: every island accepts `lang?: Lang` (default `'en'`). Wrappers accept `hydrate?: 'load' | 'idle' | 'visible'` instead of `client:*`. `SearchDialog` gets `lang` from `Search.astro`. `index.ts` exports the wrappers under the same names, so MDX imports don't change.

Wrapper template (repeat for each island; `<slot />` only where the island renders `children`: `Callout`, `StepCard`, `Badge`, `Kbd`, `CompareCards` — check each `.svelte` for `children`):

```astro
---
/** Passes the page language to the island; `hydrate` replaces `client:*` (spec §1). */
import Island from './RecipeUse.svelte';
import { pageLang } from '../../i18n/ui';

interface Props {
	hydrate?: 'load' | 'idle' | 'visible';
	[key: string]: unknown;
}
const { hydrate, ...props } = Astro.props;
const lang = pageLang(Astro);
---

{hydrate === 'load' ? (
	<Island client:load {...props} lang={lang}><slot /></Island>
) : hydrate === 'idle' ? (
	<Island client:idle {...props} lang={lang}><slot /></Island>
) : hydrate === 'visible' ? (
	<Island client:visible {...props} lang={lang}><slot /></Island>
) : (
	<Island {...props} lang={lang}><slot /></Island>
)}
```

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/wrappers.test.ts
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
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/wrappers.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add `lang` to every island**

In each `src/components/awflow/*.svelte`, add `lang = 'en'` to the `$props()` destructure with type `lang?: Lang` (`import type { Lang } from '../../i18n/locales';`) and pass `{lang}` to any child awflow island it renders (e.g. `RecipeGrid` → `RecipeCard`). No strings move yet (Tasks 9–10).

- [ ] **Step 4: Wrappers, index, codemod**

Create the wrappers. Point `index.ts` exports at them (`export { default as RecipeUse } from './RecipeUse.astro';`, keep the comment block). `FlowPreview.astro`, `GuidedShot.astro`, `StepShot.astro`: pass `lang={pageLang(Astro)}` to their island. `Search.astro`: `lang={pageLang(Astro)}` on `SearchDialog`.

Codemod for MDX (`client:load` → `hydrate="load"` etc., and the direct `.svelte` import):

```ts
// scripts/i18n/hydrate-codemod.ts — one-off: islands are hydrated through their .astro wrappers.
import { Glob } from 'bun';
for await (const f of new Glob('src/content/docs/**/*.mdx').scan('.')) {
	const src = await Bun.file(f).text();
	const out = src
		.replace(/\bclient:(load|idle|visible)\b/g, 'hydrate="$1"')
		.replace(/from (['"])@components\/awflow\/NodeCatalog\.svelte\1/g, "from '@components/awflow'")
		.replace(/^import NodeCatalog from '@components\/awflow';$/m, "import { NodeCatalog } from '@components/awflow';");
	if (out !== src) {
		await Bun.write(f, out);
		console.log('updated', f);
	}
}
```

Run: `bun scripts/i18n/hydrate-codemod.ts`, then fix the generator so it doesn't re-emit `client:` (`scripts/nodes/render.ts`: emit `hydrate="visible"`), and delete the codemod (one-off; it's in git history).

- [ ] **Step 5: Run tests and build; confirm islands still hydrate**

Run: `bun test tests/i18n && bun run build 2>&1 | tail -5 && grep -c 'astro-island' dist/recipes/index.html dist/nodes/index.html`
Expected: PASS; both counts ≥ 1 (RecipeGrid and NodeCatalog still hydrate).

- [ ] **Step 6: Commit**

```bash
git add src/components/awflow plugins/starlight-awflow/overrides/Search.astro src/content/docs scripts/nodes tests/i18n/wrappers.test.ts
git commit -m "feat(i18n): astro wrappers pass the page language to every island"
```

---

### Task 9: Move component strings into the dictionary — recipes, lessons, releases, shared label maps

**Files:**
- Modify: `RecipeGrid.svelte`, `RecipeCard.svelte`, `RecipeMeta.svelte`, `RecipeUse.svelte`, `RecipeSteps.svelte`, `recipes.ts`, `LessonProgress.svelte`, `LessonDone.svelte`, `ReleaseTimeline.svelte`, `ReleaseChanges.svelte`, `src/data/releases.ts`, `src/data/flowPreview.ts`, `FlowPreview.svelte`, `FlowPreviewHandoff.ts`, `src/i18n/ui/*.ts`
- Create: `tests/i18n/hardcoded.test.ts`, `tests/i18n/hardcoded-allow.json`

**Interfaces:**
- Consumes: `createT`, `T` (Task 2); island `lang` props (Task 8).
- Produces:
  - `recipes.ts`: `GOALS` entries keep `id`; their `label` becomes `labelKey: UIKey` (`recipe.goal.<id>`); `LEVEL_LABEL` → `levelLabel(level, t)`; `SETUP[x].label` → `SETUP[x].labelKey`. (Goal ids as URL values come in phase 3.)
  - `releases.ts`: the `en-GB` formatter takes `lang` (`formatReleaseDate(iso, lang)` → `createT(lang).date(iso)`).
  - Key prefixes: `recipe.*`, `lesson.*`, `release.*`, `flow.*`.

Procedure for each file (the same for Task 10):
1. Every user-visible literal in markup (text nodes, `aria-label`, `title`, `placeholder`, `alt`, button text, empty states, toasts, `sr-only` text) and in user-facing TS strings becomes `t('<area>.<name>')`. Counts use `t.plural`. Dates use `t.date`. Internal hrefs use `t.href`.
2. Add the key to `en.ts` with the exact current English text (English output must not change), and its translation to `fr.ts`, `de.ts`, `zh-cn.ts`, reusing the app's wording when the app has the same label (`grep -n -B1 -A1 'msgid "Copy link"' ../agentic-flow/src/locales/fr.po`).
3. In Svelte: `const t = $derived(createT(lang));`.

- [ ] **Step 1: Write the failing audit test**

```ts
// tests/i18n/hardcoded.test.ts
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
```

`tests/i18n/hardcoded-allow.json` starts as `["AWFlow", "Agentic Workflow", "Aria", "docs", "⌘K", "Ctrl K", "JSON", "MDX"]` — only brand names and keys go there, never sentences.

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/hardcoded.test.ts 2>&1 | grep -c "src/components"`
Expected: FAIL with a long list. Keep the list: it is this task's and Task 10's work queue.

- [ ] **Step 3: Extract strings for this task's files** (procedure above). Also the TS literals in `recipes.ts` (`GOALS`, `LEVEL_LABEL`, `SETUP`), `flowPreview.ts` family labels, `FlowPreviewHandoff.ts` messages, and `releases.ts` dates. The recipe sentences built in `scripts/recipes/build.ts` ("You'll need…", "It touches") are phase 3 — leave them.

- [ ] **Step 4: Verify English output is unchanged**

```bash
git stash -q && bun run build >/dev/null && cp -r dist /tmp/awf-dist-before && git stash pop -q
bun run build >/dev/null
for p in recipes/index.html get-started/first-workflow/index.html releases/index.html; do diff <(sed 's/astro-island[^>]*//g' /tmp/awf-dist-before/$p) <(sed 's/astro-island[^>]*//g' dist/$p) >/dev/null && echo "same $p" || echo "DIFF $p"; done
```

Expected: `same` for each (island attribute noise stripped). Investigate any `DIFF` with a full `diff` — a changed English string is a bug in the key's English text.

- [ ] **Step 5: Run the dictionary tests**

Run: `bun test tests/i18n/ui.test.ts && bun test tests/i18n/hardcoded.test.ts 2>&1 | grep -E "Recipe|Lesson|Release|FlowPreview" | head`
Expected: `ui.test.ts` PASS; no remaining findings in this task's files.

- [ ] **Step 6: Commit**

```bash
git add src/components/awflow src/data src/i18n/ui tests/i18n/hardcoded.test.ts tests/i18n/hardcoded-allow.json
git commit -m "feat(i18n): translate recipe, lesson, release and flow preview interface text"
```

---

### Task 10: Move component strings into the dictionary — search, nodes, reference components, plugin chrome, Home

**Files:**
- Modify: `SearchDialog.svelte`, `NodeCatalog.svelte`, `OperationTabs.svelte`, `ParamTable.svelte`, `OutputPorts.svelte`, `WorksIn.svelte`, `Badge.svelte`, `Callout.svelte`, `StepCard.svelte`, `Screenshot.svelte`, `PageActions.svelte`, `ModelTabs.svelte`, `ItemsPlayground.svelte`, `CompareCards.svelte`, `Kbd.svelte`, `GuidedShot.svelte`, `GuidedShot.astro`, `StepShot.astro`, `plugins/starlight-awflow/components/*.astro`, `plugins/starlight-awflow/overrides/{Footer,PageSidebar,PageTitle}.astro`, `plugins/starlight-awflow/lib/nodes.ts` (family labels), `plugins/starlight-awflow/lib/search.ts` (prompt framing strings), `src/components/home/{Home.astro,HeroStage.astro,SearchTyper.astro,data.ts}`, `src/i18n/ui/*.ts`

**Interfaces:**
- Consumes: as Task 9.
- Produces: key prefixes `search.*`, `aria.*` (Ask Aria tab and prompt framing), `node.*` (family labels `node.family.<id>`, node header, works-in, param table, output ports), `catalog.*`, `shot.*` (guided-shot chrome: "Step {n}", zoom/close labels — not alt text, that's phase 2), `page.*` (page actions, footer, page sidebar), `home.*`, `callout.*`, `badge.*`. `lib/search.ts` prompt builders take `t`: `buildAriaPrompt(question, sources, intent, t)`.

The Ask Aria prompt framing must, on a non-English page, also tell Aria to answer in the page language: add key `aria.answerIn` ("Answer in English.") whose translations say "Réponds en français." etc. — it's appended to the prompt. (Localized sources from the language's index come for free: Pagefind searches the current language.)

- [ ] **Step 1: Extract strings** for every file above, using Task 9's procedure. `Home.astro` and `home/data.ts`: every visible string, including card titles and descriptions, hero text, footer links' labels; internal hrefs through `t.href`. Typing demo phrases in `SearchTyper.astro` are translated too (they are example searches; they must exist in that language's index, so pick phrases that appear in that language's translated Get started pages, or fall back to page titles).

- [ ] **Step 2: Run the audit and dictionary tests**

Run: `bun test tests/i18n`
Expected: PASS — `hardcoded.test.ts` now has zero findings.

- [ ] **Step 3: Verify English output is unchanged** — same command as Task 9 Step 4 with pages `index.html`, `nodes/index.html`, `nodes/builtin/flow/if/index.html`, `app/connections/slack/index.html`.

Expected: `same` for each.

- [ ] **Step 4: Commit**

```bash
git add src/components plugins/starlight-awflow src/i18n/ui
git commit -m "feat(i18n): translate search, node reference, page chrome and home interface text"
```

---

### Task 11: `i18n:check` — structure gate in the build

**Files:**
- Create: `scripts/i18n/structure.ts`, `scripts/i18n/check.ts`, `tests/fixtures/i18n/en/page.mdx`, `tests/fixtures/i18n/fr-ok/page.mdx`, `tests/fixtures/i18n/fr-bad/page.mdx`
- Modify: `package.json` (`i18n:check`, `build`)
- Test: `tests/i18n/check.test.ts`

**Interfaces:**
- Produces:
  - `structureOf(source: string): Structure` where `Structure = { frontmatter: unknown; items: { kind: 'heading' | 'component' | 'code' | 'inlineCode' | 'link' | 'image' | 'esm'; sig: string; line: number }[] }`.
  - `compareStructures(en: Structure, tr: Structure): { line: number; message: string }[]` (empty = same).
  - `TEXT_PROPS = ['title', 'body', 'check', 'caption', 'alt', 'label', 'description', 'tweak']` (values may differ); `TEXT_FRONTMATTER = ['title', 'description', 'sidebar.label', 'sidebar.badge.text', 'hero.title', 'hero.tagline', 'hero.actions.*.text', 'head', 'i18n']`.
  - CLI: `bun run i18n:check [--locale fr] [files…]` exits 1 with `<file>:<line> <message>` lines.

- [ ] **Step 1: Fixtures**

```mdx
{/* tests/fixtures/i18n/en/page.mdx */}
---
title: Connect Slack
description: Send messages from a workflow.
sidebar:
  order: 3
recipe:
  goal: capture-to-my-apps
  minutes: 5
---

import { Callout, StepCard } from '@components/awflow';

## Before you start

You need a [Slack workspace](/app/connections/slack/).

<Callout type="tip" title="Good to know">Tokens stay in your browser.</Callout>

<StepCard n={1} title="Open Connections" shot="connections-list" />

```js
const x = 1;
```

Use `{{ $json.text }}` in the field.
```

`fr-ok/page.mdx`: same file with prose, `title`/`description` frontmatter, the Callout `title` and body, and the StepCard `title` translated; plus `i18n:\n  source: <40 hex>`.

`fr-bad/page.mdx`: like `fr-ok`, but with (a) a third heading level changed (`### Avant de commencer`), (b) `shot="connections-lists"`, (c) the link pointing at `/fr/app/connections/slack/`, (d) `minutes: 6`, (e) the inline code translated (`{{ $json.texte }}`).

- [ ] **Step 2: Write the failing test**

```ts
// tests/i18n/check.test.ts
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compareStructures, structureOf } from '../../scripts/i18n/structure';

const read = (p: string) => structureOf(readFileSync(`tests/fixtures/i18n/${p}/page.mdx`, 'utf8'));

describe('i18n:check', () => {
	test('a faithful translation passes', () => {
		expect(compareStructures(read('en'), read('fr-ok'))).toEqual([]);
	});
	test('each structural change is reported with a line', () => {
		const messages = compareStructures(read('en'), read('fr-bad')).map((d) => d.message).join('\n');
		expect(messages).toContain('heading');
		expect(messages).toContain('shot');
		expect(messages).toContain('/app/connections/slack/');
		expect(messages).toContain('recipe.minutes');
		expect(messages).toContain('$json.text');
		for (const d of compareStructures(read('en'), read('fr-bad'))) expect(d.line).toBeGreaterThan(0);
	});
});
```

- [ ] **Step 3: Run it to see it fail**

Run: `bun test tests/i18n/check.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `structure.ts`**

```ts
// scripts/i18n/structure.ts
/**
 * What must not differ between an English page and its translation (spec §3 i18n:check):
 * headings (count, depth), components and their non-text props, code, inline code, link and
 * image targets, imports, and frontmatter except text fields. Prose is free.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { parse as parseYaml } from 'yaml';

export const TEXT_PROPS = new Set(['title', 'body', 'check', 'caption', 'alt', 'label', 'description', 'tweak']);
const TEXT_FRONTMATTER = [/^title$/, /^description$/, /^sidebar\.label$/, /^sidebar\.badge\.text$/, /^hero\.title$/, /^hero\.tagline$/, /^hero\.actions\.\d+\.text$/, /^head(\.|$)/, /^i18n(\.|$)/];

export interface Item { kind: 'heading' | 'component' | 'code' | 'inlineCode' | 'link' | 'image' | 'esm'; sig: string; line: number }
export interface Structure { frontmatter: Record<string, unknown>; fmLine: number; items: Item[] }

const flatten = (v: unknown, prefix = '', out: Record<string, unknown> = {}) => {
	if (v && typeof v === 'object') {
		for (const [k, x] of Object.entries(v as Record<string, unknown>)) flatten(x, prefix ? `${prefix}.${k}` : k, out);
	} else out[prefix] = v;
	return out;
};

export function structureOf(source: string): Structure {
	const fm = /^---\n([\s\S]*?)\n---\n/.exec(source);
	const frontmatter = flatten(fm ? parseYaml(fm[1]) ?? {} : {});
	for (const key of Object.keys(frontmatter)) if (TEXT_FRONTMATTER.some((re) => re.test(key))) delete frontmatter[key];
	const offset = fm ? fm[0].split('\n').length - 1 : 0;
	const body = fm ? source.slice(fm[0].length) : source;
	const tree: any = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkDirective).parse(body);
	const items: Item[] = [];
	const line = (n: any) => (n.position?.start.line ?? 0) + offset;
	const walk = (n: any) => {
		switch (n.type) {
			case 'heading': items.push({ kind: 'heading', sig: `h${n.depth}`, line: line(n) }); break;
			case 'code': items.push({ kind: 'code', sig: `${n.lang ?? ''} ${n.meta ?? ''}\n${n.value}`, line: line(n) }); break;
			case 'inlineCode': items.push({ kind: 'inlineCode', sig: n.value, line: line(n) }); break;
			case 'link': items.push({ kind: 'link', sig: n.url, line: line(n) }); break;
			case 'image': items.push({ kind: 'image', sig: n.url, line: line(n) }); break;
			case 'mdxjsEsm': items.push({ kind: 'esm', sig: n.value.trim(), line: line(n) }); break;
			case 'mdxJsxFlowElement':
			case 'mdxJsxTextElement': {
				const props = (n.attributes ?? [])
					.filter((a: any) => a.type !== 'mdxJsxAttribute' || !TEXT_PROPS.has(a.name))
					.map((a: any) => (a.type === 'mdxJsxAttribute' ? `${a.name}=${typeof a.value === 'string' ? JSON.stringify(a.value) : a.value?.value ?? 'true'}` : `{${a.value}}`))
					.sort();
				items.push({ kind: 'component', sig: `<${n.name ?? ''} ${props.join(' ')}>`, line: line(n) });
				break;
			}
		}
		n.children?.forEach(walk);
	};
	walk(tree);
	return { frontmatter, fmLine: 2, items };
}

export function compareStructures(en: Structure, tr: Structure): { line: number; message: string }[] {
	const out: { line: number; message: string }[] = [];
	for (const key of new Set([...Object.keys(en.frontmatter), ...Object.keys(tr.frontmatter)])) {
		if (JSON.stringify(en.frontmatter[key]) !== JSON.stringify(tr.frontmatter[key])) {
			out.push({ line: tr.fmLine, message: `frontmatter ${key}: expected ${JSON.stringify(en.frontmatter[key])}, found ${JSON.stringify(tr.frontmatter[key])}` });
		}
	}
	for (const kind of ['heading', 'component', 'code', 'inlineCode', 'link', 'image', 'esm'] as const) {
		const a = en.items.filter((i) => i.kind === kind);
		const b = tr.items.filter((i) => i.kind === kind);
		for (let i = 0; i < Math.max(a.length, b.length); i++) {
			if (a[i]?.sig !== b[i]?.sig) {
				out.push({
					line: b[i]?.line ?? b[b.length - 1]?.line ?? 1,
					message: `${kind} #${i + 1}: expected ${a[i] ? JSON.stringify(a[i].sig) : '(none)'}, found ${b[i] ? JSON.stringify(b[i].sig) : '(none)'}`,
				});
				break; // one report per kind: later items are usually shifted by the same cause
			}
		}
	}
	return out;
}
```

`frontmatter` keys of a component prop holding an expression (e.g. `spots={[...]}`) compare the expression source, so array/object props with text inside (spot labels, `items={[{ title: … }]}`) would block translation. Handle it: for expression attributes, parse the expression with `JSON5`-like leniency is overkill — instead compare the expression after replacing every string literal whose property name is in `TEXT_PROPS` with `"…"`:

```ts
const maskTextInExpression = (src: string) =>
	src.replace(new RegExp(`\\b(${[...TEXT_PROPS].join('|')})\\s*:\\s*(["'\`])(?:\\\\.|(?!\\2).)*\\2`, 'g'), '$1:"…"');
```

and use `maskTextInExpression(a.value?.value)` for expression attribute values. Add a fixture case for it (`<GuidedShot spots={[{ spot: 'save', label: 'Save' }]} />` → label translated passes, `spot` changed fails) in `check.test.ts`.

- [ ] **Step 5: Implement the CLI**

```ts
// scripts/i18n/check.ts
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
for (const file of files.sort()) {
	const m = /^src\/content\/docs\/(fr|de|zh-cn)\/(.+)$/.exec(file);
	if (!m || (only && m[1] !== only)) continue;
	const english = `src/content/docs/${m[2]}`;
	if (!existsSync(english)) continue; // orphans are reported by i18n:status
	for (const d of compareStructures(structureOf(readFileSync(english, 'utf8')), structureOf(readFileSync(file, 'utf8')))) {
		console.error(`${file}:${d.line} ${d.message}`);
		failures++;
	}
}
if (failures) {
	console.error(`\ni18n:check — ${failures} difference(s). Translations may change prose and text props only.`);
	process.exit(1);
}
console.log(`i18n:check — ${files.length} translated file(s) match their English structure.`);
```

In `package.json`: `"i18n:check": "bun scripts/i18n/check.ts"`, and `"build": "bun scripts/i18n/check.ts && astro build"`.

- [ ] **Step 6: Run tests and the CLI**

Run: `bun test tests/i18n/check.test.ts && bun run i18n:check`
Expected: PASS; CLI prints `0 translated file(s)` (none yet) and exits 0.

- [ ] **Step 7: Commit**

```bash
git add scripts/i18n/structure.ts scripts/i18n/check.ts tests/fixtures/i18n tests/i18n/check.test.ts package.json
git commit -m "feat(i18n): i18n:check keeps translations structurally identical to English"
```

---

### Task 12: `i18n:status`

**Files:**
- Create: `scripts/i18n/status.ts`
- Modify: `package.json`
- Test: `tests/i18n/status.test.ts`

**Interfaces:**
- Consumes: `gitBlobHash` (Task 7); dictionaries (Task 2).
- Produces:
  - `statusOf(root: string): Report` where `Report = { locales: Record<'fr'|'de'|'zh-cn', { upToDate: string[]; stale: { page: string; source: string }[]; missing: string[]; orphaned: string[]; unsourced: string[] }>; dictionary: { keys: number } }`. Pages are content paths relative to `src/content/docs` (`app/connections/slack.mdx`). Release notes (`releases/**`) are excluded from `missing`.
  - CLI: `bun run i18n:status [--json] [--locale fr] [--section app]` prints per-locale counts and lists; `--json` prints `Report`. Exit code always 0.

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/status.test.ts
import { describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gitBlobHash } from '../../src/i18n/blob';
import { statusOf } from '../../scripts/i18n/status';

const root = mkdtempSync(join(tmpdir(), 'awf-status-'));
const d = (p: string) => join(root, 'src/content/docs', p);
for (const dir of ['app', 'releases', 'fr/app', 'de/app']) mkdirSync(d(dir), { recursive: true });
const a = '---\ntitle: A\n---\nA\n';
writeFileSync(d('app/a.mdx'), a);
writeFileSync(d('app/b.mdx'), '---\ntitle: B\n---\nB\n');
writeFileSync(d('releases/v1.mdx'), '---\ntitle: v1\n---\n');
writeFileSync(d('fr/app/a.mdx'), `---\ntitle: A fr\ni18n:\n  source: ${gitBlobHash(a)}\n---\nA\n`);
writeFileSync(d('fr/app/b.mdx'), `---\ntitle: B fr\ni18n:\n  source: ${'0'.repeat(40)}\n---\nB\n`);
writeFileSync(d('fr/app/gone.mdx'), '---\ntitle: gone\n---\n');
writeFileSync(d('de/app/a.mdx'), '---\ntitle: A de\n---\nA\n');

describe('statusOf', () => {
	const r = statusOf(root);
	test('fr', () => {
		expect(r.locales.fr.upToDate).toEqual(['app/a.mdx']);
		expect(r.locales.fr.stale.map((s) => s.page)).toEqual(['app/b.mdx']);
		expect(r.locales.fr.orphaned).toEqual(['app/gone.mdx']);
		expect(r.locales.fr.missing).toEqual([]);
	});
	test('de: no source counts as unsourced, release notes never missing', () => {
		expect(r.locales.de.unsourced).toEqual(['app/a.mdx']);
		expect(r.locales.de.missing).toEqual(['app/b.mdx']);
	});
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/status.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// scripts/i18n/status.ts
/** bun run i18n:status [--json] [--locale fr] [--section app] — which translations are missing or stale. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { gitBlobHash } from '../../src/i18n/blob';
import en from '../../src/i18n/ui/en';

const PREFIXES = ['fr', 'de', 'zh-cn'] as const;
type Prefix = (typeof PREFIXES)[number];
export interface LocaleStatus { upToDate: string[]; stale: { page: string; source: string }[]; missing: string[]; orphaned: string[]; unsourced: string[] }
export interface Report { locales: Record<Prefix, LocaleStatus>; dictionary: { keys: number } }

const walk = (dir: string): string[] =>
	readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : /\.mdx?$/.test(n) ? [p] : [];
	});

const sourceOf = (file: string): string | undefined => {
	const fm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'));
	return fm ? (parseYaml(fm[1])?.i18n?.source as string | undefined) : undefined;
};

export function statusOf(root: string): Report {
	const docs = join(root, 'src/content/docs');
	const all = walk(docs).map((f) => relative(docs, f).replaceAll('\\', '/'));
	const english = all.filter((p) => !/^(fr|de|zh-cn)\//.test(p));
	const locales = {} as Record<Prefix, LocaleStatus>;
	for (const prefix of PREFIXES) {
		const s: LocaleStatus = { upToDate: [], stale: [], missing: [], orphaned: [], unsourced: [] };
		const translated = new Set(all.filter((p) => p.startsWith(prefix + '/')).map((p) => p.slice(prefix.length + 1)));
		for (const page of english) {
			if (!translated.has(page)) {
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
	const keep = (p: string) => !section || p.startsWith(section + '/') || p === `${section}.mdx` || p === `${section}/index.mdx`;
	for (const p of PREFIXES) {
		if (locale && p !== locale) delete (report.locales as Partial<Report['locales']>)[p];
		else {
			const s = report.locales[p];
			s.upToDate = s.upToDate.filter(keep); s.missing = s.missing.filter(keep); s.orphaned = s.orphaned.filter(keep);
			s.unsourced = s.unsourced.filter(keep); s.stale = s.stale.filter((x) => keep(x.page));
		}
	}
	if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
	else {
		for (const [p, s] of Object.entries(report.locales)) {
			console.log(`${p}: ${s.upToDate.length} up to date · ${s.stale.length} stale · ${s.missing.length} missing · ${s.orphaned.length} orphaned · ${s.unsourced.length} without source`);
			for (const x of s.stale) console.log(`  stale     ${x.page}`);
			for (const x of s.orphaned) console.log(`  orphaned  ${x}`);
			for (const x of s.unsourced) console.log(`  no source ${x}`);
		}
		console.log(`dictionary: ${report.dictionary.keys} keys, complete in every locale (enforced by tests)`);
	}
}
```

`package.json`: `"i18n:status": "bun scripts/i18n/status.ts"`.

- [ ] **Step 4: Run tests and the CLI**

Run: `bun test tests/i18n/status.test.ts && bun run i18n:status | head -5`
Expected: PASS; three lines like `fr: 0 up to date · 0 stale · 39x missing · …`.

- [ ] **Step 5: Commit**

```bash
git add scripts/i18n/status.ts tests/i18n/status.test.ts package.json
git commit -m "feat(i18n): i18n:status reports missing, stale and orphaned translations"
```

---

### Task 13: Glossary, style notes, `docs-translate` skill

**Files:**
- Create: `scripts/i18n/po.ts`, `scripts/i18n/glossary.ts`, `src/i18n/glossary/terms.json`, `src/i18n/glossary/{fr,de,zh-cn}.json` (generated), `src/i18n/style/{fr,de,zh-cn}.md`, `.claude/skills/docs-translate/SKILL.md`
- Modify: `package.json`
- Test: `tests/i18n/po.test.ts`

**Interfaces:**
- Produces:
  - `parsePo(text: string): Map<string, string>` (msgid → msgstr; skips the header, empty and `#, fuzzy` entries; joins multi-line strings; unescapes `\"`, `\\`, `\n`, `\t`).
  - Glossary file shape: `{ "generatedFrom": "agentic-flow/src/locales/fr.po", "doNotTranslate": string[], "terms": Record<string, string>, "app": Record<string, string> }`.
  - CLI `bun run i18n:glossary` (env `AWFLOW_APP_DIR`, default `../agentic-flow`).

- [ ] **Step 1: Write the failing test**

```ts
// tests/i18n/po.test.ts
import { expect, test } from 'bun:test';
import { parsePo } from '../../scripts/i18n/po';

test('parsePo', () => {
	const po = [
		'msgid ""', 'msgstr ""', '"Language: fr\\n"', '',
		'#: src/a.svelte', 'msgid "Save"', 'msgstr "Enregistrer"', '',
		'msgid ""', '"Long "', '"text"', 'msgstr ""', '"Texte "', '"long"', '',
		'#, fuzzy', 'msgid "Draft"', 'msgstr "Brouillon"', '',
		'msgid "Empty"', 'msgstr ""', '',
		'msgid "Say \\"hi\\""', 'msgstr "Dites \\"salut\\""',
	].join('\n');
	const m = parsePo(po);
	expect(m.get('Save')).toBe('Enregistrer');
	expect(m.get('Long text')).toBe('Texte long');
	expect(m.has('Draft')).toBe(false);
	expect(m.has('Empty')).toBe(false);
	expect(m.has('')).toBe(false);
	expect(m.get('Say "hi"')).toBe('Dites "salut"');
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `bun test tests/i18n/po.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the parser and generator**

```ts
// scripts/i18n/po.ts
/** Minimal gettext .po reader for the glossary (msgid → msgstr). Plurals: msgstr[0] is used. */
const unquote = (s: string) => JSON.parse(s.replace(/\\t/g, '\\t'));

export function parsePo(text: string): Map<string, string> {
	const out = new Map<string, string>();
	let fuzzy = false;
	let field: 'id' | 'str' | null = null;
	let id = '';
	let str = '';
	const flush = () => {
		if (id && str && !fuzzy) out.set(id, str);
		id = ''; str = ''; field = null; fuzzy = false;
	};
	for (const raw of text.split('\n')) {
		const line = raw.trim();
		if (line === '') { flush(); continue; }
		if (line.startsWith('#,') && line.includes('fuzzy')) { fuzzy = true; continue; }
		if (line.startsWith('#')) continue;
		let m;
		if ((m = /^msgid\s+(".*")$/.exec(line))) { if (field === 'str') flush(); field = 'id'; id = unquote(m[1]); continue; }
		if (/^msgid_plural\s/.test(line)) { field = null; continue; }
		if ((m = /^msgstr(?:\[0\])?\s+(".*")$/.exec(line))) { field = 'str'; str = unquote(m[1]); continue; }
		if (/^msgstr\[\d+\]/.test(line)) { field = null; continue; }
		if ((m = /^(".*")$/.exec(line))) {
			if (field === 'id') id += unquote(m[1]);
			else if (field === 'str') str += unquote(m[1]);
		}
	}
	flush();
	return out;
}
```

```ts
// scripts/i18n/glossary.ts
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
			.filter(([en, tr]) => en.length <= 80 && !/[{<]/.test(en) && en !== tr) // labels, not sentences or templates
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
```

`src/i18n/glossary/terms.json`:

```json
{
	"doNotTranslate": ["AWFlow", "Agentic Workflow", "Aria", "Chrome Web Store", "Firefox Add-ons", "Chrome", "Firefox", "Pagefind", "MCP", "API", "OAuth", "JSON", "Markdown", "WebLLM", "Ollama", "OpenAI", "Anthropic", "Google", "Microsoft 365", "Slack", "Notion", "GitHub", "Discord", "Telegram", "Linear", "Todoist", "Airtable", "Trello", "Supabase", "HubSpot", "Pipedrive", "Obsidian", "Raindrop", "Readwise"],
	"terms": {
		"workflow": { "fr": "workflow", "de": "Workflow", "zh-CN": "工作流" },
		"node": { "fr": "nœud", "de": "Node", "zh-CN": "节点" },
		"trigger": { "fr": "déclencheur", "de": "Trigger", "zh-CN": "触发器" },
		"item": { "fr": "élément", "de": "Element", "zh-CN": "数据项" },
		"canvas": { "fr": "canevas", "de": "Canvas", "zh-CN": "画布" },
		"side panel": { "fr": "panneau latéral", "de": "Seitenleiste", "zh-CN": "侧边栏" },
		"connection": { "fr": "connexion", "de": "Verbindung", "zh-CN": "连接" },
		"credential": { "fr": "identifiant", "de": "Zugangsdaten", "zh-CN": "凭据" },
		"recipe": { "fr": "recette", "de": "Rezept", "zh-CN": "配方" },
		"knowledge base": { "fr": "base de connaissances", "de": "Wissensdatenbank", "zh-CN": "知识库" },
		"agent": { "fr": "agent", "de": "Agent", "zh-CN": "智能体" },
		"expression": { "fr": "expression", "de": "Ausdruck", "zh-CN": "表达式" }
	}
}
```

Before committing `terms.json`, check each term against the app's `.po` (`grep -n -A1 'msgid "Workflow"' ../agentic-flow/src/locales/*.po`) and use the app's choice where it differs.

`package.json`: `"i18n:glossary": "bun scripts/i18n/glossary.ts"`. Run it; commit the three generated files.

- [ ] **Step 4: Style notes**

`src/i18n/style/fr.md`:

```markdown
# French style (docs)

- Address the reader as « vous », like the app. Imperative for steps: « Ouvrez Connexions ».
- Non-breaking space (U+00A0) before `:` `;` `?` `!` and inside « guillemets ». Never before `:` in URLs, code or times.
- UI labels exactly as the app shows them: the glossary's `app` map wins over your own wording. Put labels in **bold** as the English does.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Sentence case for headings (« Avant de commencer »), as in English.
- Numbers: `1 000` (narrow no-break space U+202F as thousands separator), decimal comma `0,5` in prose; never inside code.
- Short sentences. Translate meaning, not word order.
```

`src/i18n/style/de.md`:

```markdown
# German style (docs)

- Address the reader as „Sie“, like the app. Imperative with Sie for steps: „Öffnen Sie Verbindungen“.
- UI labels exactly as the app shows them: the glossary's `app` map wins. Labels in **bold** as in English.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Headings: German capitalization rules, otherwise sentence style (no Title Case).
- Quotation marks „…“. Decimal comma in prose, never inside code.
- Prefer clear, short sentences over long compound ones; split sentences rather than chaining clauses.
```

`src/i18n/style/zh-cn.md`:

```markdown
# Simplified Chinese style (docs)

- Simplified Chinese (zh-CN). Neutral, direct tone; address the reader as「你」only when needed, or omit the subject — like the app.
- Full-width punctuation in Chinese text: ，。：；？！（）「」. Half-width inside code, URLs and Latin-only phrases.
- No spaces between Chinese characters. One space between Chinese and Latin words or numbers: 「打开 Slack 连接」「5 分钟」.
- UI labels exactly as the app shows them: the glossary's `app` map wins. Labels in **bold** as in English.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Translate meaning; reorder sentences freely.
```

- [ ] **Step 5: The skill**

`.claude/skills/docs-translate/SKILL.md`:

```markdown
---
name: docs-translate
description: Translate or re-sync AWFlow docs pages into fr, de or zh-CN (Agentic-Flow-Doc). Use for any docs translation job from `bun run i18n:status`, for new pages, stale pages, interface strings (src/i18n/ui) and sidebar labels (src/i18n/nav-labels.ts).
---

# docs-translate

Translations live in `src/content/docs/<fr|de|zh-cn>/<same path as English>`. English is the source; never edit English pages here.

## 1. Get the job list

    bun run i18n:status --locale <fr|de|zh-cn> [--section <get-started|app|concepts|recipes|nodes>] --json

Work on `missing` and `stale` pages. Ignore `releases/**` (release notes stay English).

## 2. Load the references once per locale

- `src/i18n/glossary/<locale>.json` — `app` (every UI label as the app shows it; always use these), `terms`, `doNotTranslate`.
- `src/i18n/style/<locale>.md` — tone and punctuation. Follow it exactly.

## 3. Translate a missing page

Copy the English file to the locale path and translate in place:
- Translate prose, headings, frontmatter `title`, `description`, `sidebar.label`, `sidebar.badge.text`, hero text, and component text props: `title`, `body`, `check`, `caption`, `alt`, `label`, `description`, `tweak` (also inside `spots={[…]}` / `items={[…]}` arrays — only those keys).
- Do not change: imports, component names, any other prop (`shot`, `spot`, `n`, `start`, `focus`, `href`, ids, `hydrate`), code blocks, inline code, link targets (keep `/app/…` — the build localizes them), image paths, other frontmatter values, heading count and levels.
- Add `i18n: { source: <hash> }` to the frontmatter, where `<hash>` is `git hash-object src/content/docs/<english path>`.

## 4. Re-sync a stale page

The status gives the old `source`. Get the English diff:

    git cat-file -p <old source> > /tmp/en-old.mdx
    git diff --no-index /tmp/en-old.mdx src/content/docs/<english path>

Change only the parts of the translation that correspond to the diff; keep everything else (a reviewer may have fixed it). Update `i18n.source` to the new hash. If `reviewed: true` was set, keep it only if your edits are a few words; otherwise set it to `false`.

## 5. Interface strings

When `bun test tests/i18n/ui.test.ts` or the build reports missing keys, add the translation for every missing key in `src/i18n/ui/<locale>.ts` (or `src/i18n/nav-labels.ts`), using the glossary first.

## 6. Check before finishing

    bun run i18n:check --locale <locale>
    bun test tests/i18n

Fix every reported line. Then report: pages translated, pages re-synced, keys added, and anything you were unsure about (with the page and line).
```

- [ ] **Step 6: Run tests and the generator**

Run: `bun test tests/i18n/po.test.ts && bun run i18n:glossary`
Expected: PASS; three lines `glossary fr: <n> app labels, 12 terms` with n in the hundreds.

- [ ] **Step 7: Commit**

```bash
git add scripts/i18n/po.ts scripts/i18n/glossary.ts src/i18n/glossary src/i18n/style .claude/skills/docs-translate package.json tests/i18n/po.test.ts
git commit -m "feat(i18n): glossary from the app catalogs, style notes and the docs-translate skill"
```

---

### Task 14: Translate Home, 404 and Get started; go live; verify

**Files:**
- Create: `src/content/docs/{fr,de,zh-cn}/index.mdx`, `src/content/docs/{fr,de,zh-cn}/404.md`, `src/content/docs/{fr,de,zh-cn}/get-started/*.mdx` (10 pages each)
- Modify: `CONTRIBUTING.md`
- Create: `scripts/i18n/smoke.ts` (Playwright checks)

**Interfaces:**
- Consumes: everything above; the `docs-translate` skill.

- [ ] **Step 1: Translate** — run the `docs-translate` skill once per locale (three parallel agents in worktrees are fine; each touches only its own locale folder): pages `index.mdx`, `404.md`, `get-started/**`. Each agent ends with `bun run i18n:check --locale <locale>` clean.

- [ ] **Step 2: Build and run every gate**

Run: `bun test tests && bun run build 2>&1 | tail -15 && bun test tests/i18n/heading-ids-dist.test.ts`
Expected: all PASS; build succeeds (links validator included); `bun run i18n:status | head -3` shows `11 up to date` for each locale.

- [ ] **Step 3: Built-site assertions**

```bash
grep -o 'href="/fr/get-started/[^"]*"' dist/fr/get-started/index.html | head -3          # links localized
grep -o 'id="[^"]*"' dist/fr/get-started/install/index.html | head -5                     # English ids
diff <(grep -o '<h[2-4][^>]*id="[^"]*"' dist/get-started/install/index.html | grep -o 'id="[^"]*"') \
     <(grep -o '<h[2-4][^>]*id="[^"]*"' dist/fr/get-started/install/index.html | grep -o 'id="[^"]*"') && echo "ids match"
grep -c 'starlight-lang-select' dist/fr/index.html                                         # picker present
grep -o 'hreflang="[^"]*"' dist/get-started/index.html | sort -u                           # alternates
grep -o '/examples/[^"]*\.awf' dist/fr/get-started/first-workflow/index.html | head -2     # files unprefixed
```

Expected: `/fr/` links; `ids match`; picker count ≥ 1; hreflang `en`, `fr`, `de`, `zh-CN`; `.awf` links without a locale prefix.

- [ ] **Step 4: Browser checks** — `scripts/i18n/smoke.ts` serves `dist` (`bunx serve dist -l 4329` in the background) and with Playwright (light and dark, viewport 1280×800 and 375×812) visits `/`, `/fr/`, `/de/`, `/zh-cn/`, `/<locale>/get-started/install/`, `/<locale>/app/connections/slack/` (fallback notice), `/zh-cn/recipes/`; for each: no console errors, `document.documentElement.lang` correct, `scrollWidth <= innerWidth` (no horizontal scroll), screenshot to the scratchpad. Then opens the search dialog on `/fr/` and searches `installer` (expects ≥ 1 French result), switches the picker to Deutsch and checks the URL is `/de/…` and `localStorage['awf:docs-lang'] === 'de'`. Look at the zh-cn screenshots and `dist/og/zh-cn/get-started.png` with the Read tool: Chinese glyphs render, nothing overflows.

- [ ] **Step 5: Document** — in `CONTRIBUTING.md`, replace the "English only" note with a "Translations" section: where translations live; English links and heading ids are automatic; `bun run i18n:status`, `bun run i18n:check`, `bun run i18n:glossary`; the `docs-translate` skill; how to add an interface string (all four dictionaries); stale pages ship with a note; release notes stay English; localized screenshot captures are a recorded follow-up (needs the capture to set `app:locale` per run and locators that don't depend on English accessible names).

- [ ] **Step 6: Commit, merge locally, report**

```bash
git add src/content/docs/fr src/content/docs/de src/content/docs/zh-cn scripts/i18n/smoke.ts CONTRIBUTING.md
git commit -m "docs(i18n): Home, 404 and Get started in French, German and Chinese"
git checkout Dev && git merge --no-ff feat/docs-i18n-foundation -m "Merge feat/docs-i18n-foundation: docs i18n phase 1"
git branch -d feat/docs-i18n-foundation
```

Do not push. Comment on the Phase 1 issue with what shipped, build time and output size before/after (from Task 6), and the screenshots' findings.
