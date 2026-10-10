/** Shots for the concepts docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'data-mapping',
		page: 'usage/key-concepts/data/data-mapping/data-mapping-ui',
		route: '#/app/workflows/<id>',
		alt: "Mapping data in the SHA-512 step: the Input panel on the left is expanded to show the fields of $input and of the earlier SHA-256 step, ready to drag into a field; the Text field on the right already holds the expression $input.text, with the value from the last run previewed under it.",
		hotspots: [
			{ id: 'fields-from-previous-step', label: 'Fields from the previous step: drag one into a field', locate: btn('$input fields', true) },
			{ id: 'earlier-step-its-fields', label: 'An earlier step and its fields', locate: btn('SHA-256', true) },
			{ id: 'expression-drag-creates', label: 'The expression the drag creates', locate: (p) => p.getByRole('dialog').getByText('$input.text').first() },
			{ id: 'fixed-value-expression', label: 'Fixed value or Expression', locate: (p) => p.getByRole('dialog').getByText('Expression', { exact: true }).first() }
		],
		prepare: async (s) => {
			await s.testRun('hash-text');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			await page.getByRole('button', { name: '$input fields', exact: true }).filter({ visible: true }).first().click({ timeout: T });
			await page.getByRole('button', { name: 'SHA-256', exact: true }).filter({ visible: true }).first().click({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
];
