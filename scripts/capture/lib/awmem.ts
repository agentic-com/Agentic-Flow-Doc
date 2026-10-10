import { createHash } from 'node:crypto';

/**
 * Builds a small `.awmem` memory export (the app's own import format, see the app's
 * `src/lib/memory/awmem.ts`). It is imported through the Memory page's Import dialog so the
 * Memory and chat screenshots show real stored conversations without needing a model.
 */

type Turn = { role: 'user' | 'assistant'; content: string };
type Conv = { id: string; title: string; turns: Turn[]; minutesAgo: number };

const CONVERSATIONS: Conv[] = [
	{
		id: 'docs-capture-webhooks',
		title: 'What a webhook is',
		minutesAgo: 12,
		turns: [
			{ role: 'user', content: 'In two sentences: what is a webhook?' },
			{
				role: 'assistant',
				content:
					'A webhook is a URL that one app calls to tell another app that something happened, such as a new order or a form submission.\n\nInstead of checking for changes again and again, your workflow simply waits for that call and starts when it arrives.'
			},
			{ role: 'user', content: 'Can AWFlow start a workflow from one?' },
			{
				role: 'assistant',
				content:
					'Not directly: a browser extension cannot receive incoming calls. Use a **Poll Until** node to check a URL on a schedule, or start the workflow from a page event, a shortcut or the right-click menu.'
			}
		]
	},
	{
		id: 'docs-capture-reply',
		title: 'Draft a reply to Sam',
		minutesAgo: 60 * 26,
		turns: [
			{ role: 'user', content: 'Draft a short, friendly reply saying the report will be ready on Friday.' },
			{
				role: 'assistant',
				content: 'Hi Sam,\n\nThanks for checking in. The report will be ready on Friday, and I will send it over as soon as it is done.\n\nBest regards'
			}
		]
	},
	{
		id: 'docs-capture-regex',
		title: 'Regex for order numbers',
		minutesAgo: 60 * 50,
		turns: [
			{ role: 'user', content: 'Give me a regex that matches order numbers like ORD-2026-00123.' },
			{ role: 'assistant', content: 'Use `ORD-\\d{4}-\\d{5}`. It matches "ORD-", a four-digit year, a dash and five digits.' }
		]
	}
];

const FACTS = [
	'Prefers short answers with a summary at the end',
	'Writes to clients in French',
	'Works in product operations'
];

/** The `.awmem` JSON text, with the checksum the app verifies on import. */
export function buildAwmem(now = new Date()): string {
	const conversations = CONVERSATIONS.map((c) => {
		const end = new Date(now.getTime() - c.minutesAgo * 60_000);
		const messages = c.turns.map((t, i) => ({
			id: `${c.id}-m${i + 1}`,
			conversationId: c.id,
			seq: i + 1,
			role: t.role,
			content: t.content,
			status: 'done',
			bytes: t.content.length,
			timestamp: new Date(end.getTime() - (c.turns.length - 1 - i) * 30_000).toISOString()
		}));
		const bytes = messages.reduce((n, m) => n + m.bytes, 0);
		return {
			conversation: {
				id: c.id,
				kind: 'aria',
				title: c.title,
				tags: [],
				messageCount: messages.length,
				lastMessage: c.turns[c.turns.length - 1].content.slice(0, 200),
				lastSeq: messages.length,
				bytes,
				bytesByKind: { text: bytes, tools: 0, reasoning: 0, variants: 0, build: 0, attachments: 0, other: 0, search: 0 },
				createdAt: messages[0].timestamp,
				updatedAt: messages[messages.length - 1].timestamp
			},
			messages
		};
	});
	const payload = JSON.stringify({
		format: 'awmem',
		version: 1,
		exportedAt: now.toISOString(),
		conversations,
		facts: FACTS.map((text) => ({ owner: 'aria', text }))
	});
	const checksum = createHash('sha256').update(payload).digest('hex');
	return `${payload.slice(0, -1)},"checksum":"${checksum}"}`;
}

/** Title of the conversation the chat screenshot opens. */
export const CHAT_TITLE = CONVERSATIONS[0].title;
