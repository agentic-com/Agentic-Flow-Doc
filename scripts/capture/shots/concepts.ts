/** Shots for the concepts docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn } from './define.ts';
import { T } from '../lib/session.ts';
import type { Page } from '../lib/util.ts';

const panel = (p: Page) => p.getByRole('dialog').filter({ visible: true }).last();

export const shots: ShotDef[] = [
	{
		name: 'data-mapping',
		page: 'concepts/data/data-mapping/data-mapping-ui',
		route: '#/app/workflows/<id>',
		alt: "Mapping data in the SHA-512 step: the Input panel on the left is expanded to show the fields of $input and of the earlier SHA-256 step, ready to drag into a field; the Text field on the right already holds the expression $input.text, with the value from the last run previewed under it.",
		hotspots: [
			{ id: 'fields-from-previous-step', label: 'Fields from the previous step: drag one into a field', locate: btn('$input fields', true) },
			{ id: 'earlier-step-its-fields', label: 'An earlier step and its fields', locate: btn('SHA-256', true) },
			{ id: 'expression-drag-creates', label: 'The expression the drag creates', locate: (p) => p.getByRole('dialog').getByText('$input.text').first() },
			{ id: 'fixed-value-expression', label: 'Fixed value or Expression', locate: (p) => p.getByRole('dialog').getByText('Expression', { exact: true }).first() }
		],
		spots: [
			{ id: 'input-tab', label: 'Input tab', locator: (p) => panel(p).getByRole('button', { name: 'Input', exact: true }).or(panel(p).getByRole('tab', { name: 'Input', exact: true })) },
			{ id: 'preview-last-run', label: 'Preview from last run', locator: (p) => panel(p).getByText(/Preview from last run/).first() }
		],
		prepare: async (s) => {
			await s.testRun('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			// The panel reopens on the tab used last: mapping happens on Parameters.
			await panel(page).getByRole('tab', { name: 'Parameters' }).first().click({ timeout: T });
			await page.getByRole('button', { name: '$input fields', exact: true }).filter({ visible: true }).first().click({ timeout: T });
			await page.getByRole('button', { name: 'SHA-256', exact: true }).filter({ visible: true }).first().click({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'node-settings-retry',
		page: 'concepts/flow/error-handling',
		route: '#/app/workflows/<id> (SHA-512 settings, Settings tab)',
		alt: 'The Settings tab of the SHA-512 step in the Hash Text example: Always Output Data and Continue On Fail are off; under Retry, Allow Retry is on and shows Max. Tries and Wait Between Tries (ms) (empty, so the defaults apply), Backoff set to fixed and Retry condition set to always.',
		spots: [
			{ id: 'settings-tab', label: 'Settings tab', locator: (p) => panel(p).getByRole('tab', { name: 'Settings' }) },
			{ id: 'allow-retry', label: 'Allow Retry', locator: (p) => panel(p).getByText('Allow Retry', { exact: true }) },
			{ id: 'max-tries', label: 'Max. Tries', locator: (p) => panel(p).getByText('Max. Tries', { exact: true }) },
			{ id: 'wait-between-tries', label: 'Wait Between Tries (ms)', locator: (p) => panel(p).getByText('Wait Between Tries (ms)', { exact: true }) },
			{ id: 'backoff', label: 'Backoff', locator: (p) => panel(p).getByText('Backoff', { exact: true }) },
			{ id: 'retry-condition', label: 'Retry condition', locator: (p) => panel(p).getByText('Retry condition', { exact: true }) },
			{ id: 'continue-on-fail', label: 'Continue On Fail', locator: (p) => panel(p).getByText('Continue On Fail', { exact: true }) },
			{ id: 'always-output-data', label: 'Always Output Data', locator: (p) => panel(p).getByText('Always Output Data', { exact: true }) }
		],
		prepare: async (s) => {
			await s.editor('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			await panel(page).getByRole('tab', { name: 'Settings' }).first().click({ timeout: T });
			await panel(page).getByText('Allow Retry', { exact: true }).waitFor({ timeout: T });
			// Switches in order: Always Output Data, Continue On Fail, Allow Retry.
			const retry = panel(page).getByRole('switch').nth(2);
			if ((await retry.getAttribute('aria-checked')) !== 'true') await retry.click({ timeout: T });
			await panel(page).getByText('Retry condition', { exact: true }).waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	}
];
