/** Shots for the account docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn, link, text } from './define.ts';
import { T, type Session } from '../lib/session.ts';

const SIGNED_IN =
	'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts. No real account or data.';

/** Capture-only switches of the fake API (lib/fakeApi.ts): role, newsletter state. */
async function docsState(s: Session, body: Record<string, unknown>) {
	if (!s.page.url().startsWith(s.base)) await s.go('#/app');
	await s.page.evaluate(
		(b) => fetch('https://api.awflow.io/__docs/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }),
		body
	);
}

/** A fresh page load of `route` (drops dialogs and popovers left by the previous shot). */
async function fresh(s: Session, route: string) {
	await s.page.goto('about:blank');
	await s.go(route);
}

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
		spots: [
			{ id: 'name-field', label: 'Name', locator: (p) => p.getByRole('textbox', { name: 'Name' }) },
			{ id: 'password', label: 'Password', locator: (p) => p.getByLabel('Password', { exact: true }) },
			{ id: 'confirm-password', label: 'Confirm Password', locator: (p) => p.getByLabel('Confirm Password') }
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
	{
		name: 'login',
		page: 'app/account/sign-up-and-login',
		route: '#/auth/login',
		alt: 'The login form: Welcome back, with Email and Password fields, a Forgot your password? link, the Login button, GitHub, Google and Hugging Face buttons under Or continue with, a Sign up link, and Continue without an account.',
		spots: [
			{ id: 'email', label: 'Email', locator: (p) => p.getByRole('textbox', { name: 'Email' }) },
			{ id: 'password', label: 'Password', locator: (p) => p.getByLabel('Password', { exact: true }) },
			{ id: 'forgot', label: 'Forgot your password?', locator: (p) => p.getByText('Forgot your password?') },
			{ id: 'login', label: 'Login', locator: btn('Login', true) },
			{ id: 'social', label: 'GitHub, Google or Hugging Face', locator: text('Or continue with') },
			{ id: 'no-account', label: 'Continue without an account', locator: (p) => p.getByText('Continue without an account') }
		],
		prepare: async (s) => {
			await s.go('#/auth/login');
			await s.page.getByRole('button', { name: 'Login', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1500);
		}
	},
	{
		name: 'forgot-password',
		page: 'app/account/reset-password',
		route: '#/auth/forget-password',
		alt: 'The forgot-password form: You forgot your password?, an Email field and the Submit button.',
		spots: [
			{ id: 'email', label: 'Email', locator: (p) => p.getByRole('textbox').first() },
			{ id: 'submit', label: 'Submit', locator: btn('Submit', true) }
		],
		prepare: async (s) => {
			await s.go('#/auth/forget-password');
			await s.page.getByRole('button', { name: 'Submit', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1500);
		}
	},
	{
		name: 'reset-password',
		page: 'app/account/reset-password',
		route: '?token=<token>#/auth/reset-password',
		alt: 'The reset-password page opened from an email link: Enter your new password below, with New Password and Confirm Password fields and the Reset Password button.',
		note: 'Opened with a placeholder token: the form only checks the token when it is submitted.',
		spots: [
			{ id: 'new-password', label: 'New Password', locator: (p) => p.getByLabel('New Password') },
			{ id: 'confirm-password', label: 'Confirm Password', locator: (p) => p.getByLabel('Confirm Password') },
			{ id: 'reset', label: 'Reset Password', locator: btn('Reset Password', true) }
		],
		prepare: async (s) => {
			await s.go('?token=docs-capture#/auth/reset-password');
			await s.page.getByRole('button', { name: 'Reset Password', exact: true }).waitFor({ timeout: T });
			await s.page.waitForTimeout(1500);
		}
	},
	{
		name: 'notifications',
		page: 'app/notifications',
		route: '#/app/notifications (bell open)',
		signedIn: true,
		note: SIGNED_IN,
		alt: 'The Notifications page of a fictional signed-in account with the bell open at the top right: three unread notifications (a listing is live, a new 5-star review, someone is using the workflow) and two read ones (a requested workflow shipped, a report was acted on), with Mark all read and See all in the bell and Mark all read on the page.',
		spots: [
			{ id: 'bell', label: 'The bell and its unread count', locator: (p) => p.getByRole('button', { name: 'Notifications' }) },
			{ id: 'mark-all-read', label: 'Mark all read', locator: (p) => p.getByRole('button', { name: 'Mark all read' }).last() },
			{ id: 'see-all', label: 'See all', locator: (p) => p.getByRole('link', { name: 'See all' }) },
			{ id: 'unread', label: 'An unread notification', locator: (p) => p.getByRole('main').getByRole('button', { name: /is live/ }) }
		],
		prepare: async (s) => {
			await fresh(s, '#/app/notifications');
			const page = s.page;
			await page.getByRole('main').getByRole('button', { name: /is live/ }).waitFor({ timeout: T });
			await page.getByRole('button', { name: 'Notifications' }).click({ timeout: T });
			await page.getByRole('link', { name: 'See all' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'settings-general-account',
		page: 'app/settings/general',
		route: '#/app/settings/general',
		signedIn: true,
		note: SIGNED_IN,
		alt: 'Settings, General, signed in as a fictional account (Alex Doe): the avatar with its edit button, the Username field with Update, and the Publisher tagline (38/160, shown next to your name on the marketplace) with Save. The Password section starts below.',
		spots: [
			{ id: 'avatar', label: 'Avatar', locator: (p) => p.getByRole('main').getByText('AD', { exact: true }).first() },
			{ id: 'username', label: 'Username', locator: (p) => p.getByRole('main').getByRole('textbox').first() },
			{ id: 'update-username', label: 'Update', locator: (p) => p.getByRole('main').getByRole('button', { name: 'Update' }).first() },
			{ id: 'tagline', label: 'Publisher tagline', locator: (p) => p.getByRole('main').getByRole('textbox').nth(1) },
			{ id: 'save-tagline', label: 'Save', locator: (p) => p.getByRole('main').getByRole('button', { name: 'Save' }).first() }
		],
		prepare: async (s) => {
			await fresh(s, '#/app/settings/general');
			await s.page.getByRole('main').getByText('Publisher tagline').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'settings-general-password',
		page: 'app/settings/general',
		route: '#/app/settings/general',
		signedIn: true,
		note: SIGNED_IN,
		alt: 'Settings, General, signed in as a fictional account, scrolled to the Password section (Old Password, New Password and Confirm Password, each with a show/hide eye, and Update) and the Newsletter section with the Subscribe to the newsletter switch.',
		spots: [
			{ id: 'old-password', label: 'Old Password', locator: (p) => p.getByRole('main').getByPlaceholder('Give your old password') },
			{ id: 'new-password', label: 'New Password and Confirm Password', locator: (p) => p.getByRole('main').getByPlaceholder('Give your new password') },
			{ id: 'update-password', label: 'Update', locator: (p) => p.getByRole('main').getByRole('button', { name: 'Update' }).last() },
			{ id: 'newsletter', label: 'Subscribe to the newsletter', locator: (p) => p.getByRole('main').getByRole('switch').last() }
		],
		prepare: async (s) => {
			await fresh(s, '#/app/settings/general');
			const sw = s.page.getByRole('main').getByRole('switch').last();
			await sw.waitFor({ timeout: T });
			await sw.evaluate((el) => el.scrollIntoView({ block: 'end' }));
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'newsletter-card',
		page: 'app/newsletter',
		route: '#/app/workflows',
		signedIn: true,
		note: SIGNED_IN + ' The fake API reports this account as undecided, so the opt-in card shows.',
		alt: 'The Workflows page of a fictional signed-in account with the Stay in the loop card in the bottom-right corner: occasional updates on new nodes, templates and community picks, with Not now and Subscribe buttons and a close button.',
		spots: [
			{ id: 'subscribe', label: 'Subscribe', locator: (p) => p.getByRole('button', { name: 'Subscribe', exact: true }) },
			{ id: 'not-now', label: 'Not now', locator: (p) => p.getByRole('button', { name: 'Not now' }) },
			{ id: 'dismiss', label: 'Dismiss', locator: (p) => p.getByRole('button', { name: 'Dismiss' }) }
		],
		prepare: async (s) => {
			await docsState(s, { newsletter: 'undecided', newsletterPrompt: true });
			await fresh(s, '#/app/workflows');
			await s.page.getByText('Stay in the loop').waitFor({ timeout: 30_000 });
			await s.page.waitForTimeout(800);
			await docsState(s, { newsletter: 'subscribed', newsletterPrompt: false });
		}
	},
	{
		name: 'settings-plan',
		page: 'app/settings/plan',
		route: '#/app/settings/plan',
		signedIn: true,
		note: SIGNED_IN + ' Plans and limits are those of the API seed data.',
		alt: 'Settings, Plan, for a fictional account on the Free plan: the Active plan card (Free) and All plans side by side (Free, Basic, Premium, Enterprise) with their price per month and per year in euros, Current plan on Free and Coming soon on the paid plans, and a Show detailed comparison button.',
		spots: [
			{ id: 'active-plan', label: 'Active plan', locator: (p) => p.getByRole('main').getByRole('heading', { name: 'Active plan' }) },
			{ id: 'current', label: 'Current plan', locator: (p) => p.getByRole('main').getByRole('button', { name: /Current plan/ }).first() },
			{ id: 'coming-soon', label: 'Coming soon', locator: (p) => p.getByRole('main').getByRole('button', { name: 'Coming soon' }).first() },
			{ id: 'comparison', label: 'Show detailed comparison', locator: (p) => p.getByRole('main').getByRole('button', { name: 'Show detailed comparison' }) }
		],
		prepare: async (s) => {
			await fresh(s, '#/app/settings/plan');
			await s.page.getByRole('main').getByRole('heading', { name: 'Premium' }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	}
];
