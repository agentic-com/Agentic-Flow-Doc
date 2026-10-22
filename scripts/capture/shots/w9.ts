/** Shots for the wave 9 engine pages: kept results, Run from here, Stop, renames, paused-run versions. */
import { type ShotDef, NO_MINIMAP } from './define.ts';
import { T } from '../lib/session.ts';
import type { Page } from '../lib/util.ts';

const PANEL = { width: 400, height: 860 };
const panel = (p: Page) => p.getByRole('dialog').filter({ visible: true }).last();
const node = (p: Page, id: string) => p.locator(`.svelte-flow__node[data-id="${id}"]`);
const closePanels = async (p: Page) => {
	for (let i = 0; i < 3 && (await p.getByRole('dialog').filter({ visible: true }).count()); i++) {
		await p.keyboard.press('Escape');
		await p.waitForTimeout(300);
	}
};

export const shots: ShotDef[] = [
	{
		name: 'keep-result',
		page: 'app/workflows/kept-results',
		route: '#/app/workflows/<id> (SHA-256 settings, Output)',
		alt: 'The settings of the SHA-256 step after a run: its Output shows the item it produced, with Keep this result and Copy under it.',
		css: NO_MINIMAP,
		spots: [{ id: 'keep', label: 'Keep this result', locator: (p) => panel(p).getByRole('button', { name: /Keep this result/ }).first() }],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.testRun('hash-text');
			await node(s.page, 'sha256').dblclick({ timeout: T });
			await panel(s.page).getByRole('button', { name: /Keep this result/ }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'kept-result',
		page: 'app/workflows/kept-results',
		route: '#/app/workflows/<id> (SHA-256 settings, kept result)',
		alt: 'The settings of the SHA-256 step with its result kept: a violet Kept result banner says editor runs use this result instead of running the step, with Stop keeping and Edit result, above the kept output.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'banner', label: 'The Kept result banner', locator: (p) => panel(p).getByText(/^Kept result/).first() },
			{ id: 'stop-keeping', label: 'Stop keeping', locator: (p) => panel(p).getByRole('button', { name: /Stop keeping/ }).first() },
			{ id: 'edit-result', label: 'Edit result', locator: (p) => panel(p).getByRole('button', { name: /Edit result/ }).first() }
		],
		prepare: async (s) => {
			const keep = panel(s.page).getByRole('button', { name: /Keep this result/ }).first();
			if (await keep.count()) await keep.click({ timeout: T });
			await panel(s.page).getByRole('button', { name: /Stop keeping/ }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'run-from-here',
		page: 'app/workflows/run-from-here',
		route: '#/app/workflows/<id> (SHA-512 settings, More ways to run)',
		alt: 'The settings of the SHA-512 step with the menu next to Run step open: Run from here runs this step and the steps after it on what earlier steps produced.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'more-ways', label: 'More ways to run (next to Run step)', locator: (p) => p.getByRole('button', { name: 'More ways to run' }).first() },
			{ id: 'run-from-here', label: 'Run from here', locator: (p) => p.getByRole('menuitem', { name: /Run from here/ }).first() }
		],
		prepare: async (s) => {
			const page = s.page;
			const stop = panel(page).getByRole('button', { name: /Stop keeping/ }).first();
			if (await stop.count()) await stop.click({ timeout: T });
			await closePanels(page);
			await node(page, 'sha512').dblclick({ timeout: T });
			await page.getByRole('button', { name: 'More ways to run' }).first().click({ timeout: T });
			await page.getByRole('menuitem', { name: /Run from here/ }).first().waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},


	{
		name: 'missing-step-check',
		page: 'app/workflows/components/nodes',
		route: '#/app/workflows/<id> (Save with a missing step)',
		alt: 'The sheet shown on Save when a field reads a step that no longer exists: Build the summary › Fields with its expression, Open to fix it, and Review and Save anyway.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'field', label: 'A field that reads a missing step', locator: (p) => panel(p).getByText(/Build the summary/).first() },
			{ id: 'save-anyway', label: 'Save anyway', locator: (p) => p.getByRole('button', { name: 'Save anyway' }) }
		],
		prepare: async (s) => {
			const page = s.page;
			await closePanels(page);
			await page.goto('about:blank');
			await s.editor('lead-sync');
			await closePanels(page);
			await node(page, 'seed-text').click({ timeout: T });
			await page.keyboard.press('Delete');
			await page.waitForTimeout(500);
			await page.getByRole('button', { name: 'Save', exact: true }).click({ timeout: T });
			await page.getByRole('button', { name: 'Save anyway' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},

];
