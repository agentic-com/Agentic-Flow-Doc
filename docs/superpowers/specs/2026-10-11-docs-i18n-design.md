# Docs in French, German and Chinese: design

Date: 2026-10-11 · Status: approved in conversation, pending spec review · Repo: `Agentic-Flow-Doc` (plus a small part in `agentic-flow`)

## Goal

The extension ships in English, French, German and Simplified Chinese. The docs should too. A reader who uses AWFlow in French, German or Chinese reads the docs in that language, and the labels the docs name are the labels that reader sees in the app. Translations stay current as the English pages change, without blocking English changes.

This supersedes the "English only for now" decision of awflow/Agentic-Flow#1332, which waited for the restructure of epic #1308 (shipped).

### Decisions

| Topic | Decision |
| --- | --- |
| How translations are made | AI translation by agents, with a glossary built from the app's catalogs and a sync pipeline. No human review needed to ship; reviewers can fix any page at any time. |
| Screenshots | English screenshots in every language for now. Built so per-language captures can be added later (image fallback + recorded follow-up). |
| Reaching a language | Header picker (remembered), links from the app open the docs in the app's language, and a no-redirect hint bar on English pages. |
| Scope | Every page except release notes: guides, concepts, recipes, node reference, home, 404, and every interface string. Release notes stay English. |
| Storage | Starlight's built-in i18n, one translated file per page, English slugs (approach A). |

### Size

396 pages, about 271,000 English words (189 node pages). About 615 interface strings (about 440 in components, about 175 navigation labels). 204 screenshots with about 8,900 words of alt text and 757 spot labels.

## 1. Routing, layout and interface strings

**Locales.** `root` stays English (`lang: "en"`, current URLs unchanged). Added: `fr` (`/fr/`), `de` (`/de/`), `zh-cn` (`/zh-cn/`, `lang: "zh-CN"`). The app's `zh` maps to `zh-cn`.

**Files.** A translated page mirrors the English path and slug: `src/content/docs/fr/app/connections/slack.mdx` → `/fr/app/connections/slack/`. Slugs are never translated.

**Interface dictionary.** One typed module, `src/i18n/ui.ts`: `en` is the source of truth; `fr`, `de` and `zh-cn` must define every key (a unit test enforces it). Plural and count strings use `Intl.PluralRules`; dates use `Intl.DateTimeFormat` with the page locale (replacing the three hard-wired `en-GB` formatters).

- `.astro` components and plugin overrides read it through `useT(Astro)` (based on `Astro.currentLocale`).
- Svelte islands take a `lang` prop and call `createT(lang)`. Every island placed in MDX gets a thin `.astro` wrapper (for example `RecipeGrid.astro` wrapping `RecipeGrid.svelte`) that passes `lang`, so pages never pass it by hand and the server render is already in the right language.
- Shared TS label maps (`recipes.ts` GOALS/LEVEL/SETUP, `flowPreview.ts` family labels, plugin `lib/nodes.ts`, `lib/levels.ts`, `lib/search.ts` groups and prompts) move into the dictionary.
- Sidebar group labels, topic labels and header tabs get `translations` generated from the dictionary instead of being hand-edited in `astro.config.mjs`.
- Starlight's own interface (On this page, prev/next, search, theme, fallback notice) is already translated by Starlight.

**Links in translated pages.** Sources keep English links (`/app/connections/slack/`). A rehype step rewrites internal absolute links to the page's locale at build time (`/fr/app/connections/slack/`). Components and generators use the same `localizeHref(href, lang)`. Translators never edit links, so links cannot drift between languages.

**Heading anchors.** A translated heading keeps the id of the heading at the same position in the English page (a rehype step assigns it). Links with anchors, including the app's (`/app/connections/oauth-client/#google`), keep working in every language. `i18n:check` (section 3) guarantees the heading structure matches.

**Locale-aware plumbing.**
- Route middleware strips the locale prefix before matching sections, `noPagination` prefixes and the eyebrow, so banners, section colours, the current tab and the eyebrow keep working.
- The lesson rail lists lessons of the current locale only, and its links are localized. Lesson progress is stored per path, so it stays per language.
- Search result groups match on the path after the locale prefix.
- The 404 page and the home page exist in every language (`Home.astro` reads strings from the dictionary).

## 2. Generated content and data files

**Node pages.** `scripts/nodes/generate.ts` also writes the AUTO blocks and generator-owned frontmatter into `fr/`, `de/` and `zh-cn/` node pages; the authored prose around them is translated like any page. Sections are located by AUTO markers and English heading ids, not by English `##` text. Each generated string is resolved in this order:

