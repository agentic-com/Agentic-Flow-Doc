/** Shots that need seeded account data: an installed workflow, notices from AWFlow. Signed in (lib/fakeApi.ts). */
import { type ShotDef } from './define.ts';
import { T, type Session } from '../lib/session.ts';

const SIGNED_IN =
	'Signed in as a fictional account (Alex Doe): the app is the real build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts. No real account or data.';

/** Capture-only switches of the fake API (lib/fakeApi.ts). */
async function docsState(s: Session, body: Record<string, unknown>) {
	if (!s.page.url().startsWith(s.base)) await s.go('#/app');
	await s.page.evaluate(
		(b) => fetch('https://api.awflow.io/__docs/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }),
		body
	);
}

const info = (p: Parameters<NonNullable<ShotDef['spots']>[number]['locator']>[0]) => p.getByRole('dialog').filter({ visible: true }).last();

export const shots: ShotDef[] = [
	{
		name: 'workflow-info-installed',
		page: 'app/workflows/create',
		route: '#/app/workflows/downloaded/<id> (workflow info)',
		signedIn: true,
		note: SIGNED_IN + ' The installed workflow (JSON Prettify & Repair by the fictional Sam Lee, v2 installed, v3 approved) comes from the fake API.',
		alt: 'Workflow info of an installed workflow, JSON Prettify & Repair: an Installed badge with From the Marketplace, by Sam Lee. Make a copy to change it., the Version row reading v2 · v3 available with Update…, and a Make a copy button.',
		spots: [
			{ id: 'installed', label: 'Installed, from the Marketplace', locator: (p) => p.getByText(/^From the Marketplace/).filter({ visible: true }).first() },
			{ id: 'version', label: 'Version: v2 · v3 available', locator: (p) => p.getByText(/v3 available/).filter({ visible: true }).first() },
			{ id: 'update', label: 'Update…', locator: (p) => p.getByRole('button', { name: /^Update/ }).filter({ visible: true }).first() },
			{ id: 'make-copy', label: 'Make a copy', locator: (p) => p.getByRole('button', { name: 'Make a copy' }).filter({ visible: true }).first() }
		],
		prepare: async (s) => {
			await docsState(s, { installed: true });
			await s.page.goto('about:blank');
			await s.go('#/app/workflows/downloaded/wf_docs_json_prettify');
			const page = s.page;
			await page.locator('.svelte-flow__node').first().waitFor({ timeout: T });
			await page.getByRole('button', { name: /, workflow info$/ }).first().click({ timeout: T });
			await page.getByText(/v3 available/).first().waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'notifications-from-awflow',
		page: 'app/notifications',
		route: '#/app/notifications (From AWFlow)',
		signedIn: true,
		note: SIGNED_IN + ' The two notices and the update card (AWFlow updated from 0.8.2 to 0.9.0, one workflow concerned) are seeded for the capture.',
		alt: 'The Notifications page with the From AWFlow chip selected: the Updated to AWFlow 0.9 card (1 of your workflows uses a step that changed in 0.9, with Review and Release notes), then a planned-maintenance notice and a notice about Test runs.',
		spots: [
			{ id: 'chip', label: 'From AWFlow', locator: (p) => p.getByRole('main').getByText(/^From AWFlow/).first() },
			{ id: 'update', label: 'The update card', locator: (p) => p.getByTestId('awflow-notices').getByText(/^Updated to AWFlow/).first() },
			{ id: 'review', label: 'Review', locator: (p) => p.getByTestId('awflow-notices').getByRole('button', { name: 'Review' }) },
			{ id: 'notice', label: 'A notice from AWFlow', locator: (p) => p.getByTestId('awflow-notices').getByText(/^Planned maintenance/).first() }
		],
		prepare: async (s) => {
			await docsState(s, { installed: false, notices: true });
			const page = s.page;
			// The client config is cached for 10 minutes: fetch it again. AWFlow just updated from 0.8.2.
			await page.evaluate(() => {
				localStorage.removeItem('awf:remote-config');
				localStorage.setItem('awflow.update.preflight', `awf-json:${JSON.stringify({ from: '0.8.2', to: '0.9.0', at: 0 })}`);
			});
			await page.goto('about:blank');
			await s.go('#/app/notifications');
			await page.getByRole('main').getByText(/^From AWFlow/).first().click({ timeout: T });
			await page.getByTestId('awflow-notices').waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	}
];
