/** Shots for the recipes docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { join } from 'node:path';
import { type Locate, type ShotDef, type SpotDef, NO_MINIMAP } from './define.ts';
import { T, type Session } from '../lib/session.ts';

/**
 * Each recipe is captured from its own public/examples/<awf>.awf, imported through the Add Workflow wizard:
 *   recipe-<key>-import   the wizard's last step (Name & save)
 *   recipe-<key>-consent  "Make this workflow yours?", the consent shown before you edit an installed workflow
 *   recipe-<key>-canvas   the workflow on the canvas (one spot per step, by node id)
 *   recipe-<key>-<node>   a step's settings panel, with a spot on each field the recipe asks you to change
 */
const EXAMPLES = join(import.meta.dir, '..', '..', '..', 'public', 'examples');
/** Toasts ("Workflow created", "It's yours now") are transient: keep them out of the frame. */
const NO_TOASTS = '[data-sonner-toaster] { display: none !important; }';

type Field = { id: string; label: string; field: string };
type Panel = { node: string; alt: string; fields: Field[] };
type Recipe = {
	key: string;
	awf: string;
	name: string;
	page: string;
	nodes: { id: string; label: string }[];
	panels: Panel[];
};

const f = (id: string, field: string, label = `The ${field} field`): Field => ({ id, field, label });

