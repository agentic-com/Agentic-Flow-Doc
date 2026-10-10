/** Shots for the admin docs (signed in as a fictional admin through the fake API). Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef } from './define.ts';
import { join } from 'node:path';
import { T, type Session } from '../lib/session.ts';

const NOTE =
	'Signed in as a fictional admin (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, whose admin fixtures (lib/fakeAdmin.ts) are invented accounts and listings. No real user data.';

/** Switches the fake API's user to the admin role (capture-only endpoint), then opens `route` fresh. */
async function asAdmin(s: Session, route: string) {
	const page = s.page;
	await page.goto('about:blank');
	await s.go('#/app');
	await page.evaluate(() =>
		fetch('https://api.awflow.io/__docs/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role: 'admin' }) })
	);
	await page.goto('about:blank');
	await s.go(route);
}

const main = (p: import('../lib/util.ts').Page) => p.getByRole('main');

export const shots: ShotDef[] = [
	{
		name: 'admin-users',
		page: 'app/admin/users',
		route: '#/admin/users',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Users: segment chips (All, Staff, Banned / Disabled, Published authors, New this month), the Search name or email… box with Role, Status, Plan, Email verified and Joined filters, and a table of fictional accounts with their role, status, verified state and join date. Two users are ticked, so the bulk toolbar shows Enable, Disable, Ban… and Unban.',
		spots: [
			{ id: 'segments', label: 'Segment chips', locator: (p) => main(p).getByRole('button', { name: 'Staff' }).first() },
			{ id: 'search', label: 'Search name or email', locator: (p) => main(p).getByPlaceholder(/Search name or email/) },
			{ id: 'filters', label: 'Role, Status, Plan, Email verified and Joined filters', locator: (p) => main(p).getByText('Any role', { exact: true }).first() },
			{ id: 'select', label: 'Tick users', locator: (p) => main(p).getByRole('checkbox', { name: 'Select user' }).nth(1) },
			{ id: 'bulk', label: 'Bulk actions', locator: (p) => main(p).getByRole('button', { name: /^Ban(…|\.\.\.)$/ }).first() },
			{ id: 'open-user', label: 'Open a user', locator: (p) => main(p).getByText('Mei Lin', { exact: true }).first() }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/users');
			const page = s.page;
			await main(page).getByText('Priya Nair').first().waitFor({ timeout: T });
			await main(page).getByRole('checkbox', { name: 'Select user' }).nth(0).click({ timeout: T });
			await main(page).getByRole('checkbox', { name: 'Select user' }).nth(1).click({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-user-detail',
		page: 'app/admin/users',
		route: '#/admin/users/<id>',
		signedIn: true,
		note: NOTE,
		alt: "Admin panel, one user's page for a fictional account, Mei Lin: name, email and user ID with copy buttons, User, Active, Free plan and Email verified badges, the Reset password, Resend verification and Ban… buttons, the Workflows, Listings, Runs (30d), Last active and Joined numbers, and the Account, Content, Activity and Admin history tabs above the Account and Billing cards.",
		spots: [
			{ id: 'reset-password', label: 'Reset password', locator: (p) => main(p).getByRole('button', { name: 'Reset password' }) },
			{ id: 'resend-verification', label: 'Resend verification', locator: (p) => main(p).getByRole('button', { name: 'Resend verification' }) },
			{ id: 'ban', label: 'Ban…', locator: (p) => main(p).getByRole('button', { name: /^Ban/ }) },
			{ id: 'stats', label: 'Workflows, listings, runs, last active, joined', locator: (p) => main(p).getByText('Runs (30d)', { exact: true }) },
			{ id: 'tabs', label: 'Account, Content, Activity and Admin history', locator: (p) => main(p).getByRole('tablist').first() }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/users/usr_docs_mei');
			await main(s.page).getByRole('button', { name: 'Resend verification' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-moderation',
		page: 'app/admin/moderation',
		route: '#/admin/marketplace/moderation',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Moderation: Pending (3), Approved (3), Suspended and Rejected tabs, a search box with Tags, Publisher, Language, Submitted and Updated filters, and three fictional listings waiting for review: JSON Prettify & Repair (live, with an update in review), JWT Decoder and Color Converter (In review), each with its publisher, tags, downloads, rating, dates and a Review button.',
		spots: [
			{ id: 'tabs', label: 'Pending and Approved queues', locator: (p) => main(p).getByRole('tab', { name: /Pending/ }) },
			{ id: 'search', label: 'Search and filters', locator: (p) => main(p).getByPlaceholder(/Search name, description/) },
			{ id: 'update-badge', label: 'An update to a live listing', locator: (p) => main(p).getByText('Update', { exact: true }).first() },
			{ id: 'review', label: 'Review', locator: (p) => main(p).getByRole('row').filter({ hasText: 'JWT Decoder' }).getByRole('button', { name: 'Review' }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/moderation');
			await main(s.page).getByText('JWT Decoder').first().waitFor({ timeout: T });
			// The table is wider than the content area: fold the sidebar so the Review buttons show.
			await s.page.getByRole('button', { name: 'Toggle sidebar' }).click({ timeout: T });
			await s.page.waitForTimeout(400);
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-review',
		page: 'app/admin/moderation',
		route: '#/admin/marketplace/moderation/<id>',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, reviewing a fictional pending listing, JWT Decoder by Mei Lin: the read-only graph with its sticky note and the How this flow works story, the Review checklist with the three required checks ticked (Inspected the workflow graph, Reviewed what it touches, Reviewed the listing content) and the optional sandbox test, and the action bar with Open sandbox to test, the snapshot being reviewed, Reject…, Suspend… and Approve snapshot.',
		spots: [
			{ id: 'graph', label: 'Read-only graph of the version under review', locator: (p) => main(p).getByRole('application').first() },
			{ id: 'checklist', label: 'Review checklist', locator: (p) => main(p).getByRole('button', { name: /^Inspected the workflow graph/ }) },
			{ id: 'sandbox', label: 'Open sandbox to test', locator: (p) => main(p).getByRole('button', { name: /Open sandbox to test/ }) },
			{ id: 'reject', label: 'Reject… or Suspend…', locator: (p) => main(p).getByRole('button', { name: /^Reject/ }) },
			{ id: 'approve', label: 'Approve snapshot', locator: (p) => main(p).getByRole('button', { name: /^Approve/ }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/moderation/pw_docs_jwt');
			const m = main(s.page);
			await m.getByRole('button', { name: /^Inspected the workflow graph/ }).waitFor({ timeout: T });
			for (const name of [/^Inspected the workflow graph/, /^Reviewed what it touches/, /^Reviewed the listing content/])
				await m.getByRole('button', { name }).click({ timeout: T });
			await s.page.waitForTimeout(600);
		}
	},
	{
		name: 'admin-reports',
		page: 'app/admin/reports',
		route: '#/admin/marketplace/reports',
		signedIn: true,
		note: NOTE + ' Opening Moderate… crashed the page in this build (Oops! Something went wrong), so the dialog itself is not captured.',
		alt: 'Admin panel, Reports: two fictional listings with open reports, Summarise this page in 3 bullets (2 reports: Malware / security and Other) and Hash Text (1 report: Spam), each with a view N reports link. The row menu of the first listing is open on Moderate….',
		spots: [
			{ id: 'reasons', label: 'Reasons given', locator: (p) => main(p).getByText('Malware / security', { exact: true }).first() },
			{ id: 'view-reports', label: 'View the reports', locator: (p) => main(p).getByText('view 2 reports') },
			{ id: 'row-menu', label: 'Row menu', locator: (p) => main(p).getByRole('row').filter({ hasText: 'Summarise this page' }).getByRole('button', { name: 'Report actions' }) },
			{ id: 'moderate', label: 'Moderate…', locator: (p) => p.getByRole('menuitem', { name: /Moderate/ }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/reports');
			const page = s.page;
			const row = main(page).getByRole('row').filter({ hasText: 'Summarise this page' });
			await row.getByRole('button', { name: 'Report actions' }).click({ timeout: T });
			await page.getByRole('menuitem', { name: /Moderate/ }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-category-new',
		page: 'app/admin/categories',
		route: '#/admin/categories (New category)',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Categories, with the New category dialog open: an Icon button, the Label field filled with Marketing, the slug filled in automatically with an Edit link, a Description, Color and Sort order, a Tags field, and the Cancel and Create category buttons.',
		spots: [
			{ id: 'icon', label: 'Icon', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Choose icon' }) },
			{ id: 'label', label: 'Label', locator: (p) => p.getByRole('dialog').getByLabel(/^Label/) },
			{ id: 'slug', label: 'Slug, filled in from the label', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Edit slug' }) },
			{ id: 'details', label: 'Description, color, sort order and tags', locator: (p) => p.getByRole('dialog').getByLabel('Description') },
			{ id: 'create', label: 'Create category', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Create category' }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/categories');
			const page = s.page;
			await main(page).getByRole('button', { name: 'New category' }).click({ timeout: T });
			const d = page.getByRole('dialog');
			await d.getByLabel(/^Label/).fill('Marketing');
			await d.getByLabel('Description').fill('Campaigns, social posts and audience research.');
			await d.getByLabel('Tags').fill('social, campaigns');
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-requests',
		page: 'app/admin/requests',
		route: '#/admin/marketplace/requests',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Manage requests: six fictional requests on the board with their votes, a Status menu for each (building, open, fulfilled, declined), an ETA date with Clear ETA for the one being built, a Fulfilled workflow id for the fulfilled one, and below, Duplicate requests: two look-alike requests next to their canonical request, each with a Merge in button.',
		spots: [
			{ id: 'status', label: 'Status', locator: (p) => main(p).getByRole('row').filter({ hasText: 'Summarise YouTube video transcripts' }).first().getByRole('button', { name: 'open' }) },
			{ id: 'eta', label: 'ETA', locator: (p) => main(p).getByRole('button', { name: 'Clear ETA' }) },
			{ id: 'fulfilled', label: 'Fulfilled workflow', locator: (p) => main(p).getByRole('row').filter({ hasText: 'Price-drop alert' }).getByRole('textbox') },
			{ id: 'merge', label: 'Merge in', locator: (p) => main(p).getByRole('button', { name: 'Merge in' }).first() }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/requests');
			await main(s.page).getByRole('button', { name: 'Merge in' }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-newsletter',
		page: 'app/admin/newsletter',
		route: '#/admin/newsletter (New issue)',
		signedIn: true,
		note: NOTE,
		alt: "Admin panel, Newsletter, with a new draft open: the Subject field, the Markdown Body editor starting with Hi {{name}}, the hint to use {{name}} for the recipient's name, and the Save draft, Send test and Send now buttons.",
		spots: [
			{ id: 'new-issue', label: 'New issue', locator: (p) => main(p).getByRole('button', { name: 'New issue' }) },
			{ id: 'subject', label: 'Subject', locator: (p) => main(p).getByLabel('Subject') },
			{ id: 'body', label: 'Body (Markdown)', locator: (p) => main(p).getByText('Body', { exact: true }) },
			{ id: 'send-test', label: 'Send test', locator: (p) => main(p).getByRole('button', { name: 'Send test' }) },
			{ id: 'send-now', label: 'Send now', locator: (p) => main(p).getByRole('button', { name: 'Send now' }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/newsletter');
			const page = s.page;
			await main(page).getByRole('button', { name: 'New issue' }).click({ timeout: T });
			await main(page).getByLabel('Subject').fill('October: knowledge bases in your browser');
			const editor = main(page).locator('textarea').first();
			await editor.click({ timeout: T });
			await editor.fill('Hi {{name}},\n\nThis month you can give your agents a **knowledge base** that never leaves your device.\n\n- Drop in PDFs and notes\n- Ask questions in chat\n- Everything stays local');
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'admin-audit',
		page: 'app/admin/audit-log',
		route: '#/admin/marketplace/audit',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Audit log: the Any action, Anyone and Anything filters with From and To dates, and a table of fictional entries with their time, action (Approved, Featured, Rejected, Requests merged, Dismissed reports, Category edited, Suspended, Batch import), what they are about, who did it and the details, such as the review checks that were ticked.',
		spots: [
			{ id: 'action', label: 'Action', locator: (p) => main(p).getByText('Any action', { exact: true }) },
			{ id: 'by', label: 'Done by', locator: (p) => main(p).getByText('Anyone', { exact: true }) },
			{ id: 'about', label: 'About', locator: (p) => main(p).getByText('Anything', { exact: true }) },
			{ id: 'dates', label: 'From and To', locator: (p) => main(p).getByText('From', { exact: true }) },
			{ id: 'details', label: 'Details', locator: (p) => main(p).getByText(/Checked: graph/) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/audit');
			await main(s.page).getByText('Bulk email sender').waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-insights',
		page: 'app/admin/insights',
		route: '#/admin/marketplace/insights',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Marketplace insights for 30 days, with fictional numbers: the 7 days, 30 days and 90 days switch, the Install funnel from Listing viewed to Ran once with the share of each step, Declined at permissions by capability, Where installs come from, and the Activity tiles.',
		spots: [
			{ id: 'range', label: '7, 30 or 90 days', locator: (p) => main(p).getByText('30 days', { exact: true }) },
			{ id: 'funnel', label: 'Install funnel', locator: (p) => main(p).getByText('Install funnel', { exact: true }) },
			{ id: 'declined', label: 'Declined at permissions', locator: (p) => main(p).getByText('Declined at permissions', { exact: true }) },
			{ id: 'sources', label: 'Where installs come from', locator: (p) => main(p).getByText('Where installs come from', { exact: true }) },
			{ id: 'activity', label: 'Activity', locator: (p) => main(p).getByText('Activity', { exact: true }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/insights');
			await main(s.page).getByText('Install funnel').waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'admin-template-new',
		page: 'app/admin/templates',
		route: '#/admin/templates (New template)',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Templates, with the New template dialog open: Start from, an Icon button, the Title filled with Weekly report to email and its slug, a Summary, the Details section opened with Category, Tags and Sort order, and the Cancel and Create draft & open canvas buttons.',
		spots: [
			{ id: 'start-from', label: 'Start from an existing template', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Start from template' }) },
			{ id: 'title', label: 'Icon, title and summary', locator: (p) => p.getByRole('dialog').getByLabel(/^Title/) },
			{ id: 'details', label: 'Details: category, tags, sort order', locator: (p) => p.getByRole('dialog').getByRole('button', { name: /^Details/ }) },
			{ id: 'create', label: 'Create draft & open canvas', locator: (p) => p.getByRole('dialog').getByRole('button', { name: /Create draft/ }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/templates');
			const page = s.page;
			await main(page).getByRole('button', { name: 'New template' }).click({ timeout: T });
			const d = page.getByRole('dialog');
			await d.getByLabel(/^Title/).fill('Weekly report to email');
			await d.getByLabel('Summary').fill('Every Monday, email a summary of the pages you saved.');
			await d.getByRole('button', { name: /^Details/ }).click({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-agent-templates',
		page: 'app/admin/agent-templates',
		route: '#/admin/marketplace/agent-templates',
		signedIn: true,
		note: NOTE,
		alt: 'Admin panel, Agent & team templates, Pending queue: two fictional templates, the Research desk team (3 agents, needs 1 workflow) and the Inbox triage agent, each with its description, Preview and Approve buttons, a Note to the author field and a Reject button. The Approved, Rejected, Suspended and Retired queues are tabs at the top.',
		spots: [
			{ id: 'queues', label: 'Queues', locator: (p) => main(p).getByRole('radiogroup', { name: 'Status' }) },
			{ id: 'preview', label: 'Preview', locator: (p) => main(p).getByRole('button', { name: 'Preview' }).first() },
			{ id: 'note', label: 'Note to the author', locator: (p) => main(p).getByPlaceholder(/Note to the author/).first() },
			{ id: 'approve', label: 'Approve', locator: (p) => main(p).getByRole('button', { name: 'Approve' }).first() },
			{ id: 'reject', label: 'Reject', locator: (p) => main(p).getByRole('button', { name: 'Reject' }).first() }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/agent-templates');
			await main(s.page).getByText('Research desk').waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'admin-batch-import',
		page: 'app/admin/batch-import',
		route: '#/admin/marketplace/import',
		signedIn: true,
		note: NOTE + ' The folder is a copy of six first-party example workflows (fixtures/batch-import); their drift states come from the fake API.',
		alt: 'Admin panel, Batch import after choosing a workflows folder of six official example workflows: counts per state at the top, Export 1 diverged, and a table where the new and updated workflows are ticked, one is unchanged, a live-diverged one has an Export button and a conflict has a Resolve button, with Import 3 to live at the bottom.',
		spots: [
			{ id: 'choose-folder', label: 'Choose workflows folder', locator: (p) => main(p).getByRole('button', { name: 'Choose workflows folder' }).filter({ visible: true }).first() },
			{ id: 'select', label: 'Ticked for import', locator: (p) => main(p).getByRole('checkbox', { name: /^Select (?!all)/ }).first() },
			{ id: 'export', label: 'Export a live-diverged listing', locator: (p) => main(p).getByRole('button', { name: 'Export', exact: true }).first() },
			{ id: 'resolve', label: 'Resolve a conflict', locator: (p) => main(p).getByRole('button', { name: 'Resolve' }).first() },
			{ id: 'import', label: 'Import to live', locator: (p) => main(p).getByRole('button', { name: /^Import \d+ to live/ }) }
		],
		prepare: async (s) => {
			await asAdmin(s, '#/admin/marketplace/import');
			const page = s.page;
			await main(page).getByRole('button', { name: 'Choose workflows folder' }).first().waitFor({ timeout: T });
			await main(page).locator('input[type="file"]').setInputFiles(join(import.meta.dir, '..', 'fixtures', 'batch-import', 'workflows'));
			await main(page).getByRole('button', { name: 'Resolve' }).first().waitFor({ timeout: T });
			await page.waitForTimeout(800);
		}
	}
];
