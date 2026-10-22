/**
 * Imports screens the app's e2e suite saved (e2e/pages/Shots.ts, `E2E_SHOTS_DIR` + `E2E_SHOTS_DARK=1`)
 * as docs shots: run states the static capture build can't reach (a run in another page, a queued
 * background run, an interrupted run, a paused run whose version changed, a transient toast).
 *
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e -- runs-screens
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e:ext -- extension.spec --grep queued
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e -- doc-states --project=web-desktop
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e:ext -- doc-states
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
