# German style (docs)

- Address the reader as „Sie“, like the app. Imperative with Sie for steps: „Öffnen Sie Verbindungen“.
- UI labels exactly as the app shows them: the glossary's `app` map wins. Labels in **bold** as in English.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Headings: German capitalization rules, otherwise sentence style (no Title Case).
- Quotation marks „…“. Decimal comma in prose, never inside code.
- Prefer clear, short sentences over long compound ones; split sentences rather than chaining clauses.
- Terms follow the app, not the first draft: „Knoten“ (not Node), „Auslöser“ for the Trigger label (compound node names in the app say „Chat-Trigger“, „Fehler-Trigger“; copy node names from the `app` map), „Anmeldedaten“, „Seitenbereich“, „Wissensdatenbank“. „Workflow“ and „Canvas“ stay.
- Interface strings (`src/i18n/ui/de.ts`): flat keys, plurals as `_one` / `_other`; never assemble one sentence from several keys. Sidebar labels live in `src/i18n/nav-labels.ts`.