1. **App catalogs** (`agentic-flow/src/locales/{fr,de,zh}.po`, by English msgid). Node names, descriptions and labels then match the app exactly (185/189 node names, 188/189 descriptions covered today).
2. **Docs translation memory**, `src/i18n/memory/<locale>.json` (English → translation), for app text the catalogs miss (about half of field labels and descriptions, most option labels). Filled by the translation agent once, reused afterwards.
3. **Interface dictionary** for the generator's own sentences and headings (`render.ts` templates, `extract.ts` type names, port labels such as Done/Loop/Kept).

The catalog gap means the app itself shows those labels in English. It is recorded as a separate app issue; when the app catalogs gain them, the docs pick them up automatically (step 1 wins).

**Node data.** `nodes.json`, `nodeCatalog.ts`, `integration-groups.json` and `flow-node-map.json` get localized names and labels through the same lookup (per-locale views built at build time; the English data files stay the source).

**Recipes.**
- `recipes:build` also reads the translated recipe pages and writes per-locale recipe data, used by RecipeGrid, RecipeUse, RecipeMeta, RecipeSteps and the node pages' "Recipes with this node".
- `recipe.goal` becomes a stable id (`monitor-pages`), used in `?goal=`; its label comes from the dictionary.
- Generated "You'll need…" and "It touches" sentences go through the dictionary.
- Step names inside `public/examples/*.awf` stay English: they are what the reader installs.

**`/recipes/listings.json`** (read by the app's marketplace) keeps `{title, url}` and adds `i18n: { fr: {title, url}, de: …, "zh-cn": … }`. Additive, so older app versions keep working.

**Release notes** stay English. Translated release URLs fall back to English with Starlight's notice; the timeline and change-list interface is translated; RSS stays English.

**Screenshot text.** Alt text and spot labels are translated into `src/i18n/shots/<locale>.json` (`{ [shot]: { alt, spots: { [id]: label } } }`). The shot resolver (`src/data/shots.ts`) takes text for the page's locale, and looks for `<shot>.<locale>.light.webp` / `.dark.webp` before falling back to the English images. That fallback is the hook for localized captures.

**Localized captures (follow-up, not built here).** Needs: the capture to set the app's `app:locale` per run, and shot locators that don't depend on English accessible names (`scripts/capture/shots/*`). Recorded in `CONTRIBUTING.md`.

## 3. Translation pipeline and sync

**Glossary.** `src/i18n/glossary/<locale>.json`, generated by `bun run i18n:glossary` from the app's `.po` catalogs (every UI label → the app's translation), merged with a short hand-kept list:
- never translated: AWFlow, Aria, Chrome Web Store, Firefox Add-ons, provider and app names, node ids, keyboard keys;
- the docs' key terms (for example workflow → "workflow" fr, "Workflow" de, "工作流" zh-CN).

**Style notes,** one per language in `src/i18n/style/<locale>.md`, matching the app: French uses "vous" and a non-breaking space before `: ; ? !`; German uses "Sie"; Chinese uses full-width punctuation and no spaces between Chinese characters (spaces around Latin words and numbers kept).

**Source tracking.** Each translated page carries:

```yaml
i18n:
  source: <git blob hash of the English file it was translated from>
  reviewed: false   # true once a native speaker checked it (informational)
```

Git can return the exact English text a translation was made from (`git cat-file -p <blob>`), so a re-sync works from a precise old → new English diff. The schema is extended in `src/content.config.ts`.

**`bun run i18n:status`.** Per locale: pages up to date, stale (English blob changed), missing, orphaned (English page deleted); coverage of the interface dictionary, translation memory and screenshot text. `--json` for scripts.

**`bun run i18n:check` (build gate).** Parses each English page and its translation as MDX and compares everything except prose:
- heading count and levels;
- component names and non-text props (`shot`, `spot`, `n`, `start`, `focus`, ids, `href`s);
- code blocks and inline code;
- link targets;
- frontmatter keys and non-text values.

Only text may differ: prose, and the text props `title`, `body`, `check`, `caption`, `alt`, `label`, `description`, `tweak`. A failure stops the build with the page, the line and what differs. It runs as part of `bun run build`.

**Stale pages ship.** A stale translation shows a short note in its language: "The English version was updated since this translation — read it in English", linking to the English page. English changes never wait for translations.

**Translating: the `docs-translate` skill.** A Claude Code skill in the docs repo (`.claude/skills/docs-translate/`), like the app's `wuchale-po-translate`:
- input: a job list from `i18n:status` (locale, pages, missing or stale);
- per page: the English page, the glossary, the style note, and for stale pages the old/new English diff plus the current translation, so only affected parts change and a reviewer's fixes survive;
- also fills missing dictionary keys, translation-memory entries and screenshot text;
- runs `i18n:check` on what it wrote before finishing.

