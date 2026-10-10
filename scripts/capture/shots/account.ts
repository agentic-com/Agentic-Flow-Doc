/** Shots for the account docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn, link, text } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'welcome',
		page: 'app/account/welcome',
		route: '#/app/welcome',
		alt: "The welcome page in a local workspace: a Local · no account needed badge, the headline Press Run. Watch a workflow do its thing., the Run “Start here” button (about 5 seconds), and three other ways in: Start from a template, Describe it to the AI and the 2-minute tutorial, with Skip to the app below.",
		hotspots: [
			{ id: 'local-workspace', label: 'Local workspace: no account needed', locate: text('Local · no account needed') },
			{ id: 'run-start-here', label: 'Run “Start here”', locate: btn('Run “Start here”') },
			{ id: 'other-ways', label: 'Other ways in: template, describe it, tutorial', locate: btn(/Start from a template/) },
			{ id: 'skip-app', label: 'Skip to the app', locate: btn('Skip to the app') }
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
			{ id: 'name', label: 'Name, email and password', locate: (p) => p.getByRole('textbox', { name: 'Email' }) },
			{ id: 'sign-up', label: 'Sign up', locate: btn('Sign up', true) },
			{ id: 'continue-github', label: 'Or continue with GitHub, Google or Hugging Face', locate: text('Or continue with') },
			{ id: 'already-have-account-login', label: 'Already have an account? Login', locate: link('Login') }
		],
		prepare: async (s) => {
			await s.go('#/auth/signup');
			await s.page.getByRole('button', { name: 'Sign up', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1500);
		}
	},
	{
		name: 'secret-vault',
		page: 'app/account/secret-vault',
		route: '#/app/settings/preferences',
		alt: 'Settings, Preferences, Local secret protection card with protection on: the explanation and the no-recovery warning, a Memory box saying conversations and facts are encrypted with the passphrase too (All memory is encrypted.), the Change passphrase and Disable protection sections, and at the bottom the status Unlocked for this session with a Lock now button.',
		hotspots: [
			{ id: 'no-recovery-if-forget', label: 'No recovery if you forget the passphrase', locate: text(/There is no recovery/) },
			{ id: 'memory-is-encrypted-too', label: 'Memory is encrypted too', locate: text('All memory is encrypted.') },
			{ id: 'change-passphrase', label: 'Change passphrase', locate: btn('Change passphrase') },
			{ id: 'unlocked-session', label: 'Unlocked for this session, with Lock now', locate: btn('Lock now') }
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
];
