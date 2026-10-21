import { join } from 'node:path';
import { buildAwmem, CHAT_TITLE } from './awmem.ts';
import type { Locator, Page, Theme } from './util.ts';

export const T = 15_000;
const FIXTURES = join(import.meta.dir, '..', 'fixtures');

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
		// The previous shot may have left the workflow on its Runs or Logs tab.
		const editorTab = page.getByRole('tab', { name: 'Editor', exact: true });
		if ((await editorTab.count()) && (await editorTab.first().getAttribute('aria-selected')) !== 'true') {
			await editorTab.first().click({ timeout: T });
		}
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
		await page.getByRole('button', { name: /^Run( workflow)?$/ }).first().click({ timeout: T });
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
