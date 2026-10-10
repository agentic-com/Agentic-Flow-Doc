/** Shots for the ai docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type ShotDef, btn, link, text, inDialog } from './define.ts';
import { T, type Session } from '../lib/session.ts';
import { buildAwmem, CHAT_TITLE } from '../lib/awmem.ts';

/** Closes a dialog or menu the previous shot left open. */
async function closeOverlays(s: Session) {
	for (let i = 0; i < 3 && (await s.page.getByRole('dialog').filter({ visible: true }).count()); i++) {
		await s.page.keyboard.press('Escape');
		await s.page.waitForTimeout(300);
	}
}

/** The "Price checker" agent made once per session with Blank agent; returns after opening the builder on `tab`. */
const agentRoutes = new WeakMap<Session, string>();
async function agentBuilder(s: Session, tab: string) {
	const p = s.page;
	let route = agentRoutes.get(s);
	if (!route) {
		await s.go('#/app/agents');
		await p.getByRole('heading', { name: 'Start from a template' }).waitFor({ timeout: T });
		await p.getByRole('button', { name: /Blank agent/ }).first().click({ timeout: T });
		const name = p.getByRole('textbox', { name: /^Name/ });
		await name.waitFor({ timeout: T });
		await p.waitForTimeout(800);
		await name.fill('Price checker');
		await name.press('Tab');
		await p.getByText(/Hi, I.m Price checker/).filter({ visible: true }).first().waitFor({ timeout: T });
		const role = p.getByRole('textbox', { name: /^One-line role/ });
		await role.fill('Watches competitor prices and reports changes');
		await role.press('Tab');
		await p.waitForTimeout(500);
		if ((await role.inputValue()) !== 'Watches competitor prices and reports changes') await role.fill('Watches competitor prices and reports changes');
		route = new URL(p.url()).hash;
		agentRoutes.set(s, route);
	} else if (new URL(p.url()).hash !== route) await s.go(route);
	await p.getByRole('button', { name: new RegExp(`^${tab}`) }).first().click({ timeout: T });
	await p.waitForTimeout(800);
}

/** The New team wizard, from a fresh page, walked to `step` (1 Goal … 4 Rules & limits). Nothing is created. */
async function teamWizard(s: Session, step: 1 | 2 | 3 | 4) {
	const p = s.page;
	await p.goto('about:blank');
	await s.go('#/app/teams/new');
	await p.getByRole('textbox', { name: 'Name' }).fill('Trip crew', { timeout: T });
	await p.getByRole('textbox', { name: 'Goal' }).fill('Plan short trips end-to-end: research, find stays, write the itinerary. Never pay.');
	if (step === 1) return;
	await p.getByRole('button', { name: 'Suggest members' }).click({ timeout: T });
	await p.getByRole('textbox', { name: 'New agent name' }).fill('Stay finder', { timeout: T });
	await p.getByRole('button', { name: 'Add', exact: true }).click({ timeout: T });
	await p.getByText('Stay finder').first().waitFor({ timeout: T });
	await p.waitForTimeout(500);
	if (step === 2) return;
	await p.getByRole('button', { name: 'Continue' }).last().click({ timeout: T });
	await p.getByText('How the team coordinates').waitFor({ timeout: T });
	await p.waitForTimeout(500);
	if (step === 3) return;
	await p.getByRole('button', { name: 'Continue' }).last().click({ timeout: T });
	await p.getByRole('button', { name: 'Create team' }).waitFor({ timeout: T });
	await p.waitForTimeout(500);
}

/** Opens Add a custom model with a transformers.js model id; the task is detected from Hugging Face (network). */
async function customModel(s: Session) {
	const p = s.page;
	await p.goto('about:blank');
	await s.go('#/app/local-models');
	await p.getByText('Llama 3.2 1B Instruct').first().waitFor({ timeout: T });
	await p.getByRole('button', { name: /Add custom model/ }).first().click({ timeout: T });
	const d = p.getByRole('dialog');
	await d.getByRole('button', { name: 'Transformers.js' }).click({ timeout: T });
	await d.getByRole('textbox').first().fill('Xenova/vit-base-patch16-224');
	await d
		.getByText("Detected from the model's config")
		.waitFor({ timeout: 20_000 })
		.catch(() => {
			throw new Error('the model task was not detected within 20s (offline?)');
		});
	await p.waitForTimeout(500);
}

