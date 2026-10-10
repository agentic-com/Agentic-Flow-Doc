/** Shots for the publishing docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef } from './define.ts';
import { T, type Session } from '../lib/session.ts';

const SIGNED_IN_NOTE =
	'Signed in as a fictional account (Alex Doe): the app is the real production build, but its backend is the fake API in scripts/capture/lib/fakeApi.ts, which serves one example cloud workflow (fixtures/summarize-page-llm-chain.awf) and keeps the draft listing in memory. Nothing is published.';

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
	{
		name: 'publish-open',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu)',
		signedIn: true,
		note: SIGNED_IN_NOTE,
		alt: 'The Workflows page of a fictional signed-in account with the row menu of its cloud workflow, Summarise this page in 3 bullets, open on the actions for that workflow, including Publish.',
		spots: [
			{ id: 'row-menu', label: 'Row menu', locator: (p) => p.getByRole('row').filter({ hasText: 'Summarise this page' }).first().getByRole('button', { name: 'Open menu' }) },
			{ id: 'publish', label: 'Publish', locator: (p) => p.getByRole('menuitem', { name: 'Publish' }) }
		],
		prepare: async (s) => {
			const page = s.page;
			await page.goto('about:blank');
			await s.go('#/app/workflows');
			const row = page.getByRole('row').filter({ hasText: 'Summarise this page' }).first();
			await row.getByRole('button', { name: 'Open menu' }).click({ timeout: T });
			await page.getByRole('menuitem', { name: 'Publish' }).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
	{
		name: 'publish-details',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 3)',
		signedIn: true,
		note: SIGNED_IN_NOTE,
		alt: 'Step 3 of 5, Details, of the Publish to the marketplace dialog for an example workflow: the Research category picked, the tags summary and ai added, Language set to English, and Back and Next buttons.',
		spots: [
			{ id: 'categories', label: 'Categories', locator: (p) => p.getByRole('dialog').getByRole('combobox').first() },
			{ id: 'tags', label: 'Tags', locator: (p) => p.getByRole('dialog').getByPlaceholder('Enter tags') },
			{ id: 'language', label: 'Language', locator: (p) => p.getByRole('dialog').getByText('English', { exact: true }).first() },
			{ id: 'next', label: 'Next', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Next' }) }
		],
		prepare: async (s) => {
			await wizardTo(s, 3);
		}
	},
	{
		name: 'publish-explain',
		page: 'app/workflows/publishing',
		route: '#/app/workflows (row menu › Publish, step 4)',
		signedIn: true,
		note: SIGNED_IN_NOTE,
		alt: 'Step 4 of 5, Explain the steps, of the Publish to the marketplace dialog for an example workflow: a 4 of 5 explained counter, then one card per step (When Started, Get All Text, Basic LLM Chain, Web LLM…) with its plain-language note, prefilled from the notes already on the canvas; Next stays disabled with Add 1 more note to continue.',
		spots: [
			{ id: 'progress', label: 'How many steps are explained', locator: (p) => p.getByRole('dialog').getByText(/of \d+ explained/) },
			{ id: 'step-note', label: 'A note for one step', locator: (p) => p.getByRole('dialog').getByPlaceholder(/What this step does/).first() },
			{ id: 'next', label: 'Next', locator: (p) => p.getByRole('dialog').getByRole('button', { name: 'Next' }) }
		],
		prepare: async (s) => {
			await wizardTo(s, 4);
		}
	}
];

/** Walks the wizard to step 3 (Details, with a category and two tags) or 4 (Explain the steps). */
async function wizardTo(s: Session, step: 3 | 4) {
	await s.publishWizard(2);
	const page = s.page;
	const dialog = page.getByRole('dialog');
	const next = () => dialog.getByRole('button', { name: 'Next' }).click({ timeout: T });
	await next();
	// The fake API keeps the draft between shots: an earlier shot may already have saved this step.
	const tags = dialog.getByPlaceholder('Enter tags');
	await tags.waitFor({ timeout: T });
	const pick = dialog.getByRole('combobox').filter({ hasText: 'Select categories' });
	if (await pick.count()) {
		await pick.click({ timeout: T });
		await page.getByRole('option', { name: 'Research' }).click({ timeout: T });
	}
	for (const tag of ['summary', 'ai']) {
		if (await dialog.getByText(tag, { exact: true }).count()) continue;
		await tags.fill(tag);
		await tags.press('Enter');
	}
	await page.waitForTimeout(500);
	if (step === 3) return;
	await next();
	await dialog.getByPlaceholder(/What this step does/).first().waitFor({ timeout: T });
	await page.waitForTimeout(800);
}
