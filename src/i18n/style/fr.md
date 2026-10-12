# French style (docs)

- Address the reader as « vous », like the app. Imperative for steps: « Ouvrez Connexions ».
- Non-breaking space (U+00A0) before `:` `;` `?` `!` and inside « guillemets ». Never before `:` in URLs, code or times.
- UI labels exactly as the app shows them: the glossary's `app` map wins over your own wording. Put labels in **bold** as the English does.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Sentence case for headings (« Avant de commencer »), as in English.
- Numbers: `1 000` (narrow no-break space U+202F as thousands separator), decimal comma `0,5` in prose; never inside code.
- Short sentences. Translate meaning, not word order.
- Terms: « workflow » (the app's plural is « Workflows »), « nœud », « déclencheur », « canevas », « identifiant », « base de connaissances ». The app's singular « Flux de travail » appears once; use « workflow ».
- Interface strings (`src/i18n/ui/fr.ts`): flat keys, plurals as `_one` / `_other`; never assemble one sentence from several keys. Sidebar labels live in `src/i18n/nav-labels.ts`.