export const shots: ShotDef[] = [
	{
		name: 'aria-chat',
		page: 'app/chat-and-agents/chat',
		route: '#/app/assistant',
		alt: 'The Assistant page with a saved chat open: the user asks what a webhook is and whether AWFlow can start a workflow from one, and Aria answers in two short replies. The left rail lists recent chats.',
		note: 'The chat is a real conversation imported with Memory > Import from a generated .awmem file (scripts/capture/lib/awmem.ts); no model runs during capture.',
		hotspots: [
			{ id: 'recent-chats', label: 'Recent chats', locate: btn(CHAT_TITLE, true) },
			{ id: 'switch-agent', label: 'Switch agent', locate: btn('Switch agent') },
			{ id: 'reply-box', label: 'Reply box, with Chat and Build modes', locate: (p) => p.getByRole('textbox', { name: /Reply to Aria/ }) },
			{ id: 'context-meter-model-picker', label: 'Context meter and model picker', locate: btn(/Context window/) }
		],
		prepare: async (s) => {
			await s.importMemory();
			await s.assistant();
			await s.page.getByText(CHAT_TITLE).filter({ visible: true }).first().click({ timeout: T });
			await s.page.getByText('Can AWFlow start a workflow from one?').filter({ visible: true }).first().waitFor({ timeout: T });
		}
	},
	{
		name: 'knowledge-bases',
		page: 'app/knowledge-bases/overview',
		route: '#/app/knowledges/<id>',
		alt: "A new knowledge base called Product handbook: its source, chunk and size counters, the on-device MiniLM search engine and Cloud OK badges, the Sources, Test search, Used by and Settings tabs, and side cards for Used by, Privacy and Search engine. It has no sources yet.",
		hotspots: [
			{ id: 'add-sources', label: 'Add sources: files, web pages or text', locate: btn('Add sources') },
			{ id: 'test-search', label: 'Test search', locate: (p) => p.getByRole('tab', { name: 'Test search' }) },
			{ id: 'privacy', label: 'Privacy: Cloud OK or Device only', locate: text('PRIVACY') },
			{ id: 'search-engine', label: 'Search engine, on this device', locate: text('SEARCH ENGINE') }
		],
		prepare: async (s) => {
			await s.knowledgeBase();
			await s.page.getByRole('heading', { name: 'Product handbook' }).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'local-models',
		page: 'app/local-models',
		route: '#/app/local-models',
		needsNetwork: true,
		alt: 'The Local AI page: storage used by on-device models split by engine (WebLLM, TF.js, Transformers), a task list on the left (Chat, Embeddings, vision and audio tasks) and model cards on the right, such as Llama 3.2 1B Instruct with its size, variants and install state.',
		hotspots: [
			{ id: 'storage-header', label: 'Storage header: space used, by engine', locate: text(/of \d+(\.\d+)? GB/) },
			{ id: 'tasks', label: 'Tasks', locate: text('BROWSE BY TASK') },
			{ id: 'search-engine-filter', label: 'Search and engine filter', locate: (p) => p.getByRole('textbox', { name: 'Filter models…' }) },
			{ id: 'model-card', label: 'A model card: size, device fit and install state', locate: (p) => p.getByText('Llama 3.2 1B Instruct').first() }
		],
		prepare: async (s) => {
			await s.go('#/app/local-models');
			await s.page.getByText('Llama 3.2 1B Instruct').first().waitFor({ timeout: T });
			// The Hugging Face section only appears once the network list has loaded.
			await s.page
				.getByText('Hugging Face', { exact: true })
				.first()
				.waitFor({ timeout: 20_000 })
				.catch(() => {
					throw new Error('the Hugging Face model list did not load within 20s (offline?)');
				});
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'memory',
		page: 'app/memory/overview',
		route: '#/app/memory',
		alt: "The Memory page: total space on this device split into Chats, Workflow and Facts, Import and Export all buttons, and the Conversations tab listing three Aria chats (What a webhook is, Draft a reply to Sam, Regex for order numbers) with their last message, message count and when they were updated.",
		note: 'Conversations and facts are imported from a generated .awmem file through Memory > Import.',
		hotspots: [
			{ id: 'storage-strip', label: 'Storage strip: space used, by kind', locate: text(/\d+(\.\d+)? ?[KMG]?B on this device/) },
			{ id: 'import-export-all', label: 'Import and Export all', locate: btn('Export all') },
			{ id: 'conversations', label: 'Conversations, Facts and Storage tabs', locate: link(/^Conversations/) },
			{ id: 'search-titles-messages', label: 'Search titles and messages', locate: (p) => p.getByRole('searchbox', { name: 'Search titles and messages' }) }
		],
		prepare: async (s) => {
			await s.importMemory();
			await s.go('#/app/memory');
			await s.page.getByText(CHAT_TITLE).first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'agents',
		page: 'app/chat-and-agents/agents',
		route: '#/app/agents',
		alt: 'The Agents tab of Agents & teams: a Describe an agent box with a Create agent button, the card for Aria (Your assistant, On-device AI) with a Chat button, and four templates to start from: Chief of staff, Inbox triager, Price watcher and Study buddy. Import and Blank agent buttons are at the top right.',
		hotspots: [
			{ id: 'agent-cards', label: 'Agent cards, with Chat', locate: (p) => p.getByRole('link', { name: /^Aria/ }) },
			{ id: 'describe-agent', label: 'Describe an agent', locate: (p) => p.getByRole('textbox', { name: 'Describe an agent' }) },
			{ id: 'templates', label: 'Templates', locate: (p) => p.getByRole('heading', { name: 'Start from a template' }) }
		],
		spots: [{ id: 'blank-agent', label: 'Blank agent', locator: btn(/Blank agent/) }],
		prepare: async (s) => {
			await s.go('#/app/agents');
			await s.page.getByRole('heading', { name: 'Start from a template' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	// ── Knowledge bases ────────────────────────────────────────────────────────────────────────────
	{
		name: 'kb-new',
		page: 'app/knowledge-bases/create',
		route: '#/app/knowledges',
		alt: "The New knowledge base dialog: Name (Support answers), What's in it, a Sources drop zone with Web page and Paste text buttons, Who can read it with Cloud OK selected and Device only, the Search engine line (all-MiniLM-L6-v2 on this device), and Cancel and Create buttons.",
		spots: [
			{ id: 'name', label: 'Name', locator: inDialog((d) => d.getByRole('textbox', { name: 'Name', exact: true })) },
			{ id: 'description', label: "What's in it", locator: inDialog((d) => d.getByRole('textbox', { name: /What's in it/ })) },
			{ id: 'sources', label: 'Sources: drop files, Web page or Paste text', locator: inDialog((d) => d.getByRole('button', { name: /^Drop files here/ })) },
			{ id: 'privacy', label: 'Who can read it', locator: inDialog((d) => d.getByRole('radiogroup', { name: 'Privacy' })) },
			{ id: 'search-engine', label: 'Search engine', locator: inDialog((d) => d.getByRole('button', { name: /^Search engine/ })) },
			{ id: 'create', label: 'Create', locator: inDialog((d) => d.getByRole('button', { name: /^Create/ })) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.go('#/app/knowledges');
			await s.page.getByRole('button', { name: 'New knowledge base' }).first().click({ timeout: T });
			const d = s.page.getByRole('dialog');
			await d.getByRole('textbox', { name: 'Name', exact: true }).fill('Support answers');
			await d.getByRole('textbox', { name: /What's in it/ }).fill('Help-centre articles and saved replies about orders and refunds');
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'kb-add-sources',
		page: 'app/knowledge-bases/create',
		route: '#/app/knowledges/<id>',
		alt: 'The Add sources to Product handbook dialog: a note that sources are indexed on this device with MiniLM and nothing is uploaded, the Files, Web pages and Paste text tabs, a drop zone for PDF, TXT, MD, CSV, JSON and HTML files, the Chunking · Automatic option and a Done button.',
		spots: [
			{ id: 'tabs', label: 'Files, Web pages and Paste text tabs', locator: inDialog((d) => d.getByRole('tablist')) },
			{ id: 'drop-files', label: 'Drop files or browse', locator: inDialog((d) => d.getByRole('button', { name: /^Drop files/ })) },
			{ id: 'chunking', label: 'Chunking', locator: inDialog((d) => d.getByRole('button', { name: /^Chunking/ })) },
			{ id: 'done', label: 'Done', locator: inDialog((d) => d.getByRole('button', { name: 'Done' })) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.knowledgeBase();
			if (!/#\/app\/knowledges\/[^/?]+/.test(s.page.url())) {
				await s.go('#/app/knowledges');
				await s.page.getByText('Product handbook').first().click({ timeout: T });
			}
			await s.page.getByRole('button', { name: 'Add sources' }).first().click({ timeout: T });
			await s.page.getByRole('dialog').getByRole('tablist').waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'kb-test-search',
		page: 'app/knowledge-bases/test-search',
		route: '#/app/knowledges/<id>',
		alt: "The Test search tab of the Product handbook knowledge base: a Question box with a question typed in and a Search button, and the Search as panel: Who's asking (Aria · default model), When to look things up, Passages, Search mode (Hybrid or Vector), Prefer different sources (MMR) and Rerank on this device. No search has been run yet.",
		spots: [
			{ id: 'test-search-tab', label: 'Test search tab', locator: (p) => p.getByRole('tab', { name: 'Test search' }) },
			{ id: 'question', label: 'Question', locator: (p) => p.getByRole('textbox', { name: 'Question' }) },
			{ id: 'search', label: 'Search', locator: (p) => p.getByRole('region', { name: 'Results' }).getByRole('button', { name: 'Search' }) },
			{ id: 'whos-asking', label: "Search as: who's asking", locator: (p) => p.getByRole('combobox', { name: "Who's asking" }) },
			{ id: 'search-mode', label: 'Search mode', locator: (p) => p.getByRole('group', { name: 'Search mode' }) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.knowledgeBase();
			await s.page.getByRole('tab', { name: 'Test search' }).click({ timeout: T });
			await s.page.getByRole('textbox', { name: 'Question' }).fill("What's the refund window?");
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'kb-settings',
		page: 'app/knowledge-bases/manage',
		route: '#/app/knowledges/<id>',
		alt: 'The Settings tab of the Product handbook knowledge base: Search engine all-MiniLM-L6-v2 (default) on this device with a Re-embed with… button, Privacy with the On this device only switch, Export to an .awkb file, and Delete knowledge base with a Delete… button.',
		spots: [
			{ id: 'settings-tab', label: 'Settings tab', locator: (p) => p.getByRole('tab', { name: 'Settings' }) },
			{ id: 're-embed', label: 'Re-embed with…', locator: btn('Re-embed with…') },
			{ id: 'device-only', label: 'On this device only', locator: (p) => p.getByRole('switch', { name: 'On this device only' }) },
			{ id: 'export', label: 'Export', locator: btn('Export', true) },
			{ id: 'delete', label: 'Delete…', locator: btn('Delete…') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.knowledgeBase();
			await s.page.getByRole('tab', { name: 'Settings' }).click({ timeout: T });
			await s.page.getByRole('button', { name: 'Re-embed with…' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'kb-list',
		page: 'app/knowledge-bases/export-import-backup',
		route: '#/app/knowledges',
		alt: 'The Knowledge bases page with one knowledge base, Product handbook, and a toolbar with search, Import and New knowledge base.',
		spots: [
			{ id: 'import', label: 'Import', locator: btn('Import', true) },
			{ id: 'new-knowledge-base', label: 'New knowledge base', locator: btn('New knowledge base') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.knowledgeBase();
			await s.go('#/app/knowledges');
			await s.page.getByText('Product handbook').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'kb-import',
		page: 'app/knowledge-bases/export-import-backup',
		route: '#/app/knowledges',
		alt: 'The Import a knowledge base dialog after choosing product-handbook.awkb, a file exported from the Product handbook knowledge base: an editable Name, then Embedding model None (empty), Content 0 chunks · 0 sources and the file size, with Choose another file, Cancel and Import.',
		note: 'The .awkb file is a real export of the (empty) Product handbook knowledge base, made with Settings › Export in the same session.',
		spots: [
			{ id: 'choose-file', label: 'Choose another file', locator: inDialog((d) => d.getByRole('button', { name: 'Choose another file' })) },
			{ id: 'name', label: 'Name', locator: inDialog((d) => d.getByRole('textbox', { name: 'Name' })) },
			{ id: 'details', label: 'Embedding model, content and file', locator: inDialog((d) => d.getByText('Embedding model')) },
			{ id: 'import', label: 'Import', locator: inDialog((d) => d.getByRole('button', { name: 'Import', exact: true })) }
		],
		prepare: async (s) => {
			const p = s.page;
			await closeOverlays(s);
			await s.knowledgeBase();
			await s.go('#/app/knowledges');
			await p.getByText('Product handbook').first().click({ timeout: T });
			await p.getByRole('tab', { name: 'Settings' }).click({ timeout: T });
			const download = p.waitForEvent('download', { timeout: T });
			await p.getByRole('button', { name: 'Export', exact: true }).click({ timeout: T });
			const file = join(mkdtempSync(join(tmpdir(), 'awflow-awkb-')), 'product-handbook.awkb');
			await (await download).saveAs(file);
			await s.go('#/app/knowledges');
			await p.getByRole('button', { name: 'Import', exact: true }).first().click({ timeout: T });
			await p.getByRole('dialog').locator('input[type=file]').setInputFiles(file);
			await p.getByRole('dialog').getByRole('button', { name: 'Choose another file' }).waitFor({ timeout: T });
			await p.waitForTimeout(500);
		}
	},
	// ── Memory ─────────────────────────────────────────────────────────────────────────────────────
	{
		name: 'memory-storage',
		page: 'app/memory/free-space',
		route: '#/app/memory/storage',
		alt: 'The Storage tab of Memory: 13.9 KB of memory split by content, tiles for Aria & quick chats, Workflow conversations, Facts and Easy to free, the filters Largest first, Easy to free, Not opened in 90 days, No owner and Workflow deleted, and the conversation table with two chats selected. The selection bar shows 2 selected with Slim, Archive and Delete, each with what it frees.',
		spots: [
			{ id: 'filters', label: 'Filters, such as Easy to free', locator: btn(/^Easy to free/) },
			{ id: 'select', label: 'Select a conversation', locator: (p) => p.getByRole('checkbox', { name: `Select ${CHAT_TITLE}` }) },
			{ id: 'slim', label: 'Slim', locator: btn(/^Slim/) },
			{ id: 'archive', label: 'Archive', locator: btn(/^Archive/) },
			{ id: 'delete', label: 'Delete', locator: btn(/^Delete · frees/) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.importMemory();
			await s.go('#/app/memory/storage');
			await s.page.getByRole('checkbox', { name: `Select ${CHAT_TITLE}` }).click({ timeout: T });
			await s.page.getByRole('checkbox', { name: 'Select Draft a reply to Sam' }).click({ timeout: T });
			await s.page.getByRole('button', { name: /^Slim/ }).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'memory-facts',
		page: 'app/memory/facts',
		route: '#/app/memory/facts',
		alt: "The Facts tab of Memory: Remembered by lists Aria with 3 facts; Aria's facts are Prefers short answers with a summary at the end, Writes to clients in French and Works in product operations, each with Edit and Forget buttons, under Add a fact and Export.",
		spots: [
			{ id: 'owner', label: 'Remembered by: pick an owner', locator: btn(/^Aria Your assistant/) },
			{ id: 'add-fact', label: 'Add a fact', locator: btn('Add a fact') },
			{ id: 'edit', label: 'Edit fact', locator: btn('Edit fact') },
			{ id: 'forget', label: 'Forget this fact', locator: btn('Forget this fact') },
			{ id: 'export', label: "Export this owner's facts", locator: btn('Export', true) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.importMemory();
			await s.go('#/app/memory/facts');
			await s.page.getByText('Writes to clients in French').first().waitFor({ timeout: T });
			const gotIt = s.page.getByRole('button', { name: 'Got it' });
			if (await gotIt.count()) await gotIt.first().click({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'memory-export',
		page: 'app/memory/export-import',
		route: '#/app/memory',
		alt: 'The Export memory dialog opened from Export all: every conversation and fact on this device in one .awmem file, a Protect with a passphrase checkbox, and Cancel and Export buttons.',
		spots: [
			{ id: 'export-all', label: 'Export all', locator: btn('Export all') },
			{ id: 'passphrase', label: 'Protect with a passphrase', locator: inDialog((d) => d.getByRole('checkbox', { name: /^Protect with a passphrase/ })) },
			{ id: 'export', label: 'Export', locator: inDialog((d) => d.getByRole('button', { name: 'Export', exact: true })) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.importMemory();
			await s.go('#/app/memory');
			await s.page.getByRole('button', { name: 'Export all' }).click({ timeout: T });
			await s.page.getByRole('dialog').getByRole('checkbox').first().waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'memory-import',
		page: 'app/memory/export-import',
		route: '#/app/memory',
		alt: 'The Import memory dialog after choosing an .awmem file: a preview of the conversations, messages and facts it holds and when it was exported, with Cancel and Import buttons.',
		note: 'The .awmem file is generated by scripts/capture/lib/awmem.ts; the dialog is closed without importing.',
		spots: [
			{ id: 'preview', label: 'Preview: what the file holds', locator: (p) => p.locator('[data-testid="awmem-import-preview"]') },
			{ id: 'import', label: 'Import', locator: inDialog((d) => d.getByRole('button', { name: 'Import', exact: true })) }
		],
		prepare: async (s) => {
			const p = s.page;
			await closeOverlays(s);
			await s.go('#/app/memory');
			await p.getByRole('button', { name: 'Import' }).first().click({ timeout: T });
			const dialog = p.getByRole('dialog');
			await dialog
				.locator('[data-testid="awmem-import-file"]')
				.setInputFiles({ name: 'my-memory.awmem', mimeType: 'application/json', buffer: Buffer.from(buildAwmem()) });
			await dialog.locator('[data-testid="awmem-import-preview"]').waitFor({ timeout: T });
			await p.waitForTimeout(500);
		}
	},
	// ── Local AI ───────────────────────────────────────────────────────────────────────────────────
	{
		name: 'local-models-compare',
		page: 'app/local-models-compare',
		route: '#/app/local-models',
		alt: 'The Local AI page with Llama 3.2 1B Instruct and Llama 3.2 3B Instruct ticked for comparison: their compare checkboxes are checked and a bar at the bottom lists both models with a Compare (2) button and Clear.',
		spots: [
			{ id: 'first-model', label: 'Compare checkbox on a model', locator: (p) => p.getByRole('button', { name: /^Llama 3\.2 1B Instruct/ }).getByRole('button', { name: 'Remove from comparison' }) },
			{ id: 'second-model', label: 'Compare checkbox on another model of the same task', locator: (p) => p.getByRole('button', { name: /^Llama 3\.2 3B Instruct/ }).getByRole('button', { name: 'Remove from comparison' }) },
			{ id: 'compare', label: 'Compare (2)', locator: btn(/^Compare \(2\)/) }
		],
		prepare: async (s) => {
			const p = s.page;
			await closeOverlays(s);
			await p.goto('about:blank');
			await s.go('#/app/local-models');
			await p.getByText('Llama 3.2 1B Instruct').first().waitFor({ timeout: T });
			for (const m of [/^Add to comparison Llama 3\.2 1B/, /^Add to comparison Llama 3\.2 3B/])
				await p.getByRole('button', { name: m }).getByRole('button', { name: 'Add to comparison' }).first().click({ timeout: T });
			await p.getByRole('button', { name: /^Compare \(2\)/ }).waitFor({ timeout: T });
			await p.waitForTimeout(500);
		}
	},
	{
		name: 'local-models-install',
		page: 'app/local-models-install',
		route: '#/app/local-models',
		alt: 'The detail view of Llama 3.2 1B Instruct on the Local AI page, scrolled to Use it in (Web LLM, Transformers Chat, Run Local Model) and Variants: four precisions (q4f16_1 ≈ 879 MB, q4f32_1 ≈ 1.1 GB, q0f16 ≈ 2.5 GB, q0f32 ≈ 5.0 GB), each with an Install button.',
		spots: [
			{ id: 'variants', label: 'Variants', locator: (p) => p.getByRole('heading', { name: /^Variants/ }) },
			{ id: 'install', label: 'Install a variant', locator: inDialog((d) => d.getByRole('button', { name: 'Install', exact: true })) }
		],
		prepare: async (s) => {
			const p = s.page;
			await closeOverlays(s);
			await p.goto('about:blank');
			await s.go('#/app/local-models');
			await p.getByText('Llama 3.2 1B Instruct').first().click({ timeout: T });
			const variants = p.getByRole('heading', { name: /^Variants/ });
			await variants.waitFor({ timeout: T });
			await p.getByRole('heading', { name: 'Use it in' }).scrollIntoViewIfNeeded();
			await variants.evaluate((el) => el.scrollIntoView({ block: 'center' }));
			await p.waitForTimeout(800);
		}
	},
	{
		name: 'local-models-custom',
		page: 'app/local-models-custom',
		route: '#/app/local-models',
		needsNetwork: true,
		alt: "Step 1 of 2 of Add a custom model: the Transformers.js engine is selected, the Hugging Face model id is Xenova/vit-base-patch16-224, and a green box shows what was detected from the model's config (task Image classification, input Image, 1000 labels, ONNX · about 84 MB), above Use it as, Display name and Continue.",
		note: "The task is detected from the model's Hugging Face metadata at capture time, so this shot needs the network.",
		spots: [
			{ id: 'engine', label: 'Engine', locator: inDialog((d) => d.getByRole('button', { name: 'Transformers.js' })) },
			{ id: 'model-id', label: 'Hugging Face model id', locator: inDialog((d) => d.getByRole('textbox').first()) },
			{ id: 'detected', label: 'Detected task', locator: inDialog((d) => d.getByText("Detected from the model's config")) },
			{ id: 'use-it-as', label: 'Use it as', locator: inDialog((d) => d.getByRole('combobox', { name: /^Use it as/ })) },
			{ id: 'continue', label: 'Continue', locator: inDialog((d) => d.getByRole('button', { name: 'Continue' })) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await customModel(s);
		}
	},
	{
		name: 'local-models-custom-trust',
		page: 'app/local-models-custom',
		route: '#/app/local-models',
		needsNetwork: true,
		alt: "Step 2 of 2 of Add a custom model, Only add models you trust: Xenova/vit-base-patch16-224 (Transformers.js), a warning that the model isn't reviewed by awflow and is downloaded from huggingface.co, the I trust this source and want to add the model checkbox, and Back and Add & download (84 MB) buttons.",
		spots: [
			{ id: 'trust', label: 'I trust this source', locator: inDialog((d) => d.getByRole('checkbox', { name: /^I trust this source/ })) },
			{ id: 'add-download', label: 'Add & download', locator: inDialog((d) => d.getByRole('button', { name: /^Add & download/ })) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await customModel(s);
			await s.page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click({ timeout: T });
			await s.page.getByRole('heading', { name: 'Only add models you trust' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	// ── Chat, projects, agents, teams ──────────────────────────────────────────────────────────────
	{
		name: 'aria-composer',
		page: 'app/chat-and-agents/chat',
		route: '#/app/assistant',
		alt: "A new chat with Aria: the greeting, then the composer with the Ask Aria anything box, the Add context (+), Attach files and Dictate buttons, the Chat and Build switch, the context meter, the model picker set to Gemini Nano and the send button, above suggestion cards.",
		spots: [
			{ id: 'message', label: 'Message box', locator: (p) => p.getByRole('textbox', { name: 'Ask Aria anything…' }) },
			{ id: 'add-context', label: 'Add context (+)', locator: btn('Add context') },
			{ id: 'attach', label: 'Attach files', locator: btn('Attach files') },
			{ id: 'dictate', label: 'Dictate', locator: btn('Dictate (on-device)') },
			{ id: 'chat-build', label: 'Chat or Build', locator: btn('Build', true) },
			{ id: 'context-meter', label: 'Context meter', locator: btn(/^Context window/) },
			{ id: 'model-picker', label: 'Model picker', locator: btn('Gemini Nano') },
			{ id: 'send', label: 'Send', locator: btn('Submit') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await s.assistant();
			await s.page.getByRole('button', { name: 'New chat' }).first().click({ timeout: T });
			await s.page.getByRole('textbox', { name: 'Ask Aria anything…' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'project-new',
		page: 'app/chat-and-agents/projects',
		route: '#/app/assistant',
		alt: 'The New project dialog over the Assistant: Name (Lisbon move), a colour, Instructions about the family budget, a Files drop zone indexed on this device, Default agent or team set to Aria, and Cancel and Create project buttons.',
		spots: [
			{ id: 'new-project', label: '+ New next to Projects', locator: (p) => p.getByText('+ New').first() },
			{ id: 'name', label: 'Name', locator: inDialog((d) => d.getByRole('textbox', { name: 'Name' })) },
			{ id: 'colour', label: 'Colour', locator: inDialog((d) => d.getByRole('radiogroup', { name: 'Colour' })) },
			{ id: 'instructions', label: 'Instructions', locator: inDialog((d) => d.getByRole('textbox', { name: /^Instructions/ })) },
			{ id: 'files', label: 'Files', locator: inDialog((d) => d.getByRole('button', { name: /^Drop PDFs/ })) },
			{ id: 'default-agent', label: 'Default agent or team', locator: inDialog((d) => d.getByRole('combobox', { name: /^Default agent or team/ })) },
			{ id: 'create', label: 'Create project', locator: inDialog((d) => d.getByRole('button', { name: 'Create project' })) }
		],
		prepare: async (s) => {
			const p = s.page;
			await closeOverlays(s);
			await s.assistant();
			// The Meet Aria card can replace the composer a moment after it first renders.
			const start = p.getByRole('button', { name: /Start chatting/ }).filter({ visible: true });
			const add = p.getByText('+ New').filter({ visible: true });
			for (let i = 0; i < 30 && !(await add.count()); i++) {
				if (await start.count()) await start.first().click({ timeout: T });
				await p.waitForTimeout(500);
			}
			await add.first().click({ timeout: T });
			const d = p.getByRole('dialog');
			await d.getByRole('textbox', { name: 'Name' }).fill('Lisbon move', { timeout: T });
			await d.getByRole('textbox', { name: /^Instructions/ }).fill('We are a family of 3. Budget €1,400/month rent. Answer in English, prices in euros.');
			await p.waitForTimeout(500);
		}
	},
	{
		name: 'agent-identity',
		page: 'app/chat-and-agents/agent-builder',
		route: '#/app/agents/<id>',
		alt: "The Identity tab of the agent builder for a new agent, Price checker: the look options (color, texture, eyes, accessory) above the Name, One-line role, Greeting and Conversation starters fields, with the builder tabs on the left and a preview of the agent in the list, a new chat and a team thread on the right.",
		note: 'The agent is created with Blank agent during capture and stays in the session.',
		spots: [
			{ id: 'tabs', label: 'Builder tabs', locator: btn(/^Identity/) },
			{ id: 'name', label: 'Name', locator: (p) => p.getByRole('textbox', { name: /^Name/ }) },
			{ id: 'role', label: 'One-line role', locator: (p) => p.getByRole('textbox', { name: /^One-line role/ }) },
			{ id: 'done', label: 'Done', locator: btn('Done', true) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await agentBuilder(s, 'Identity');
			await s.page.getByRole('textbox', { name: /^Name/ }).evaluate((el) => el.scrollIntoView({ block: 'center' }));
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'agent-instructions',
		page: 'app/chat-and-agents/agent-builder',
		route: '#/app/agents/<id>',
		alt: 'The Instructions tab of the agent builder for Price checker: Write and Generate from a description, the insert chips {today}, {my name}, {current tab} and {memory}, Improve with Aria, and the instructions editor with Your job, How to work and Never sections. On the right, the Try it panel shows what is in effect (Same as Aria, Rules: Balanced, 25 steps) and a message box.',
		spots: [
			{ id: 'tab', label: 'Instructions tab', locator: btn(/^Instructions/) },
			{ id: 'editor', label: 'Instructions', locator: (p) => p.getByRole('textbox', { name: 'Instructions' }) },
			{ id: 'improve', label: 'Improve with Aria', locator: btn('Improve with Aria') },
			{ id: 'try-it', label: 'Try it: message the agent', locator: (p) => p.getByRole('textbox', { name: /^Ask / }) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await agentBuilder(s, 'Instructions');
			const editor = s.page.getByRole('textbox', { name: 'Instructions' });
			await editor.click({ timeout: T });
			await s.page.keyboard.press('ControlOrMeta+a');
			await s.page.keyboard.type(
				'# Your job\nEvery Monday, check the pricing pages I give you and tell me what changed.\n\n# How to work\n- Compare with last week\n- List changes as a short table\n\n# Never\n- Buy or sign up for anything'
			);
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'agent-model',
		page: 'app/chat-and-agents/agent-builder',
		route: '#/app/agents/<id>',
		alt: 'The Model tab of the agent builder for Price checker: Choose a model with Same as Aria selected and on-device models to download (Llama 3.2 1B and 3B Instruct), then Behaviour: Creativity, Max steps per task (25) and Fall back to on-device when offline.',
		spots: [
			{ id: 'tab', label: 'Model tab', locator: btn(/^Model/) },
			{ id: 'choose-model', label: 'Choose a model', locator: (p) => p.getByRole('radiogroup', { name: 'Model' }) },
			{ id: 'max-steps', label: 'Max steps per task', locator: text('Max steps per task') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await agentBuilder(s, 'Model');
			await s.page.getByRole('radiogroup', { name: 'Model' }).waitFor({ timeout: T });
		}
	},
	{
		name: 'agent-skills',
		page: 'app/chat-and-agents/agent-builder',
		route: '#/app/agents/<id>',
		alt: 'The Skills tab of the agent builder for Price checker: switches for Browser control, Web search, Workflows, On-device AI (on, Allowed), Teammates and MCP servers. In the web app, Browser control and Web search say they need the AWFlow extension.',
		spots: [
			{ id: 'tab', label: 'Skills tab', locator: btn(/^Skills/) },
			{ id: 'skill-switch', label: 'Turn a skill on', locator: (p) => p.getByRole('switch', { name: 'Workflows' }) }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await agentBuilder(s, 'Skills');
			await s.page.getByRole('switch', { name: 'Workflows' }).waitFor({ timeout: T });
		}
	},
	{
		name: 'team-goal',
		page: 'app/chat-and-agents/teams',
		route: '#/app/teams/new',
		alt: 'Step 1 Goal of the New team wizard: Name (Trip crew) and Goal (Plan short trips end-to-end: research, find stays, write the itinerary. Never pay.), with the steps Goal, Members, How they work and Rules & limits at the top and Suggest members at the bottom right.',
		spots: [
			{ id: 'name', label: 'Name', locator: (p) => p.getByRole('textbox', { name: 'Name' }) },
			{ id: 'goal', label: 'Goal', locator: (p) => p.getByRole('textbox', { name: 'Goal' }) },
			{ id: 'suggest-members', label: 'Suggest members', locator: btn('Suggest members') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await teamWizard(s, 1);
		}
	},
	{
		name: 'team-members',
		page: 'app/chat-and-agents/teams',
		route: '#/app/teams/new',
		alt: 'Step 2 Members of the New team wizard for Trip crew: Aria as Lead with the role Splits requests, merges the answer, and a suggested new agent, Stay finder, with Make lead, a role field and Create Stay finder. On the right, Add from your agents with a search box and a Create a new agent field.',
		spots: [
			{ id: 'lead', label: 'Lead', locator: (p) => p.getByText('Lead', { exact: true }) },
			{ id: 'role', label: 'Role in this team', locator: (p) => p.getByRole('textbox', { name: 'Role in this team' }).last() },
			{ id: 'add-agents', label: 'Add from your agents', locator: text('Add from your agents') },
			{ id: 'continue', label: 'Continue', locator: btn('Continue') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await teamWizard(s, 2);
		}
	},
	{
		name: 'team-how',
		page: 'app/chat-and-agents/teams',
		route: '#/app/teams/new',
		alt: 'Step 3 How they work of the New team wizard: the coordination modes Lead routes (recommended, selected), Pipeline and Open table, a diagram of who can hand work to whom (Aria, the lead, assigns to Stay finder), and team-thread switches such as Show agent-to-agent messages and Agents work in parallel.',
		spots: [
			{ id: 'mode', label: 'How the team coordinates', locator: text('How the team coordinates') },
			{ id: 'handoffs', label: 'Who can hand work to whom', locator: text('Who can hand work to whom') },
			{ id: 'thread-options', label: 'In team threads', locator: text('In team threads') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await teamWizard(s, 3);
		}
	},
	{
		name: 'team-rules',
		page: 'app/chat-and-agents/teams',
		route: '#/app/teams/new',
		alt: 'Step 4 Rules & limits of the New team wizard: Team rules (Submitting any form, Opening new sites, Using your own open tabs, Running workflows), where approvals go, Limits per thread (max steps, handoffs, agents at once, cloud tokens), Shared by the team, a summary, and the Create team and Create & start a thread buttons.',
		spots: [
			{ id: 'team-rules', label: 'Team rules', locator: text('Team rules') },
			{ id: 'limits', label: 'Limits per thread', locator: text('Limits per thread') },
			{ id: 'create-team', label: 'Create team', locator: btn('Create team', true) },
			{ id: 'create-start', label: 'Create & start a thread', locator: btn('Create & start a thread') }
		],
		prepare: async (s) => {
			await closeOverlays(s);
			await teamWizard(s, 4);
		}
	},
];
