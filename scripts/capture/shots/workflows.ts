/** Shots for the workflows docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { join } from 'node:path';
import { type ShotDef, btn, inDialog, NO_MINIMAP } from './define.ts';
import { T, type Session } from '../lib/session.ts';

const POP = '[data-slot="popover-content"]';
const FIXTURES = join(import.meta.dir, '..', 'fixtures');
const NAMES = ['hash-text', 'json-prettify', 'jwt-decoder', 'color-converter'];
const MOUSE = (s: Session) => (s.page as unknown as { mouse: { move(x: number, y: number, o?: { steps?: number }): Promise<void>; down(): Promise<void>; up(): Promise<void> } }).mouse;

/** The workflows list with the example workflows, no dialog or menu open and no filter left from an earlier shot. */
async function cleanList(s: Session) {
	for (const w of NAMES) await s.workflow(w);
	await s.page.goto('about:blank');
	await s.go('#/app/workflows');
	const page = s.page;
	await page.getByRole('button', { name: 'Add Workflow' }).first().waitFor({ timeout: T });
	const reset = page.getByRole('button', { name: 'Reset', exact: true });
	if (await reset.count()) await reset.first().click({ timeout: T });
	const search = page.getByRole('textbox', { name: 'Filter...' });
	if (await search.count()) await search.first().fill('');
	await page.getByText(/JSON Prettify/).first().waitFor({ timeout: T });
}
const row = (s: Session, name: string) => s.page.getByRole('row').filter({ hasText: name }).first();
async function selectRows(s: Session, n: number) {
	for (let i = 1; i <= n; i++) await s.page.getByRole('row').nth(i).getByRole('checkbox').click({ timeout: T });
	await s.page.getByRole('button', { name: 'Turn off' }).waitFor({ timeout: T });
}
/** Opens the Runs tab of Hash Text (3 saved runs). */
async function executions(s: Session) {
	await fresh(s);
	await s.savedRuns('hash-text', 3);
	await s.page.goto('about:blank');
	await s.go(await s.workflow('hash-text'));
	await s.page.getByRole('tab', { name: 'Runs' }).click({ timeout: T });
	await s.page.getByText('Done', { exact: true }).first().waitFor({ timeout: T });
}
/** A fresh page load: no dialog, popover or Executions tab left by an earlier shot (editor() only navigates when the route differs). */
async function fresh(s: Session) {
	await s.page.goto('about:blank');
}
/** Opens a workflow's editor with the side panel collapsed and the whole flow in view. */
async function canvas(s: Session, name: string) {
	if (!new URL(s.page.url()).hash.startsWith('#/app/workflows/')) await fresh(s);
	await s.editor(name);
	const page = s.page;
	const collapse = page.getByRole('button', { name: 'Collapse panel' });
	if (await collapse.count()) {
		await collapse.first().click({ timeout: T });
		await collapse.first().waitFor({ state: 'hidden', timeout: T });
	}
	await page.getByRole('button', { name: /^(Fit View|Fit the workflow on screen)$/ }).first().click({ timeout: T });
	await page.waitForTimeout(500);
}

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
		alt: 'The workflow editor with the Hash Text example: a sticky note explaining it, then five connected steps (Run now, Your text, SHA-256, SHA-512, Show the hashes). The Editor, Logs and Runs tabs are at the top, the Run button at the top right, and zoom controls at the bottom left.',
		css: NO_MINIMAP,
		hotspots: [
			{ id: 'add-step', label: 'Add a step (node)', locate: (p) => p.locator('#canvas-add-step') },
			{ id: 'editor', label: 'Editor, Logs and Runs tabs', locate: (p) => p.getByRole('tablist').first() },
			{ id: 'test-workflow', label: 'Run: run it now', locate: (p) => p.getByRole('button', { name: /^Run( workflow)?$/ }).first() },
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
			await page.getByRole('button', { name: /^(Fit View|Fit the workflow on screen)$/ }).first().click({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'node-settings',
		page: 'app/workflows/components/nodes',
		route: '#/app/workflows/<id>',
		alt: "The settings panel of the SHA-512 step after a test run: on the left the Input panel lists this step's data and the steps before it; on the right the Parameters tab shows Operation, Algorithm, HMAC Key and a Text field mapped to $input.text, with a preview of the value from the last run.",
		hotspots: [
			{ id: 'input-output-step', label: 'Input of this step', locate: (p) => p.getByRole('dialog').getByText(/^Input\s*·/i).first() },
			{ id: 'parameters', label: 'Setup and Advanced tabs', locate: (p) => p.getByRole('dialog').getByText('Setup', { exact: true }).first() },
			{ id: 'mapped-field', label: 'A mapped field, with a preview from the last run', locate: (p) => p.getByRole('dialog').getByText(/\(item \d+ of \d+\)/).first() },
			{ id: 'test-step', label: 'Run step', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Run step' }) }
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
		route: '#/app/workflows/<id> (Runs tab)',
		alt: "The Runs tab of the Hash Text workflow: All, Automatic and Manual chips with their counts, a Filter button, and a table of saved runs, each marked Done with how it started, when, its duration and where it ran (Local).",
		hotspots: [
			{ id: 'runs-tab', label: 'Runs tab', locate: (p) => p.getByRole('tab', { name: 'Runs' }) },
			{ id: 'filter-runs', label: 'Filter runs', locate: btn(/^Filter/) },
			{ id: 'saved-run-its-status', label: 'A saved run and its status', locate: (p) => p.getByText('Done', { exact: true }).first() }
		],
		prepare: async (s) => {
			await s.savedRuns('hash-text', 3);
			await s.go(await s.workflow('hash-text'));
			await s.page.getByRole('tab', { name: 'Runs' }).click({ timeout: T });
			await s.page.getByText('Done', { exact: true }).first().waitFor({ timeout: T });
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
		spots: [
			{ id: 'bulk-export', label: 'Export the selected workflows', locator: (p) => p.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Export', exact: true }) },
			{ id: 'bulk-tags', label: 'Tags: add or remove tags on all of them', locator: (p) => p.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Tags', exact: true }) },
			{ id: 'bulk-delete', label: 'Delete the selected workflows', locator: (p) => p.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Delete', exact: true }) },
			{ id: 'bulk-clear', label: 'Clear the selection', locator: (p) => p.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Clear', exact: true }) }
		],
		prepare: async (s) => {
			for (const w of ['hash-text', 'json-prettify', 'jwt-decoder']) await s.workflow(w);
			await s.go('#/app/workflows');
			const page = s.page;
			await page.getByText(/JSON Prettify/).first().waitFor({ timeout: T });
			for (let i = 1; i <= 3; i++) await page.getByRole('row').nth(i).getByRole('checkbox').click({ timeout: T });
			await page.getByRole('button', { name: 'Turn off' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},

	{
		name: 'workflow-row-menu',
		page: 'app/workflows/manage-list',
		route: '#/app/workflows (row menu)',
		alt: 'The Workflows page, My Workflows tab, with the ⋮ menu of the Hash Text row open: Open, Improve with Aria, Run, Duplicate, Edit, Manage tags, Export and Delete.',
		spots: [
			{ id: 'row-menu', label: 'The row menu (⋮)', locator: (p) => p.getByRole('row').filter({ hasText: 'Hash Text' }).first().getByRole('button', { name: 'Open menu' }) },
			{ id: 'run', label: 'Run', locator: (p) => p.getByRole('menuitem', { name: 'Run', exact: true }) },
			{ id: 'duplicate', label: 'Duplicate', locator: (p) => p.getByRole('menuitem', { name: 'Duplicate' }) },
			{ id: 'edit', label: 'Edit name and description', locator: (p) => p.getByRole('menuitem', { name: 'Edit', exact: true }) },
			{ id: 'manage-tags', label: 'Manage tags', locator: (p) => p.getByRole('menuitem', { name: 'Manage tags' }) },
			{ id: 'export', label: 'Export as a .awf file', locator: (p) => p.getByRole('menuitem', { name: 'Export' }) },
			{ id: 'delete', label: 'Delete', locator: (p) => p.getByRole('menuitem', { name: 'Delete' }) }
		],
		prepare: async (s) => {
			await cleanList(s);
			await row(s, 'Hash Text').getByRole('button', { name: 'Open menu' }).click({ timeout: T });
			await s.page.getByRole('menuitem', { name: 'Delete' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1200);
		}
	},
	{
		name: 'workflow-tags',
		page: 'app/workflows/tags',
		route: '#/app/workflows (row menu › Manage tags)',
		alt: 'The Manage tags dialog for the Hash Text workflow: the Tags field holds crypto, hash and security, each with a × to remove it, and the new tag daily is being typed, above Cancel and Save.',
		spots: [
			{ id: 'current-tags', label: 'Current tags: click × to remove one', locator: inDialog((d) => d.getByText('crypto', { exact: true })) },
			{ id: 'add-tag', label: 'Type a tag and press Enter', locator: inDialog((d) => d.getByRole('textbox').first()) },
			{ id: 'save', label: 'Save', locator: inDialog((d) => d.getByRole('button', { name: 'Save' })) }
		],
		prepare: async (s) => {
			await cleanList(s);
			await row(s, 'Hash Text').getByRole('button', { name: 'Open menu' }).click({ timeout: T });
			await s.page.getByRole('menuitem', { name: 'Manage tags' }).click({ timeout: T });
			const dialog = s.page.getByRole('dialog');
			await dialog.getByText('Manage tags').first().waitFor({ timeout: T });
			const input = dialog.getByRole('textbox').first();
			await input.fill('security');
			await input.press('Enter');
			await input.fill('daily');
			await s.page.waitForTimeout(400);
		}
	},
	{
		name: 'workflows-filter',
		page: 'app/workflows/filters',
		route: '#/app/workflows (Tags filter)',
		alt: 'The Workflows page with the Tags filter open: crypto is ticked, so the Tags button shows 1, a Reset button has appeared next to the filters, and the list shows only Hash Text (1 of 4 match filters).',
		spots: [
			{ id: 'search', label: 'Search by name', locator: (p) => p.getByRole('textbox', { name: 'Filter...' }) },
			{ id: 'filter-button', label: 'A filter, with the number of values picked', locator: (p) => p.getByRole('button', { name: /^Tags/ }).first() },
			{ id: 'filter-value', label: 'Tick one or more values', locator: (p) => p.getByRole('option', { name: 'crypto' }) },
			{ id: 'reset', label: 'Reset: clear every filter', locator: (p) => p.getByRole('button', { name: 'Reset', exact: true }) }
		],
		prepare: async (s) => {
			await cleanList(s);
			const page = s.page;
			await page.getByRole('button', { name: /^Tags/ }).first().click({ timeout: T });
			await page.getByRole('option', { name: 'crypto' }).click({ timeout: T });
			await page.getByRole('button', { name: 'Reset', exact: true }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'workflows-bulk-tags',
		page: 'app/workflows/tags',
		route: '#/app/workflows (bulk › Tags)',
		alt: 'The Manage tags dialog opened from the bulk-action toolbar for 3 selected workflows: an Add tags field holding the tag tools, an empty Remove tags field, and Cancel and Apply buttons.',
		spots: [
			{ id: 'add-tags', label: 'Add tags', locator: inDialog((d) => d.getByRole('textbox').first()) },
			{ id: 'remove-tags', label: 'Remove tags', locator: inDialog((d) => d.getByRole('textbox').nth(1)) },
			{ id: 'apply', label: 'Apply', locator: inDialog((d) => d.getByRole('button', { name: 'Apply' })) }
		],
		prepare: async (s) => {
			await cleanList(s);
			await selectRows(s, 3);
			await s.page.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Tags', exact: true }).click({ timeout: T });
			const dialog = s.page.getByRole('dialog');
			await dialog.getByText('Add tags').first().waitFor({ timeout: T });
			const add = dialog.getByRole('textbox').first();
			await add.fill('tools');
			await add.press('Enter');
			await s.page.waitForTimeout(400);
		}
	},
	{
		name: 'workflows-bulk-delete',
		page: 'app/workflows/manage-list',
		route: '#/app/workflows (bulk › Delete)',
		alt: 'The Delete workflows dialog after selecting 3 workflows: Delete 3 selected workflows? This can\'t be undone, with Cancel and Delete buttons.',
		spots: [
			{ id: 'confirm-delete', label: 'Delete: confirm', locator: inDialog((d) => d.getByRole('button', { name: 'Delete', exact: true })) },
			{ id: 'cancel', label: 'Cancel', locator: inDialog((d) => d.getByRole('button', { name: 'Cancel' })) }
		],
		prepare: async (s) => {
			await cleanList(s);
			await selectRows(s, 3);
			await s.page.getByRole('toolbar', { name: 'Bulk actions' }).getByRole('button', { name: 'Delete', exact: true }).click({ timeout: T });
			await s.page.getByRole('dialog').getByText('Delete workflows').waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'import-source',
		page: 'app/workflows/export-import',
		route: '#/app/workflows (Add Workflow › Import)',
		alt: 'The Create a workflow dialog, step 1 of 3 (Source, Choose, Details), with Import selected among Start from a template, Blank canvas, From the marketplace and Import, and the Continue button.',
		spots: [
			{ id: 'import', label: 'Import', locator: inDialog((d) => d.getByRole('button', { name: /^\W*Import/ })) },
			{ id: 'continue', label: 'Continue', locator: inDialog((d) => d.getByRole('button', { name: 'Continue' })) }
		],
		prepare: async (s) => {
			await cleanList(s);
			await s.page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
			await s.page.getByRole('dialog').getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'import-file',
		page: 'app/workflows/export-import',
		route: '#/app/workflows (Add Workflow › Import, step 2)',
		alt: 'Step 2 of the Create a workflow dialog for an import: From a file and From a URL tabs, and a Choose a .awf file area noting that secrets are never shared inside a flow file.',
		spots: [
			{ id: 'from-file', label: 'From a file', locator: inDialog((d) => d.getByRole('button', { name: 'From a file' })) },
			{ id: 'from-url', label: 'From a URL', locator: inDialog((d) => d.getByRole('button', { name: 'From a URL' })) },
			{ id: 'choose-file', label: 'Choose a .awf file', locator: inDialog((d) => d.getByText(/Choose a \.awf file/)) }
		],
		prepare: async (s) => {
			await cleanList(s);
			const dialog = s.page.getByRole('dialog');
			await s.page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
			await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
			await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
			await dialog.getByText(/Choose a \.awf file/).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'import-details',
		page: 'app/workflows/export-import',
		route: '#/app/workflows (Add Workflow › Import, step 3)',
		alt: 'Step 3, Name & save, of the Create a workflow dialog after choosing a file: Source Imported .awf, the Name prefilled with Color Converter, an optional Description, Where to save (Saved locally in this browser), and Back and Create & open buttons.',
		spots: [
			{ id: 'name', label: 'Name', locator: inDialog((d) => d.getByRole('textbox').first()) },
			{ id: 'create-open', label: 'Create & open', locator: inDialog((d) => d.getByRole('button', { name: 'Create & open' })) }
		],
		prepare: async (s) => {
			await cleanList(s);
			const page = s.page;
			const dialog = page.getByRole('dialog');
			await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
			await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
			await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
			const chooser = page.waitForEvent('filechooser', { timeout: T });
			await dialog.getByText(/Choose a \.awf file/).click({ timeout: T });
			await (await chooser).setFiles(join(FIXTURES, 'color-converter.awf'));
			await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
			await dialog.getByRole('button', { name: 'Create & open' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'version-history',
		page: 'app/workflows/history',
		route: '#/app/workflows/<id> (History)',
		alt: 'The JSON Prettify & Repair workflow in the editor with the History sheet open: every saved version of the workflow, grouped by day, each with its label, the time and what changed, the newest marked Current.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'version-history', label: 'History (the clock button)', locator: (p) => p.getByRole('button', { name: 'Version history' }) },
			{ id: 'current', label: 'The current version', locator: (p) => p.getByRole('dialog').getByText('Current', { exact: true }).first() }
		],
		prepare: async (s) => {
			await canvas(s, 'json-prettify');
			const page = s.page;
			const mouse = MOUSE(s);
			// Two edits, each saved: every save keeps a version.
			for (const dy of [60, -60]) {
				const box = await page.locator('.svelte-flow__node[data-id="copy"]').boundingBox();
				if (!box) throw new Error('node "copy" not on screen');
				await mouse.move(box.x + box.width / 2, box.y + box.height / 2);
				await mouse.down();
				await mouse.move(box.x + box.width / 2, box.y + box.height / 2 + dy, { steps: 8 });
				await mouse.up();
				await page.waitForTimeout(400);
				await page.getByRole('button', { name: 'Save', exact: true }).click({ timeout: T });
				await page.waitForTimeout(1500);
			}
			// The list of versions is read when the editor opens.
			const route = new URL(page.url()).hash;
			await fresh(s);
			await s.go(route);
			await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
			await page.getByRole('button', { name: 'Version history' }).click({ timeout: T });
			await page.getByText('Every saved version of this workflow.').waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'run-filter',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs › Filter)',
		alt: 'The Runs tab of the Hash Text workflow with the Filter panel open: Status set to Done, Run date range (Pick a date) and a Reset button, over a list of three finished runs.',
		spots: [
			{ id: 'status', label: 'Status', locator: (p) => p.locator(POP).getByRole('button', { name: /Select a status|Done/ }) },
			{ id: 'date-range', label: 'Run date range', locator: (p) => p.locator(POP).getByRole('button', { name: /Pick a date/ }) },
			{ id: 'reset', label: 'Reset', locator: (p) => p.locator(POP).getByRole('button', { name: 'Reset' }) }
		],
		prepare: async (s) => {
			await executions(s);
			const page = s.page;
			await page.getByRole('button', { name: /^Filter/ }).click({ timeout: T });
			await page.getByText('Filter the runs.').waitFor({ timeout: T });
			await page.locator(POP).getByRole('button', { name: 'Select a status' }).click({ timeout: T });
			await page.getByRole('option', { name: 'Done', exact: true }).click({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'run-detail',
		page: 'app/workflows/run-history',
		route: '#/app/workflows/<id> (Runs › a run)',
		alt: 'The Runs tab of the Hash Text workflow with All, Automatic and Manual chips, three Done runs started Manually, and the first run open on the right: Done · Manual, when it started, its duration, where it ran and its run id; Steps, Graph and Logs tabs with Debug in editor; the Steps tab lists the five steps with their item counts and says No step data for this run, with Change what\'s saved.',
		spots: [
			{ id: 'run-row', label: 'The run you opened', locator: (p) => p.getByRole('row').nth(1) },
			{ id: 'graph-tab', label: 'Graph: the workflow as it was when it ran', locator: (p) => p.getByRole('tab', { name: 'Graph' }) },
			{ id: 'logs-tab', label: 'Logs: every line the run wrote', locator: (p) => p.getByRole('tab', { name: 'Logs', exact: true }).last() },
			{ id: 'steps-tab', label: 'Steps: each step of the run', locator: (p) => p.getByRole('tab', { name: 'Steps' }) },
			{ id: 'debug-in-editor', label: 'Debug in editor', locator: (p) => p.getByRole('button', { name: /Debug in editor/ }).last() }
		],
		prepare: async (s) => {
			await executions(s);
			const page = s.page;
			await page.keyboard.press('Escape');
			await page.getByRole('row').nth(1).click({ timeout: T });
			await page.getByRole('tab', { name: 'Steps' }).waitFor({ timeout: T });
			await page.waitForTimeout(1200);
			// The read-only graph opens its Story panel over the detail: collapse it.
			const collapse = page.getByRole('button', { name: 'Collapse panel' }).filter({ visible: true });
			if (await collapse.count()) await collapse.first().click({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'last-run',
		page: 'app/workflows/executions/run-from-the-canvas',
		route: '#/app/workflows/<id> (after Run)',
		alt: 'The Hash Text workflow after a test run: every step has a green check and each connection shows 1 Item; the Last run tab of the panel on the right says It worked, 5 steps ran successfully, with a Run again button.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'test-workflow', label: 'Run', locator: (p) => p.getByRole('button', { name: /^Run( workflow)?$/ }).first() },
			{ id: 'last-run', label: 'Last run: what happened, in plain words', locator: (p) => p.getByText('It worked').first() },
			{ id: 'run-again', label: 'Run again', locator: (p) => p.getByRole('button', { name: 'Run again' }).first() },
			{ id: 'step-output', label: 'A step and its output count', locator: (p) => p.locator('.svelte-flow__node[data-id="sha512"]') }
		],
		prepare: async (s) => {
			await fresh(s);
			await s.testRun('hash-text');
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'canvas-sticky-note',
		page: 'app/workflows/components/sticky-notes',
		route: '#/app/workflows/<id> (sticky note, right-click menu)',
		alt: 'The Hash Text workflow in the editor with its yellow sticky note selected (resize handles on its corners) and its right-click menu open: Edit Sticky Note, Change Color, Duplicate, Copy, Duplicate and Delete. The Add sticky note button is in the toolbar at the top left.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'add-sticky-note', label: 'Add sticky note', locator: btn('Add sticky note') },
			{ id: 'note', label: 'A sticky note: drag to move, double-click to edit', locator: (p) => p.locator('.svelte-flow__node[data-id="sticky-intro"]') },
			{ id: 'resize', label: 'Drag a corner to resize', locator: (p) => p.locator('.svelte-flow__node[data-id="sticky-intro"] .svelte-flow__resize-control.bottom.right').first() },
			{ id: 'edit-sticky-note', label: 'Edit Sticky Note', locator: (p) => p.getByRole('menuitem', { name: 'Edit Sticky Note' }) },
			{ id: 'change-color', label: 'Change Color', locator: (p) => p.getByRole('menuitem', { name: 'Change Color' }) }
		],
		prepare: async (s) => {
			await canvas(s, 'hash-text');
			const note = s.page.locator('.svelte-flow__node[data-id="sticky-intro"]');
			await note.click({ timeout: T });
			await (note as unknown as { click(o: { button: 'right'; position: { x: number; y: number }; timeout: number }): Promise<void> }).click({ button: 'right', position: { x: 120, y: 60 }, timeout: T });
			await s.page.getByRole('menuitem', { name: 'Change Color' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1200);
		}
	},
	{
		name: 'canvas-connection',
		page: 'app/workflows/components/connections',
		route: '#/app/workflows/<id>',
		alt: 'The Hash Text workflow after a test run, zoomed in: the steps Run now, Your text, SHA-256 and SHA-512 joined left to right by connections, each labelled 1 Item, from the output port on the right of one step to the input port on the left of the next.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'output-port', label: 'Output port: drag from here', locator: (p) => p.locator('.svelte-flow__node[data-id="sha256"] .svelte-flow__handle.source').first() },
			{ id: 'input-port', label: 'Input port of the next step: drop here', locator: (p) => p.locator('.svelte-flow__node[data-id="sha512"] .svelte-flow__handle.target').first() },
			{ id: 'connection', label: 'The connection, with the number of items it passed', locator: (p) => p.getByText('1 Item', { exact: true }).nth(2) }
		],
		prepare: async (s) => {
			await fresh(s);
			await s.testRun('hash-text');
			await canvas(s, 'hash-text');
			await s.page.getByRole('button', { name: /^Zoom in$/i }).click({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'node-context-menu',
		page: 'app/workflows/narration',
		route: '#/app/workflows/<id> (step right-click menu)',
		alt: 'The Hash Text workflow in the editor with the right-click menu of the SHA-256 step open: Open, Edit note, Ask AI about this step, Test Step, Rename, Duplicate, Copy, Duplicate and Delete.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'step', label: 'The step you right-clicked', locator: (p) => p.locator('.svelte-flow__node[data-id="sha256"]') },
			{ id: 'edit-note', label: 'Edit note (Annotate this step on a step without one)', locator: (p) => p.getByRole('menuitem', { name: /Edit note|Annotate this step/ }) }
		],
		prepare: async (s) => {
			await canvas(s, 'hash-text');
			const page = s.page;
			await page.getByRole('button', { name: /^Zoom in$/i }).click({ timeout: T });
			await page.waitForTimeout(400);
			await (page.locator('.svelte-flow__node[data-id="sha256"]') as unknown as { click(o: { button: 'right'; timeout: number }): Promise<void> }).click({ button: 'right', timeout: T });
			await page.getByRole('menuitem', { name: /Edit note|Annotate this step/ }).waitFor({ timeout: T });
			await page.waitForTimeout(1200);
		}
	},
	{
		name: 'node-annotate',
		page: 'app/workflows/narration',
		route: '#/app/workflows/<id> (Explain this step)',
		alt: 'The Explain this step dialog for the SHA-256 step: a Markdown editor holding its note (Computes the SHA-256 hash (hex) of your text and keeps the original.), a How to write good notes link, and the Draft with AI, Cancel and Save note buttons.',
		spots: [
			{ id: 'note-editor', label: 'The note, in Markdown', locator: inDialog((d) => d.locator('textarea').first()) },
			{ id: 'draft-ai', label: 'Draft with AI', locator: inDialog((d) => d.getByRole('button', { name: /Draft with AI/ })) },
			{ id: 'save-note', label: 'Save note', locator: inDialog((d) => d.getByRole('button', { name: 'Save note' })) }
		],
		prepare: async (s) => {
			// Continues from node-context-menu when it ran just before; otherwise opens the menu itself.
			const page = s.page;
			const item = page.getByRole('menuitem', { name: /Edit note|Annotate this step/ });
			if (!(await item.count())) {
				await canvas(s, 'hash-text');
				await (page.locator('.svelte-flow__node[data-id="sha256"]') as unknown as { click(o: { button: 'right'; timeout: number }): Promise<void> }).click({ button: 'right', timeout: T });
			}
			await item.click({ timeout: T });
			await page.getByRole('dialog').getByText('Explain this step').first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'flow-story',
		page: 'app/workflows/narration',
		route: '#/app/workflows/<id> (Story)',
		alt: 'The Hash Text workflow in the editor with the Story tab of the panel on the right open: How this flow works, In plain words, no code required, then the five steps numbered in run order, each with its note.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'how-flow-works', label: 'How this flow works', locator: (p) => p.getByRole('button', { name: /How this flow works|Close flow story/ }) },
			{ id: 'story', label: 'Story tab', locator: (p) => p.getByRole('tab', { name: /Story/ }).first() },
			{ id: 'story-step', label: 'Each step, numbered, with its note', locator: (p) => p.getByText('Computes the SHA-256 hash (hex) of your text and keeps the original.').last() }
		],
		prepare: async (s) => {
			await fresh(s);
			await s.editor('hash-text');
			const page = s.page;
			const open = page.getByRole('button', { name: 'Open workflow panel' });
			if (await open.count()) await open.first().click({ timeout: T });
			const story = page.getByRole('button', { name: 'How this flow works' });
			if (await story.count()) await story.first().click({ timeout: T });
			await page.getByRole('tab', { name: /Story/ }).first().waitFor({ timeout: T });
			await page.getByRole('button', { name: /^(Fit View|Fit the workflow on screen)$/ }).first().click({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'canvas-menu',
		page: 'app/workflows/export-import',
		route: '#/app/workflows/<id> (⋮ menu)',
		alt: 'The JSON Prettify & Repair workflow in the editor with the ⋮ menu at the top right open: Improve with Aria, Run, Deactivate, Duplicate, Edit, Manage tags, Export, Import as new workflow and Import as new workflow from URL.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'menu', label: 'The workflow menu (⋮)', locator: (p) => p.getByRole('button', { name: 'Open menu' }).first() },
			{ id: 'export', label: 'Export', locator: (p) => p.getByRole('menuitem', { name: 'Export' }) },
			{ id: 'import-file', label: 'Import as new workflow (from a file)', locator: (p) => p.getByRole('menuitem', { name: 'Import as new workflow', exact: true }) },
			{ id: 'import-url', label: 'Import as new workflow from URL', locator: (p) => p.getByRole('menuitem', { name: 'Import as new workflow from URL' }) }
		],
		prepare: async (s) => {
			await fresh(s);
			await canvas(s, 'json-prettify');
			const page = s.page;
			await page.getByRole('button', { name: 'Open menu' }).first().click({ timeout: T });
			await page.getByRole('menuitem', { name: 'Import as new workflow from URL' }).waitFor({ timeout: T });
			await page.waitForTimeout(1500);
		}
	},
];