The first full pass runs as parallel agents in worktrees, one per locale and section. Nothing calls a translation API in the build; no API key or paid service is involved.

## 4. Reaching the right language

**Header picker.** Starlight's language select in our `Header` override, next to the theme select. Picking a language opens the same page in that language and saves the choice (`awf:docs-lang`, localStorage, wrapped in try/catch).

**Hint bar (no redirect).** On an English page, a dismissible bar shows when the reader's saved choice (else the first supported entry of `navigator.languages`) is fr, de or zh, and this page has a real translation in that language (not a fallback). It's written in the target language ("Cette page existe en français — Lire en français"). Dismissing it is remembered. Shared links and search results always open what they point to. The list of translated pages is a manifest generated at build time.

**App → docs links (`agentic-flow`).** One helper, `docsUrl(path)` in `src/lib/utils/consts.ts`, prefixes the app's current language (`currentLang.lang` / `getHarnessLocale()`: `en` → none, `fr` → `/fr`, `de` → `/de`, `zh` → `/zh-cn`). It replaces the hand-built links:
- node "Learn more" (`classes.ts` `getDocLink`);
- the help menu (`navigation.svelte.ts` `getHelpNav`);
- the narration style guide links (3 places);
- the OAuth guide (`OAuth/providers.ts`, anchors kept);
- release notes (`extensions/utils/releaseNotes.ts`, which today hard-codes its own docs URL): the service worker reads `app:locale` from extension storage; the existing HEAD probe and fallback stay.

**Ask Aria from the docs.** On a translated page the prompt's framing sentences come from the dictionary and ask Aria to answer in the page's language. Sources are the top hits of that language's search index. `llms.txt` stays English (an index for AI tools).

**Search.** Pagefind builds one index per `<html lang>`. The search dialog's text, groups and suggestion chips come from the dictionary. For Chinese, the loose-match fallback splits text into character bigrams instead of words.

## 5. Build, search engines, rollout, testing

**Build.**
- OG images: zh-cn titles use a CJK font (Noto Sans SC, subset to the characters used); section colours work on prefixed paths.
- `starlight-links-validator`: `errorOnFallbackPages: false` so translated pages may link to pages not translated yet; `errorOnInvalidHashes` stays on (works because ids are English).
- `starlight-md-txt` produces `/fr/….md` copies automatically; `starlight-llms-txt` stays English.
- Output grows: HTML and OG images about 4× (OG images 17 MB → about 68 MB). Screenshots are shared (one English set). Build time is measured in phase 1 and reported.

**Search engines.** Starlight emits `hreflang` alternates and the per-language `<html lang>`; the sitemap (`site` is set) lists every language. No redirects, so English URLs keep their ranking.

**Rollout.** Each phase ships on its own: untranslated pages fall back to English with a notice.

1. **Foundation.** Locale config; interface dictionary, `useT`, `createT`, island wrappers; `localizeHref` + link rehype; English heading ids; route middleware, lesson rail, search groups, OG fixes; `i18n:check` (in the build) and `i18n:status`; schema; glossary generator, style notes, `docs-translate` skill. Then the interface, Home, 404 and Get started translated in fr, de, zh-cn, and the picker goes live.
2. **Use the app and Concepts** (about 160 pages), with screenshot text overlays.
3. **Recipes,** per-locale recipe data, goal ids, `listings.json` i18n.
4. **Nodes.** Locale-aware generator, translation memory, 189 node pages, localized node data views.
5. **App side and discovery.** `docsUrl()` in the app; hint bar and localized Ask Aria in the docs.
6. **Recorded follow-ups (not built):** localized screenshot captures; the app catalog gaps found in phase 4 (separate app issue).

**Testing.**
- Docs unit tests: dictionary completeness per locale; `localizeHref`; heading-id assignment; `i18n:check` on passing and failing fixture pages; the generator's lookup order (catalog → memory → dictionary); goal ids round-trip.
- App unit tests: `docsUrl` for each app language, including `zh` → `/zh-cn`.
- Build gates: `i18n:check`, links validator, full `bun run build`.
- Browser checks per phase (Playwright, light and dark, each language): home, a guide with guided screenshots, a recipe, a node page, search; Chinese glyphs in pages and OG images.

**Tracking.** An epic with one sub-issue per phase and per cross-cutting piece, label `docs-i18n`, on org Project #2. Implementation merged locally into `Dev` (epic convention), pushed when asked.

## Out of scope

Translated slugs; release-note translation; localized screenshot captures (follow-up); a translated `llms.txt`; machine translation at build time; languages beyond the app's four.
