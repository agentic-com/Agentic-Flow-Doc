import { join } from 'node:path';
import { buildAwmem, CHAT_TITLE } from './lib/awmem.ts';
import type { Locator, Page, Theme } from './lib/util.ts';

export const T = 15_000;
const FIXTURES = join(import.meta.dir, 'fixtures');

/** One browser session per theme; shots share its state (imported workflows, runs, memory). */
export class Session {
	private workflows = new Map<string, string>();
	private madeMine = new Set<string>();
	private runs = 0;
	private memory = false;
	private kb = false;
	constructor(
		readonly page: Page,
		readonly base: string,
		readonly theme: Theme
	) {}

	async go(route: string) {
		await this.page.goto(this.base + route);
	}

	/** Opens the Assistant; when no model is ready yet, the "Meet Aria" card is passed with its own Start chatting button. */
	async assistant() {
		await this.go('#/app/assistant');
		const page = this.page;
		const start = page.getByRole('button', { name: /Start chatting/ }).filter({ visible: true });
		const composer = page.getByRole('button', { name: 'Build' }).filter({ visible: true });
		for (let i = 0; i < 30; i++) {
			if (await composer.count()) return;
			if (await start.count()) {
				await start.first().click({ timeout: T });
				await composer.first().waitFor({ timeout: T });
				return;
			}
			await page.waitForTimeout(500);
		}
		throw new Error('neither the chat composer nor the Meet Aria card appeared');
	}

