/** Shots for the pages added with AWFlow 0.9 (Road to 1.0), captured at side-panel width. */
import { type ShotDef } from './define.ts';

const T = 15_000;
const PANEL = { width: 400, height: 860 };
/** Imports and opens the workflow at desktop width (the wizard and Make it mine), then back to the panel width. */
async function openAtPanel(s: Parameters<ShotDef['prepare']>[0], name: string, run = false) {
	const page = s.page as unknown as { setViewportSize(v: { width: number; height: number }): Promise<void> };
	await page.setViewportSize({ width: 1440, height: 900 });
	await s.editor(name);
	if (run) await s.testRun(name).catch(() => {});
	await page.setViewportSize(PANEL);
	await s.page.waitForTimeout(800);
}
const dialog = (p: Parameters<NonNullable<ShotDef['spots']>[number]['locator']>[0]) => p.getByRole('dialog').filter({ visible: true }).last();

export const shots: ShotDef[] = [
	{
		name: 'variables-new',
		page: 'app/variables',
		route: '#/app/variables?new=BASE_URL',
		viewport: PANEL,
		alt: 'The New variable sheet at side-panel width: Name filled with BASE_URL (letters, numbers and _, up to 50), an empty Value, an optional Description of what it is for, and Cancel and Save buttons.',
		spots: [
			{ id: 'name', label: 'Name', locator: (p) => dialog(p).getByRole('textbox', { name: /^Name/ }) },
			{ id: 'value', label: 'Value', locator: (p) => dialog(p).getByRole('textbox', { name: /^Value/ }) },
			{ id: 'description', label: 'Description (optional)', locator: (p) => dialog(p).getByRole('textbox', { name: /^Description/ }) },
			{ id: 'save', label: 'Save', locator: (p) => dialog(p).getByRole('button', { name: 'Save', exact: true }) }
		],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.go('#/app/variables?new=BASE_URL');
			await s.page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-health',
		page: 'app/settings/health',
		route: '#/app/settings/health',
		viewport: PANEL,
		alt: 'Settings › Health at side-panel width: 1 thing needs attention, checked just now, 8 checks passed, with Run checks again; under Worth a look, Your browser may delete AWFlow data when space runs low, with Protect my data; then 8 checks passed folded into one row, and a note that everything runs on this device.',
		spots: [],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.go('#/app/settings/health');
			await s.page.getByText(/checked just now/i).first().waitFor({ timeout: 30_000 });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'insights-page',
		page: 'app/insights',
		route: '#/app/insights',
		viewport: PANEL,
		alt: 'The Insights page at side-panel width: Your insights for the last 30 days with the 7 days, 30 days, 90 days and 1 year tabs; tiles for Runs, Failure rate, Typical run time and Time saved (not set yet, with Set time saved per run); then Workflows · top 10 by runs with Hash Text, and the bottom bar.',
		spots: [],
		prepare: async (s) => {
			await openAtPanel(s, 'hash-text', true);
			await s.go('#/app/insights');
			await s.page.getByText('Failure rate').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(1200);
		}
	},
	{
		name: 'keyboard-shortcuts',
		page: 'app/workflows/keyboard-shortcuts',
		route: '#/app/workflows/<id> (? sheet)',
		viewport: PANEL,
		alt: 'The Keyboard shortcuts sheet at side-panel width: Canvas (Add a step N, Run the workflow ⌘ Enter, Select all, Add sticky note, Tidy up, Fit view · 100 %, Save · Undo · Redo), Selected step (move with the arrows, Open settings Enter, Rename F2, Disable · Enable D, Copy · Paste · Duplicate, Delete), Step picker keys, and All shortcuts in the docs.',
		spots: [],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await openAtPanel(s, 'hash-text');
			const page = s.page;
			await page.getByRole('button', { name: 'Add a step' }).first().waitFor({ timeout: T });
			await page.keyboard.press('?');
			await page.getByRole('dialog').getByText(/Keyboard shortcuts/).first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'workflow-settings',
		page: 'app/workflows/settings',
		route: '#/app/workflows/<id> (⋯ › Workflow settings)',
		viewport: PANEL,
		alt: 'The Workflow settings sheet of Hash Text at side-panel width: Running with Timezone for schedules (Europe/Paris · your browser); Run history with Save step data (Only for failed runs selected, For all runs, Never) and Keep Manual runs switched on; When this fails with Create an error workflow; Value with Minutes saved per run; and Done.',
		spots: [],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await openAtPanel(s, 'hash-text');
			const page = s.page;
			await page.getByRole('button', { name: 'Open menu', exact: true }).first().click({ timeout: T });
			await page.getByRole('menuitem', { name: 'Workflow settings' }).click({ timeout: T });
			await page.getByText('Save step data').first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'workflow-info',
		page: 'app/workflows/create',
		route: '#/app/workflows/<id> (workflow name › Workflow info)',
		alt: 'The Workflow info popover opened from the workflow name in the canvas header: Status with the On/Off switch (or Runs when you press Run), the version with History, the behaviour, where it is stored, its folder, and when it was created, with Workflow settings at the bottom.',
		spots: [
			{ id: 'name', label: 'The workflow name: opens Workflow info', locator: (p) => p.getByRole('button', { name: /workflow info$/ }).first() },
			{ id: 'settings', label: 'Workflow settings', locator: (p) => p.getByRole('button', { name: /Workflow settings/ }).last() }
		],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.editor('hash-text');
			await s.page.getByRole('button', { name: /workflow info$/ }).first().click({ timeout: T });
			await s.page.getByText(/^Created/).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	}
];