const RECIPES: Recipe[] = [
	{
		key: 'summarize',
		awf: 'summarize-this-page',
		name: 'Summarize This Page',
		page: 'recipes/research-and-reading/summarize-this-page',
		nodes: [
			{ id: 'trigger-run', label: 'Run now (When Started)' },
			{ id: 'get-text', label: 'Read the current page' },
			{ id: 'summarize', label: 'Summarize it' },
			{ id: 'local-model', label: 'Local AI model' },
			{ id: 'show-summary', label: 'Show the summary' }
		],
		panels: [
			{ node: 'get-text', alt: 'The settings of the Read the current page step (Get All Text): Output field name text, an empty DOM Selector with its picker, and Visible text only switched on.', fields: [f('dom-selector', 'DOM Selector')] },
			{ node: 'summarize', alt: 'The settings of the Summarize it step (Summarization): the Text field, then Options with Max words and Style set to “a few bullet points”.', fields: [f('max-words', 'Max words'), f('style', 'Style')] },
			{ node: 'local-model', alt: 'The settings of the Local AI model step (Web LLM): the Model menu still reads “Choose a model…”, with Options under it.', fields: [f('model', 'Model', 'The Model menu')] },
			{ node: 'show-summary', alt: 'The settings of the Show the summary step (Display Markdown): the Title field and the Content field.', fields: [f('title', 'Title')] }
		]
	},
	{
		key: 'eli5',
		awf: 'explain-eli5',
		name: "Explain Like I'm 5",
		page: 'recipes/research-and-reading/explain-like-im-five',
		nodes: [
			{ id: 'trigger-context-menu', label: 'Right-click a selection (Context Menu)' },
			{ id: 'get-selection', label: 'Get selected text' },
			{ id: 'explain', label: 'Explain simply' },
			{ id: 'local-model', label: 'Local AI model' },
			{ id: 'show-explanation', label: 'Show the explanation' }
		],
		panels: [
			{ node: 'trigger-context-menu', alt: 'The settings of the Right-click a selection trigger (Context Menu): Menu Contexts set to Selection, and empty Document URL Patterns and Target URL Patterns lists with Add buttons.', fields: [f('menu-contexts', 'Menu Contexts'), f('document-url-patterns', 'Document URL Patterns')] },
			{ node: 'explain', alt: 'The settings of the Explain simply step (Basic LLM Chain): the Prompt field, as an expression, and Options.', fields: [f('prompt', 'Prompt')] },
			{ node: 'local-model', alt: 'The settings of the Local AI model step (Web LLM): the Model menu still reads “Choose a model…”, with Options under it.', fields: [f('model', 'Model', 'The Model menu')] }
		]
	},
	{
		key: 'rewrite',
		awf: 'rewrite-professional',
		name: 'Rewrite Professionally',
		page: 'recipes/write-with-ai/rewrite-professionally',
		nodes: [
			{ id: 'trigger-context-menu', label: 'Right-click a selection (Context Menu)' },
			{ id: 'get-selection', label: 'Get selected text' },
			{ id: 'rewrite', label: 'Rewrite professionally' },
			{ id: 'local-model', label: 'Local AI model' },
			{ id: 'copy-result', label: 'Copy the rewrite' }
		],
		panels: [
			{ node: 'trigger-context-menu', alt: 'The settings of the Right-click a selection trigger (Context Menu): Menu Contexts set to Selection, and empty Document URL Patterns and Target URL Patterns lists with Add buttons.', fields: [f('menu-contexts', 'Menu Contexts')] },
			{ node: 'rewrite', alt: 'The settings of the Rewrite professionally step (Basic LLM Chain): the Prompt field, as an expression, and Options with its Add additional options menu.', fields: [f('prompt', 'Prompt'), f('options', 'Options', 'Options, where System message is added')] },
			{ node: 'local-model', alt: 'The settings of the Local AI model step (Web LLM): the Model menu still reads “Choose a model…”, with Options under it.', fields: [f('model', 'Model', 'The Model menu')] }
		]
	},
	{
		key: 'todoist',
		awf: 'selection-to-todoist',
		name: 'Selection to Todoist Task',
		page: 'recipes/capture-to-my-apps/selection-to-todoist',
		nodes: [
			{ id: 'trigger-context-menu', label: 'Right-click a selection (Context Menu)' },
			{ id: 'get-selection', label: 'Get selected text' },
			{ id: 'extract', label: 'Draft a task title' },
			{ id: 'local-model', label: 'Local AI model' },
			{ id: 'create-task', label: 'Create the Todoist task' }
		],
		panels: [
			{ node: 'trigger-context-menu', alt: 'The settings of the Right-click a selection trigger (Context Menu): Menu Contexts set to Selection, and empty Document URL Patterns and Target URL Patterns lists with Add buttons.', fields: [f('document-url-patterns', 'Document URL Patterns')] },
			{ node: 'extract', alt: 'The settings of the Draft a task title step: the Text field, What to extract, and Options.', fields: [f('what-to-extract', 'What to extract')] },
			{ node: 'local-model', alt: 'The settings of the Local AI model step (Web LLM): the Model menu still reads “Choose a model…”, with Options under it.', fields: [f('model', 'Model', 'The Model menu')] },
			{ node: 'create-task', alt: 'The settings of the Create the Todoist task step: an empty Credential menu, then Resource Task, Operation Create, Content, Description, Source URL, Project ID, Due (natural language), Priority and Labels.', fields: [f('credential', 'Credential', 'The Credential menu (a Todoist connection)'), f('project-id', 'Project ID'), f('due', 'Due (natural language)')] }
		]
	},
	{
		key: 'markdown',
		awf: 'article-to-markdown',
		name: 'Capture Article as Markdown',
		page: 'recipes/capture-to-my-apps/article-to-markdown',
		nodes: [
			{ id: 'trigger-when-started', label: 'When Started' },
			{ id: 'get-html', label: 'Read the page HTML' },
			{ id: 'to-markdown', label: 'Convert to Markdown' },
			{ id: 'copy-clipboard', label: 'Copy to clipboard' }
		],
		panels: [
			{ node: 'get-html', alt: 'The settings of the Read the page HTML step: Output field name, an empty DOM Selector with its picker, and Options.', fields: [f('dom-selector', 'DOM Selector')] },
			{ node: 'to-markdown', alt: 'The settings of the Convert to Markdown step: Operation HTML to Markdown, Content, Source Field html, Keep Links on, Keep Images and Keep Tables off.', fields: [f('keep-images', 'Keep Images', 'The Keep Images switch'), f('keep-tables', 'Keep Tables', 'The Keep Tables switch')] }
		]
	},
	{
		key: 'airtable',
		awf: 'save-page-to-airtable',
		name: 'Save Page to Airtable Reading List',
		page: 'recipes/capture-to-my-apps/save-page-to-airtable',
		nodes: [
			{ id: 'trigger-context-menu', label: 'Right-click a page (Context Menu)' },
			{ id: 'get-metadata', label: 'Read the page details' },
			{ id: 'save-airtable', label: 'Add a record to Airtable' }
		],
		panels: [
			{ node: 'trigger-context-menu', alt: 'The settings of the Right-click a page trigger (Context Menu): Menu Contexts set to Page, and empty Document URL Patterns and Target URL Patterns lists with Add buttons.', fields: [f('menu-contexts', 'Menu Contexts')] },
			{ node: 'save-airtable', alt: 'The settings of the Add a record to Airtable step: an empty Credential menu, then Resource Record, Operation create, Base and Table (which cannot load items without a credential) and Fields.', fields: [f('credential', 'Credential', 'The Credential menu (an Airtable connection)'), f('base', 'Base'), f('table', 'Table'), f('fields', 'Fields')] }
		]
	},
	{
		key: 'csv',
		awf: 'table-to-csv',
		name: 'Page Table to CSV',
		page: 'recipes/extract-data/table-to-csv',
		nodes: [
			{ id: 'trigger-when-started', label: 'When Started' },
			{ id: 'read-table', label: 'Read the table' },
			{ id: 'build-csv', label: 'Build CSV' },
			{ id: 'copy-clipboard', label: 'Copy to clipboard' }
		],
		panels: [
			{ node: 'read-table', alt: 'The settings of the Read the table step: DOM Selector with its picker, and Options with Mode and Table first row is header.', fields: [f('dom-selector', 'DOM Selector')] },
			{ node: 'build-csv', alt: 'The settings of the Build CSV step: Operation Build from items, CSV Text, Source Field, Delimiter “,”, and the header, trim and quote switches.', fields: [f('delimiter', 'Delimiter', 'The Delimiter menu')] }
		]
	},
	{
		key: 'scrape',
		awf: 'web-scrape-to-json',
		name: 'Web Scrape to JSON',
		page: 'recipes/extract-data/scrape-a-list',
		nodes: [
			{ id: 'trigger-run', label: 'Run now (When Started)' },
			{ id: 'fetch-html', label: 'Fetch the page' },
			{ id: 'extract', label: 'Pull out the items' },
			{ id: 'show-result', label: 'Show the data' }
		],
		panels: [
			{ node: 'fetch-html', alt: 'The settings of the Fetch the page step: the URL field, Output field name, Timeout and Options.', fields: [f('url', 'URL')] },
			{ node: 'extract', alt: 'The settings of the Pull out the items step: HTML, Mode Repeating list, Selector, Return, Attribute, Container Selector .titleline, and Fields with a title field read from the a element.', fields: [f('container-selector', 'Container Selector'), f('fields', 'Fields', 'The Fields list')] }
		]
	},
	{
		key: 'jobs',
		awf: 'job-postings-watch',
		name: 'New Job Postings Watch',
		page: 'recipes/monitor-pages/new-jobs-alert',
		nodes: [
			{ id: 'trigger-element-change', label: 'Watch the job list (Element Change)' },
			{ id: 'send-push', label: 'Send a push notification' }
		],
		panels: [
			{ node: 'trigger-element-change', alt: 'The settings of the Watch the job list trigger (Element Change): an empty CSS Selectors list with Add, Fire when Content changes, Match text, Debounce (ms) and URL Patterns.', fields: [f('css-selectors', 'CSS Selectors', 'The CSS Selectors list'), f('fire-when', 'Fire when', 'The Fire when menu'), f('url-patterns', 'URL Patterns', 'The URL Patterns list')] },
			{ node: 'send-push', alt: 'The settings of the Send a push notification step: an empty Credential menu, then Provider, Topic, Message, Title, Priority, Tags, Click URL and Server.', fields: [f('credential', 'Credential', 'The Credential menu'), f('topic', 'Topic'), f('message', 'Message')] }
		]
	},
	{
		key: 'price',
		awf: 'price-on-page-watch',
		name: 'Price On Page Watch',
		page: 'recipes/monitor-pages/price-drop-alert',
		nodes: [
			{ id: 'trigger-change', label: 'When the price changes (Element Change)' },
			{ id: 'extract-price', label: 'Read the price' },
			{ id: 'get-last-price', label: 'Read last price' },
			{ id: 'is-drop', label: 'Did the price drop?' },
			{ id: 'notify', label: 'Show the drop alert' },
			{ id: 'save-price', label: 'Remember this price' }
		],
		panels: [
			{ node: 'trigger-change', alt: 'The settings of the When the price changes trigger (Element Change): an empty CSS Selectors list with Add, Fire when, Match text, Debounce (ms) and URL Patterns.', fields: [f('css-selectors', 'CSS Selectors', 'The CSS Selectors list'), f('url-patterns', 'URL Patterns', 'The URL Patterns list')] },
			{ node: 'extract-price', alt: 'The settings of the Read the price step: Pattern, Maximum Matches and Put Result In Field.', fields: [f('pattern', 'Pattern')] },
			{ node: 'is-drop', alt: 'The settings of the Did the price drop? step (If): one condition comparing two expressions, with Add Condition.', fields: [f('conditions', 'Conditions', 'The condition')] }
		]
	},
	{
		key: 'fill-form',
		awf: 'fill-form-from-json',
		name: 'Fill Form from JSON',
		page: 'recipes/fill-forms-and-click/fill-form-from-saved-values',
		nodes: [
			{ id: 'trigger-run', label: 'Run now (When Started)' },
			{ id: 'values', label: 'Your form values' },
			{ id: 'approve', label: 'Confirm before filling' },
			{ id: 'fill', label: 'Fill the form' },
			{ id: 'submit', label: 'Submit the form' }
		],
		panels: [
			{ node: 'values', alt: 'The settings of the Your form values step: one field, formValues, of type Object.', fields: [f('fields', 'Fields', 'The formValues field')] },
			{ node: 'approve', alt: 'The settings of the Confirm before filling step: the Prompt reads “Fill and submit this form?”.', fields: [f('prompt', 'Prompt')] },
			{ node: 'fill', alt: 'The settings of the Fill the form step: Mode Manual, Form set to form, and Values, a list of Field ID and Value pairs.', fields: [f('values', 'Values', 'The Values list (Field ID and Value)')] }
		]
	}
];

