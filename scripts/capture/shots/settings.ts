/** Shots for the settings docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, text } from './define.ts';
import { T, type Session } from '../lib/session.ts';
import type { Page } from '../lib/util.ts';

const main = (p: Page) => p.getByRole('main');
const PROVIDER = 'Work Anthropic';
const PROVIDER_KEY = 'sk-ant-docs-placeholder-0000';

/** A small workflow with two HTTP Request steps, so Site access has real grants to show. Built here, imported through the app's own wizard. */
const API_CALLS_AWF = {
	name: 'Weather and repo check',
	description: 'Calls two public APIs: the weather forecast for Paris and the AWFlow issues repository on GitHub.',
	tags: ['api'],
	type: 'triggered',
	nodes: [
		{ id: 'start', type: 'trigger', position: { x: 120, y: 200 }, data: { instance: { id: 'af-base-node:trigger:whenStarted' }, label: 'Run now', inputs: {}, parameters: { notes: 'Starts the workflow when you press Run.' } } },
		{
			id: 'weather',
			type: 'basic',
			position: { x: 440, y: 120 },
			data: {
				instance: { id: 'af-base-node:basic:httpRequest' },
				label: 'Get the forecast',
				inputs: { method: 'GET', url: 'https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current=temperature_2m' },
				parameters: { notes: 'Asks Open-Meteo for the current temperature in Paris.' }
			}
		},
		{
			id: 'repo',
			type: 'basic',
			position: { x: 440, y: 300 },
			data: {
				instance: { id: 'af-base-node:basic:httpRequest' },
				label: 'Get the repository',
				inputs: { method: 'GET', url: 'https://api.github.com/repos/awflow/awflow-Studio-Issues' },
				parameters: { notes: 'Reads the public AWFlow issues repository on GitHub.' }
			}
		}
	],
	edges: [
		{ id: 'e1', source: 'start', target: 'weather' },
		{ id: 'e2', source: 'start', target: 'repo' }
	]
};
const apiCallsRoutes = new WeakMap<Session, string>();

/** Imports API_CALLS_AWF with the Add Workflow wizard (once per session) and opens its editor. */
async function apiCallsWorkflow(s: Session): Promise<string> {
	const page = s.page;
	const known = apiCallsRoutes.get(s);
	if (known) {
		if (new URL(page.url()).hash !== known) await s.go(known);
		await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
		return known;
	}
	await s.go('#/app/workflows');
	await page.getByRole('button', { name: 'Add Workflow' }).first().click({ timeout: T });
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: /^\W*Import/ }).click({ timeout: T });
	await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
	const chooser = page.waitForEvent('filechooser', { timeout: T });
	await dialog.getByText('Choose a .awf file').click({ timeout: T });
	await ((await chooser) as unknown as { setFiles(f: { name: string; mimeType: string; buffer: Buffer }): Promise<void> }).setFiles({
		name: 'weather-and-repo-check.awf',
		mimeType: 'application/json',
		buffer: Buffer.from(JSON.stringify(API_CALLS_AWF))
	});
	await dialog.getByRole('button', { name: 'Continue' }).click({ timeout: T });
	await dialog.getByRole('button', { name: 'Create & open' }).click({ timeout: T });
	await page.waitForURL(/#\/app\/workflows\/[^/?]+/, { timeout: T });
	await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
	// An imported workflow runs on the access it was imported with; "Make it mine" makes it your own,
	// so Safe mode for my workflows applies to it.
	await page.getByRole('button', { name: 'Make it mine' }).first().click({ timeout: T });
	const mine = page.getByRole('dialog');
	await mine.getByRole('checkbox').first().click({ timeout: T });
	await mine.getByRole('button', { name: 'Make it mine', exact: true }).last().click({ timeout: T });
	await mine.waitFor({ state: 'hidden', timeout: T });
	const route = new URL(page.url()).hash;
	apiCallsRoutes.set(s, route);
	return route;
}

/** Turns Safe mode for my workflows on, so the workflow's own steps ask before contacting a site. */
async function safeModeOn(s: Session) {
	await s.go('#/app/settings/security');
	const sw = s.page.getByRole('switch', { name: 'Safe mode for my workflows' });
	await sw.waitFor({ timeout: T });
	if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click({ timeout: T });
	await s.page.getByText(/^On\. Your workflows must be granted/).waitFor({ timeout: T });
}

