# Docs O9: Observability section

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** document AWFlow observability for users (issue awflow/Agentic-Flow#1617). This means:
- the Observability guide section (Traces, Monitor with alerts and budgets, Evals with agent versions, Insights with Fix with Aria);
- the settings and collectors how-to (Phoenix, Langfuse, any OTLP);
- a concept page;
- updates to the pages the observability work made stale;
- real guided screenshots.

**Architecture:** a new "Observability" group under the "Use the app" topic (`app/observability/*.mdx`), plus `concepts/ai/observability.mdx`.

Screenshots follow the e2e import path. A new app-side e2e spec, `e2e/specs/web/doc-states-observability.spec.ts`, seeds telemetry through the existing e2e hooks and saves shots with spot boxes. The docs repo then imports them with `scripts/capture/import-e2e.ts`. They cannot come from the static capture build, which has no traces and no hooks.

**Tech stack:** Astro 7 + Starlight, MDX, `@components/awflow` (GuidedShot, StepShot, StepCard, Screenshot, Callout, Badge), Mermaid with `awf-*` classes, Playwright (app e2e).

**Sources of truth (read them, never invent):**
- **Spec:** `architectures/observability.md` in the app repo. §1 goals, §4 the span tree, §9 collectors, §10 feedback, §11 monitoring, §12 evals, §13 insights, §14 privacy, §16 UI map, and the delivery notes §11.5, §11.6, §12.7, §12.8, §13.4 and §13.5.
- **App source**, current and equal to Dev: `/Users/dannickstark/Documents/Projets/Agentic-Flow/awflow-code/agentic-flow/.claude/worktrees/ai-sdk-phase-0`.
  - UI: `src/lib/components/observability/**`, `src/lib/components/settings/observability/**`, `src/lib/components/agents/observe/**`.
  - Copy files: `*Labels.ts`.
  - Every button and field name in the docs must match the app's English copy exactly.
- **Docs conventions:** `CONTRIBUTING.md`, `app/insights.mdx` and `app/chat-and-agents/agents.mdx` (page patterns), and the map in `SDD/docs-map.md`.

## Rulings

- **R1 Location and sidebar.**
  - The "Observability" group goes in `astro.config.mjs` "Use the app" `items`, directly after "Chat & agents".
  - Pages, in this order:
    | Label | Slug |
    |---|---|
    | Overview | `app/observability/overview` |
    | Traces | `app/observability/traces` |
    | Monitor | `app/observability/monitor` |
    | Alerts & budgets | `app/observability/alerts-and-budgets` |
    | Evals | `app/observability/evals` |
    | Agent versions | `app/observability/agent-versions` |
    | Insights | `app/observability/insights` |
    | Fix with Aria | `app/observability/fix-with-aria` |
    | Settings & privacy | `app/observability/settings` |
    | Send to your tools | `app/observability/collectors` |
  - Every new label goes in `src/i18n/nav-labels.ts` with fr, de and zh-CN values. Use the app's own translations: fr "Analyses" for Insights, de "Einblicke", zh "洞察"; Evals is "Évaluations" / "Evaluierungen" / "评估".
  - Add a card "Observability" to `app/index.mdx`.
- **R2 Stale pages.**
  - `app/chat-and-agents/turn-traces.mdx` describes a removed UI (the Trace drawer, Developer mode, Settings › Privacy › Turn traces). Delete it, remove it from the sidebar, and add the redirect `/app/chat-and-agents/turn-traces/` → `/app/observability/traces/`.
  - `app/settings/privacy.mdx`: its "Turn traces" section becomes a short pointer to **Settings › Observability** and `/app/observability/settings/`.
  - `app/insights.mdx` (the old Insights page): title and sidebar label become "Workflow stats". Keep the slug, because the app route is unchanged. Add a note that AI-agent Insights live under Observability.
  - `app/chat-and-agents/seeing-the-work.mdx`, `agents.mdx` and `teams.mdx`: add an "Observe" mention and links (the agent page's **Observe** tabs: Traces, Monitor, Evals, Insights).
  - `app/privacy-and-data.mdx`: add a short Observability paragraph.
  - Fix every link to turn-traces across the repo (grep for it).
- **R3 Page template** (`kind: guide`, `section: app`). Each page has:
  - frontmatter with `title`, `description` and `sidebar.label`;
  - an `**In the app:**` line;
  - a short intro;
  - task sections, with `GuidedShot` for tasks on one screen and `StepCard`/`StepShot` for tasks across screens;
  - `## Good to know`;
  - `## Related`.
  - Write for the capable non-coder first. Developer details (span kinds, OpenInference attributes) go in a clearly marked "For developers" section or an `Aside`.
  - Tokens only: never mention cost or money.
  - Model output examples are illustrative and must be marked as such.
- **R4 Concept page** `concepts/ai/observability.mdx` (`kind: concept`, `sidebar.order` after evaluation-testing). It covers:
  - an "In 20 seconds" note;
  - traces, spans, sessions and threads, and the span kinds table (from spec §4) in plain words;
  - the four pillars and how they feed each other (Mermaid, `awf-*` classes);
  - two depths (the summary versus Developer view);
  - links into the guide pages.
- **R5 Screenshots** are the pinned list below. The shot names and spot ids are binding; page writers use them before the images exist. The app spec produces exactly these, from seeded e2e data.
  - Import with `bun scripts/capture/import-e2e.ts`, adding entries to its map: `source`, `page`, `route`, `alt`, `spots` with labels.
  - **Viewport** 1280×800, plus `obs-traces-panel` at 400×860 for the side panel.
  - **Light and dark** both (`E2E_SHOTS_DARK=1`).
  - **Never fake a state.** If a state can't be seeded (for example a Fix with Aria proposal, which needs a model), skip that shot and tell the writer.
- **R6 Shot list** (`name`: route, then spot ids):
  - **Traces**
    - `obs-traces`: `#/app/observability`; `view-switch`, `source-filter`, `trace-row`, `stats-rail`
    - `obs-traces-panel`: the same at 400 px; `trace-row`, `filters`
    - `obs-trace`: a trace detail on Conversation; `summary`, `tabs`, `feedback`, `developer-view`
    - `obs-trace-steps`: the same trace on Steps, with a span selected; `span-tree`, `detail-pane`
  - **Monitor**
    - `obs-monitor`: `#/app/observability/monitor`; `range`, `tiles`, `chart`, `dashboards`
    - `obs-chart-editor`: a custom dashboard's Edit chart sheet open; `metric`, `group-by`, `save`
    - `obs-alerts`: `#/app/observability/monitor/alerts`; `new-alert`, `rule-row`
    - `obs-alert-editor`: the alert editor open; `metric`, `threshold`, `notify`
    - `obs-budget`: an agent's Monitor tab with the budget editor; `limit`, `on-limit`
  - **Evals**
    - `obs-evals`: `#/app/observability/evals`; `datasets`, `new-dataset`, `experiments`
    - `obs-dataset`: a dataset page; `examples`, `add-from-traces`, `generate`, `evaluators`
    - `obs-new-experiment`: `#/app/observability/evals/experiments/new`; `dataset`, `variants`, `evaluators`, `run`
    - `obs-compare`: a finished experiment; `scores`, `rows`, `apply`
    - `obs-review`: `/review/:id`; `sides`, `choices`
    - `obs-regression`: the agent Evals tab with the draft banner; `banner`, `test-draft`
  - **Insights**
    - `obs-insights`: `#/app/observability/insights`; `lenses`, `reports`
    - `obs-new-report`: `/insights/new`; `lens`, `sample`, `categories`, `schedule`, `estimate`
    - `obs-report`: a seeded report; `summary`, `schedule`, `run-now`, `categories`, `edit-categories`
    - `obs-category`: a stuck category page; `create-dataset`, `fix-with-aria`, `conversations`
    - `obs-cant-category`: a cant report table with a suggestion; `suggestion`
    - `obs-agent-insights`: an agent Insights tab with the banner; `banner`, `lens-cards`
  - **Settings**
    - `obs-settings`: `#/app/settings/observability`; `recording`, `content`, `storage`, `collectors`
    - `obs-collector`: the add-collector form with the Phoenix preset; `preset`, `endpoint`, `headers`, `test`
- **R7 Not in O9.** French or other page translations (English first; nav labels are required). A release-notes entry: features ship in the next release, and the release owner adds it with an "Observability" area then.

## Global constraints

- Docs repo: work on branch `docs/observability` from `origin/Dev`, and open the PR to `Dev` on agentic-com/Agentic-Flow-Doc.
- App repo: the e2e spec goes on branch `test/observability-doc-states` from `origin/Dev`, with its PR to `Dev` on awflow/Agentic-Flow.
- Conventional commits, scoped as `docs(observability): …`.
- Gates:
  - docs: `bun run build` (links-validator, i18n check, shot checks) and `bun run test`;
  - app: the e2e spec passes and `bun run e2e:lint`.
- No `_meta.yml`. The maximum sidebar depth is 3.

## Tasks

Waves:
- **W1:** T1 (shots, app and import), T2, T3, T4 and T5 (pages). The page writers reference shots by the pinned names; the build is only run in T6.
- **W2:** T6 (integration).

### Task 1: Doc-state shots (app spec plus docs import)
- **Files.**
  - App: `e2e/specs/web/doc-states-observability.spec.ts` (new). It reuses the seeding helpers of the `observability-*.spec.ts` specs and `src/lib/e2e/hooks.ts`, and uses `e2e/pages/Shots.ts` `capture(name, spots)`.
  - Docs: `scripts/capture/import-e2e.ts` entries, and `src/assets/screenshots/obs-*.{json,light.webp,dark.webp}`.
- [ ] Seed realistic, illustrative data, all in English: 2 agents ("Inbox Triage", "Research Scout"), ~30 traces over 14 days with errors and feedback, a dataset with 8 examples, a finished experiment A vs B, a stuck report and a cant report with a suggestion, an alert rule, a budget and a collector.
- [ ] Capture every R6 shot with exactly its spot ids. Run with `E2E_SHOTS_DIR` and `E2E_SHOTS_DARK=1`.
- [ ] Import into the docs repo, check each image and its spots, and commit on both branches.

### Task 2: Concept, overview, traces, settings, collectors pages
- **Files:** `concepts/ai/observability.mdx`, and `app/observability/{overview,traces,settings,collectors}.mdx`.
- [ ] Overview: the four pillars, where to find them (sidebar › Observability and the agent **Observe** tabs), the summary versus Developer view, privacy in brief, and cards to every page.
- [ ] Traces:
  - the list: views, filters, source and the stats rail;
  - a trace: Conversation, Steps and Timeline, and Developer view;
  - feedback 👍/👎 with reasons;
  - "Add to dataset";
  - fix buttons;
  - the side panel.
- [ ] Settings & privacy: recording, content capture (prompts and replies, redaction), retention and storage, what never leaves the device, and tokens only.
- [ ] Collectors: what OTLP export is.
  - Step by step for **Phoenix (local)** and **Langfuse** (EU/US, Basic auth built from the public and secret keys).
  - Any OTLP endpoint.
  - "Send test span", metadata-only, the queue and status, the vault-locked waiting state, and that web mode needs CORS.

### Task 3: Monitor, alerts and budgets pages
- **Files:** `app/observability/{monitor,alerts-and-budgets}.mdx`.
- [ ] Monitor:
  - the overview dashboard (tiles and charts, with a table view on every chart);
  - range and filters;
  - custom dashboards and the chart editor, including grouping by agent version.
- [ ] Alerts:
  - rules: metric, threshold, scope and window;
  - notify in-app and on the desktop, plus the bell;
  - fired and resolved states.
- [ ] Budgets: per-agent token budgets, 80 % and 100 % notices, and pause versus warn at the limit.
- [ ] Analysis traffic (Evals, Insights) never counts in Monitor.

### Task 4: Evals and agent versions pages
- **Files:** `app/observability/{evals,agent-versions}.mdx`.
- [ ] Datasets: from traces, from an Insights category, and with Generate with AI; examples and expected answers; evaluators.
- [ ] Experiments: variants A–D (instructions, model, skills, rules, memory, knowledge), the run, the comparison and human review (pairwise, keys 1/T/2/S).
- [ ] Agent versions: drafts, the baseline, Apply, roll back, the draft banner and "Always re-run on change".

### Task 5: Insights and Fix with Aria pages
- **Files:** `app/observability/{insights,fix-with-aria}.mdx`.
- [ ] Insights:
  - the lenses;
  - a new report: the question, which conversations, the sample, "Use my categories", extra attributes, the model and schedule, the estimate and the privacy line;
  - the report: summary with #refs, categories over time and the categories table;
  - earlier runs, "Find new categories" and "Edit categories";
  - the category page with Create dataset;
  - schedule and notifications, the "Waiting for vault unlock" state, and the agent Insights tab.
- [ ] Fix with Aria:
  - what it proposes (added instruction lines and stricter rules) and what it never does (change the agent);
  - "Create draft & test" leads to the experiment, then Apply;
  - when it's offered;
  - missing-skill suggestions (links) and the agent-tab banner.

### Task 6: Integration
- **Files:**
  - `astro.config.mjs` (the sidebar group and the redirect);
  - `src/i18n/nav-labels.ts`;
  - `app/index.mdx`;
  - the R2 stale-page edits, including deleting `turn-traces.mdx`;
  - any link fixes.
- [ ] Run `bun run build` and `bun run test`, and fix every error (links, shots, labels).
- [ ] Read the rendered pages at 360 and 1280 (serve `dist/`).
