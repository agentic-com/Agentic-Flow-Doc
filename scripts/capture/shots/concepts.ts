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
		route: '#/app/workflows/<id> (SHA-512 settings, Advanced tab)',
		alt: "The Advanced tab of the SHA-512 step in the Hash Text example: On error with Stop the run selected (Continue with an empty result and Send to an error output below it), Try again automatically ticked with Retries, Wait (seconds), Wait pattern and Which errors, and Pass an empty item when there's no result.",
		spots: [
			{ id: 'advanced-tab', label: 'Advanced tab', locator: (p) => panel(p).getByRole('tab', { name: /Advanced/ }) },
			{ id: 'on-error', label: 'On error', locator: (p) => panel(p).getByText('On error', { exact: true }) },
			{ id: 'try-again', label: 'Try again automatically', locator: (p) => panel(p).getByText('Try again automatically', { exact: true }) },
			{ id: 'retries', label: 'Retries', locator: (p) => panel(p).getByText('Retries', { exact: true }) },
			{ id: 'wait', label: 'Wait (seconds)', locator: (p) => panel(p).getByText('Wait (seconds)', { exact: true }) },
			{ id: 'wait-pattern', label: 'Wait pattern', locator: (p) => panel(p).getByText('Wait pattern', { exact: true }) },
			{ id: 'which-errors', label: 'Which errors', locator: (p) => panel(p).getByText('Which errors', { exact: true }) },
			{ id: 'empty-item', label: "Pass an empty item when there's no result", locator: (p) => panel(p).getByText(/Pass an empty item when there/) }
		],
		prepare: async (s) => {
			await s.editor('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			await panel(page).getByRole('tab', { name: /Advanced/ }).first().click({ timeout: T });
			await panel(page).getByText('Try again automatically', { exact: true }).waitFor({ timeout: T });
			const retry = panel(page).getByRole('checkbox').first();
			if ((await retry.getAttribute('aria-checked')) !== 'true') await retry.click({ timeout: T });
			await panel(page).getByText('Which errors', { exact: true }).waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	}
];
