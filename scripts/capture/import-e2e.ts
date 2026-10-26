/**
 * Imports screens the app's e2e suite saved (e2e/pages/Shots.ts, `E2E_SHOTS_DIR` + `E2E_SHOTS_DARK=1`)
 * as docs shots: run states the static capture build can't reach (a run in another page, a queued
 * background run, an interrupted run, a paused run whose version changed, a transient toast).
 *
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e -- runs-screens
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e:ext -- extension.spec --grep queued
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e -- doc-states --project=web-desktop
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e:ext -- doc-states
 *   (app) E2E_SHOTS_DIR=/tmp/obs E2E_SHOTS_DARK=1 bun run test:e2e -- doc-states-observability --project=web-desktop
 *     (its "Online evals" test makes the obs-online-* screens, O10)
 *   (docs) bun scripts/capture/import-e2e.ts /tmp/w10 <app commit> [shot,shot,…]
 *
 * Writes src/assets/screenshots/<shot>.{light,dark}.webp + <shot>.json, the same format as
 * `bun run docs:capture`. Spot boxes are in % of the screen: written here (measured on the e2e
 * screens), or, for a spot without a box, read from `<source>.spots.json`, which the e2e saves
 * next to the screen (e2e/pages/Shots.ts). The third argument imports only the named shots.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { toWebp } from './lib/util.ts';

type Box = { x: number; y: number; w: number; h: number };
type Def = { source: string; page: string; route: string; alt: string; spots: Record<string, { label: string; box?: Box }> };

const SHOTS: Record<string, Def> = {
	'runs-stop': {
		source: 'a1-runs-running-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs)',
		alt: 'Runs with one row: Lead sync is Running, started by its Schedule in the background 2 minutes ago, with a Stop button at the end of the row.',
		spots: {
			running: { label: 'Running', box: { x: 21.9, y: 28.0, w: 6.0, h: 2.4 } },
			stop: { label: 'Stop', box: { x: 93.2, y: 27.7, w: 4.6, h: 3.0 } }
		}
	},
	'runs-stop-confirm': {
		source: 'a2-stop-confirm-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs › Stop)',
		alt: 'The Stop this run? dialog: Finished steps keep their results. Get issues is cancelled now; the steps after it don’t run. Buttons Keep running and Stop run.',
		spots: {
			keep: { label: 'Keep running', box: { x: 50.8, y: 52.9, w: 7.2, h: 3.5 } },
			'stop-run': { label: 'Stop run', box: { x: 58.7, y: 53.0, w: 5.0, h: 3.3 } }
		}
	},
	'runs-stopped-toast': {
		source: 'a3-run-stopped-toast-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs, after Stop)',
		alt: 'After Stop, a toast says Run stopped, Lead sync · marked Canceled, with View run.',
		spots: {
			toast: { label: 'Run stopped', box: { x: 70.3, y: 88.8, w: 27.8, h: 9.2 } },
			'view-run': { label: 'View run', box: { x: 91.6, y: 91.9, w: 5.2, h: 3.0 } }
		}
	},
	'runs-queued': {
		source: 'b-runs-queued-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs)',
		alt: 'Runs with one Queued row: E2E Hello waits for the run before it, 1 in line, with Cancel at the end of the row.',
		spots: {
			queued: { label: 'Queued', box: { x: 21.9, y: 28.1, w: 5.9, h: 2.2 } },
			cancel: { label: 'Cancel', box: { x: 93.3, y: 27.7, w: 4.5, h: 3.0 } }
		}
	},
	'run-interrupted': {
		source: 'c-run-interrupted-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs › an Interrupted run)',
		alt: 'The detail of an Interrupted run of E2E Runaway: This run stopped unexpectedly. The browser closed while Spin forever was running. Last finished step: Start. Spin forever shows Stopped while running; Run again and Debug in editor are above the steps.',
		spots: {
			notice: { label: 'This run stopped unexpectedly', box: { x: 64.9, y: 37.8, w: 32.9, h: 10.6 } },
			'run-again': { label: 'Run again', box: { x: 89.5, y: 50.3, w: 8.3, h: 3.0 } },
			step: { label: 'Stopped while running', box: { x: 87.8, y: 70.0, w: 9.7, h: 2.0 } }
		}
	},
	'run-timed-out': {
		source: 'd-run-timed-out-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows (Runs › a Timed out run)',
		alt: 'The detail of a Timed out run of E2E Time limit: Get page took longer than its 1 s time limit, so the run stopped. Change the limit in the step’s Advanced settings. Get page Failed after 1.0 s; Log price didn’t run.',
		spots: {
			notice: { label: 'Timed out', box: { x: 64.9, y: 37.8, w: 32.9, h: 13.4 } },
			'run-again': { label: 'Run again', box: { x: 89.5, y: 52.8, w: 8.3, h: 3.0 } },
			step: { label: 'The step that ran out of time', box: { x: 65.0, y: 71.0, w: 32.5, h: 5.0 } }
		}
	},
	'paused-run-changed': {
		source: 'e1-needs-you-changed-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs, a paused run)',
		alt: 'Needs attention on a paused Wait for approval run: You changed this workflow after the run paused. It continues with the version it started on (v1). Your changes (v2) apply to the next runs. What changed, then Approve, Reject and Cancel.',
		spots: {
			notice: { label: 'You changed this workflow after the run paused', box: { x: 26.1, y: 27.5, w: 71.6, h: 8.6 } },
			'what-changed': { label: 'What changed', box: { x: 90.2, y: 29.0, w: 6.5, h: 2.7 } },
			approve: { label: 'Approve', box: { x: 26.0, y: 37.6, w: 5.1, h: 3.0 } }
		}
	},
	'paused-run-version-gone': {
		source: 'e2-needs-you-version-gone-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs, a paused run)',
		alt: 'Needs attention on a paused run whose version was deleted: It can’t continue as it was. Continue on the current version (steps that no longer exist are skipped) or Cancel this run (marked Canceled), with Not now and Continue.',
		spots: {
			notice: { label: 'The version this run started on was deleted', box: { x: 26.1, y: 27.5, w: 71.6, h: 8.4 } },
			'continue-current': { label: 'Continue on the current version', box: { x: 26.1, y: 37.4, w: 71.6, h: 7.6 } },
			'cancel-run': { label: 'Cancel this run', box: { x: 26.1, y: 46.1, w: 71.6, h: 7.6 } },
			continue: { label: 'Continue', box: { x: 62.2, y: 55.4, w: 35.5, h: 3.0 } }
		}
	},
	'rename-toast': {
		source: 'f1-rename-toast-1280',
		page: 'app/workflows/components/nodes',
		route: '#/app/workflows/<id> (step settings, title)',
		alt: 'A step renamed to Find open issues in its settings; a toast says Renamed to “Find open issues”, 2 references in 2 steps now use the new name, with Undo.',
		spots: {
			title: { label: 'The step’s name', box: { x: 7.8, y: 6.0, w: 59.5, h: 4.3 } },
			toast: { label: 'Renamed to …', box: { x: 70.3, y: 81.0, w: 27.8, h: 11.3 } },
			undo: { label: 'Undo', box: { x: 93.1, y: 85.3, w: 3.7, h: 2.8 } }
		}
	},
	// Seeded states (docs "seeded screenshots"): e2e/specs/web/doc-states.spec.ts and e2e/specs/ext/doc-states.spec.ts.
	'run-failed-items': {
		source: 'g1-failed-items-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs › a run with failed items)',
		alt: 'The Steps tab of a Done with errors run of E2E Order import: Parse order ran 4 times; Went to Error · 3 items, 1 done · 3 failed, lists Item 2, Item 3 and Item 4, each with its JSON error and Run again, then Run the 3 failed items again.',
		spots: {
			heading: { label: 'Went to Error · 3 items' },
			item: { label: 'Run again (one item)' },
			all: { label: 'Run the 3 failed items again' }
		}
	},
	'run-failed-items-retry': {
		source: 'g2-retry-failed-items-1280',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs › Run the failed items again)',
		alt: 'The Run the 3 failed items again? dialog: Parse order and the steps after it run again for these 3 items only, as a new run. Run it on: The workflow as it is now (selected) or The version it ran on. Orders doesn’t run again: its results from this run are used. Cancel and Run again.',
		spots: {
			version: { label: 'Run it on' },
			'run-again': { label: 'Run again' }
		}
	},
	'step-test-one-item-menu': {
		source: 'h1-test-one-item-menu-1280',
		page: 'app/workflows/components/nodes',
		route: '#/app/workflows/<id> (step settings, Run step ▾)',
		alt: 'The Parse order step with 4 input items; the arrow next to Run step opens Run this step with…: All 4 items (4 calls), Only item 1 (1 call), and Run from here.',
		spots: {
			menu: { label: 'Run this step with…' },
			all: { label: 'All 4 items' },
			one: { label: 'Only item 1' }
		}
	},
	'step-tested-one-item': {
		source: 'h2-tested-one-item-1280',
		page: 'app/workflows/components/nodes',
		route: '#/app/workflows/<id> (step settings, after a one-item test)',
		alt: 'After Only item 1, the Output of Parse order shows a blue note: Tested with item 1 only. The other 3 items didn’t run. Steps after this one see 1 item until you run all. With Run all 4.',
		spots: {
			note: { label: 'Tested with item 1 only' },
			'run-all': { label: 'Run all 4' }
		}
	},
	'http-pagination': {
		source: 'i-pagination-1280',
		page: 'nodes/builtin/core/http-request',
		route: '#/app/workflows/<id> (HTTP Request settings, after a run)',
		alt: 'An HTTP Request step, List products, after a paginated run: the Output shows Stopped at 3 pages, the limit. More pages exist. Raise Max pages (up to 100) to get them, with Raise to 25, above 6 items. Under the pagination settings: Will ask for page = 1, 2, 3: up to 3 pages. Stops when the list is empty. Up to 3 pages, about 6 items (the last run got 2 per page).',
		spots: {
			notice: { label: 'Stopped at 3 pages, the limit' },
			raise: { label: 'Raise to 25' },
			line: { label: 'What it will do, and what the last run got' }
		}
	},
	'test-runs-cases': {
		source: 'j1-test-runs-rows-1280',
		page: 'app/workflows/test-runs',
		route: '#/app/workflows/<id> (⋯ › Test runs › Set up test runs, 1)',
		alt: 'Set up test runs, step 1 · Test cases: Rows from Google Sheets, Data Store or Paste CSV (selected), with the pasted rows (question, expected) and Next.',
		spots: {
			source: { label: 'Rows from: Paste CSV' },
			rows: { label: 'Rows' },
			next: { label: 'Next' }
		}
	},
	'test-runs-in-out': {
		source: 'j2-test-runs-answers-1280',
		page: 'app/workflows/test-runs',
		route: '#/app/workflows/<id> (⋯ › Test runs › Set up test runs, 2)',
		alt: 'Set up test runs, step 2 · In and out: What goes in (question becomes Start › started) and What a good answer is (expected compared with the Number step’s n field), with Back and Next.',
		spots: {
			input: { label: 'What goes in' },
			expected: { label: 'What a good answer is' },
			step: { label: 'Step to compare with' }
		}
	},
	'test-runs-score': {
		source: 'j3-test-runs-score-1280',
		page: 'app/workflows/test-runs',
		route: '#/app/workflows/<id> (⋯ › Test runs › Set up test runs, 3)',
		alt: 'Set up test runs, step 3 · Score: Score with Correctness (AI judge, 1–5), Judge model, Pass at 0.8, a note that it adds an Evaluation Trigger before the step and an Evaluation step after it (normal runs skip both), and Add to workflow.',
		spots: {
			score: { label: 'Score with' },
			pass: { label: 'Pass at' },
			add: { label: 'Add to workflow' }
		}
	},
	'health-pasted-key': {
		source: 'k1-health-pasted-key-1280',
		page: 'app/settings/health',
		route: '#/app/settings/health',
		alt: 'Health with 3 things that need attention: under Critical, An API key is pasted into a step (a key sits in plain text in Get weather, E2E Weather alerts › Get weather) with Move to a connection; under Worth a look, storage protection and Nothing on this device is backed up.',
		spots: {
			move: { label: 'Move to a connection' }
		}
	},
	'health-key-move': {
		source: 'k2-health-key-move-1280',
		page: 'app/settings/health',
		route: '#/app/settings/health (Move to a connection)',
		alt: 'The Move the key to a connection sheet: Found, step Get weather, field Headers › X-Api-Key, value sk-l••••••••cdef; Connection type API key in a header; Name E2e-test key; what happens (Get weather uses the new connection, the header is removed from the step, the key is stored like your other connections); Cancel and Move.',
		spots: {
			found: { label: 'Found (the key, masked)' },
			name: { label: 'Name' },
			move: { label: 'Move' }
		}
	},
	'backup-vault': {
		source: 'l-backup-vault-1280',
		page: 'app/settings/storage',
		route: '#/app/settings/storage?backup=now',
		alt: 'The Back up now dialog: what the file holds (workflows, connections, settings, Data Store collections), Passphrase with Use my vault passphrase (selected) or Choose a different one, the Vault passphrase field filled (it unlocks the vault for this session too), Good to know, and Unlock and back up.',
		spots: {
			vault: { label: 'Use my vault passphrase' },
			passphrase: { label: 'Vault passphrase' },
			create: { label: 'Unlock and back up' }
		}
	},
	'install-consent': {
		source: 'm-install-consent-1280',
		page: 'app/workflows/publishing',
		route: '#/app/import?src=<docs link> (Open in AWFlow)',
		alt: 'Install “Daily exchange rates”?: This workflow was made by someone else. Once installed, it can make network requests (to api.frankfurter.app) and run code in a sandbox (Keep USD and GBP: no internet, pages or files). Before it runs: it asks the first time it uses each site and each connection. A checkbox, I understand this workflow can run with these permissions when I use it, then Cancel and Install.',
		spots: {
			can: { label: 'Once installed, it can' },
			before: { label: 'Before it runs' },
			understand: { label: 'I understand…' },
			install: { label: 'Install' }
		}
	},
	'insights-failing-step': {
		source: 'n-insights-step-1280',
		page: 'app/insights',
		route: '#/app/insights',
		alt: 'Insights for the last 30 days: 3 runs, 100% failure rate; the card E2E Order sync failed 3 of 3 runs, Most often at Fetch orders · 3 of 3, Usually: Response status: 429 Too Many Requests, with Open the step and Open the last failed run; the table’s Last failure column says Fetch orders · 3 of 3.',
		spots: {
			line: { label: 'Most often at Fetch orders' }
		}
	},
	'replace-step-banner': {
		source: 'o1-replace-step-banner-1280',
		page: 'app/workflows/step-versions',
		route: '#/app/workflows/<id> (a workflow with a deprecated step)',
		alt: 'The editor of E2E Page digest: under the header and the Editor, Logs and Runs tabs, an amber banner says Read page is deprecated, Use Get Page HTML instead, with a Replace step button. The canvas starts below it.',
		spots: {
			banner: { label: 'Read page is deprecated' },
			replace: { label: 'Replace step' }
		}
	},
	'replace-step-confirm': {
		source: 'o2-replace-step-confirm-1280',
		page: 'app/workflows/step-versions',
		route: '#/app/workflows/<id> (Replace step)',
		alt: 'The Replace Read page? dialog: Get Page HTML takes its place, with the same links in and out. Settings that carry over: options and outputFieldName. Its kept result and its last run’s data don’t carry over. Cancel and Replace step.',
		spots: {
			carry: { label: 'Settings that carry over' },
			confirm: { label: 'Replace step' }
		}
	},
	'model-sees': {
		source: 'p-model-sees-1280',
		page: 'concepts/ai/memory-context',
		route: '#/app/workflows/<id> (an AI step’s settings, after a run)',
		alt: 'The settings of a Tools Agent step, Summarise, after a run: above its Output, the violet The model sees card with a meter (63 of 8,192 tokens), the Instructions (8 tokens) and the Message (55 tokens: Summarise this article in 2 short bullets, with the article’s title highlighted as a value from an earlier step), and a copy button.',
		spots: {
			card: { label: 'The model sees' },
			copy: { label: 'Copy the full prompt' }
		}
	},
	'form-give-up': {
		source: 'q1-form-give-up-1280',
		page: 'nodes/builtin/trigger/form-trigger',
		route: '#/app/workflows/<id> (Form trigger settings)',
		alt: 'The settings of a Form trigger, Sign-up form, whose workflow has two more form pages: at the end, Give up after (If someone stops on a later page, the run ends as “Form not completed” after this. Never: it waits until you cancel it.) set to 1 day.',
		spots: {
			field: { label: 'Give up after' },
			day: { label: '1 day' }
		}
	},
	'form-waiting-run': {
		source: 'q2-form-waiting-1280',
		page: 'nodes/builtin/trigger/form-trigger',
		route: '#/app/workflows?tab=runs',
		alt: 'Runs with a Needs you row for E2E Event sign-up: Form · on page 2 of 3 · gives up in 24 h, with Cancel.',
		spots: {
			line: { label: 'Form · on page 2 of 3 · gives up in 24 h' },
			cancel: { label: 'Cancel' }
		}
	},
	'inbox-from-awflow': {
		source: 'r-inbox-from-awflow-1280',
		page: 'app/notifications',
		route: '#/app/workflows (inbox open)',
		alt: 'The inbox open on Workflows: From AWFlow · 2 new, with the Updated to AWFlow 0.9 card (1 of your workflows uses a step that changed in 0.9, Review, Release notes), a planned-maintenance notice and a notice about Test runs with Learn more, each with ×; then Notifications need an account. Sign in.',
		spots: {
			heading: { label: 'From AWFlow' },
			update: { label: 'Updated to AWFlow 0.9' },
			notice: { label: 'A notice from AWFlow' },
			dismiss: { label: 'Hide it (×)' }
		}
	},
	'notch-panel': {
		source: 's1-notch-panel-1280',
		page: 'app/assistant-notch',
		route: 'a web page (notch open)',
		alt: 'The assistant notch open on a web page: Ask or run a command…, On this page with 4 chats (Order help, Returns, Sizing and All 4 chats for this page), Forms with E2E Event sign-up (3 pages), Quick actions, Page tools and Quick chat.',
		spots: {
			handle: { label: 'The notch', box: { x: 95.0, y: 47.8, w: 3.8, h: 4.4 } },
			'all-chats': { label: 'All 4 chats for this page', box: { x: 68.4, y: 63.7, w: 11.3, h: 1.8 } },
			forms: { label: 'Forms', box: { x: 67.6, y: 66.4, w: 26.5, h: 4.3 } }
		}
	},
	'notch-chat-picker': {
		source: 's2-notch-chat-picker-1280',
		page: 'app/assistant-notch',
		route: 'a web page (notch › All chats for this page)',
		alt: 'The notch’s chat picker: Search chats and folders, Chats for this page · 4 of 4 (Order help, Returns, Sizing, Store hours, each with a pin star), then Not shown: workflows that are Off or archived, and chats whose sites don’t include this page.',
		spots: {
			search: { label: 'Search chats and folders', box: { x: 70.9, y: 48.9, w: 20.8, h: 2.1 } },
			list: { label: 'Chats for this page', box: { x: 67.6, y: 53.0, w: 26.5, h: 13.4 } },
			'not-shown': { label: 'Not shown', box: { x: 67.6, y: 67.3, w: 26.5, h: 5.0 } }
		}
	},
	// Look's Show on the page (board J33): e2e/specs/ext/doc-states.spec.ts, a scripted Aria (e2e only).
	'look-sheet': {
		source: 'u1-look-sheet-1280',
		page: 'app/chat-and-agents/browser-control',
		route: '#/app/assistant (a Look under Aria’s reply › its drawing)',
		alt: 'The Look sheet for 127.0.0.1:4310/flights.html, 10 elements: Page structure, not a screenshot, the drawing of the page with refs e1 to e9 (links, the From and Date fields, Search and three Hold seat buttons), Show element refs on, the legend, then Open page, Show on the page and Copy element list.',
		spots: {
			address: { label: 'The page Look read' },
			refs: { label: 'Show element refs' },
			show: { label: 'Show on the page' }
		}
	},
	'look-refs-on-page': {
		source: 'u2-look-refs-on-page-1280',
		page: 'app/chat-and-agents/browser-control',
		route: 'the tab Aria looked at (after Show on the page)',
		alt: 'The flights page itself with AWFlow’s ref badges e1 to e9 drawn over its links, fields and buttons (each Hold seat has its own), and a dark pill at the bottom: AWFlow · refs from Look at 04:10 PM, Hide refs.',
		spots: {
			badge: { label: 'A ref badge on the real button' },
			pill: { label: 'refs from Look' },
			hide: { label: 'Hide refs' }
		}
	},
	// Observability (O9): e2e/specs/web/doc-states-observability.spec.ts, data seeded through the e2e hooks.
	'obs-traces': {
		source: 'obs-traces-1280',
		page: 'app/observability/traces',
		route: '#/app/observability',
		alt: 'Observability › Traces for the last 7 days: the Threads, Traces and Spans switch with Traces selected, a search box, Last 7 days and Filter, the source chips (All sources, Agents, Aria, Teams, Workflow steps, Routines, Errors only, On device), then a table of runs of Inbox Triage, Research Scout and Aria with their input, output, start, latency and tokens; a failed Research Scout run is marked with a warning. On the right, the stats rail: 16 traces, 19% error rate, total tokens, latency P50 and P99, traces per day, where it ran (cloud models or on device) and the top tools.',
		spots: {
			'view-switch': { label: 'Threads, Traces or Spans' },
			'source-filter': { label: 'Filter by source' },
			'trace-row': { label: 'A trace: open it' },
			'stats-rail': { label: 'Stats for the range' }
		}
	},
	'obs-traces-panel': {
		source: 'obs-traces-panel-400',
		page: 'app/observability/traces',
		route: '#/app/observability (side panel)',
		alt: 'Observability in the 400 px side panel: the Traces, Monitor, Evals and Insights tabs, the search box, Threads, Traces and Spans, Last 7 days, Filter and the source chips, then two-line rows: the agent, its request, when, tokens and model, and the latency on the right. The first Inbox Triage row shows a thumbs up.',
		spots: {
			'trace-row': { label: 'A trace, as two lines' },
			filters: { label: 'Source filters' }
		}
	},
	'obs-trace': {
		source: 'obs-trace-1280',
		page: 'app/observability/traces',
		route: '#/app/observability/trace/<id>?view=conversation',
		alt: 'A trace of Inbox Triage, turn 2 of 2, Succeeded, on Conversation: the header has the thumbs up and down, the Conversation, Steps and Timeline switch and the Developer view toggle. Below, the summary says Inbox Triage used gmail.search, then used gmail.create_draft, and answered in 6.5 s using 20.8k tokens, with Add to dataset and Export trace. The conversation shows both turns: the questions about the Acme invoice, each reply with its 2 tool calls, time and tokens, and a Steps link; this trace’s turn is highlighted.',
		spots: {
			summary: { label: 'What happened, in one sentence' },
			tabs: { label: 'Conversation, Steps, Timeline' },
			feedback: { label: 'Helpful or not helpful' },
			'developer-view': { label: 'Developer view' }
		}
	},
	'obs-trace-steps': {
		source: 'obs-trace-steps-1280',
		page: 'app/observability/traces',
		route: '#/app/observability/trace/<id>?view=steps',
		alt: 'The same trace on Steps: on the left, the turns and the step tree (Inbox Triage, Step 1 · search Gmail with Thinking and Used gmail.search, then Step 2 · write the draft and Final answer folded, each with its time and tokens), with Used gmail.search selected. On the right, its detail: gmail.search, Used a tool, 658 ms, the Input & output and Events tabs, the input query and the output, as JSON.',
		spots: {
			'span-tree': { label: 'The steps, as a tree' },
			'detail-pane': { label: 'The selected step' }
		}
	},
	'obs-monitor': {
		source: 'obs-monitor-1280',
		page: 'app/observability/monitor',
		route: '#/app/observability/monitor',
		alt: 'Observability › Monitor on the prebuilt Overview dashboard: Dashboards and Alerts, the dashboard picker (Overview, Prebuilt), Clone as custom and New dashboard; the filters Last 14 days, Source, Agent and Model; under Traffic & errors, the tiles Finished traces 30, Error rate 13.3%, Failed traces 4 and Active agents 3, then the Traces per day chart (succeeded and failed) and Top error types.',
		spots: {
			range: { label: 'Time range' },
			tiles: { label: 'Key numbers' },
			chart: { label: 'A chart' },
			dashboards: { label: 'Pick a dashboard' }
		}
	},
	'obs-chart-editor': {
		source: 'obs-chart-editor-1280',
		page: 'app/observability/monitor',
		route: '#/app/observability/monitor/dashboards/<id> (Edit chart)',
		alt: 'A custom dashboard, Overview (copy), with the Edit chart sheet open for Traces per day: Title, Data (Traces, Spans or Feedback), Metric (Count), Filters with + Filter, Span, Trace or Whole tree, Group by (None, top 5, the rest folds into Other), the chart types Line, Stacked (selected), KPI, Ranked, Donut and Table, templates such as Error rate over time and Average latency by model, then Cancel and Save chart.',
		spots: {
			metric: { label: 'Metric' },
			'group-by': { label: 'Group by' },
			save: { label: 'Save chart' }
		}
	},
	'obs-alert-editor': {
		source: 'obs-alert-editor-1280',
		page: 'app/observability/alerts-and-budgets',
		route: '#/app/observability/monitor/alerts (New alert)',
		alt: 'The New alert sheet: Name Research Scout errors; the condition reads When Error rate of Research Scout over the last 6 hours is above 10 %; a backtest chart of the last 48 hours says it would not have fired; Notify me with In-app notification checked and Desktop notification (with sound); Don’t repeat for 1 hour; Cancel and Save alert.',
		spots: {
			metric: { label: 'What to watch' },
			threshold: { label: 'The line it crosses' },
			notify: { label: 'How to tell you' }
		}
	},
	'obs-alerts': {
		source: 'obs-alerts-1280',
		page: 'app/observability/alerts-and-budgets',
		route: '#/app/observability/monitor/alerts',
		alt: 'Monitor › Alerts with one rule: Research Scout errors, OK, Error rate > 10% · 6 h · Research Scout, Never fired, with a bell. New alert is at the top right; below, Recent alerts (no alerts have fired yet) and How it looks on your desktop, a sample notification.',
		spots: {
			'new-alert': { label: 'New alert' },
			'rule-row': { label: 'An alert rule and its state' }
		}
	},
	'obs-budget': {
		source: 'obs-budget-1280',
		page: 'app/observability/alerts-and-budgets',
		route: '#/app/agents/<id>?tab=monitor',
		alt: 'The Monitor tab of the Inbox Triage agent: the Monthly token budget card (resets on the 1st, counts cloud models only) with 2 000 000 typed in and Cloud tokens only, a meter for Inbox Triage at 0 of 2.00M, At 80% with In-app and Desktop checked, and At 100% with Just notify me (selected), Switch to on-device models and Pause the agent. The Runs per day chart is on the right.',
		spots: {
			limit: { label: 'Monthly token cap' },
			'on-limit': { label: 'What happens at 100%' }
		}
	},
	'obs-evals': {
		source: 'obs-evals-1280',
		page: 'app/observability/evals',
		route: '#/app/observability/evals',
		alt: 'Observability › Evals: Datasets with Import and New dataset, and one dataset, Everyday inbox requests, for Inbox Triage, 8 examples from four sources (Hand-written, From traces, AI-generated, Imported), its last experiment and a baseline score of 0.91; then Experiments with New experiment and one experiment, Shorter drafts vs current, variants A and B, Done, best B 0.93.',
		spots: {
			datasets: { label: 'Datasets' },
			'new-dataset': { label: 'New dataset' },
			experiments: { label: 'Experiments' }
		}
	},
	'obs-dataset': {
		source: 'obs-dataset-1280',
		page: 'app/observability/evals',
		route: '#/app/observability/evals/datasets/<id>',
		alt: 'The dataset Everyday inbox requests (Inbox Triage, 8 examples, 4 evaluators, baseline Shorter drafts vs current): Export and New experiment at the top; Examples with Add, From traces, Import CSV / JSON and Generate with AI, and a table of the 8 examples with their input, expected answer, expected tools and source; then the Evaluators heading, run on every experiment of this dataset, starting with Completeness (LLM judge).',
		spots: {
			examples: { label: 'The examples' },
			'add-from-traces': { label: 'Add from traces' },
			generate: { label: 'Generate with AI' },
			evaluators: { label: 'Evaluators' }
		}
	},
	'obs-new-experiment': {
		source: 'obs-new-experiment-1280',
		page: 'app/observability/evals',
		route: '#/app/observability/evals/experiments/new',
		alt: 'New experiment: 1 · Agent and dataset with Inbox Triage on Everyday inbox requests (8); 2 · Variants, a table with A Baseline and B Shorter drafts side by side (Model, Role, Instructions, Temperature, and Skills, rules, memory with Vary these too), and + Variant; 3 · Scoring with the evaluators Completeness, Expected tools called, Must contain and Must not contain checked, the Judge model and Runs per example. Cancel and Run 16 runs are at the top right.',
		spots: {
			dataset: { label: 'Dataset' },
			variants: { label: 'Variants to compare' },
			evaluators: { label: 'Evaluators' },
			run: { label: 'Run' }
		}
	},
	'obs-compare': {
		source: 'obs-compare-1280',
		page: 'app/observability/evals',
		route: '#/app/observability/evals/experiments/<id>',
		alt: 'The finished experiment Shorter drafts vs current (Done), with Review A vs B and Apply B to agent: the variants A Current and B Shorter drafts; Scores per evaluator, 0 to 1, compared with baseline A (B is higher on Completeness and Expected tools called, lower on Must contain); Latency P50 and Tokens per run; then Examples with the filters All 8, Worse than baseline · 1, Outputs differ · 8 and Run failed · 0, and a row per example with both outputs and their scores.',
		spots: {
			scores: { label: 'Scores, A vs B' },
			rows: { label: 'One example, both answers' },
			apply: { label: 'Apply the winner to the agent' }
		}
	},
	'obs-review': {
		source: 'obs-review-1280',
		page: 'app/observability/evals',
		route: '#/app/observability/evals/review/<id>',
		alt: 'Review · Shorter drafts vs current, 0 / 8 rated: Pairwise A vs B, labels hidden and shuffled; Which is better? or Rate one at a time; the input of example 1 with its expected answer; Answer 1 and Answer 2 side by side; the buttons Answer 1 is better (1), Tie (T), Answer 2 is better (2) and Skip (S); and a Why? box.',
		spots: {
			sides: { label: 'The two answers' },
			choices: { label: 'Your pick' }
		}
	},
	'obs-regression': {
		source: 'obs-regression-1280',
		page: 'app/observability/agent-versions',
		route: '#/app/agents/<id>?tab=evals',
		alt: 'The Evals tab of the Inbox Triage agent: a draft banner says You edited Instructions just now · draft v2 is not tested yet, with an Always re-run on change checkbox and a Test v2 vs baseline v1 button. Below, Versions lists v2 · draft (untested) and v1 · current with the baseline chip and a score of 0.91; Datasets shows Everyday inbox requests (8 examples, baseline 0.91) with Open and New dataset; and Score by version charts v1.',
		spots: {
			banner: { label: 'An untested draft' },
			'test-draft': { label: 'Test it against the last version' }
		}
	},
	'obs-insights': {
		source: 'obs-insights-1280',
		page: 'app/observability/insights',
		route: '#/app/observability/insights',
		alt: 'Observability › Insights: Start a report with three lens cards (What people ask, Where it gets stuck, What it can’t do yet) and Custom question; then Reports (2): What it can’t do yet for Research Scout, manual, and Where it gets stuck for Inbox Triage, weekly on Monday at 08:00, each with its latest finding and last run. A note says the old Insights page is now Workflow stats.',
		spots: {
			lenses: { label: 'Start a report from a lens' },
			reports: { label: 'Your reports' }
		}
	},
	'obs-new-report': {
		source: 'obs-new-report-1280',
		page: 'app/observability/insights',
		route: '#/app/observability/insights/new',
		alt: 'New report, scrolled down: the lens cards with Where it gets stuck selected and the question it answers; 2 · Which conversations with Inbox Triage, Last 14 days, only failed, retried, looped or 👎, and the Sample choice 50, 200, 500 or 1000; 3 · Categories, Let the model find them or Use my categories, and Extra things to look for; 4 · Model and schedule with Analyse with and Schedule (Only when I click Run); and the estimate of the tokens and time it takes.',
		spots: {
			lens: { label: 'Lens' },
			sample: { label: 'How many conversations' },
			categories: { label: 'Categories' },
			schedule: { label: 'Schedule' },
			estimate: { label: 'What it costs in tokens and time' }
		}
	},
	'obs-report': {
		source: 'obs-report-1280',
		page: 'app/observability/insights',
		route: '#/app/observability/insights/reports/<id>',
		alt: 'The report Where it gets stuck · Inbox Triage (13 conversations, analysed by gpt-5-mini, 48k tokens), with its schedule (Weekly · Mon 08:00), Run now and the lens switch; the summary answers Where does Inbox Triage get stuck? in three points with links to the cited traces; a Categories over time chart; then Categories (5) with Find new categories and Edit categories.',
		spots: {
			summary: { label: 'The summary' },
			schedule: { label: 'Schedule' },
			'run-now': { label: 'Run now' },
			categories: { label: 'Categories' },
			'edit-categories': { label: 'Edit categories' }
		}
	},
	'obs-category': {
		source: 'obs-category-1280',
		page: 'app/observability/insights',
		route: '#/app/observability/insights/reports/<id>/categories/<key>',
		alt: 'The category Finding the right invoice of the report: 5 of 13 stuck conversations (38%), 20% 👎, with Create dataset (5) and Fix with Aria; then Conversations (5), a table of each request, what happened (the model’s summary), its feedback, when, and a Trace link.',
		spots: {
			'create-dataset': { label: 'Turn them into a dataset' },
			'fix-with-aria': { label: 'Fix with Aria' },
			conversations: { label: 'The conversations' }
		}
	},
	'obs-cant-category': {
		source: 'obs-cant-category-1280',
		page: 'app/observability/insights',
		route: '#/app/observability/insights/reports/<id> (What it can’t do yet)',
		alt: 'A What it can’t do yet report for Research Scout, scrolled to its categories: Saving digests to Notion (56%, 5 conversations) has the suggestion button Find a “save to Notion” workflow next to Open and Dataset; Reading paywalled articles (44%) has no suggestion.',
		spots: {
			suggestion: { label: 'The suggested skill' }
		}
	},
	'obs-agent-insights': {
		source: 'obs-agent-insights-1280',
		page: 'app/observability/insights',
		route: '#/app/agents/<id>?tab=insights',
		alt: 'The Insights tab of the Research Scout agent: a banner says Suggested: Find a “save to Notion” workflow · 5 requests in 14 days could not be handled, with See requests, the suggestion button and ×; below, three lens cards (What people ask and Where it gets stuck with No report yet and Create, What it can’t do yet with its finding, Open and Create), then Your reports with New custom report.',
		spots: {
			banner: { label: 'A suggested skill' },
			'lens-cards': { label: 'One card per lens' }
		}
	},
	'obs-settings': {
		source: 'obs-settings-1280',
		page: 'app/observability/settings',
		route: '#/app/settings/observability',
		alt: 'Settings › Observability: Recording with Record traces on, Include prompts and replies on (API keys, tokens and passwords are redacted before saving), Don’t record content for… with Add, and Open traces in developer view off; Storage on this device with the space used by traces, datasets and experiments, and insights, Keep traces for 30 days, Max size 200 MB, Export (OTLP JSON) and Clear traces; then the OpenTelemetry collectors heading with a Phoenix (local) collector.',
		spots: {
			recording: { label: 'Recording' },
			content: { label: 'Prompts and replies' },
			storage: { label: 'Storage on this device' },
			collectors: { label: 'Collectors' }
		}
	},
	'obs-collector': {
		source: 'obs-collector-1280',
		page: 'app/observability/collectors',
		route: '#/app/settings/observability (Add a collector)',
		alt: 'Settings › Observability › OpenTelemetry collectors with the Add a collector form open: Preset Phoenix (local), Name Phoenix (local), Endpoint http://localhost:6006/v1/traces (put API keys in headers, not in the URL), Protocol OTLP/HTTP · JSON, Send Spans with content, Headers with + Header (values are stored in your secret vault), a note that the collector must allow requests from this site (CORS), then Send test span and Save collector.',
		spots: {
			preset: { label: 'Preset' },
			endpoint: { label: 'Endpoint' },
			headers: { label: 'Headers' },
			test: { label: 'Send test span' }
		}
	},
	// Online evals (O10, awflow/Agentic-Flow#1618): e2e/specs/web/doc-states-observability.spec.ts.
	'obs-online-setup': {
		source: 'obs-online-setup-1280',
		page: 'app/observability/online-evals',
		route: '#/app/agents/<id>?tab=evals (Online evals › Set up)',
		alt: 'Inbox Triage’s Evals tab with the Online evals setup open on the right: Score live conversations on; How many at 10%, less than 1 a day from the last 14 days; Which conversations with All selected, then Failed, With 👎, Chat and Routines; Evaluators with Completeness, Tool selection and Refusal ticked and the other judges unticked, + Add evaluator and a note that Correctness isn’t offered because it needs an expected answer; Judge model Agent’s model and Monthly cap 1 000 000 (1.00M judge tokens a month); an estimate of about 9.6k judge tokens a month that also count toward the agent’s budget, a note that a cloud judge’s provider receives each scored conversation, then Cancel and Save.',
		spots: {
			sheet: { label: 'The Online evals setup' },
			rate: { label: 'How many' },
			filter: { label: 'Which conversations' },
			evaluators: { label: 'Evaluators' },
			cap: { label: 'Monthly cap' }
		}
	},
	'obs-online-card': {
		source: 'obs-online-card-1280',
		page: 'app/observability/online-evals',
		route: '#/app/agents/<id>?tab=evals',
		alt: 'Inbox Triage’s Evals tab with the Online evals card as a full-width row above Versions and Datasets, On: tiles Sampling 10% of all conversations, Scored · 7 days 10 (last 1 min ago) and Judge tokens · October 46.8k / 1.00M with a meter; Average score · last 7 days with a 7-day trend line each: Completeness 0.75, Tool selection 0.94, Refusal 1.00; the links See scored conversations and 2 low scores → Add to dataset, the Score past traces… button, and Edit at the top.',
		spots: {
			card: { label: 'Online evals card' },
			edit: { label: 'Edit' },
			backfill: { label: 'Score past traces…' },
			'low-link': { label: '2 low scores → Add to dataset' }
		}
	},
	'obs-online-trace': {
		source: 'obs-online-trace-1280',
		page: 'app/observability/online-evals',
		route: '#/app/observability/trace/<id>',
		alt: 'A trace of Inbox Triage on Conversation. Under the summary, Online scores shows the chips Completeness 0.35 (low, open), Refusal 1.00 and Tool selection 1.00, and Scored by gpt-5-mini · 4.6k judge tokens. The open chip explains that the user asked for the September invoice from Northwind and the reply attaches NW-0912 from 3 October, with Add to dataset and Not right? Rate it yourself. Below, the conversation: Find the invoice from Northwind for September and the agent’s answer.',
		spots: {
			chips: { label: 'Online score chips' },
			explanation: { label: 'The judge’s explanation' }
		}
	},
	'obs-online-chart': {
		source: 'obs-online-chart-1280',
		page: 'app/observability/online-evals',
		route: '#/app/agents/<id>?tab=monitor',
		alt: 'Inbox Triage’s Monitor tab, scrolled to the Online eval scores chart: one line per evaluator (Completeness, Refusal, Tool selection) with the average score per day, Completeness dipping to 0.10 on one day.',
		spots: {
			chart: { label: 'Online eval scores' }
		}
	},
	'obs-online-alert': {
		source: 'obs-online-alert-1280',
		page: 'app/observability/online-evals',
		route: '#/app/observability/monitor/alerts (New alert)',
		alt: 'Monitor › Alerts with the New alert sheet: Name Inbox Triage online scores; When Online eval score of Inbox Triage over the last 24 hours is below 0.7; Evaluator All evaluators, with the hint that the average online score is 0 to 1 and needs at least 5 scores; the Last 48 hours preview says it would not have fired, its scores above the 0.70 line; then Notify me, Cancel and Save alert.',
		spots: {
			metric: { label: 'Online eval score' },
			evaluator: { label: 'Evaluator' }
		}
	}
};
const [dirArg, commit = 'unknown', onlyArg] = process.argv.slice(2);
const only = onlyArg?.split(',').map((x) => x.trim()).filter(Boolean);
for (const n of only ?? []) if (!SHOTS[n]) throw new Error(`unknown shot ${n}. Shots: ${Object.keys(SHOTS).join(', ')}`);
if (!dirArg) throw new Error('usage: bun scripts/capture/import-e2e.ts <E2E_SHOTS_DIR> [app commit] [shot,shot,…]');
const dir = resolve(dirArg);
const OUT = resolve(import.meta.dir, '../../src/assets/screenshots');
const appVersion = '0.9.0';
const r1 = (n: number) => Math.round(n * 10) / 10;

for (const [shot, def] of Object.entries(SHOTS).filter(([n]) => !only || only.includes(n))) {
	const files: Record<string, string> = {};
	let width = 0, height = 0;
	for (const theme of ['light', 'dark'] as const) {
		const src = join(dir, `${def.source}-${theme}.png`);
		if (!existsSync(src)) throw new Error(`${shot}: missing ${src}`);
		const webp = await toWebp(readFileSync(src));
		writeFileSync(join(OUT, `${shot}.${theme}.webp`), webp.data);
		files[theme] = `${shot}.${theme}.webp`;
		({ width, height } = webp);
	}
	const spotsFile = join(dir, `${def.source}.spots.json`);
	const measured: Record<string, Box> = existsSync(spotsFile) ? JSON.parse(readFileSync(spotsFile, 'utf8')) : {};
	const hotspots = Object.entries(def.spots).map(([id, { label, box: given }]) => {
		const box = given ?? measured[id];
		if (!box) throw new Error(`${shot}: no box for spot "${id}" (not in the script, nor in ${spotsFile})`);
		return {
			id,
			label,
			x: r1(box.x + box.w / 2),
			y: r1(box.y + box.h / 2),
			box: { x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h) }
		};
	});
	const entry = {
		$comment: 'Imported by scripts/capture/import-e2e.ts from the app e2e screens. Do not edit by hand: change the script and re-import.',
		shot,
		page: def.page,
		route: def.route,
		alt: def.alt,
		status: 'ok',
		files,
		hotspots,
		appCommit: commit,
		appVersion,
		capturedAt: new Date().toISOString(),
		width,
		height
	};
	writeFileSync(join(OUT, `${shot}.json`), JSON.stringify(entry, null, '\t') + '\n');
	console.log(`${shot}: ok (${width}×${height})`);
}
