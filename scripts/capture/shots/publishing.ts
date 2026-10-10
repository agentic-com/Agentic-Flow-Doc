/** Shots for the publishing docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef } from './define.ts';

export const shots: ShotDef[] = [
	{
		name: 'publish-basics',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish)',
		signedIn: true,
		alt: 'Step 1 of 5, Basics, of the Publish to the marketplace dialog for an example workflow: a five-step progress bar, the Name field filled with the workflow name (Summarise this page in 3 bullets), a Description editor with Write and Preview tabs and a formatting toolbar, prefilled with a starter description, the note Autofilled from your workflow, and Back and Next buttons.',
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ id: 'five-steps', label: 'Five steps: Basics, Media, Details, Explain the steps, Review & publish', locate: (p) => p.getByRole('dialog').getByText('Basics', { exact: true }) },
			{ id: 'listing-name', label: 'Listing name', locate: (p) => p.getByRole('dialog').getByRole('textbox').first() },
			{ id: 'description', label: 'Description, autofilled from your workflow', locate: (p) => p.getByRole('dialog').getByText(/Autofilled from your workflow/) },
			{ id: 'next-saves-step-draft', label: 'Next saves this step to your draft', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Next' }) }
		],
		prepare: async (s) => {
			await s.publishWizard(1);
		}
	},
	{
		name: 'publish-preview',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 2)',
		signedIn: true,
		alt: 'Step 2 of 5, Media, of the Publish to the marketplace dialog for an example workflow, with Generate selected under Screenshots & video: a bento-style preview image of the workflow (its trigger, the Get All Text, Basic LLM Chain, Web LLM and Display Markdown nodes, the title, an AWFlow mark and a 5 nodes, Runs in your browser card), then the Layout choices (Spotlight Halo selected, Cinematic Split, Filmstrip, Mosaic), five Accent colours, Image theme Light or Dark, a Show title checkbox and the Generate preview button for a 1600×900 PNG.',
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ id: 'generate-preview-image', label: 'Generate a preview image, or Upload your own', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Generate', exact: true }) },
			{ id: 'layout', label: 'Layout', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Spotlight Halo/ }) },
			{ id: 'accent-colour', label: 'Accent colour, image theme and title', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Dark', exact: true }) },
			{ id: 'generate-preview-adds-image', label: 'Generate preview adds the image to your previews', locate: (p) => p.getByRole('dialog').getByRole('button', { name: /Generate preview/ }) }
		],
		prepare: async (s) => {
			await s.publishWizard(2);
		}
	},
	{
		name: 'publish-review',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 5)',
		signedIn: true,
		alt: "Step 5 of 5, Review & publish, of the Publish to the marketplace dialog for an example workflow that summarises the page you're on, scrolled to Permissions & Safety: What it can access lists Reads the active tab (reads content, never writes), Where it connects says the workflow makes no network requests, How you're protected lists the runtime-enforced sandbox, capabilities disclosed up front and reviews from real installs only. Below, a Narrated badge (every step has a plain-language note), a What happens next note about the quick review, and the Publish button.",
		note: 'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.',
		hotspots: [
			{ id: 'what-access', label: 'What it can access, derived from the steps', locate: (p) => p.getByRole('dialog').getByText('What it can access') },
			{ id: 'where-connects', label: 'Where it connects', locate: (p) => p.getByRole('dialog').getByText('Where it connects') },
			{ id: 'narrated', label: 'Narrated: every step has a note', locate: (p) => p.getByRole('dialog').getByText('Every step has a plain-language note.') },
			{ id: 'publish-sends-review', label: 'Publish sends it to review', locate: (p) => p.getByRole('dialog').getByRole('button', { name: 'Publish' }) }
		],
		prepare: async (s) => {
			await s.publishWizard(5);
			const heading = s.page.getByRole('dialog').getByText('Permissions & Safety').first();
			await heading.evaluate((el) => el.scrollIntoView({ block: 'start' }));
			await s.page.waitForTimeout(500);
		}
	},
];