	/** Imports a fixture .awf through the app's Add Workflow wizard (once) and returns its editor route. */
	async workflow(name: string): Promise<string> {
		const known = this.workflows.get(name);
		if (known) return known;
		const page = this.page;
		await this.go('#/app/workflows');
		await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
		const dialog = page.getByRole('dialog');
		await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
		await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		const chooser = page.waitForEvent('filechooser', { timeout: T });
		await dialog.getByText('Choose a .awf file').click({ timeout: T });
		await (await chooser).setFiles(join(FIXTURES, `${name}.awf`));
		await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
		await dialog.getByRole('button', { name: 'Create & open' }).click({ timeout: T });
		await page.waitForURL(/#\/app\/workflows\/[^/?]+/, { timeout: T });
		const route = new URL(page.url()).hash;
		const id = route.split('/').pop() ?? '';
		await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
		// The list badges an imported workflow "Needs setup" until the canvas has assessed it.
		await page
			.waitForFunction((wid) => !!JSON.parse(localStorage.getItem('workflow_setup_status') ?? '{}')[wid], id, { timeout: T })
			.catch(() => {
				throw new Error(`the canvas never recorded ${name}'s readiness`);
			});
		this.workflows.set(name, route);
		return route;
	}

	/** Opens a workflow's editor and, once, accepts "Make it mine" so it runs without the marketplace guard. */
	async editor(name: string): Promise<string> {
		const route = await this.workflow(name);
		const page = this.page;
		// A node panel left open by the previous shot: close it.
		for (let i = 0; i < 3 && (await page.getByRole('dialog').filter({ visible: true }).count()); i++) {
			await page.keyboard.press('Escape');
			await page.waitForTimeout(300);
		}
		if (new URL(page.url()).hash !== route) await this.go(route);
		await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
		if (!this.madeMine.has(name)) {
			await page.getByRole('button', { name: 'Make it mine' }).first().click({ timeout: T });
			const dialog = page.getByRole('dialog');
			await dialog.getByRole('checkbox').first().click({ timeout: T });
			await dialog.getByRole('button', { name: 'Make it mine', exact: true }).last().click({ timeout: T });
			await dialog.waitFor({ state: 'hidden', timeout: T });
			this.madeMine.add(name);
		}
		return route;
	}

	/** Runs hash-text from the canvas so node panels show real input data. */
	async testRun(name: string) {
		await this.editor(name);
		const page = this.page;
		await page.getByRole('button', { name: 'Test Workflow' }).first().click({ timeout: T });
		await page.getByText('It worked').first().waitFor({ timeout: T });
	}

	/** Saved runs: the list's "Run" action records an execution (canvas test runs are not kept). */
	async savedRuns(name: string, count: number) {
		await this.editor(name);
		const page = this.page;
		while (this.runs < count) {
			await this.go('#/app/workflows');
			const row = page.getByRole('row').filter({ hasText: 'Hash Text' }).first();
			await row.getByRole('button', { name: 'Open menu' }).click({ timeout: T });
			await page.getByRole('menuitem', { name: 'Run' }).first().click({ timeout: T });
			await page.waitForTimeout(2500);
			this.runs++;
		}
	}

	/** Imports the generated .awmem through Memory > Import (3 Aria chats + 3 facts). */
	async importMemory() {
		if (this.memory) return;
		const page = this.page;
		await this.go('#/app/memory');
		await page.getByRole('button', { name: 'Import' }).first().click({ timeout: T });
		const dialog = page.getByRole('dialog');
		await dialog
			.locator('[data-testid="awmem-import-file"]')
			.setInputFiles({ name: 'docs-capture.awmem', mimeType: 'application/json', buffer: Buffer.from(buildAwmem()) });
		await dialog.locator('[data-testid="awmem-import-preview"]').waitFor({ timeout: T });
		await dialog.getByRole('button', { name: 'Import', exact: true }).click({ timeout: T });
		await dialog.waitFor({ state: 'hidden', timeout: T });
		this.memory = true;
	}

	async knowledgeBase() {
		if (this.kb) return;
		const page = this.page;
		await this.go('#/app/knowledges');
		await page.getByRole('button', { name: 'New knowledge base' }).first().click({ timeout: T });
		const dialog = page.getByRole('dialog');
		await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Product handbook');
		await dialog.getByRole('textbox', { name: /What's in it/ }).fill('Pricing, plans, refund and onboarding docs');
		// The dialog closes while the click settles, so don't wait on the click itself.
		await dialog.getByRole('button', { name: 'Create', exact: true }).click({ timeout: 3000 }).catch(() => {});
		await page.waitForURL(/#\/app\/knowledges\/[^/?]+/, { timeout: T });
		this.kb = true;
	}
}

export type ShotDef = {
	name: string;
	/** Docs page (slug under src/content/docs) the image is meant for; null when no page exists yet. */
	page: string | null;
	/** Route shown, with placeholders for generated ids. */
	route: string;
	alt: string;
	note?: string;
	viewport?: { width: number; height: number };
	/** Set when the shot depends on the network: a failure is then recorded as skipped. */
	needsNetwork?: boolean;
	/** Extra capture-only CSS (never product changes): hides headless-only artefacts. */
	css?: string;
	hotspots: { label: string; locate: (p: Page) => Locator }[];
	prepare: (s: Session) => Promise<void>;
};

const btn = (name: string | RegExp, exact = false) => (p: Page) => p.getByRole('button', { name, exact });
const link = (name: string | RegExp) => (p: Page) => p.getByRole('link', { name });
const text = (t: string | RegExp) => (p: Page) => p.getByText(t);
const NO_MINIMAP = '.svelte-flow__minimap { display: none !important; }';

export const SHOTS: ShotDef[] = [
	{
		name: 'side-panel',
		page: 'usage/using-the-app/side-panel',
		route: '#/app/assistant',
		viewport: { width: 400, height: 860 },
		alt: "The AWFlow app at side-panel width (400 px) on the Assistant page: a compact header with the sidebar button and search, a row with chat history, the Aria agent switcher, new chat and chat settings, the greeting, the message box with Chat and Build modes, context meter and model picker, and suggestion cards stacked in one column.",
		hotspots: [
			{ label: 'Sidebar button: opens the full navigation', locate: btn('Toggle sidebar') },
			{ label: 'Message box: ask Aria anything', locate: (p) => p.getByRole('textbox').first() },
			{ label: 'Chat or Build mode', locate: btn('Build') },
			{ label: 'Model picker', locate: btn('Gemini Nano') }
		],
		prepare: async (s) => {
			await s.assistant();
		}
	},
	{
		name: 'aria-chat',
		page: 'usage/using-the-app/chat-and-agents/chat',
		route: '#/app/assistant',
		alt: 'The Assistant page with a saved chat open: the user asks what a webhook is and whether AWFlow can start a workflow from one, and Aria answers in two short replies. The left rail lists recent chats.',
		note: 'The chat is a real conversation imported with Memory > Import from a generated .awmem file (scripts/capture/lib/awmem.ts); no model runs during capture.',
		hotspots: [
			{ label: 'Recent chats', locate: btn(CHAT_TITLE, true) },
			{ label: 'Switch agent', locate: btn('Switch agent') },
			{ label: 'Reply box, with Chat and Build modes', locate: (p) => p.getByRole('textbox', { name: /Reply to Aria/ }) },
			{ label: 'Context meter and model picker', locate: btn(/Context window/) }
		],
		prepare: async (s) => {
			await s.importMemory();
			await s.assistant();
			await s.page.getByText(CHAT_TITLE).filter({ visible: true }).first().click({ timeout: T });
			await s.page.getByText('Can AWFlow start a workflow from one?').filter({ visible: true }).first().waitFor({ timeout: T });
		}
	},
	{
		name: 'workflows-list',
		page: 'usage/using-the-app/workflows/manage-list',
		route: '#/app/workflows',
		alt: 'The Workflows page, My Workflows tab: four workflows (JSON Prettify & Repair, Hash Text, Color Converter, JWT Decoder) with their tags, active status, Local storage badge, Not published state and dates, above the Status, Storage, Published, Needs setup and Tags filters.',
		hotspots: [
			{ label: 'Add Workflow: create, import or describe one', locate: btn('Add Workflow') },
			{ label: 'Filters', locate: (p) => p.getByRole('textbox', { name: 'Filter...' }) },
			{ label: 'Row menu: open, run, duplicate, export, delete', locate: (p) => p.getByRole('row').nth(1).getByRole('button', { name: 'Open menu' }) }
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
		page: 'usage/using-the-app/workflows/create',
		route: '#/app/workflows/<id>',
		alt: 'The workflow editor with the Hash Text example: a sticky note explaining it, then five connected steps (Run now, Your text, SHA-256, SHA-512, Show the hashes). The toolbar with Editor, Logs and Executions tabs is at the top, the Test Workflow button at the top right, and zoom controls at the bottom left.',
		css: NO_MINIMAP,
		hotspots: [
			{ label: 'Add a step (node)', locate: (p) => p.locator('#canvas-add-step') },
			{ label: 'Editor, Logs and Executions tabs', locate: (p) => p.getByRole('tablist').first() },
			{ label: 'Test Workflow: run it now', locate: btn('Test Workflow') },
			{ label: 'A step (node); drag from its handle to connect', locate: (p) => p.locator('.svelte-flow__node[data-id="sha256"]') }
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
			{ label: 'Input and Output of this step', locate: (p) => p.getByRole('dialog').getByText('Input', { exact: true }).first() },
			{ label: 'Parameters, Settings and Tutorials tabs', locate: (p) => p.getByRole('dialog').getByText('Parameters', { exact: true }).first() },
			{ label: 'A mapped field, with a preview from the last run', locate: (p) => p.getByRole('dialog').getByText(/Preview from last run/).first() },
			{ label: 'Test step', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Test step' }) }
		],
		prepare: async (s) => {
			await s.testRun('hash-text');
			await s.page.locator('.svelte-flow__node[data-id="sha512"]').dblclick({ timeout: T });
			await s.page.getByRole('dialog').getByText('SHA-512').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'data-mapping',
		page: 'usage/key-concepts/data/data-mapping/data-mapping-ui',
		route: '#/app/workflows/<id>',
		alt: "Mapping data in the SHA-512 step: the Input panel on the left is expanded to show the fields of $input and of the earlier SHA-256 step, ready to drag into a field; the Text field on the right already holds the expression $input.text, with the value from the last run previewed under it.",
		hotspots: [
			{ label: 'Fields from the previous step: drag one into a field', locate: btn('$input fields', true) },
			{ label: 'An earlier step and its fields', locate: btn('SHA-256', true) },
			{ label: 'The expression the drag creates', locate: (p) => p.getByRole('dialog').getByText('$input.text').first() },
			{ label: 'Fixed value or Expression', locate: (p) => p.getByRole('dialog').getByText('Expression', { exact: true }).first() }
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
	{
		name: 'run-history',
		page: 'usage/using-the-app/workflows/run-history',
		route: '#/app/workflows/<id> (Executions tab)',
		alt: "The Executions tab of the Hash Text workflow: a table of saved runs, each with a Success status, when it started, its duration, where it ran (Local) and its metadata, with a filter bar above.",
		hotspots: [
			{ label: 'Executions tab', locate: (p) => p.getByRole('tab', { name: 'Executions' }) },
			{ label: 'Filter runs', locate: btn('Filter') },
			{ label: 'A saved run and its status', locate: (p) => p.getByText('Success').first() }
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
		name: 'credentials-new',
		page: 'usage/using-the-app/credentials/create',
		route: '#/app/credentials',
		alt: 'The New Credential dialog over the Credentials page: an Integration App / Service picker, Name and Description fields, an Auth Type menu set to Basic Auth with Username and Password fields, a note that the secret is saved locally and encrypted in this browser, and the Create Credential button.',
		hotspots: [
			{ label: 'Pick the app or service', locate: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ label: 'Name it so you can find it in nodes', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
			{ label: 'Auth type decides which fields you fill', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Auth Type' }) },
			{ label: 'Where the secret is stored', locate: (p) => p.getByRole('dialog').getByText('Saved locally in this browser') }
		],
		prepare: async (s) => {
			await s.go('#/app/credentials');
			await s.page.getByRole('button', { name: 'Add Credential' }).first().click({ timeout: T });
			await s.page.getByRole('dialog').getByText('New Credential').first().waitFor({ timeout: T });
		}
	},
	{
		name: 'knowledge-bases',
		page: 'usage/using-the-app/knowledge-bases/overview',
		route: '#/app/knowledges/<id>',
		alt: "A new knowledge base called Product handbook: its source, chunk and size counters, the on-device MiniLM search engine and Cloud OK badges, the Sources, Test search, Used by and Settings tabs, and side cards for Used by, Privacy and Search engine. It has no sources yet.",
		hotspots: [
			{ label: 'Add sources: files, web pages or text', locate: btn('Add sources') },
			{ label: 'Test search', locate: (p) => p.getByRole('tab', { name: 'Test search' }) },
			{ label: 'Privacy: Cloud OK or Device only', locate: text('PRIVACY') },
			{ label: 'Search engine, on this device', locate: text('SEARCH ENGINE') }
		],
		prepare: async (s) => {
			await s.knowledgeBase();
			await s.page.getByRole('heading', { name: 'Product handbook' }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'local-models',
		page: 'usage/using-the-app/local-models',
		route: '#/app/local-models',
		needsNetwork: true,
		alt: 'The Local AI page: storage used by on-device models split by engine (WebLLM, TF.js, Transformers), a task list on the left (Chat, Embeddings, vision and audio tasks) and model cards on the right, such as Llama 3.2 1B Instruct with its size, variants and install state.',
		hotspots: [
			{ label: 'Space used on this device, by engine', locate: text(/of \d+(\.\d+)? GB/) },
			{ label: 'Browse by task', locate: text('BROWSE BY TASK') },
			{ label: 'A model, its size and install state', locate: (p) => p.getByText('Llama 3.2 1B Instruct').first() },
			{ label: 'Add a custom model', locate: btn('Add custom model') }
		],
		prepare: async (s) => {
			await s.go('#/app/local-models');
			await s.page.getByText('Llama 3.2 1B Instruct').first().waitFor({ timeout: T });
			// The Hugging Face section only appears once the network list has loaded.
			await s.page
				.getByText('Hugging Face', { exact: true })
				.first()
				.waitFor({ timeout: 20_000 })
				.catch(() => {
					throw new Error('the Hugging Face model list did not load within 20s (offline?)');
				});
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'memory',
		page: 'usage/using-the-app/memory/overview',
		route: '#/app/memory',
		alt: "The Memory page: total space on this device split into Chats, Workflow and Facts, Import and Export all buttons, and the Conversations tab listing three Aria chats (What a webhook is, Draft a reply to Sam, Regex for order numbers) with their last message, message count and when they were updated.",
		note: 'Conversations and facts are imported from a generated .awmem file through Memory > Import.',
		hotspots: [
			{ label: 'Space used, by kind', locate: text(/\d+(\.\d+)? ?[KMG]?B on this device/) },
			{ label: 'Conversations, Facts and Storage tabs', locate: link(/^Conversations/) },
			{ label: 'A saved conversation', locate: text(CHAT_TITLE) },
			{ label: 'Import or export memory', locate: btn('Export all') }
		],
		prepare: async (s) => {
			await s.importMemory();
			await s.go('#/app/memory');
			await s.page.getByText(CHAT_TITLE).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'settings-general',
		page: 'usage/using-the-app/settings/general',
		route: '#/app/settings/general',
		alt: "Settings, General section, in a local workspace: the settings menu (Preferences, Assistant Notch, Providers, Local models, Storage, Security, Privacy, Site access) and a card explaining that the workspace is saved on this device, with a Sign in button to create an account.",
		note: 'Local (anonymous) workspace. The signed-in view (avatar, username, password, newsletter) needs an account and is not captured.',
		hotspots: [
			{ label: 'Settings sections', locate: (p) => p.getByRole('main').getByText('Preferences', { exact: true }).first() },
			{ label: 'Sign in to manage your profile', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Sign in' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/general');
			await s.page.getByRole('main').getByRole('button', { name: 'Sign in' }).waitFor({ timeout: T });
		}
	},
	{
		name: 'marketplace-browse',
		page: null,
		route: '#/app/marketplace',
		needsNetwork: true,
		alt: "The Marketplace's Workflows page for a guest: a banner saying installing is free with an account, category chips (For you, Communication & Notifications, Data Integration and more), a search box, a large Featured card for one workflow with a Get button, and the first row of popular community workflows with their tags, safety label and Install buttons.",
		note: 'Live listings from api.awflow.io at capture time. No browse page exists in the docs yet.',
		hotspots: [
			{ label: 'Browse by category', locate: btn(/For you/) },
			{ label: 'Search workflows, publishers and tags', locate: btn('Search workflows') },
			{ label: 'Featured workflow: Get it', locate: btn('Get', true) },
			{ label: 'Popular community workflows', locate: text('What the community installs') }
		],
		prepare: async (s) => {
			await s.go('#/app/marketplace');
			const failed = s.page.getByText("Couldn't load your marketplace");
			await s.page.waitForTimeout(4000);
			if (await failed.count()) throw new Error('the marketplace API did not answer (offline?)');
			await s.page.waitForLoadState('networkidle').catch(() => {});
		}
	}
];
