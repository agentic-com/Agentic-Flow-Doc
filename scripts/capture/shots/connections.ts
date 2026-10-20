/** Shots for the connections docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, type SpotDef, btn } from './define.ts';
import { T, type Session } from '../lib/session.ts';
import type { Page } from '../lib/util.ts';

// ---------------------------------------------------------------------------------------------
// Helpers for the per-service New Credential shots.

const dialog = (p: Page) => p.getByRole('dialog');

async function openNewCredential(s: Session) {
	await s.go('#/app/credentials');
	await s.page.getByRole('button', { name: 'Add Credential' }).first().click({ timeout: T });
	await dialog(s.page).getByText('New Credential').first().waitFor({ timeout: T });
}

async function pickApp(s: Session, app: string) {
	const page = s.page;
	await dialog(page).getByRole('combobox').first().click({ timeout: T });
	// The list filters on the integration's id (e.g. microsoftGraph), so type the label's first word.
	await page.keyboard.type(app.split(' ')[0]);
	await page.waitForTimeout(300);
	await page.getByRole('option').filter({ hasText: app }).first().click({ timeout: T });
	await dialog(page).getByRole('combobox').first().filter({ hasText: app }).waitFor({ timeout: T });
	await page.waitForTimeout(300);
}

const nameSpot: SpotDef = { id: 'name', label: 'Name', locator: (p) => dialog(p).getByRole('textbox', { name: 'Name', exact: true }) };
const storageSpot: SpotDef = { id: 'storage', label: 'Where the secret is stored (here, locally in this browser)', locator: (p) => dialog(p).getByText('Saved locally in this browser') };
const createSpot: SpotDef = { id: 'create', label: 'Create Credential', locator: (p) => dialog(p).getByRole('button', { name: 'Create Credential' }) };
const field = (id: string, name: string, label = name): SpotDef => ({ id, label, locator: (p) => dialog(p).getByRole('textbox', { name, exact: true }) });

function appShot(page: string, app: string, kind: 'bearer' | 'basic' | 'oauth'): ShotDef {
	const slug = page;
	const isGoogle = app === 'Gmail';
	const vendor = isGoogle ? 'Google' : 'Microsoft';
	const fieldsAlt =
		kind === 'bearer'
			? 'a Bearer Token field (no Auth Type menu: the app sets it)'
			: kind === 'basic'
				? 'Username and Password fields (no Auth Type menu: the app sets Basic Auth)'
				: `a collapsed Create your ${vendor} OAuth client guide, a Client ID field${isGoogle ? ', a Client Secret (optional) field' : ' (no Client Secret: Microsoft 365 is a public client)'} and a Check connection button, disabled until a Client ID is filled`;
	const spots: SpotDef[] = [
		{ id: 'app', label: `Integration App / Service: ${app}`, locator: (p) => dialog(p).getByRole('combobox').first() },
		nameSpot
	];
	if (kind === 'bearer') spots.push(field('token', 'Bearer Token'));
	if (kind === 'basic') spots.push(field('username', 'Username'), field('password', 'Password'));
	if (kind === 'oauth') {
		spots.push({ id: 'oauth-guide', label: `Create your ${vendor} OAuth client guide`, locator: btn(new RegExp(`Create your ${vendor} OAuth client`)) });
		spots.push(field('client-id', 'Client ID'));
		if (isGoogle) spots.push(field('client-secret', 'Client Secret (optional)'));
		spots.push({ id: 'check-connection', label: 'Check connection (sign in)', locator: (p) => dialog(p).getByRole('button', { name: 'Check connection' }) });
	}
	spots.push(storageSpot, createSpot);
	return {
		name: `credentials-${slug}`,
		page: `app/connections/${page}`,
		route: '#/app/credentials (Add Credential)',
		alt: `The New Credential dialog with ${app} picked under Integration App / Service: Name and Description fields, ${fieldsAlt}, a note that the secret is saved locally and encrypted in this browser, and the Cancel and Create Credential buttons.`,
		spots,
		prepare: async (s) => {
			await openNewCredential(s);
			await pickApp(s, app);
			if (kind === 'oauth') {
				const guide = s.page.getByRole('button', { name: new RegExp(`Create your ${vendor} OAuth client`) });
				await guide.waitFor({ timeout: T });
				await s.page.waitForTimeout(800);
				if ((await guide.getAttribute('aria-expanded')) === 'true') await guide.click();
				await s.page.waitForTimeout(500);
			}
		}
	};
}

function simpleShot(kind: 'jwt' | 'bearer' | 'basic', authLabel: string, page: string): ShotDef {
	const spots: SpotDef[] = [
		{ id: 'app', label: 'Integration App / Service: none (Simple Credential)', locator: (p) => dialog(p).getByRole('combobox').first() },
		nameSpot,
		{ id: 'auth-type', label: `Auth Type: ${authLabel}`, locator: (p) => dialog(p).getByRole('button', { name: 'Auth Type' }) }
	];
	if (kind === 'jwt') spots.push(field('token', 'JWT'));
	if (kind === 'bearer') spots.push(field('token', 'Bearer Token'));
	if (kind === 'basic') spots.push(field('username', 'Username'), field('password', 'Password'));
	spots.push(storageSpot, createSpot);
	const fields = kind === 'jwt' ? 'a JWT field' : kind === 'bearer' ? 'a Bearer Token field' : 'Username and Password fields';
	return {
		name: `credentials-simple-${kind}`,
		page: `app/connections/${page}`,
		route: '#/app/credentials (Add Credential)',
		alt: `The New Credential dialog for a simple credential (no app picked, so Integration App / Service reads Select an integration...): Name and Description fields, the Auth Type menu set to ${authLabel}, ${fields}, a note that the secret is saved locally and encrypted in this browser, and the Cancel and Create Credential buttons.`,
		spots,
		prepare: async (s) => {
			await openNewCredential(s);
			const page = s.page;
			if (kind !== 'basic' || !(await dialog(page).getByRole('textbox', { name: 'Username' }).count())) {
				await dialog(page).getByRole('button', { name: 'Auth Type' }).click({ timeout: T });
				await page.getByRole('option', { name: authLabel, exact: true }).click({ timeout: T });
			}
			await dialog(page).getByRole('button', { name: 'Auth Type' }).filter({ hasText: authLabel }).waitFor({ timeout: T });
			await page.waitForTimeout(400);
		}
	};
}

export const shots: ShotDef[] = [
	{
		name: 'credentials-new',
		page: 'app/connections/create',
		route: '#/app/credentials?new=1',
		alt: 'The New connection form over the Connections page: the Integration App / Service picker, Name (Weather API) and Description, Type set to Bearer token with its Bearer Token field, a note that it is saved locally in this browser, and the Cancel and Add connection buttons.',
		spots: [
			{ id: 'app', label: 'Pick the app or service', locator: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ id: 'name', label: 'Name it so you can find it in steps', locator: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
			{ id: 'auth-type', label: 'Type: how the service signs in', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Type' }) },
			{ id: 'fields', label: 'The fields of that type (here the token)', locator: (p) => p.getByRole('dialog').getByRole('textbox', { name: /Bearer Token/i }) },
			{ id: 'storage', label: 'Where it is saved', locator: (p) => p.getByRole('dialog').getByText('Saved locally in this browser') },
			{ id: 'create', label: 'Add connection', locator: (p) => p.getByRole('dialog').getByRole('button', { name: /^(Add connection|Save and test|Save connection)$/ }).last() }
		],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.go('#/app/credentials');
			await s.page.getByRole('button', { name: /Add connection/ }).first().click({ timeout: T });
			const d = s.page.getByRole('dialog');
			await d.getByRole('textbox', { name: 'Name', exact: true }).click({ timeout: T });
			await d.getByRole('textbox', { name: 'Name', exact: true }).fill('Weather API');
			await d.getByRole('button', { name: 'Type' }).click({ timeout: T });
			await s.page.getByRole('option', { name: 'Bearer token' }).first().click({ timeout: T });
			await s.page.getByRole('dialog').getByRole('textbox', { name: /Bearer Token/i }).waitFor({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'credentials-oauth',
		page: 'app/connections/oauth-client',
		route: '#/app/credentials (Add Credential)',
		alt: 'The New Credential dialog with Gmail picked: Name and Description fields, then the Create your Google OAuth client guide in 5 steps (create a Google Cloud project, enable the Gmail API, set up the consent screen, create a Web application client with the redirect URI shown and a Copy button, paste the Client ID and Secret), and a Step-by-step with screenshots link. This capture is the web app, so the redirect URI is https://app.awflow.io/oauth-callback/web.',
		hotspots: [
			{ id: 'app', label: 'The app: Gmail', locate: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ id: 'create-google-oauth-client', label: 'Create your Google OAuth client guide', locate: btn(/Create your Google OAuth client/) },
			{ id: 'redirect-uri', label: 'Redirect URI, with Copy', locate: btn('Copy redirect URI') }
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
			{ id: 'name-description', label: 'Name and description', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
			{ id: 'secret-fields', label: 'Secret fields: here, the token', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Bearer Token' }) },
			{ id: 'update-credential', label: 'Update Credential', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Update Credential' }) }
		],
		spots: [
			{ id: 'description', label: 'Description', locator: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Description' }) },
			{ id: 'app', label: 'Integration App / Service: GitHub', locator: (p) => p.getByRole('dialog').getByRole('combobox').first() }
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

	// Per-service New Credential forms (one per "Connect <service>" page): the app picked, so its real fields show.
	...[
		['airtable', 'AirTable'],
		['attio', 'Attio'],
		['baserow-nocodb', 'Baserow / NocoDB'],
		['discord', 'Discord'],
		['github', 'GitHub'],
		['hubspot', 'HubSpot'],
		['linear', 'Linear'],
		['notion', 'Notion'],
		['obsidian', 'Obsidian'],
		['pipedrive', 'Pipedrive'],
		['raindrop', 'Raindrop'],
		['readwise', 'Readwise / Reader'],
		['slack', 'Slack'],
		['supabase', 'Supabase'],
		['telegram', 'Telegram'],
		['todoist', 'Todoist']
	].map(([page, app]): ShotDef => appShot(page, app, 'bearer')),
	appShot('trello', 'Trello', 'basic'),
	appShot('google', 'Gmail', 'oauth'),
	appShot('microsoft-365', 'Microsoft 365', 'oauth'),
	simpleShot('jwt', 'JWT', 'openai'),
	simpleShot('bearer', 'Bearer Token', 'http-and-apis'),
	simpleShot('basic', 'Basic Auth', 'http-and-apis')
];
