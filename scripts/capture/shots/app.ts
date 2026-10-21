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
];
