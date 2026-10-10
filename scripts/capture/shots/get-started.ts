/** Shots for the get-started docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, NO_MINIMAP } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'aria-build',
		page: 'get-started/build-with-aria',
		route: '#/app/assistant',
		alt: 'The Assistant page with the composer switched to Build: the message box holds “When I press a keyboard shortcut, take the text I selected on the page, translate it into French with an on-device model, and show the translation.”, with the Chat | Build switch, the context meter and the model picker under it, and suggestion cards below. The left rail lists recent chats.',
		hotspots: [
			{ id: 'describe-workflow', label: 'Describe the workflow', locate: (p) => p.getByRole('textbox').filter({ visible: true }).first() },
			{ id: 'chat-build-switch', label: 'Chat | Build switch, set to Build', locate: (p) => p.getByRole('button', { name: 'Build' }).filter({ visible: true }).first() },
			{ id: 'model-picker', label: 'Model picker', locate: (p) => p.getByRole('button', { name: /Gemini Nano/ }).filter({ visible: true }).first() }
		],
		prepare: async (s) => {
			await s.importMemory();
			await s.assistant();
			const page = s.page;
			await page.getByRole('button', { name: 'Build' }).filter({ visible: true }).first().click({ timeout: T });
			await page
				.getByRole('textbox')
				.filter({ visible: true })
				.first()
				.fill('When I press a keyboard shortcut, take the text I selected on the page, translate it into French with an on-device model, and show the translation.');
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'create-workflow',
		page: 'get-started/first-workflow',
		route: '#/app/workflows (Add Workflow)',
		alt: 'The Create a workflow dialog, step 1 of 3 (Source, Choose, Details): Start from a template (recommended) at the top, then Blank canvas, which is selected, From the marketplace and Import, with Cancel and Continue buttons.',
		hotspots: [
			{ id: 'steps', label: 'Steps: Source, Choose, Details', locate: (p) => p.getByRole('dialog').getByText('1 · Source').first() },
			{ id: 'blank-canvas', label: 'Blank canvas', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Blank canvas/ }) },
			{ id: 'continue', label: 'Continue', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Continue' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/workflows');
			const page = s.page;
			await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
			await page.getByRole('dialog').getByRole('button', { name: /Blank canvas/ }).click({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'llm-chain',
		page: 'get-started/summarize-with-ai',
		route: '#/app/workflows/<id>',
		alt: 'The workflow editor with the Summarise this page in 3 bullets example: a sticky note, then When Started, Get All Text, Basic LLM Chain and Display Markdown in a row. A Web LLM model node hangs under the chain’s Model slot. The chain has a warning badge and the Ready to run? button counts one setting still to fill.',
		css: NO_MINIMAP,
		hotspots: [
			{ id: 'basic-llm-chain', label: 'Basic LLM Chain', locate: (p) => p.locator('.svelte-flow__node[data-id="summarize"]') },
			{ id: 'model-slot', label: 'Model slot, with a model node under it', locate: (p) => p.locator('.svelte-flow__node[data-id="model"]') },
			{ id: 'display-markdown', label: 'Display Markdown shows the result', locate: (p) => p.locator('.svelte-flow__node[data-id="show"]') }
		],
		spots: [
			{ id: 'get-all-text', label: 'Get All Text, after When Started', locator: (p) => p.locator('.svelte-flow__node[data-id="get-text"]') },
			{ id: 'run', label: 'Test Workflow', locator: (p) => p.getByRole('button', { name: 'Test Workflow', exact: true }) }
		],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
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
		name: 'llm-chain-prompt',
		page: 'get-started/summarize-with-ai',
		route: '#/app/workflows/<id> (Basic LLM Chain settings)',
		alt: 'The settings panel of the Basic LLM Chain step in the Summarise this page example, with the Prompt field asking for 3 short bullets and ending with {{ $input.text }}.',
		css: NO_MINIMAP,
		spots: [{ id: 'prompt', label: 'The Prompt field', locator: (p) => p.getByRole('dialog').locator('.cm-editor').first() }],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="summarize"]').dblclick({ timeout: T });
			await page.getByRole('dialog').getByText('Prompt', { exact: true }).first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	}
];