/** Answers the open access prompt with Allow, ticking Always allow first when asked. */
async function allowConsent(page: Page, always: boolean) {
	const prompt = page.getByRole('alertdialog');
	await prompt.waitFor({ timeout: T });
	if (always) await prompt.getByRole('checkbox').click({ timeout: T });
	await prompt.getByRole('button', { name: 'Allow', exact: true }).click({ timeout: T });
	// The next request (another host) can replace it straight away, so don't wait for it to close.
	await page.waitForTimeout(800);
}

/** Fills the Add provider dialog with an example provider (placeholder key; nothing is called). */
async function fillProvider(p: Page) {
	const d = p.getByRole('dialog');
	await d.locator('#provider-label').fill(PROVIDER);
	await d.locator('#provider-api-key').fill(PROVIDER_KEY);
	await d.locator('#provider-model').fill('claude-sonnet-4-5');
}

export const shots: ShotDef[] = [
	{
		name: 'settings-general',
		page: 'app/settings/general',
		route: '#/app/settings/general',
		alt: "Settings, General section, in a local workspace: the settings menu (Preferences, Assistant Notch, Providers, Local models, Storage, Security, Privacy, Site access) and a card explaining that the workspace is saved on this device, with a Sign in button to create an account.",
		note: 'Local (anonymous) workspace. The signed-in view (avatar, username, password, newsletter) needs an account and is not captured.',
		hotspots: [
			{ id: 'settings-sections', label: 'Settings sections', locate: (p) => p.getByRole('main').getByText('Preferences', { exact: true }).first() },
			{ id: 'sign-manage-profile', label: 'Sign in to manage your profile', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Sign in' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/general');
			await s.page.getByRole('main').getByRole('button', { name: 'Sign in' }).waitFor({ timeout: T });
		}
	},
	{
		name: 'settings-index',
		page: 'app/settings',
		route: '#/app/settings',
		viewport: { width: 400, height: 860 },
		alt: 'Settings at side-panel width (400 px), in a local workspace: three groups of rows, each with a one-line status. Account: General (Local workspace · Sign in). App: Preferences, Assistant Notch (Off), Providers (None configured), Local models (0 installed), Storage. Safety & privacy: Security (Safe mode · Off (Trusted)), Privacy and Site access (No hosts granted yet).',
		hotspots: [
			{ id: 'account', label: 'Account', locate: (p) => p.getByRole('link', { name: /^General/ }) },
			{ id: 'app', label: 'App', locate: (p) => p.getByRole('link', { name: /^Preferences/ }) },
			{ id: 'safety-privacy', label: 'Safety & privacy', locate: (p) => p.getByRole('link', { name: /^Security/ }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings');
			await s.page.getByRole('link', { name: /^Site access/ }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'settings-notch',
		page: 'app/settings/notch',
		route: '#/app/settings/notch',
		alt: 'Settings, Assistant Notch, with Show the assistant bubble on web pages switched on: Resting form (Orb, Pill, Edge tab, Orb + badge), Accent colours, Size S, M or L, the Blocks list (On this page, Pinned workflows, Quick actions, Page tools, and Recent marked Soon) with move and on/off controls, Where it shows (All sites; Allowlist only marked Soon), and Discard and Save buttons.',
		hotspots: [
			{ id: 'show-bubble-on-web', label: 'Show the bubble on web pages', locate: (p) => p.getByRole('switch', { name: /Show the assistant bubble/ }) },
			{ id: 'resting-form', label: 'Resting form, accent and size', locate: (p) => p.getByRole('main').getByText('Resting form', { exact: false }).first() },
			{ id: 'blocks', label: 'Blocks: order and on/off', locate: (p) => p.getByRole('main').getByText('Pinned workflows', { exact: true }).first() },
			{ id: 'save-discard', label: 'Save or Discard', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Save' }).last() }
		],
		spots: [
			{ id: 'accent', label: 'Accent colours', locator: (p) => p.getByRole('button', { name: /^Accent/ }).first() },
			{ id: 'size', label: 'Size: S, M or L', locator: (p) => p.getByRole('main').getByRole('button', { name: 'M', exact: true }) },
			{ id: 'block-switch', label: 'Move a block, or switch it on or off', locator: (p) => p.getByRole('button', { name: 'Move down' }).first() },
			{ id: 'where-it-shows', label: 'Where it shows: All sites', locator: (p) => p.getByRole('button', { name: 'All sites' }) }
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
			{ id: 'enforcement-own-workflows', label: 'Enforcement for your own workflows: see Security', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Security' }) },
			{ id: 'granted-hosts-apps-appear', label: 'Granted hosts and apps appear here', locate: text(/No site or app access granted yet/) }
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
			{ id: 'safe-mode-my-workflows', label: 'Safe mode for my workflows: On', locate: (p) => p.getByRole('switch', { name: 'Safe mode for my workflows' }) },
			{ id: 'manage-granted-sites-site', label: 'Manage granted sites in Site access', locate: (p) => p.getByRole('main').getByRole('link', { name: 'Site access' }).last() }
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
	{
		name: 'settings-preferences',
		page: 'app/settings/preferences',
		route: '#/app/settings/preferences',
		viewport: { width: 1440, height: 1000 },
		alt: 'Settings, Preferences, in a local workspace: Language (English) with its Change language button, the Appearance Settings card with the Light and Dark theme choices and an Update preferences button, the Play a sound when your approval is needed switch (on), and Agent animations with Lively (selected), Calm and Off.',
		spots: [
			{ id: 'language', label: 'Change language', locator: (p) => main(p).getByRole('button', { name: 'Change language' }) },
			{ id: 'theme', label: 'Theme: Light or Dark', locator: (p) => main(p).getByRole('radio', { name: 'Dark' }) },
			{ id: 'update-preferences', label: 'Update preferences', locator: (p) => main(p).getByRole('button', { name: 'Update preferences' }) },
			{ id: 'approval-sound', label: 'Play a sound when your approval is needed', locator: (p) => main(p).getByRole('switch', { name: 'Play a sound when your approval is needed' }) },
			{ id: 'agent-animations', label: 'Agent animations: Lively, Calm or Off', locator: (p) => main(p).getByRole('radio', { name: /^Calm/ }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/preferences');
			await main(s.page).getByRole('radio', { name: /^Calm/ }).waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-providers-add',
		page: 'app/settings/providers',
		route: '#/app/settings/providers (Add provider)',
		viewport: { width: 1440, height: 1000 },
		alt: 'Settings, Providers, with the Add provider dialog open: Provider set to Anthropic, Label Work Anthropic, a hidden API key, Model claude-sonnet-4-5, a blank Max output tokens (optional) field (default 4096), Order 0 (lower numbers are tried first in auto-mode), Set as default off, Enabled on, and Cancel and Add buttons.',
		note: 'The API key is a placeholder, never a real key; adding a provider does not call it.',
		spots: [
			{ id: 'provider', label: 'Provider', locator: (p) => p.getByRole('dialog').locator('#provider-kind') },
			{ id: 'label', label: 'Label', locator: (p) => p.getByRole('dialog').locator('#provider-label') },
			{ id: 'api-key', label: 'API key', locator: (p) => p.getByRole('dialog').locator('#provider-api-key') },
			{ id: 'model', label: 'Model', locator: (p) => p.getByRole('dialog').locator('#provider-model') },
			{ id: 'order-default', label: 'Order and Set as default', locator: (p) => p.getByRole('dialog').locator('#provider-order') },
			{ id: 'add', label: 'Add', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Add', exact: true }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/providers');
			await main(s.page).getByRole('button', { name: 'Add provider' }).click({ timeout: T });
			await fillProvider(s.page);
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'settings-providers',
		page: 'app/settings/providers',
		route: '#/app/settings/providers',
		alt: 'Settings, Providers, with one provider added: Work Anthropic, Anthropic · claude-sonnet-4-5, with its on/off switch and Edit and Delete buttons, below the Add provider button.',
		note: 'Added through the Add provider dialog with a placeholder key; the next shot deletes it again.',
		spots: [
			{ id: 'add-provider', label: 'Add provider', locator: (p) => main(p).getByRole('button', { name: 'Add provider' }) },
			{ id: 'enable', label: 'Switch the provider on or off', locator: (p) => main(p).getByRole('switch', { name: `Enable ${PROVIDER}` }) },
			{ id: 'edit', label: 'Edit', locator: (p) => main(p).getByRole('button', { name: `Edit ${PROVIDER}` }).filter({ visible: true }).first() },
			{ id: 'delete', label: 'Delete', locator: (p) => main(p).getByRole('button', { name: `Delete ${PROVIDER}` }).filter({ visible: true }).first() }
		],
		prepare: async (s) => {
			const page = s.page;
			const d = page.getByRole('dialog');
			if (!(await d.locator('#provider-label').count())) {
				await s.go('#/app/settings/providers');
				await main(page).getByRole('button', { name: 'Add provider' }).click({ timeout: T });
				await fillProvider(page);
			}
			await d.getByRole('button', { name: 'Add', exact: true }).click({ timeout: T });
			await d.waitFor({ state: 'hidden', timeout: T });
			await main(page).getByRole('switch', { name: `Enable ${PROVIDER}` }).waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-privacy',
		page: 'app/settings/privacy',
		route: '#/app/settings/privacy',
		viewport: { width: 1440, height: 1340 },
		alt: 'Settings, Privacy: Usage statistics with the Share anonymous usage statistics switch (off), What we collect, Reset install ID and a Privacy policy link; Error reports with the Send error reports switch (off); Agent memory with Forget everything (no memories yet); Turn traces with the Developer mode, Keep traces (on) and Include prompt text switches and a Clear traces button; and the summary Nothing is shared from this device.',
		note: 'The capture browser starts with usage statistics and error reports off, so docs runs never send telemetry.',
		spots: [
			{ id: 'usage-stats', label: 'Share anonymous usage statistics', locator: (p) => main(p).getByRole('switch', { name: 'Share anonymous usage statistics' }) },
			{ id: 'what-we-collect', label: 'What we collect', locator: (p) => main(p).getByRole('button', { name: 'What we collect' }) },
			{ id: 'reset-install-id', label: 'Reset install ID', locator: (p) => main(p).getByRole('button', { name: 'Reset install ID' }) },
			{ id: 'error-reports', label: 'Send error reports', locator: (p) => main(p).getByRole('switch', { name: 'Send error reports' }) },
			{ id: 'forget-everything', label: 'Forget everything', locator: (p) => main(p).getByRole('button', { name: 'Forget everything' }) },
			{ id: 'developer-mode', label: 'Developer mode', locator: (p) => main(p).getByRole('switch', { name: 'Developer mode' }) },
			{ id: 'keep-traces', label: 'Keep traces and Include prompt text', locator: (p) => main(p).getByRole('switch', { name: 'Keep traces' }) },
			{ id: 'clear-traces', label: 'Clear traces', locator: (p) => main(p).getByRole('button', { name: 'Clear traces' }) }
		],
		prepare: async (s) => {
			const page = s.page;
			// Remove the example provider the two previous shots added.
			await s.go('#/app/settings/providers');
			await main(page).getByRole('button', { name: 'Add provider' }).waitFor({ timeout: T });
			await page.waitForTimeout(800);
			const del = main(page).getByRole('button', { name: `Delete ${PROVIDER}` }).filter({ visible: true });
			if (await del.count()) {
				await del.first().click({ timeout: T });
				const confirm = page.getByRole('alertdialog');
				await confirm.getByRole('button', { name: 'Delete', exact: true }).click({ timeout: T });
				await main(page).getByRole('switch', { name: `Enable ${PROVIDER}` }).waitFor({ state: 'detached', timeout: T });
				// The confirmation stays open after the delete in this build: close it.
				if (await confirm.filter({ visible: true }).count()) await confirm.getByRole('button', { name: 'Cancel' }).click({ timeout: T });
				await confirm.waitFor({ state: 'hidden', timeout: T });
			}
			await s.go('#/app/settings/privacy');
			await page.getByText('Nothing is shared from this device.').waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-storage',
		page: 'app/settings/storage',
		route: '#/app/settings/storage',
		viewport: { width: 1440, height: 1000 },
		alt: 'Settings, Storage, in a local workspace: the space used out of what the browser allows, a bar, and the categories Workflows & run history, Memory, Knowledge bases, Local models (each with Manage) and Other; the Not protected from automatic clean-up card with Keep my data and Export memory; and the Clean-up switches Tell me when memory gets large (on) and Clean up old conversations (off).',
		spots: [
			{ id: 'manage', label: 'Manage a category', locator: (p) => main(p).getByRole('link', { name: 'Manage' }).first() },
			{ id: 'keep-my-data', label: 'Keep my data', locator: (p) => main(p).getByRole('button', { name: 'Keep my data' }) },
			{ id: 'export-memory', label: 'Export memory', locator: (p) => main(p).getByRole('link', { name: 'Export memory' }) },
			{ id: 'memory-large', label: 'Tell me when memory gets large', locator: (p) => main(p).getByRole('switch', { name: 'Tell me when memory gets large' }) },
			{ id: 'clean-up', label: 'Clean up old conversations', locator: (p) => main(p).getByRole('switch', { name: 'Clean up old conversations' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/storage');
			await main(s.page).getByRole('button', { name: 'Keep my data' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1200);
		}
	},
	{
		name: 'site-access-consent',
		page: 'app/settings/access',
		route: '#/app/workflows/<id> (Test Workflow, access prompt)',
		alt: 'The workflow editor after Test Workflow, with Safe mode on: a prompt titled Allow this installed workflow to continue? says “Get the forecast” wants to contact api.open-meteo.com, with an Always allow for this workflow checkbox and Don’t allow and Allow buttons.',
		note: 'An example workflow with two HTTP Request steps, imported with the Add Workflow wizard, run with Safe mode for my workflows on.',
		spots: [
			{ id: 'always-allow', label: 'Always allow for this workflow', locator: (p) => p.getByRole('alertdialog').getByRole('checkbox') },
			{ id: 'allow', label: 'Allow', locator: (p) => p.getByRole('alertdialog').getByRole('button', { name: 'Allow', exact: true }) }
		],
		prepare: async (s) => {
			const page = s.page;
			await safeModeOn(s);
			await apiCallsWorkflow(s);
			await page.getByRole('button', { name: 'Test Workflow' }).first().click({ timeout: T });
			await page.getByRole('alertdialog').waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-access-granted',
		page: 'app/settings/access',
		route: '#/app/settings/access',
		alt: 'Settings, Site access, with one workflow’s grants: the Weather and repo check card (1 of 2 hosts allowed) lists api.open-meteo.com switched on and api.github.com switched off, each with an on/off switch and a trash button, and a Remove all button. Above it are the Search host, app, or workflow… box and the All, Enabled and Disabled tabs.',
		note: 'The grants were made by answering Allow, with Always allow for this workflow, to the prompts of a test run (see site-access-consent); api.github.com was then switched off here.',
		spots: [
			{ id: 'search', label: 'Search host, app or workflow', locator: (p) => main(p).getByRole('textbox', { name: 'Search site and app access' }) },
			{ id: 'status-tabs', label: 'All, Enabled and Disabled', locator: (p) => main(p).getByRole('button', { name: 'Enabled', exact: true }) },
			{ id: 'host-switch', label: 'Switch a host off or on', locator: (p) => main(p).getByRole('switch', { name: /^Allow api\.github\.com/ }) },
			{ id: 'remove-host', label: 'Remove a host', locator: (p) => main(p).getByRole('button', { name: /^Remove api\.github\.com/ }) },
			{ id: 'remove-all', label: 'Remove all', locator: (p) => main(p).getByRole('button', { name: 'Remove all' }) }
		],
		prepare: async (s) => {
			const page = s.page;
			// Answer the access prompts of the previous shot's run: Allow, always, for each host.
			for (let i = 0; i < 4; i++) {
				const shown = await page
					.getByRole('alertdialog')
					.waitFor({ timeout: 6000 })
					.then(() => true)
					.catch(() => false);
				if (!shown) break;
				await allowConsent(page, true);
			}
			await s.go('#/app/settings/access');
			const sw = main(page).getByRole('switch', { name: /^Allow api\.github\.com/ });
			await sw.waitFor({ timeout: T });
			if ((await sw.getAttribute('aria-checked')) === 'true') await sw.click({ timeout: T });
			await page.getByText(/1 of 2 hosts allowed/).waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'help-menu',
		page: 'app/help/help',
		route: '#/app/workflows (sidebar › Help)',
		viewport: { width: 1440, height: 1000 },
		alt: 'The app sidebar with the Help section open: How to use, Nodes, AI concepts, Video tutorials, Community, YouTube channel, Report a bug, Request a feature, Roadmap and Email us, each opening in a new tab.',
		spots: [
			{ id: 'help', label: 'Help: open its list', locator: (p) => p.getByRole('link', { name: 'Help', exact: true }) },
			{ id: 'community', label: 'Community', locator: (p) => p.getByRole('link', { name: 'Community', exact: true }) },
			{ id: 'report-bug', label: 'Report a bug', locator: (p) => p.getByRole('link', { name: 'Report a bug' }) },
			{ id: 'request-feature', label: 'Request a feature and Roadmap', locator: (p) => p.getByRole('link', { name: 'Request a feature' }) },
			{ id: 'email-us', label: 'Email us', locator: (p) => p.getByRole('link', { name: 'Email us' }) }
		],
		prepare: async (s) => {
			const page = s.page;
			await s.go('#/app/workflows');
			const help = page.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Help', exact: true }) }).getByRole('button', { name: 'Toggle' });
			await help.waitFor({ timeout: T });
			if (!(await page.getByRole('link', { name: 'Email us' }).count())) await help.click({ timeout: T });
			await page.getByRole('link', { name: 'Email us' }).evaluate((el) => el.scrollIntoView({ block: 'end' }));
			await page.waitForTimeout(600);
		}
	},
];
