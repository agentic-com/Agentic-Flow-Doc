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
- Translate prose, headings, frontmatter `title`, `description`, `sidebar.label`, `sidebar.badge.text`, hero text, and component text props. What may be translated is defined in `scripts/i18n/structure.ts`: `TEXT_PROPS` (component attributes) and, inside expression props such as `steps={[…]}` / `spots={[…]}`, only the keys in `TEXT_KEYS`. Read those two sets instead of relying on a remembered list.
- Everything else must stay identical (`i18n:check` compares it): imports, component names, every other prop and object key (`STRUCTURAL_PROPS` / `STRUCTURAL_KEYS`: `shot`, `spot`, `n`, `start`, `href`, ids, ...), `hydrate="load|idle|visible"` island attributes (not `client:*`; leave them as they are), code blocks, inline code, link targets (keep `/app/…` — the build localizes them), image paths, other frontmatter values, heading count and levels.
- Relative imports: a translated page sits one folder deeper than the English one, so add one more `../` (`../../../data/stores` instead of `../../data/stores`). `i18n:check` resolves them; a wrong depth fails. Aliases such as `@components/awflow` stay as written.
- Add `i18n: { source: "<hash>" }` to the frontmatter, where `<hash>` is `git hash-object src/content/docs/<english path>`. The hash must be a QUOTED string (`source: "abc…"`): an unquoted all-digit hash parses as a number.

## 4. Re-sync a stale page

The status gives the old `source`. Get the English diff:

    git cat-file -p <old source> > /tmp/en-old.mdx
    git diff --no-index /tmp/en-old.mdx src/content/docs/<english path>

Change only the parts of the translation that correspond to the diff; keep everything else (a reviewer may have fixed it). Update `i18n.source` (quoted) to the new hash. If `reviewed: true` was set, keep it only if your edits are a few words; otherwise set it to `false`.

## 5. Interface strings

Interface strings are in `src/i18n/ui/{en,fr,de,zh-cn}.ts`: flat keys, plurals as `_one` / `_other`; never assemble one sentence from several keys. Sidebar labels are in `src/i18n/nav-labels.ts`. When `bun test tests/i18n/ui.test.ts` or the build reports missing keys, add the translation for every missing key in `src/i18n/ui/<locale>.ts` (or `nav-labels.ts`), using the glossary first.

## 6. Check before finishing

    bun run i18n:check --locale <locale>
    bun test tests/i18n

Fix every reported line. Then report: pages translated, pages re-synced, keys added, and anything you were unsure about (with the page and line).

## Refreshing the glossary

`bun run i18n:glossary` (env `AWFLOW_APP_DIR`, default `../agentic-flow`) regenerates `src/i18n/glossary/<locale>.json` from the app's `.po` files plus `terms.json`. Commit the output.
