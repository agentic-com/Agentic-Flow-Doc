/**
 * Imports screens the app's e2e suite saved (e2e/pages/Shots.ts, `E2E_SHOTS_DIR` + `E2E_SHOTS_DARK=1`)
 * as docs shots: run states the static capture build can't reach (a run in another page, a queued
 * background run, an interrupted run, a paused run whose version changed, a transient toast).
 *
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e -- runs-screens
 *   (app) E2E_SHOTS_DIR=/tmp/w10 E2E_SHOTS_DARK=1 bun run test:e2e:ext -- extension.spec --grep queued
 *   (docs) bun scripts/capture/import-e2e.ts /tmp/w10 <app commit>
 *
 * Writes src/assets/screenshots/<shot>.{light,dark}.webp + <shot>.json, the same format as
 * `bun run docs:capture`. Spot boxes are in % of the 1280×800 screen, measured on the e2e screens.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { toWebp } from './lib/util.ts';

type Box = { x: number; y: number; w: number; h: number };
type Def = { source: string; page: string; route: string; alt: string; spots: Record<string, { label: string; box: Box }> };

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
	}
};

const [dirArg, commit = 'unknown'] = process.argv.slice(2);
if (!dirArg) throw new Error('usage: bun scripts/capture/import-e2e.ts <E2E_SHOTS_DIR> [app commit]');
const dir = resolve(dirArg);
const OUT = resolve(import.meta.dir, '../../src/assets/screenshots');
const appVersion = '0.9.0';
const r1 = (n: number) => Math.round(n * 10) / 10;

for (const [shot, def] of Object.entries(SHOTS)) {
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
	const hotspots = Object.entries(def.spots).map(([id, { label, box }]) => ({
		id,
		label,
		x: r1(box.x + box.w / 2),
		y: r1(box.y + box.h / 2),
		box: { x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h) }
	}));
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
