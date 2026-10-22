/** Shots for the app docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn, text } from './define.ts';

export const shots: ShotDef[] = [
	{
		name: 'side-panel',
		page: 'app/side-panel',
		route: '#/app/assistant',
		viewport: { width: 400, height: 860 },
		alt: "The AWFlow app at side-panel width (400 px) on the Aria page: a header with the page name and search, a row with chat history, the Aria switcher, new chat and chat settings, Aria's greeting, the message box with Chat and Build modes, context meter and model picker, suggestion cards in one column, and the bottom bar with Home, Aria, Workflows, Marketplace and More.",
		hotspots: [
			{ id: 'search', label: 'Search and commands', locate: btn('Search or run a command') },
			{ id: 'message-box', label: 'Message box: ask Aria anything', locate: (p) => p.getByRole('textbox').first() },
			{ id: 'chat-build-mode', label: 'Chat or Build mode', locate: btn('Build') },
			{ id: 'model-picker', label: 'Model picker', locate: btn('Gemini Nano') },
			{ id: 'bottom-bar', label: 'Bottom bar: Home, Aria, Workflows, Marketplace, More', locate: (p) => p.getByRole('link', { name: 'Workflows' }).last() }
		],
		prepare: async (s) => {
			await s.assistant();
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
			{ id: 'browse-by-category', label: 'Browse by category', locate: btn(/For you/) },
			{ id: 'search-workflows', label: 'Search workflows, publishers and tags', locate: btn('Search workflows') },
			{ id: 'featured-workflow', label: 'Featured workflow: Get it', locate: btn('Get', true) },
			{ id: 'popular-community-workflows', label: 'Popular community workflows', locate: text('What the community installs') }
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
		name: 'notch-enable',
		page: 'app/assistant-notch',
		route: '#/app/settings/notch',
		alt: 'Settings › Aria on web pages: the settings sections on the left with Aria on web pages selected, and the Show the assistant bubble on web pages switch, which is off.',
		spots: [
			{ id: 'notch-section', label: 'Aria on web pages', locator: (p) => p.getByRole('navigation', { name: 'Settings sections' }).getByRole('link', { name: /Aria on web pages/ }) },
			{ id: 'show-bubble', label: 'Show the assistant bubble on web pages', locator: (p) => p.getByRole('switch', { name: 'Show the assistant bubble on web pages' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/notch');
			await s.page.getByRole('switch', { name: 'Show the assistant bubble on web pages' }).waitFor({ timeout: 15_000 });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'request-board',
		page: 'app/request-board',
		route: '#/app/marketplace/requests',
		signedIn: true,
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build; the requests on the board come from the fake API in scripts/capture/lib/fakeApi.ts.',
		alt: 'The Request board, signed in as a fictional account: What the community wants built, with the Request a workflow button, this week\'s numbers (12 requests, 140 votes, 3 shipped this month, 1 in review), and three lanes: Most wanted (four requests with their votes, Join +1 buttons and one marked Joined), Building now (one in review with its estimated ship date, one with no ETA yet) and Shipped (two requests with Open the workflow links). Request board is selected under Marketplace in the sidebar.',
		spots: [
			{ id: 'sidebar-link', label: 'Request board, under Marketplace', locator: (p) => p.getByRole('link', { name: 'Request board' }).first() },
			{ id: 'request-workflow', label: 'Request a workflow', locator: btn('Request a workflow') },
			{ id: 'most-wanted', label: 'Most wanted', locator: (p) => p.getByRole('heading', { name: /Most wanted/ }) },
			{ id: 'building-now', label: 'Building now', locator: (p) => p.getByRole('heading', { name: /Building now/ }) },
			{ id: 'shipped', label: 'Shipped', locator: (p) => p.getByRole('heading', { name: /Shipped/ }) },
			{ id: 'join', label: 'Join +1: vote for a request', locator: btn('Join +1') }
		],
		prepare: async (s) => {
			await s.page.goto('about:blank');
			await s.go('#/app/marketplace/requests');
			const page = s.page;
			await page.getByRole('button', { name: 'Join +1' }).first().waitFor({ timeout: 15_000 });
			// Unfold Marketplace in the sidebar so the Request board entry shows.
			const link = page.getByRole('link', { name: 'Request board' });
			if (!(await link.count())) await page.getByRole('button', { name: 'Marketplace' }).first().click({ timeout: 15_000 });
			await link.first().waitFor({ timeout: 15_000 });
			await page.waitForTimeout(800);
		}
	}
];
