/** Shots for the ai docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, btn, link, text } from './define.ts';
import { T } from '../lib/session.ts';
import { CHAT_TITLE } from '../lib/awmem.ts';

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
		prepare: async (s) => {
			await s.go('#/app/agents');
			await s.page.getByRole('heading', { name: 'Start from a template' }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
];