/** Per browser session: where each recipe's import stands. */
type State = { route?: string; mine?: boolean };
const states = new WeakMap<Session, Map<string, State>>();
const stateOf = (s: Session, awf: string): State => {
	let m = states.get(s);
	if (!m) states.set(s, (m = new Map()));
	let st = m.get(awf);
	if (!st) m.set(awf, (st = {}));
	return st;
};

async function closeDialogs(s: Session) {
	for (let i = 0; i < 3 && (await s.page.getByRole('dialog').filter({ visible: true }).count()); i++) {
		await s.page.keyboard.press('Escape');
		await s.page.waitForTimeout(300);
	}
}

/** Add Workflow › Import › the recipe's .awf, up to the Name & save step. */
async function toNameAndSave(s: Session, awf: string) {
	const page = s.page;
	await closeDialogs(s);
	await s.go('#/app/workflows');
	await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
	await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
	const chooser = page.waitForEvent('filechooser', { timeout: T });
	await dialog.getByText('Choose a .awf file').click({ timeout: T });
	await (await chooser).setFiles(join(EXAMPLES, `${awf}.awf`));
	await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
	await dialog.getByRole('button', { name: 'Create & open' }).waitFor({ timeout: T });
}

/** The recipe on the canvas: imported once (finishing the wizard if a previous shot left it open). */
async function created(s: Session, awf: string) {
	const page = s.page;
	const st = stateOf(s, awf);
	if (!st.route) {
		const finish = page.getByRole('dialog').getByRole('button', { name: 'Create & open' });
		if (!(await finish.count())) await toNameAndSave(s, awf);
		await finish.click({ timeout: T });
		await page.waitForURL(/#\/app\/workflows\/[^/?]+/, { timeout: T });
		st.route = new URL(page.url()).hash;
	}
	await closeDialogs(s);
	if (new URL(page.url()).hash !== st.route) await s.go(st.route);
	await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
	await page.waitForTimeout(1000);
	return st;
}

/** Opens "Make this workflow yours?" (the consent shown for a workflow installed from a file or the marketplace). */
async function openConsent(s: Session, awf: string) {
	const page = s.page;
	await created(s, awf);
	await page.getByRole('button', { name: 'Make it mine' }).first().click({ timeout: T });
	await page.getByRole('dialog').getByText("I'm responsible").first().waitFor({ timeout: T });
}

/** The recipe on the canvas, made yours, side panel collapsed and fitted. */
async function canvas(s: Session, awf: string) {
	const page = s.page;
	const st = await created(s, awf);
	if (!st.mine) {
		await openConsent(s, awf);
		const dialog = page.getByRole('dialog');
		await dialog.getByRole('checkbox').first().click({ timeout: T });
		await dialog.getByRole('button', { name: 'Make it mine', exact: true }).last().click({ timeout: T });
		await dialog.waitFor({ state: 'hidden', timeout: T });
		st.mine = true;
	}
	const collapse = page.getByRole('button', { name: 'Collapse panel' });
	if (await collapse.count()) {
		await collapse.first().click({ timeout: T });
		await collapse.first().waitFor({ state: 'hidden', timeout: T });
	}
	await page.getByRole('button', { name: /^(Fit View|Fit the workflow on screen)$/ }).first().click({ timeout: T });
	await page.waitForTimeout(600);
}

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A field of the open node panel, by its label: the field group (label, control, Fixed/Expression). */
const field = (label: string): Locate => (p) =>
	p
		.getByRole('dialog')
		.filter({ visible: true })
		.last()
		.locator('[data-field-path]')
		.filter({ has: p.getByRole('button', { name: `Options for ${label}`, exact: true }) })
		.last();
const node = (id: string): Locate => (p) => p.locator(`.svelte-flow__node[data-id="${id}"]`);

function recipeShots(r: Recipe): ShotDef[] {
	const steps = r.nodes.map((n) => n.label.replace(/ \(.*\)$/, '')).join(', ');
	const out: ShotDef[] = [
		{
			name: `recipe-${r.key}-import`,
			page: r.page,
			route: '#/app/workflows (Add Workflow › Import)',
			alt: `The Create a workflow dialog at step 3, Name & save, after importing ${r.awf}.awf: Source Imported .awf, Name “${r.name}”, an optional Description, Where to save “Saved locally in this browser”, and the Back and Create & open buttons.`,
			css: NO_TOASTS,
			spots: [
				{ id: 'name', label: 'Name', locator: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
				{ id: 'create-open', label: 'Create & open', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Create & open' }) }
			],
			prepare: async (s) => {
				await toNameAndSave(s, r.awf);
				await s.page.waitForTimeout(600);
			}
		},
		{
			name: `recipe-${r.key}-consent`,
			page: r.page,
			route: '#/app/workflows/<id> (Make it mine)',
			alt: `The Make this workflow yours? dialog over the ${r.name} workflow: it came from the Marketplace, It can currently lists what the workflow may access, two notes on what changes, the “I'm responsible for what this workflow does from now on.” checkbox, and Cancel and Make it mine.`,
			css: NO_TOASTS,
			spots: [
				{ id: 'access', label: 'What it can access', locator: (p) => p.getByRole('dialog').getByText('It can currently') },
				{ id: 'responsible', label: "I'm responsible checkbox", locator: (p) => p.getByRole('dialog').getByRole('checkbox').first() },
				{ id: 'make-it-mine', label: 'Make it mine', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Make it mine', exact: true }).last() }
			],
			prepare: async (s) => {
				await openConsent(s, r.awf);
				await s.page.waitForTimeout(600);
			}
		},
		{
			name: `recipe-${r.key}-canvas`,
			page: r.page,
			route: '#/app/workflows/<id>',
			alt: `The workflow editor with the ${r.name} recipe: sticky notes and the steps ${steps}, linked left to right. The top bar shows the On/Off switch and Save; Run is above the canvas.`,
			css: NO_MINIMAP + NO_TOASTS,
			spots: [
				...r.nodes.map((n): SpotDef => ({ id: n.id, label: n.label, locator: node(n.id) })),
				{ id: 'test-workflow', label: 'Run', locator: (p) => p.getByRole('button', { name: /^Run( workflow)?$/ }) },
				{ id: 'active', label: 'The On/Off switch, or Runs when you press Run', locator: (p) => p.getByRole('switch', { name: /^Workflow (on|off)$/ }).or(p.locator('span', { hasText: /^Runs when you press Run$/ }).filter({ visible: true })).first() },
				{ id: 'save', label: 'Save', locator: (p) => p.getByRole('button', { name: 'Save', exact: true }) }
			],
			prepare: async (s) => canvas(s, r.awf)
		}
	];
	for (const panel of r.panels) {
		out.push({
			name: `recipe-${r.key}-${panel.node}`,
			page: r.page,
			route: `#/app/workflows/<id> (${r.nodes.find((n) => n.id === panel.node)?.label} settings)`,
			alt: panel.alt,
			css: NO_MINIMAP + NO_TOASTS,
			spots: panel.fields.map((x) => ({ id: x.id, label: x.label, locator: field(x.field) })),
			prepare: async (s) => {
				await canvas(s, r.awf);
				const page = s.page;
				await page.locator(`.svelte-flow__node[data-id="${panel.node}"]`).dblclick({ timeout: T });
				await page.getByRole('dialog').getByRole('tab', { name: 'Setup' }).waitFor({ timeout: T });
				await page.waitForTimeout(800);
				// Fields past the required ones sit under More options (N): open it.
				const more = page.getByRole('dialog').filter({ visible: true }).last().getByRole('button', { name: /^More options/ });
				if ((await more.count()) && (await more.first().getAttribute('aria-expanded')) !== 'true') await more.first().click({ timeout: T });
				await page.waitForTimeout(400);
				// Bring the fields into view; the first one wins when they don't all fit.
				for (const x of [...panel.fields].reverse()) await field(x.field)(page).scrollIntoViewIfNeeded({ timeout: T });
				await page.waitForTimeout(400);
			}
		});
	}
	return out;
}

export const shots: ShotDef[] = RECIPES.flatMap(recipeShots);
