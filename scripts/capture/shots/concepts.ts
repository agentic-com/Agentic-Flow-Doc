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
		alt: "Mapping data in the SHA-512 step after a run: on the left the Input pane shows the item from SHA-256 as a table (text and sha256), then Earlier steps and Variables with New variable…; in the middle the Text field is in Expression mode and holds the pill SHA-256 › text, with the preview → The quick brown fox jumps over the lazy dog (item 1 of 1) under it; on the right the step's Output.",
		spots: [
			{ id: 'input-data', label: 'The data this step receives, from the previous step', locator: (p) => panel(p).getByText(/^Input\s*·/i).first() },
			{ id: 'earlier-steps', label: 'Earlier steps', locator: (p) => panel(p).getByText(/^Earlier steps$/i).first() },
			{ id: 'variables', label: 'Your variables', locator: (p) => panel(p).getByText(/^Variables$/i).first() },
			{ id: 'mode-switch', label: 'Fixed or Expression', locator: (p) => panel(p).getByText('Expression', { exact: true }).first() },
			{ id: 'mapped-field', label: 'A mapped field, shown as a pill', locator: (p) => panel(p).getByText(/SHA-256\s*›\s*text/).first() },
			{ id: 'preview', label: 'The value it gets, at this item', locator: (p) => panel(p).getByText(/\(item 1 of 1\)/).first() }
		],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.testRun('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').filter({ visible: true }).first().dblclick({ timeout: T });
			await panel(page).getByRole('tab', { name: 'Setup' }).first().click({ timeout: T });
			await panel(page).getByText(/\(item 1 of 1\)/).first().waitFor({ timeout: T });
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
			{ id: 'empty-item', label: "Pass an empty item when there's no result", locator: (p) => panel(p).getByText(/Pass an empty item when there/) },
			{ id: 'time-limit', label: 'Time limit', locator: (p) => panel(p).getByText('Time limit', { exact: true }).first() }
		],
		prepare: async (s) => {
			await s.editor('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').filter({ visible: true }).first().dblclick({ timeout: T });
			await panel(page).getByRole('tab', { name: /Advanced/ }).first().click({ timeout: T });
			await panel(page).getByText('Try again automatically', { exact: true }).waitFor({ timeout: T });
			const retry = panel(page).getByRole('checkbox').first();
			if ((await retry.getAttribute('aria-checked')) !== 'true') await retry.click({ timeout: T });
			await panel(page).getByText('Which errors', { exact: true }).waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	}
];
