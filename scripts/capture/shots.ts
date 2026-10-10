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
	/**
	 * Signed-in (fake API) only: opens Publish on the "Summarise this page" cloud workflow from the workflows
	 * list and walks the wizard to `step` (1 Basics, 2 Media, 5 Review & publish).
	 */
	async publishWizard(step: 1 | 2 | 5) {
		const page = this.page;
		// A fresh page load: a wizard left open by the previous shot is gone.
		await page.goto('about:blank');
		await this.go('#/app/workflows');
		const row = page.getByRole('row').filter({ hasText: 'Summarise this page' }).first();
		await row.getByRole('button', { name: 'Open menu' }).click({ timeout: T });
		await page.getByRole('menuitem', { name: 'Publish' }).first().click({ timeout: T });
		const dialog = page.getByRole('dialog');
		await dialog.getByText('Publish to the marketplace').first().waitFor({ timeout: T });
		await dialog.getByRole('textbox').first().waitFor({ timeout: T });
		await page.waitForTimeout(800);
		if (step === 1) return;
		const next = () => dialog.getByRole('button', { name: 'Next' }).click({ timeout: T });
		await next();
		// 2 Media: an emoji icon and a generated preview image.
		await dialog.getByRole('button', { name: 'Emoji', exact: true }).click({ timeout: T });
		await dialog.getByRole('button', { name: 'Choose emoji' }).click({ timeout: T });
		await page.getByRole('region', { name: 'Emoji picker' }).getByRole('combobox', { name: 'Search' }).fill('memo');
		await page.waitForTimeout(800);
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await dialog.getByRole('button', { name: 'Choose emoji' }).filter({ hasText: '📝' }).waitFor({ timeout: T });
		await dialog.getByRole('button', { name: /Generate preview/ }).click({ timeout: T });
		await dialog.getByRole('img', { name: /\.png$/ }).first().waitFor({ timeout: T });
		await page.waitForTimeout(1000);
		if (step === 2) return;
		await next();
		// 3 Details: a category and two tags.
		await dialog.getByRole('combobox').filter({ hasText: 'Select categories' }).click({ timeout: T });
		await page.getByRole('option', { name: 'Research' }).click({ timeout: T });
		const tags = dialog.getByPlaceholder('Enter tags');
		for (const tag of ['summary', 'ai']) {
			await tags.fill(tag);
			await tags.press('Enter');
		}
		await next();
		// 4 Explain the steps: lengthen the example's notes that are under 8 words.
		const notes = dialog.getByPlaceholder(/What this step does/);
		await notes.first().waitFor({ timeout: T });
		for (let i = 0; i < (await notes.count()); i++) {
			const note = notes.nth(i);
			const value = await note.inputValue();
			if (value.trim().split(/\s+/).length < 8) await note.fill(`${value.replace(/\.$/, '')}, so you can check the result yourself.`);
		}
		await next();
		// 5 Review & publish: wait for the secret check and the permissions summary.
		await dialog.getByText('Review & publish').first().waitFor({ timeout: T });
		await page.waitForTimeout(2500);
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
	/** Runs as the fictional signed-in user "Alex Doe": the app's backend is the fake API in lib/fakeApi.ts. */
	signedIn?: boolean;
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
		page: 'app/side-panel',
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
		page: 'app/chat-and-agents/chat',
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
		page: 'app/workflows/manage-list',
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
		page: 'app/workflows/create',
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
		page: 'app/workflows/run-history',
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
		page: 'app/connections/create',
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
		page: 'app/knowledge-bases/overview',
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
		page: 'app/local-models',
		route: '#/app/local-models',
		needsNetwork: true,
		alt: 'The Local AI page: storage used by on-device models split by engine (WebLLM, TF.js, Transformers), a task list on the left (Chat, Embeddings, vision and audio tasks) and model cards on the right, such as Llama 3.2 1B Instruct with its size, variants and install state.',
		hotspots: [
			{ label: 'Storage header: space used, by engine', locate: text(/of \d+(\.\d+)? GB/) },
			{ label: 'Tasks', locate: text('BROWSE BY TASK') },
			{ label: 'Search and engine filter', locate: (p) => p.getByRole('textbox', { name: 'Filter models…' }) },
			{ label: 'A model card: size, device fit and install state', locate: (p) => p.getByText('Llama 3.2 1B Instruct').first() }
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
		page: 'app/memory/overview',
		route: '#/app/memory',
		alt: "The Memory page: total space on this device split into Chats, Workflow and Facts, Import and Export all buttons, and the Conversations tab listing three Aria chats (What a webhook is, Draft a reply to Sam, Regex for order numbers) with their last message, message count and when they were updated.",
		note: 'Conversations and facts are imported from a generated .awmem file through Memory > Import.',
		hotspots: [
			{ label: 'Storage strip: space used, by kind', locate: text(/\d+(\.\d+)? ?[KMG]?B on this device/) },
			{ label: 'Import and Export all', locate: btn('Export all') },
			{ label: 'Conversations, Facts and Storage tabs', locate: link(/^Conversations/) },
			{ label: 'Search titles and messages', locate: (p) => p.getByRole('searchbox', { name: 'Search titles and messages' }) }
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
		page: 'app/settings/general',
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
	},
	{
		name: 'welcome',
		page: 'app/account/welcome',
		route: '#/app/welcome',
		alt: "The welcome page in a local workspace: a Local · no account needed badge, the headline Press Run. Watch a workflow do its thing., the Run “Start here” button (about 5 seconds), and three other ways in: Start from a template, Describe it to the AI and the 2-minute tutorial, with Skip to the app below.",
		hotspots: [
			{ label: 'Local workspace: no account needed', locate: text('Local · no account needed') },
			{ label: 'Run “Start here”', locate: btn('Run “Start here”') },
			{ label: 'Other ways in: template, describe it, tutorial', locate: btn(/Start from a template/) },
			{ label: 'Skip to the app', locate: btn('Skip to the app') }
		],
		prepare: async (s) => {
			await s.go('#/app/welcome');
			await s.page.getByRole('button', { name: 'Run “Start here”' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'sign-up',
		page: 'app/account/sign-up-and-login',
		route: '#/auth/signup',
		alt: 'The sign-up form: Welcome, Sign up to your Agentic Workflow account, with Name, Email, Password and Confirm Password fields, the Sign up button, GitHub, Google and Hugging Face buttons under Or continue with, and an Already have an account? Login link. A photo of a person at a computer fills the right half.',
		hotspots: [
			{ label: 'Name, email and password', locate: (p) => p.getByRole('textbox', { name: 'Email' }) },
			{ label: 'Sign up', locate: btn('Sign up', true) },
			{ label: 'Or continue with GitHub, Google or Hugging Face', locate: text('Or continue with') },
			{ label: 'Already have an account? Login', locate: link('Login') }
		],
		prepare: async (s) => {
			await s.go('#/auth/signup');
			await s.page.getByRole('button', { name: 'Sign up', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1500);
		}
	},
	{
		name: 'settings-index',
		page: 'app/settings',
		route: '#/app/settings',
		viewport: { width: 400, height: 860 },
		alt: 'Settings at side-panel width (400 px), in a local workspace: three groups of rows, each with a one-line status. Account: General (Local workspace · Sign in). App: Preferences, Assistant Notch (Off), Providers (None configured), Local models (0 installed), Storage. Safety & privacy: Security (Safe mode · Off (Trusted)), Privacy and Site access (No hosts granted yet).',
		hotspots: [
			{ label: 'Account', locate: (p) => p.getByRole('link', { name: /^General/ }) },
			{ label: 'App', locate: (p) => p.getByRole('link', { name: /^Preferences/ }) },
			{ label: 'Safety & privacy', locate: (p) => p.getByRole('link', { name: /^Security/ }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings');
			await s.page.getByRole('link', { name: /^Site access/ }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'agents',
		page: 'app/chat-and-agents/agents',
		route: '#/app/agents',
		alt: 'The Agents tab of Agents & teams: a Describe an agent box with a Create agent button, the card for Aria (Your assistant, On-device AI) with a Chat button, and four templates to start from: Chief of staff, Inbox triager, Price watcher and Study buddy. Import and Blank agent buttons are at the top right.',
		hotspots: [
			{ label: 'Agent cards, with Chat', locate: (p) => p.getByRole('link', { name: /^Aria/ }) },
			{ label: 'Describe an agent', locate: (p) => p.getByRole('textbox', { name: 'Describe an agent' }) },
			{ label: 'Templates', locate: (p) => p.getByRole('heading', { name: 'Start from a template' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/agents');
			await s.page.getByRole('heading', { name: 'Start from a template' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'aria-build',
		page: 'get-started/build-with-aria',
		route: '#/app/assistant',
		alt: 'The Assistant page with the composer switched to Build: the message box holds “When I press a keyboard shortcut, take the text I selected on the page, translate it into French with an on-device model, and show the translation.”, with the Chat | Build switch, the context meter and the model picker under it, and suggestion cards below. The left rail lists recent chats.',
		hotspots: [
			{ label: 'Describe the workflow', locate: (p) => p.getByRole('textbox').filter({ visible: true }).first() },
			{ label: 'Chat | Build switch, set to Build', locate: (p) => p.getByRole('button', { name: 'Build' }).filter({ visible: true }).first() },
			{ label: 'Model picker', locate: (p) => p.getByRole('button', { name: /Gemini Nano/ }).filter({ visible: true }).first() }
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
			{ label: 'Steps: Source, Choose, Details', locate: (p) => p.getByRole('dialog').getByText('1 · Source').first() },
			{ label: 'Blank canvas', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Blank canvas/ }) },
			{ label: 'Continue', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Continue' }) }
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
			{ label: 'Basic LLM Chain', locate: (p) => p.locator('.svelte-flow__node[data-id="summarize"]') },
			{ label: 'Model slot, with a model node under it', locate: (p) => p.locator('.svelte-flow__node[data-id="model"]') },
			{ label: 'Display Markdown shows the result', locate: (p) => p.locator('.svelte-flow__node[data-id="show"]') }
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
		name: 'workflows-bulk',
		page: 'app/workflows/manage-list',
		route: '#/app/workflows',
		alt: 'The Workflows page, My Workflows tab, with three of the listed workflows selected: their row checkboxes are ticked, the footer says how many rows are selected, and a toolbar at the bottom shows 3 selected with Export, Activate, Deactivate, Tags, Delete and Clear.',
		hotspots: [
			{ label: 'Select rows', locate: (p) => p.getByRole('row').nth(1).getByRole('checkbox') },
			{ label: 'Bulk-action toolbar', locate: (p) => p.getByText('selected', { exact: true }).last() }
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
	{
		name: 'credentials-oauth',
		page: 'app/connections/oauth-client',
		route: '#/app/credentials (Add Credential)',
		alt: 'The New Credential dialog with Gmail picked: Name and Description fields, then the Create your Google OAuth client guide in 5 steps (create a Google Cloud project, enable the Gmail API, set up the consent screen, create a Web application client with the redirect URI shown and a Copy button, paste the Client ID and Secret), and a Step-by-step with screenshots link. This capture is the web app, so the redirect URI is https://app.awflow.io/oauth-callback/web.',
		hotspots: [
			{ label: 'The app: Gmail', locate: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ label: 'Create your Google OAuth client guide', locate: btn(/Create your Google OAuth client/) },
			{ label: 'Redirect URI, with Copy', locate: btn('Copy redirect URI') }
		],
		prepare: async (s) => {
			await s.go('#/app/credentials');
			const page = s.page;
			await page.getByRole('button', { name: 'Add Credential' }).first().click({ timeout: T });
			const dialog = page.getByRole('dialog');
			await dialog.getByText('New Credential').first().waitFor({ timeout: T });
			await dialog.getByRole('combobox').first().click({ timeout: T });
			await page.keyboard.type('Gmail');
			await page.waitForTimeout(400);
			await page.keyboard.press('Enter');
			await page.getByRole('button', { name: 'Copy redirect URI' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'credentials-edit',
		page: 'app/connections/edit',
		route: '#/app/credentials (row menu › Open)',
		alt: 'The Edit Credential dialog for a GitHub credential named GitHub (team): the Integration App / Service set to GitHub, the Name and Description fields, the Bearer Token field (a placeholder value), and Cancel and Update Credential buttons.',
		hotspots: [
			{ label: 'Name and description', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
			{ label: 'Secret fields: here, the token', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Bearer Token' }) },
			{ label: 'Update Credential', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Update Credential' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/credentials');
			const page = s.page;
			await page.getByRole('heading', { name: /My Credentials/ }).waitFor({ timeout: T });
			await page.waitForTimeout(800);
			const row = () => page.getByRole('row').filter({ hasText: 'GitHub (team)' }).first();
			if (!(await row().count())) {
				await page.getByRole('button', { name: 'Add Credential' }).first().click({ timeout: T });
				const d = page.getByRole('dialog');
				await d.getByText('New Credential').first().waitFor({ timeout: T });
				await d.getByRole('combobox').first().click({ timeout: T });
				await page.keyboard.type('GitHub');
				await page.waitForTimeout(400);
				await page.keyboard.press('Enter');
				await d.getByRole('textbox', { name: 'Name', exact: true }).fill('GitHub (team)');
				await d.getByRole('textbox', { name: 'Description' }).fill('Fine-grained token for the team repos');
				await d.getByRole('textbox', { name: 'Bearer Token' }).fill('docs-capture-placeholder-token');
				await d.getByRole('button', { name: 'Create Credential' }).click({ timeout: T });
				await row().waitFor({ timeout: T });
			}
			await row().getByRole('button', { name: 'Open menu' }).click({ timeout: T });
			await page.getByRole('menuitem', { name: 'Open' }).click({ timeout: T });
			await page.getByRole('dialog').getByText('Edit Credential').first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-notch',
		page: 'app/settings/notch',
		route: '#/app/settings/notch',
		alt: 'Settings, Assistant Notch, with Show the assistant bubble on web pages switched on: Resting form (Orb, Pill, Edge tab, Orb + badge), Accent colours, Size S, M or L, the Blocks list (On this page, Pinned workflows, Quick actions, Page tools, and Recent marked Soon) with move and on/off controls, Where it shows (All sites; Allowlist only marked Soon), and Discard and Save buttons.',
		hotspots: [
			{ label: 'Show the bubble on web pages', locate: (p) => p.getByRole('switch', { name: /Show the assistant bubble/ }) },
			{ label: 'Resting form, accent and size', locate: (p) => p.getByRole('main').getByText('Resting form', { exact: false }).first() },
			{ label: 'Blocks: order and on/off', locate: (p) => p.getByRole('main').getByText('Pinned workflows', { exact: true }).first() },
			{ label: 'Save or Discard', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Save' }).last() }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/notch');
			const page = s.page;
			const sw = page.getByRole('switch', { name: /Show the assistant bubble/ });
			await sw.waitFor({ timeout: T });
			if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click({ timeout: T });
			await page.getByRole('main').getByText('Pinned workflows', { exact: true }).first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-access',
		page: 'app/settings/access',
		route: '#/app/settings/access',
		alt: 'Settings, Site access, in a new local workspace: the Site & app access page explains that access is granted when a workflow first needs a host or an app, notes that enforcement is off for your own workflows (Trusted mode) with a link to Security, and says no site or app access has been granted yet.',
		note: 'A fresh workspace has no grants: a granted host needs a workflow to ask for it and the user to allow it.',
		hotspots: [
			{ label: 'Enforcement for your own workflows: see Security', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Security' }) },
			{ label: 'Granted hosts and apps appear here', locate: text(/No site or app access granted yet/) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/access');
			await s.page.getByText(/No site or app access granted yet/).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'settings-security',
		page: 'app/settings/security',
		route: '#/app/settings/security',
		alt: 'Settings, Security: the Site access for your workflows card with Safe mode for my workflows switched on. Its text reads: On. Your workflows must be granted access to each external URL before they can contact it, the same per-host check installed workflows get, with a link to Site access.',
		hotspots: [
			{ label: 'Safe mode for my workflows: On', locate: (p) => p.getByRole('switch', { name: 'Safe mode for my workflows' }) },
			{ label: 'Manage granted sites in Site access', locate: (p) => p.getByRole('main').getByRole('link', { name: 'Site access' }).last() }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/security');
			const page = s.page;
			const sw = page.getByRole('switch', { name: 'Safe mode for my workflows' });
			await sw.waitFor({ timeout: T });
			if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click({ timeout: T });
			await page.getByText(/^On\. Your workflows must be granted/).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	// Last: once local secret protection is on, credentials stay locked until the passphrase is typed again.
	{
		name: 'secret-vault',
		page: 'app/account/secret-vault',
		route: '#/app/settings/preferences',
		alt: 'Settings, Preferences, Local secret protection card with protection on: the explanation and the no-recovery warning, a Memory box saying conversations and facts are encrypted with the passphrase too (All memory is encrypted.), the Change passphrase and Disable protection sections, and at the bottom the status Unlocked for this session with a Lock now button.',
		hotspots: [
			{ label: 'No recovery if you forget the passphrase', locate: text(/There is no recovery/) },
			{ label: 'Memory is encrypted too', locate: text('All memory is encrypted.') },
			{ label: 'Change passphrase', locate: btn('Change passphrase') },
			{ label: 'Unlocked for this session, with Lock now', locate: btn('Lock now') }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/preferences');
			const page = s.page;
			const pass = page.getByPlaceholder('At least 8 characters');
			await page.getByText('Local secret protection').first().waitFor({ timeout: T });
			if (await pass.count()) {
				await pass.fill('docs-capture-passphrase');
				await page.getByPlaceholder('Repeat passphrase').fill('docs-capture-passphrase');
				await page.getByRole('button', { name: 'Enable', exact: true }).click({ timeout: T });
			}
			await page.getByText('All memory is encrypted.').waitFor({ timeout: 30_000 });
			// Bring the card's header to the top of the view.
			await page.getByText('Local secret protection').first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
			await page.waitForTimeout(600);
		}
	},
	// Signed-in shots: they run in their own browser context against the fake API (lib/fakeApi.ts).
	{
		name: 'publish-basics',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish)',
		signedIn: true,
		alt: 'Step 1 of 5, Basics, of the Publish to the marketplace dialog for an example workflow: a five-step progress bar, the Name field filled with the workflow name (Summarise this page in 3 bullets), a Description editor with Write and Preview tabs and a formatting toolbar, prefilled with a starter description, the note Autofilled from your workflow, and Back and Next buttons.',
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ label: 'Five steps: Basics, Media, Details, Explain the steps, Review & publish', locate: (p) => p.getByRole('dialog').getByText('Basics', { exact: true }) },
			{ label: 'Listing name', locate: (p) => p.getByRole('dialog').getByRole('textbox').first() },
			{ label: 'Description, autofilled from your workflow', locate: (p) => p.getByRole('dialog').getByText(/Autofilled from your workflow/) },
			{ label: 'Next saves this step to your draft', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Next' }) }
		],
		prepare: async (s) => {
			await s.publishWizard(1);
		}
	},
	{
		name: 'publish-preview',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 2)',
		signedIn: true,
		alt: 'Step 2 of 5, Media, of the Publish to the marketplace dialog for an example workflow, with Generate selected under Screenshots & video: a bento-style preview image of the workflow (its trigger, the Get All Text, Basic LLM Chain, Web LLM and Display Markdown nodes, the title, an AWFlow mark and a 5 nodes, Runs in your browser card), then the Layout choices (Spotlight Halo selected, Cinematic Split, Filmstrip, Mosaic), five Accent colours, Image theme Light or Dark, a Show title checkbox and the Generate preview button for a 1600×900 PNG.',
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ label: 'Generate a preview image, or Upload your own', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Generate', exact: true }) },
			{ label: 'Layout', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Spotlight Halo/ }) },
			{ label: 'Accent colour, image theme and title', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Dark', exact: true }) },
			{ label: 'Generate preview adds the image to your previews', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Generate preview/ }) }
		],
		prepare: async (s) => {
			await s.publishWizard(2);
		}
	},
	{
		name: 'publish-review',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 5)',
		signedIn: true,
		alt: "Step 5 of 5, Review & publish, of the Publish to the marketplace dialog for an example workflow that summarises the page you're on, scrolled to Permissions & Safety: What it can access lists Reads the active tab (reads content, never writes), Where it connects says the workflow makes no network requests, How you're protected lists the runtime-enforced sandbox, capabilities disclosed up front and reviews from real installs only. Below, a Narrated badge (every step has a plain-language note), a What happens next note about the quick review, and the Publish button.",
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ label: 'What it can access, derived from the steps', locate: (p) => p.getByRole('dialog').getByText('What it can access') },
			{ label: 'Where it connects', locate: (p) => p.getByRole('dialog').getByText('Where it connects') },
			{ label: 'Narrated: every step has a note', locate: (p) => p.getByRole('dialog').getByText('Every step has a plain-language note.') },
			{ label: 'Publish sends it to review', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Publish' }) }
		],
		prepare: async (s) => {
			await s.publishWizard(5);
			const heading = s.page.getByRole('dialog').getByText('Permissions & Safety').first();
			await heading.evaluate((el) => el.scrollIntoView({ block: 'start' }));
			await s.page.waitForTimeout(500);
		}
	}
];
