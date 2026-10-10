/** Shots for the get-started docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { join } from 'node:path';
import { type ShotDef, NO_MINIMAP } from './define.ts';
import { T, type Session } from '../lib/session.ts';
import type { Page } from '../lib/util.ts';

const EXAMPLES = join(import.meta.dir, '..', '..', '..', 'public', 'examples');
/** Per-session state of the lesson shots (one browser session per theme). */
const state = new WeakMap<Session, { examples: Map<string, string>; blank?: string }>();
const stateOf = (s: Session) => {
	let st = state.get(s);
	if (!st) state.set(s, (st = { examples: new Map() }));
	return st;
};

/** Closes node panels and the node picker left open by a previous shot. */
async function closePanels(page: Page) {
	for (let i = 0; i < 3 && (await page.getByRole('dialog').filter({ visible: true }).count()); i++) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);
	}
	const picker = page.getByText('Choose a node', { exact: true }).filter({ visible: true });
	for (let i = 0; i < 2 && (await picker.count()); i++) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);
	}
}

/**
 * Imports a docs example (public/examples/<name>.awf) with the Add Workflow wizard, once per session, accepts
 * "Make it mine" (the examples are tagged like marketplace installs) and opens its editor.
 */
async function example(s: Session, name: string): Promise<string> {
	const st = stateOf(s);
	const page = s.page;
	let route = st.examples.get(name);
	if (!route) {
		await closePanels(page);
		await s.go('#/app/workflows');
		await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
		const dialog = page.getByRole('dialog');
		await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
		await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		const chooser = page.waitForEvent('filechooser', { timeout: T });
		await dialog.getByText('Choose a .awf file').click({ timeout: T });
		await (await chooser).setFiles(join(EXAMPLES, `${name}.awf`));
		await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		await dialog.getByRole('button', { name: 'Create & open' }).click({ timeout: T });
		await page.waitForURL(/#\/app\/workflows\/[^/?]+/, { timeout: T });
		route = new URL(page.url()).hash;
		await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
		const mine = page.getByRole('button', { name: 'Make it mine' }).filter({ visible: true });
		await mine.first().waitFor({ timeout: 5000 }).catch(() => {});
		if (await mine.count()) {
			await mine.first().click({ timeout: T });
			const confirm = page.getByRole('dialog');
			await confirm.getByRole('checkbox').first().click({ timeout: T });
			await confirm.getByRole('button', { name: 'Make it mine', exact: true }).last().click({ timeout: T });
			await confirm.waitFor({ state: 'hidden', timeout: T });
		}
		st.examples.set(name, route);
	}
	await closePanels(page);
	if (new URL(page.url()).hash !== route) await s.go(route);
	await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
	return route;
}

/** A new Blank canvas › Triggered workflow named "My first workflow", created once per session. */
async function blankWorkflow(s: Session): Promise<string> {
	const st = stateOf(s);
	const page = s.page;
	await closePanels(page);
	if (!st.blank) {
		await s.go('#/app/workflows');
		await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
		const d = page.getByRole('dialog');
		await d.getByRole('button', { name: /Blank canvas/ }).click({ timeout: T });
		await d.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		await d.getByRole('button', { name: /Triggered/ }).first().click({ timeout: T });
		await d.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		await d.getByRole('textbox', { name: 'Name' }).fill('My first workflow');
		await d.getByRole('button', { name: 'Create & open' }).click({ timeout: T });
		await page.waitForURL(/#\/app\/workflows\/[^/?]+/, { timeout: T });
		st.blank = new URL(page.url()).hash;
	}
	if (new URL(page.url()).hash !== st.blank) await s.go(st.blank);
	await page.getByRole('button', { name: 'Add Trigger' }).first().waitFor({ timeout: T });
	return st.blank;
}

/** Hides the editor's "Ready to run" side card and fits the graph in view. */
async function tidyCanvas(page: Page) {
	const collapse = page.getByRole('button', { name: 'Collapse panel' }).filter({ visible: true });
	if (await collapse.count()) {
		await collapse.first().click({ timeout: T });
		await collapse.first().waitFor({ state: 'hidden', timeout: T });
	}
	await page.getByRole('button', { name: 'Fit View' }).first().click({ timeout: T });
	await page.waitForTimeout(500);
}

/** Opens the node picker from the canvas toolbar's Add a step button and searches for `query`. */
async function searchNode(page: Page, query: string) {
	await page.getByRole('button', { name: 'Add a step' }).click({ timeout: T });
	await page.waitForTimeout(400);
	// The picker reopens on the last category it showed: go back to the search over every node.
	const back = page.getByRole('button', { name: 'Back', exact: true }).filter({ visible: true });
	if (await back.count()) await back.first().click({ timeout: T });
	await page.getByRole('textbox', { name: 'Type to search a node...' }).filter({ visible: true }).first().fill(query);
	await page.waitForTimeout(800);
}

/** Adds a node from the picker (once per workflow), then opens its settings. */
async function openAddedNode(page: Page, query: string, result: RegExp, label: RegExp) {
	await closePanels(page);
	const node = page.locator('.svelte-flow__node').filter({ hasText: label });
	if (!(await node.count())) {
		await searchNode(page, query);
		await page.getByRole('button', { name: result }).first().click({ timeout: T });
		await page.waitForTimeout(1000);
		await closePanels(page);
	}
	await page.getByRole('button', { name: 'Fit View' }).first().click({ timeout: T });
	await page.waitForTimeout(500);
	await node.first().dblclick({ timeout: T });
	await page.getByRole('dialog').filter({ visible: true }).first().waitFor({ timeout: T });
	await page.waitForTimeout(800);
}

const searchBox = (p: Page) => p.getByRole('textbox', { name: 'Type to search a node...' }).filter({ visible: true }).last();
const inPanel = (p: Page) => p.getByRole('dialog').filter({ visible: true }).last();

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
	},
	{
		name: 'gs-side-panel-home',
		page: 'get-started/install',
		route: '#/app (400 px wide)',
		viewport: { width: 400, height: 860 },
		alt: 'The AWFlow app at side-panel width (400 px) on its Home page, in a new local workspace: a compact header with the sidebar button and search, a Your first workflow card with Run “Start here”, Describe it and Blank workflow, and Popular templates below.',
		spots: [{ id: 'sidebar-button', label: 'The AWFlow app in the side panel: the sidebar button opens Workflows, Assistant and the rest', locator: (p) => p.getByRole('button', { name: 'Toggle sidebar' }) }],
		prepare: async (s) => {
			await closePanels(s.page);
			await s.go('#/app');
			await s.page.getByRole('button', { name: 'Toggle sidebar' }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(1200);
		}
	},
	{
		name: 'gs-trigger-search',
		page: 'get-started/first-workflow',
		route: '#/app/workflows/<id> (Add Trigger)',
		alt: 'A new, empty workflow named My first workflow. Add Trigger opened the Trigger panel on the right; “when” is typed in its search box and the only result is When Started, “Run the flow on clicking the start button”.',
		spots: [
			{ id: 'search', label: 'Search box of the Trigger panel', locator: searchBox },
			{ id: 'when-started', label: 'When Started', locator: (p) => p.getByRole('button', { name: /^When Started/ }) }
		],
		prepare: async (s) => {
			await blankWorkflow(s);
			const page = s.page;
			await page.getByRole('button', { name: 'Add Trigger' }).first().click({ timeout: T });
			await searchBox(page).fill('when');
			await page.getByRole('button', { name: /^When Started/ }).filter({ visible: true }).first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'gs-first-workflow',
		page: 'get-started/first-workflow',
		route: '#/app/workflows/<id>',
		alt: 'The lesson’s workflow, My first workflow, on the canvas: a sticky note, then When Started, Get Selected Text and Edit Fields joined by lines. The header has the active switch and Save; Test Workflow is above the canvas on the right.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'get-selected-text', label: 'Get Selected Text, after When Started', locator: (p) => p.locator('.svelte-flow__node[data-id="get-selection"]') },
			{ id: 'edit-fields', label: 'Edit Fields, after Get Selected Text', locator: (p) => p.locator('.svelte-flow__node[data-id="report"]') },
			{ id: 'test-workflow', label: 'Test Workflow', locator: (p) => p.getByRole('button', { name: 'Test Workflow', exact: true }) },
			{ id: 'save', label: 'Save', locator: (p) => p.getByRole('banner').getByRole('button', { name: 'Save', exact: true }) }
		],
		prepare: async (s) => {
			await example(s, 'first-workflow');
			await tidyCanvas(s.page);
		}
	},
	{
		name: 'gs-get-selected-text',
		page: 'get-started/first-workflow',
		route: '#/app/workflows/<id> (Get Selected Text settings)',
		alt: 'The settings panel of Get Selected Text: Output field name is set to text. On the left, the Input and Output tabs; When Started is listed under Direct inputs with Run this step to see its data.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'output-field-name', label: 'Output field name, set to text', locator: (p) => inPanel(p).getByText(/^Output field name/).first() },
			{ id: 'output-tab', label: 'Output tab: what the step produced on the last run', locator: (p) => inPanel(p).getByRole('button', { name: 'Output', exact: true }).or(inPanel(p).getByRole('tab', { name: 'Output', exact: true })) }
		],
		prepare: async (s) => {
			await example(s, 'first-workflow');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="get-selection"]').dblclick({ timeout: T });
			await inPanel(page).getByText(/^Output field name/).first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'gs-edit-fields',
		page: 'get-started/first-workflow',
		route: '#/app/workflows/<id> (Edit Fields settings)',
		alt: 'The settings panel of Edit Fields: under Fields, a field named processed_text of type String whose value is “Text: {{ $input.text }}” and “Length: {{ $input.text.length }} characters”, with Drag input fields here or Add field below.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'processed-text', label: 'The processed_text field and its value', locator: (p) => inPanel(p).locator('.cm-editor').first() },
			{ id: 'add-field', label: 'Add field', locator: (p) => inPanel(p).getByText('Add field', { exact: true }) }
		],
		prepare: async (s) => {
			await example(s, 'first-workflow');
			const page = s.page;
			await page.locator('.svelte-flow__node[data-id="report"]').dblclick({ timeout: T });
			await inPanel(page).locator('.cm-editor').first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	},
	{
		name: 'gs-hotkey-search',
		page: 'get-started/first-automation',
		route: '#/app/workflows/<id> (Add a step)',
		alt: 'The Summarise this page in 3 bullets workflow with the node picker open from Add a step (the + at the left of the canvas toolbar): “Hotkey” is typed in the search box and the result is the Hotkey trigger, “Run the flow from a keyboard shortcut”.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'add-step', label: 'Add a step', locator: (p) => p.getByRole('button', { name: 'Add a step' }) },
			{ id: 'search', label: 'Search box of the node picker', locator: searchBox },
			{ id: 'hotkey', label: 'Hotkey', locator: (p) => p.getByRole('button', { name: /^Hotkey Run the flow/ }) }
		],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
			await closePanels(s.page);
			await tidyCanvas(s.page);
			await searchNode(s.page, 'Hotkey');
		}
	},
	{
		name: 'gs-hotkey-slot',
		page: 'get-started/first-automation',
		route: '#/app/workflows/<id> (Hotkey settings)',
		alt: 'The settings panel of a Hotkey trigger just added to the workflow (its label is still the generated hotkeyTrigger name): an Instruction card about assigning the key combination at chrome://extensions/shortcuts, and Hotkey Slot set to run-workflow-1.',
		css: NO_MINIMAP,
		spots: [{ id: 'hotkey-slot', label: 'Hotkey Slot, set to the first slot', locator: (p) => inPanel(p).getByText('run-workflow-1') }],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
			await openAddedNode(s.page, 'Hotkey', /^Hotkey Run the flow/, /hotkeyTrigger-\d/);
			await inPanel(s.page).getByText('run-workflow-1').waitFor({ timeout: T });
		}
	},
	{
		name: 'gs-activate',
		page: 'get-started/first-automation',
		route: '#/app/workflows/<id>',
		alt: 'The Summarise this page in 3 bullets workflow with its Hotkey trigger added: Hotkey sits under When Started and both lines lead into Get All Text, then Basic LLM Chain (with Web LLM under it) and Display Markdown. The header shows the Workflow active switch reading active, Saved and the Save button.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'save', label: 'Save', locator: (p) => p.getByRole('banner').getByRole('button', { name: 'Save', exact: true }) },
			{ id: 'active-switch', label: 'The active switch next to the workflow’s name', locator: (p) => p.getByRole('switch', { name: 'Workflow active' }) }
		],
		prepare: async (s) => {
			await s.editor('summarize-page-hotkey');
			await closePanels(s.page);
			await tidyCanvas(s.page);
		}
	},
	{
		name: 'gs-schedule-search',
		page: 'get-started/first-automation',
		route: '#/app/workflows/<id> (Add a step)',
		alt: 'The node picker opened from Add a step on the Summarise this page in 3 bullets workflow: “Schedule” is typed in the search box; the Schedule trigger, “Run the flow at a specific time”, is the first result, above calendar actions of Google Calendar and Microsoft 365.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'add-step', label: 'Add a step', locator: (p) => p.getByRole('button', { name: 'Add a step' }) },
			{ id: 'schedule', label: 'Schedule', locator: (p) => p.getByRole('button', { name: /^Schedule Run the flow/ }) }
		],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
			await closePanels(s.page);
			await tidyCanvas(s.page);
			await searchNode(s.page, 'Schedule');
		}
	},
	{
		name: 'gs-schedule-rule',
		page: 'get-started/first-automation',
		route: '#/app/workflows/<id> (Schedule settings)',
		alt: 'The settings panel of a Schedule trigger just added to the workflow: under Rules, one rule added with Add, with the Trigger Interval, Days Between Triggers, Trigger at Hour and Trigger at Minute fields still empty.',
		css: NO_MINIMAP,
		spots: [
			{ id: 'trigger-interval', label: 'Trigger Interval', locator: (p) => inPanel(p).getByText('Trigger Interval', { exact: true }) },
			{ id: 'add-rule', label: 'Add a rule', locator: (p) => inPanel(p).getByRole('button', { name: 'Add', exact: true }) }
		],
		prepare: async (s) => {
			await s.editor('summarize-page-llm-chain');
			await openAddedNode(s.page, 'Schedule', /^Schedule Run the flow/, /schedule-\d/);
			const panel = inPanel(s.page);
			if (!(await panel.getByText('Trigger Interval', { exact: true }).count())) await panel.getByRole('button', { name: 'Add', exact: true }).click({ timeout: T });
			await panel.getByText('Trigger Interval', { exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'gs-meet-aria',
		page: 'get-started/build-with-aria',
		route: '#/app/assistant (first visit)',
		alt: 'The Assistant’s first-visit card, Meet Aria, your private AI: Private, on this device (greyed out here, because the capture browser has no WebGPU), Chrome built-in AI with Set up, Connect a cloud provider with Add key, and Start chatting.',
		spots: [
			{ id: 'on-device', label: 'Private, on this device', locator: (p) => p.getByText('Private, on this device', { exact: true }) },
			{ id: 'cloud-provider', label: 'Connect a cloud provider, with Add key', locator: (p) => p.getByText('Connect a cloud provider', { exact: true }) },
			{ id: 'start-chatting', label: 'Start chatting', locator: (p) => p.getByRole('button', { name: /Start chatting/ }) }
		],
		prepare: async (s) => {
			const page = s.page;
			await closePanels(page);
			await s.go('#/app');
			await page.getByRole('button', { name: 'Toggle sidebar' }).first().waitFor({ timeout: T });
			// The card shows once per browser; the capture seeds it as seen, so un-see it for this shot.
			const p = page as unknown as { evaluate(fn: () => void): Promise<void> };
			await p.evaluate(() => localStorage.removeItem('assistant.firstRunSeen'));
			await p.evaluate(() => {
				location.hash = '#/app/assistant';
			});
			await page.getByText('Meet Aria, your private AI').first().waitFor({ timeout: T });
			await page.waitForTimeout(1000);
		}
	},
	{
		name: 'gs-if-search',
		page: 'get-started/branch-on-page-content',
		route: '#/app/workflows/<id> (Add a step)',
		alt: 'The node picker opened from Add a step, shown on the workflow from lesson 2 (When Started, Get Selected Text, Edit Fields): “IF” is typed in the search box and IF, “Route items to different branches based on conditions”, is listed under Action.',
		css: NO_MINIMAP,
		spots: [{ id: 'if', label: 'IF', locator: (p) => p.getByRole('button', { name: /^IF Route items/ }) }],
		prepare: async (s) => {
			await example(s, 'first-workflow');
			await tidyCanvas(s.page);
			await searchNode(s.page, 'IF');
			await s.page.getByRole('button', { name: /^IF Route items/ }).filter({ visible: true }).first().waitFor({ timeout: T });
		}
	}
];
