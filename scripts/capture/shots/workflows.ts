/** Shots for the workflows docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn, NO_MINIMAP } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'workflows-list',
		page: 'app/workflows/manage-list',
		route: '#/app/workflows',
		alt: 'The Workflows page, My Workflows tab: four workflows (JSON Prettify & Repair, Hash Text, Color Converter, JWT Decoder) with their tags, active status, Local storage badge, Not published state and dates, above the Status, Storage, Published, Needs setup and Tags filters.',
		hotspots: [
			{ id: 'add-workflow', label: 'Add Workflow: create, import or describe one', locate: btn('Add Workflow') },
			{ id: 'filters', label: 'Filters', locate: (p) => p.getByRole('textbox', { name: 'Filter...' }) },
			{ id: 'row-menu', label: 'Row menu: open, run, duplicate, export, delete', locate: (p) => p.getByRole('row').nth(1).getByRole('button', { name: 'Open menu' }) }
		],
		prepare: async (s) => {
			for (const w of ['hash-text', 'json-prettify', 'jwt-decoder', 'color-converter']) await s.workflow(w);
			await s.go('#/app/workflows');
			await s.page.getByText(/JSON Prettify/).first().waitFor({ timeout: T });
			if ((await s.page.getByRole('row').filter({ hasText: /Needs setup/ }).count()) > 0)
				throw new Error("an imported workflow is still badged 'Needs setup'");
		}
	},
	{
		name: 'canvas',
		page: 'app/workflows/create',
		route: '#/app/workflows/<id>',
		alt: 'The workflow editor with the Hash Text example: a sticky note explaining it, then five connected steps (Run now, Your text, SHA-256, SHA-512, Show the hashes). The toolbar with Editor, Logs and Executions tabs is at the top, the Test Workflow button at the top right, and zoom controls at the bottom left.',
		css: NO_MINIMAP,
		hotspots: [
			{ id: 'add-step', label: 'Add a step (node)', locate: (p) => p.locator('#canvas-add-step') },
			{ id: 'editor', label: 'Editor, Logs and Executions tabs', locate: (p) => p.getByRole('tablist').first() },
			{ id: 'test-workflow', label: 'Test Workflow: run it now', locate: btn('Test Workflow') },
			{ id: 'step', label: 'A step (node); drag from its handle to connect', locate: (p) => p.locator('.svelte-flow__node[data-id="sha256"]') }
		],
		prepare: async (s) => {
			await s.editor('hash-text');
			const page = s.page;
			const collapse = page.getByRole('button', { name: 'Collapse panel' });
			if (await collapse.count()) {
				await collapse.first().click({ timeout: T });
				await collapse.first().waitFor({ state: 'hidden', timeout: T });
			}
			await page.getByRole('button', { name: 'Fit View' }).first().click({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'node-settings',
		page: 'usage/using-the-app/workflows/components/nodes',
		route: '#/app/workflows/<id>',
		alt: "The settings panel of the SHA-512 step after a test run: on the left the Input panel lists this step's data and the steps before it; on the right the Parameters tab shows Operation, Algorithm, HMAC Key and a Text field mapped to $input.text, with a preview of the value from the last run.",
		hotspots: [
			{ id: 'input-output-step', label: 'Input and Output of this step', locate: (p) => p.getByRole('dialog').getByText('Input', { exact: true }).first() },
			{ id: 'parameters', label: 'Parameters, Settings and Tutorials tabs', locate: (p) => p.getByRole('dialog').getByText('Parameters', { exact: true }).first() },
			{ id: 'mapped-field', label: 'A mapped field, with a preview from the last run', locate: (p) => p.getByRole('dialog').getByText(/Preview from last run/).first() },
			{ id: 'test-step', label: 'Test step', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Test step' }) }
		],
		prepare: async (s) => {
			await s.testRun('hash-text');
			await s.page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			await s.page.getByRole('dialog').getByText('SHA-512').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'run-history',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Executions tab)',
		alt: "The Executions tab of the Hash Text workflow: a table of saved runs, each with a Success status, when it started, its duration, where it ran (Local) and its metadata, with a filter bar above.",
		hotspots: [
			{ id: 'executions-tab', label: 'Executions tab', locate: (p) => p.getByRole('tab', { name: 'Executions' }) },
			{ id: 'filter-runs', label: 'Filter runs', locate: btn('Filter') },
			{ id: 'saved-run-its-status', label: 'A saved run and its status', locate: (p) => p.getByText('Success').first() }
		],
		prepare: async (s) => {
			await s.savedRuns('hash-text', 3);
			await s.go(await s.workflow('hash-text'));
			await s.page.getByRole('tab', { name: 'Executions' }).click({ timeout: T });
			await s.page.getByText('Success').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'workflows-bulk',
		page: 'app/workflows/manage-list',
		route: '#/app/workflows',
		alt: 'The Workflows page, My Workflows tab, with three of the listed workflows selected: their row checkboxes are ticked, the footer says how many rows are selected, and a toolbar at the bottom shows 3 selected with Export, Activate, Deactivate, Tags, Delete and Clear.',
		hotspots: [
			{ id: 'select-rows', label: 'Select rows', locate: (p) => p.getByRole('row').nth(1).getByRole('checkbox') },
			{ id: 'bulk-action-toolbar', label: 'Bulk-action toolbar', locate: (p) => p.getByText('selected', { exact: true }).last() }
		],
		prepare: async (s) => {
			for (const w of ['hash-text', 'json-prettify', 'jwt-decoder']) await s.workflow(w);
			await s.go('#/app/workflows');
			const page = s.page;
			await page.getByText(/JSON Prettify/).first().waitFor({ timeout: T });
			for (let i = 1; i <= 3; i++) await page.getByRole('row').nth(i).getByRole('checkbox').click({ timeout: T });
			await page.getByRole('button', { name: 'Deactivate' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
];
