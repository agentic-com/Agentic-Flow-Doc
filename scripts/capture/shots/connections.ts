/** Shots for the connections docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'credentials-new',
		page: 'app/connections/create',
		route: '#/app/credentials',
		alt: 'The New Credential dialog over the Credentials page: an Integration App / Service picker, Name and Description fields, an Auth Type menu set to Basic Auth with Username and Password fields, a note that the secret is saved locally and encrypted in this browser, and the Create Credential button.',
		hotspots: [
			{ id: 'app', label: 'Pick the app or service', locate: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ id: 'name', label: 'Name it so you can find it in nodes', locate: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Name', exact: true }) },
			{ id: 'auth-type', label: 'Auth type decides which fields you fill', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Auth Type' }) },
			{ id: 'storage', label: 'Where the secret is stored', locate: (p) => p.getByRole('dialog').getByText('Saved locally in this browser') }
		],
		spots: [
			{ id: 'fields', label: 'The fields of the chosen auth type (here Username and Password)', locator: (p) => p.getByRole('dialog').getByRole('textbox', { name: 'Username' }) },
			{ id: 'create', label: 'Create Credential', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Create Credential' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/credentials');
			await s.page.getByRole('button', { name: 'Add Credential' }).first().click({ timeout: T });
			await s.page.getByRole('dialog').getByText('New Credential').first().waitFor({ timeout: T });
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
];
