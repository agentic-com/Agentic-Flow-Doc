/**
 * Structured release notes (awflow/Agentic-Flow#1345).
 *
 * One entry per published version, newest first. This file feeds:
 * - the /releases/ timeline (ReleaseTimeline.svelte),
 * - the New / Improved / Fixed groups on each version page (ReleaseChanges.svelte),
 * - the RSS feed at /releases/rss.xml (src/pages/releases/rss.xml.ts).
 *
 * Rules (checked at build time by rss.xml.ts and by `bun scripts/releases/check.ts`):
 * - every `new` change links to the docs page that explains it;
 * - links are site-relative docs paths ending in `/` (an `#anchor` is allowed);
 * - the version page lives at /releases/v{major}-{minor}-{patch}/ — the extension opens that URL.
 *
 * Draft a new entry with `bun scripts/releases/draft.ts --from <ref> --to <ref>` (see CONTRIBUTING.md).
 */

export type ChangeKind = 'new' | 'improved' | 'fixed';

export const AREAS = [
	'Aria & agents',
	'Memory',
	'Knowledge',
	'Workflows',
	'Nodes',
	'Local AI',
	'Marketplace',
	'Integrations',
	'App',
	'Security',
] as const;

export type Area = (typeof AREAS)[number];

interface ChangeBase {
	area: Area;
	/** One sentence, user-facing, no trailing link text. */
	text: string;
}

/** A `new` change must point at the page that documents it. */
export type Change =
	| (ChangeBase & { kind: 'new'; link: string; label: string })
	| (ChangeBase & { kind: 'improved' | 'fixed'; link?: string; label?: string });

export interface Release {
	/** Semver without the `v`, e.g. "0.8.2". */
	version: string;
	/** ISO date the version was published. */
	date: string;
	/** Where the release applies. */
	browsers: string[];
	/** Headline-style title: what the release means for you. */
	headline: string;
	/** One-line summary. */
	summary: string;
	/** Short line for the collapsed card on the timeline. */
	teaser?: string;
	/** True when the release changes behaviour you may need to act on (see breaking-changes). */
	breaking?: boolean;
	changes: Change[];
}

export const KIND_LABEL: Record<ChangeKind, string> = { new: 'New', improved: 'Improved', fixed: 'Fixed' };

const CHROME_AND_WEB = ['Chrome', 'Web app'];

export const RELEASES: Release[] = [
	{
		version: '0.8.2',
		date: '2026-10-10',
		browsers: CHROME_AND_WEB,
		headline: 'Memory you can see and manage — plus a safer Marketplace',
		summary:
			'Chats, workflow conversations and learned facts now live in one store on your device, with a Memory page to search, export and clean them up. Marketplace installs update in one click and their access is checked on your device.',
		teaser: 'One Memory page · suggested facts · one Chat Memory node · one-click Marketplace updates · Stop sharing.',
		breaking: true,
		changes: [
			{ kind: 'new', area: 'Memory', text: 'A Memory page for every conversation, fact and the space they take, with search inside messages.', link: '/app/memory/overview/', label: 'Memory' },
			{ kind: 'new', area: 'Memory', text: 'Settings › Storage shows everything AWFlow keeps in your browser, with an opt-in automatic clean-up.', link: '/app/memory/storage/', label: 'Storage & clean-up' },
			{ kind: 'new', area: 'Memory', text: '“Remember this?” suggests facts and saves them only when you confirm; each message recalls the most relevant facts.', link: '/app/chat-and-agents/memory/', label: 'Assistant memory' },
			{ kind: 'new', area: 'Nodes', text: 'One Chat Memory node replaces Local Memory, Persistent Chat Memory and Window Buffer Memory.', link: '/nodes/builtin/ai/aidependencies/chatmemories/chatmemory/', label: 'Chat Memory' },
			{ kind: 'new', area: 'Aria & agents', text: 'View summary and Compact now for long chats, and a context meter that shows how many facts went in.', link: '/app/chat-and-agents/chat/#context-meter', label: 'Chat with Aria' },
			{ kind: 'new', area: 'Aria & agents', text: 'Canvas dock chats are saved with their workflow and reopen next time.', link: '/app/chat-and-agents/building-workflows-in-chat/#canvas-dock-chats', label: 'Building workflows in chat' },
			{ kind: 'new', area: 'Marketplace', text: 'Update an installed workflow in one click, with the release notes and access changes shown first, or Make it mine.', link: '/app/workflows/publishing/#using-shared-workflows', label: 'Using shared workflows' },
			{ kind: 'new', area: 'Marketplace', text: 'Stop sharing removes a listing from the Marketplace while people who installed it keep their copy.', link: '/app/workflows/publishing/#stop-sharing-a-listing', label: 'Stop sharing a listing' },
			{ kind: 'new', area: 'Marketplace', text: 'Agent and team templates show What it can do before you install them.', link: '/app/chat-and-agents/templates/', label: 'Agent & team templates' },
			{ kind: 'improved', area: 'Marketplace', text: 'What a listing can access is checked on your device from the version’s own steps.', link: '/app/workflows/publishing/', label: 'Publishing workflows' },
			{ kind: 'improved', area: 'Marketplace', text: 'The secret scan catches more keys, tokens and webhook URLs and re-runs on every change.', link: '/app/workflows/publishing/', label: 'Publishing workflows' },
			{ kind: 'improved', area: 'Security', text: 'With Local secret protection on, conversation messages, summaries and facts are encrypted on this device.', link: '/app/account/secret-vault/', label: 'Secret vault' },
			{ kind: 'improved', area: 'Aria & agents', text: 'Team members who are handed work see the thread’s summary and last turns.', link: '/app/chat-and-agents/teams/', label: 'Teams' },
			{ kind: 'improved', area: 'Marketplace', text: 'Moderation test runs are isolated and decisions are tied to the exact version reviewed.' },
			{ kind: 'improved', area: 'App', text: 'Conversations are no longer limited by plans: they are stored on your device.' },
			{ kind: 'improved', area: 'App', text: 'A new logo, and Marketplace and memory strings translated into French, German and Chinese.' },
			{ kind: 'fixed', area: 'Marketplace', text: 'Installed workflows no longer fail with “its steps changed since you approved it” after a run wrote a URL.' },
			{ kind: 'fixed', area: 'Marketplace', text: 'An installed workflow is no longer blocked because AWFlow now classifies one of its nodes differently.' },
			{ kind: 'fixed', area: 'Memory', text: 'Facts longer than 500 characters are refused with a hint instead of being lost.' },
			{ kind: 'fixed', area: 'Memory', text: 'Conversations written by the old Persistent Chat Memory node are visible again, marked Recovered.', link: '/app/memory/overview/', label: 'Memory' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'A reply cut off by closing the tab is kept as interrupted, with Retry.' },
			{ kind: 'fixed', area: 'App', text: 'Sign-in no longer requests an extra token, and changing your password works on Firefox.' },
		],
	},
	{
		version: '0.8.1',
		date: '2026-10-07',
		browsers: CHROME_AND_WEB,
		headline: 'Knowledge bases on your device — and an AI harness you can watch',
		summary:
			'Collections of your own files, pages and notes that Aria, your agents and your workflows can search in the browser, plus a rebuilt engine that shows each step of a reply and stops cleanly.',
		teaser: 'Knowledge bases · hybrid search · work timeline · turn traces · dependable agents and teams.',
		breaking: true,
		changes: [
			{ kind: 'new', area: 'Knowledge', text: 'Knowledge bases: files, web pages and notes searchable by meaning and keyword, stored and searched in the browser.', link: '/app/knowledge-bases/overview/', label: 'Knowledge bases' },
			{ kind: 'new', area: 'Knowledge', text: 'Save to a knowledge base from a page, a selection or a chat.', link: '/app/knowledge-bases/save-from-anywhere/', label: 'Save from anywhere' },
			{ kind: 'new', area: 'Knowledge', text: 'Portable .awkb files to export a base and import it on another device.', link: '/app/knowledge-bases/export-import-backup/', label: 'Export & import' },
			{ kind: 'new', area: 'Aria & agents', text: 'A knowledge picker in chat with citations you can open, and a Knowledge tab for agents.', link: '/app/chat-and-agents/knowledge/', label: 'Knowledge in chats & agents' },
			{ kind: 'new', area: 'Aria & agents', text: 'A work timeline shows each model and tool step as it happens, with a reply receipt.', link: '/app/chat-and-agents/seeing-the-work/', label: 'Following Aria’s work' },
			{ kind: 'new', area: 'Aria & agents', text: 'Turn traces (Developer mode) show where the time and tokens of each reply went.', link: '/app/chat-and-agents/turn-traces/', label: 'Turn traces' },
			{ kind: 'improved', area: 'Knowledge', text: 'Hybrid keyword and vector search, with optional on-device reranking.', link: '/concepts/ai/rag/', label: 'RAG concepts' },
			{ kind: 'improved', area: 'Nodes', text: 'Workflow knowledge nodes gained hybrid search, MMR, metadata filters and a richer base picker.', link: '/nodes/builtin/ai/aidependencies/vectorstore/localknowledge/', label: 'Local Knowledge' },
			{ kind: 'improved', area: 'Aria & agents', text: 'Project files now use the same knowledge engine.', link: '/app/chat-and-agents/projects/', label: 'Projects' },
			{ kind: 'improved', area: 'Workflows', text: 'Node parameters Aria generates are validated against each node’s schema before a workflow is applied.', link: '/app/chat-and-agents/building-workflows-in-chat/', label: 'Building workflows in chat' },
			{ kind: 'improved', area: 'Local AI', text: 'Gemini Nano can call tools, and local models stream replies token by token even with tools bound.', link: '/nodes/builtin/ai/aidependencies/llm/chrome-ai/', label: 'Chrome AI' },
			{ kind: 'improved', area: 'Aria & agents', text: 'Workflow and MCP tools are locked by what they do, not by their name.', link: '/concepts/ai/action-approval/', label: 'Action approval' },
			{ kind: 'improved', area: 'Aria & agents', text: 'Stopping a reply is clean, and you are told about step limits, Auto fallbacks and skills that are off.' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'Agent approvals are queued, so approving one never declines another.', link: '/concepts/ai/action-approval/', label: 'Action approval' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'Aria keeps her skills inside team threads, and team-scoped memories are shared between members.', link: '/app/chat-and-agents/teams/', label: 'Teams' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'A team thread cut off by closing the app is shown and can be retried.' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'Cloud tokens are metered per model call, and the limit is enforced during a turn.' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'A clarifying question asked during a build survives a page reload.' },
			{ kind: 'fixed', area: 'App', text: 'Local database connections share one lock, which fixes hangs when several features open it at once.' },
		],
	},
	{
		version: '0.8.0',
		date: '2026-10-05',
		browsers: CHROME_AND_WEB,
		headline: 'Chat-first Aria with agents, teams and projects — plus flow control that survives a closed tab',
		summary:
			'Talk to Aria from anywhere in the browser, build agents with skills and memory, group them into teams, run AI on your device, and let long workflows pause and resume safely.',
		teaser: 'Chat-first Aria · agents & teams · projects · Local AI task nodes · durable Wait · 14 new nodes · engine fixes.',
		breaking: true,
		changes: [
			{ kind: 'new', area: 'Aria & agents', text: 'Chat with Aria from the right-click menu, the address bar, a shortcut or the notch.', link: '/app/chat-and-agents/entry-points/', label: 'Ways to open Aria' },
			{ kind: 'new', area: 'Aria & agents', text: 'Agents with their own skills, rules, memory and activity log.', link: '/app/chat-and-agents/agents/', label: 'Agents' },
			{ kind: 'new', area: 'Aria & agents', text: 'Teams of agents that hand work to each other in a shared thread.', link: '/app/chat-and-agents/teams/', label: 'Teams' },
			{ kind: 'new', area: 'Aria & agents', text: 'Projects group chats, files and agents.', link: '/app/chat-and-agents/projects/', label: 'Projects' },
			{ kind: 'new', area: 'Aria & agents', text: 'Live browser control and routines, so an agent can act on the page you are on, with safety checks.', link: '/app/chat-and-agents/browser-control/', label: 'Browser control & safety' },
			{ kind: 'new', area: 'Marketplace', text: 'Agent and team templates to start from a ready-made agent.', link: '/app/chat-and-agents/templates/', label: 'Agent & team templates' },
			{ kind: 'new', area: 'Aria & agents', text: 'A change plan before anything is applied, and highlighted nodes after a build.', link: '/app/chat-and-agents/building-workflows-in-chat/', label: 'Building workflows in chat' },
			{ kind: 'new', area: 'Local AI', text: 'Local AI task nodes: generate, summarise, translate, classify, caption, detect objects and transcribe on your device.', link: '/nodes/builtin/ai/localai/', label: 'Local AI' },
			{ kind: 'new', area: 'Local AI', text: 'A Local Models page to install, browse and delete in-browser models.', link: '/app/local-models/', label: 'Local models' },
			{ kind: 'new', area: 'Nodes', text: 'Wait of a minute or more survives closing the tab, for up to 30 days.', link: '/nodes/builtin/flow/wait/', label: 'Wait' },
			{ kind: 'new', area: 'Nodes', text: 'Poll Until checks a URL until your conditions hold or a deadline passes.', link: '/nodes/builtin/flow/polluntil/', label: 'Poll Until' },
			{ kind: 'new', area: 'Nodes', text: 'Split in Batches processes items in chunks, with durable checkpoints.', link: '/nodes/builtin/flow/splitinbatches/', label: 'Split in Batches' },
			{ kind: 'new', area: 'Workflows', text: 'A badge, a sound and a desktop notification when a run waits for you, with the card on the page you are on.', link: '/concepts/flow/waiting/', label: 'Waiting' },
			{ kind: 'new', area: 'Workflows', text: 'Continue On Fail and per-node retry with backoff.', link: '/concepts/flow/error-handling/', label: 'Error handling' },
			{ kind: 'new', area: 'Nodes', text: 'File nodes: Save as File, Convert to File, Extract From File, Compression, Edit Image and XML.', link: '/nodes/builtin/datatransformation/converttofile/', label: 'Convert to File' },
			{ kind: 'new', area: 'Nodes', text: 'Digest collects items across runs and releases them together.', link: '/nodes/builtin/core/digest/', label: 'Digest' },
			{ kind: 'new', area: 'Nodes', text: 'Hotkey Trigger starts a workflow from a keyboard shortcut.', link: '/nodes/builtin/trigger/hotkey/', label: 'Hotkey Trigger' },
			{ kind: 'new', area: 'Integrations', text: 'Readwise / Reader, Attio and Pipedrive integrations.', link: '/nodes/builtin/integration/readwise/', label: 'Readwise' },
			{ kind: 'new', area: 'Integrations', text: 'Mistral chat and Cohere embeddings.', link: '/nodes/builtin/ai/aidependencies/llm/mistral/', label: 'Mistral' },
			{ kind: 'new', area: 'Security', text: 'Anonymous usage telemetry with a Privacy settings section to turn it off.', link: '/app/privacy-and-data/', label: 'Privacy and data' },
			{ kind: 'improved', area: 'Workflows', text: 'A richer {{ }} expression language; $(\'label\') works for labels with spaces.', link: '/concepts/data/data-mapping/data-mapping-expressions/', label: 'Expressions' },
			{ kind: 'improved', area: 'Nodes', text: 'The Code node reads upstream data as input, and Python runs in an isolated worker.', link: '/nodes/builtin/core/code/', label: 'Code node' },
			{ kind: 'improved', area: 'Workflows', text: 'A redesigned Executions view with an attention band and a docked detail panel.', link: '/app/workflows/executions/run-from-the-workflow-list/', label: 'Executions' },
			{ kind: 'improved', area: 'App', text: 'Every screen works in the side panel at 320–450 px.', link: '/app/side-panel/', label: 'Side panel' },
			{ kind: 'improved', area: 'App', text: 'An outcome-first first run with a welcome tab and a templates-first home.', link: '/get-started/quick-intro/', label: 'Quick intro' },
			{ kind: 'improved', area: 'Local AI', text: 'Ollama models are detected automatically and appear in the model picker.', link: '/nodes/builtin/ai/aidependencies/llm/ollama/', label: 'Ollama' },
			{ kind: 'improved', area: 'Integrations', text: 'Google nodes use the right OAuth scopes and refresh tokens on their own; an inline guide creates your OAuth client.', link: '/app/connections/oauth-client/', label: 'Create your OAuth client' },
			{ kind: 'improved', area: 'Integrations', text: 'Extension-only integrations work from the web app through a secure fetch bridge.', link: '/app/troubleshooting/extension-only-integrations-in-the-web-app/', label: 'Extension-only integrations' },
			{ kind: 'improved', area: 'Marketplace', text: 'Browse without an account, featured and trending workflows, and editing a published listing.', link: '/app/workflows/publishing/', label: 'Publishing a workflow' },
			{ kind: 'improved', area: 'Nodes', text: 'Loop allows up to 1,000 iterations; Screenshot Page uses native capture.', link: '/nodes/builtin/flow/loop/', label: 'Loop' },
			{ kind: 'improved', area: 'App', text: 'Heavy libraries load only when needed and only the last 100 executions per workflow are kept locally.', link: '/app/troubleshooting/performance-optimization/', label: 'Performance' },
			{ kind: 'fixed', area: 'Workflows', text: 'No more double runs or re-runs on resume, and resumed runs no longer disappear.' },
			{ kind: 'fixed', area: 'Workflows', text: 'Schedules handle day-of-month and DST correctly, and keep durable-wait alarms when they sync.', link: '/nodes/builtin/trigger/schedule/', label: 'Schedule' },
			{ kind: 'fixed', area: 'Workflows', text: 'Sub-workflow failures and cancels reach the parent, and nested loops rewind correctly.' },
			{ kind: 'fixed', area: 'Security', text: 'A “Not authenticated” error after sign-in, caused by the storage key being created twice.' },
			{ kind: 'fixed', area: 'Aria & agents', text: 'The assistant no longer freezes the UI when it opens.' },
			{ kind: 'fixed', area: 'Workflows', text: 'Opening a past run no longer locks the editor canvas.' },
		],
	},
	{
		version: '0.6.0',
		date: '2026-09-08',
		browsers: CHROME_AND_WEB,
		headline: 'Aria drafts your workflows, a Marketplace to share them, and 14 new integrations',
		summary:
			'Describe an outcome and the assistant drafts the workflow; publish and install community workflows with a trust layer that shows what they touch; connect GitHub, Discord, Telegram and more.',
		teaser: 'AI workflow assistant · Marketplace · consent & safety · narrated workflows · 14 integrations · OAuth with PKCE.',
		breaking: true,
		changes: [
			{ kind: 'new', area: 'Aria & agents', text: 'The AI assistant drafts a workflow from a plain-language goal, with a live preview on the canvas.', link: '/concepts/ai/workflow-intelligence/', label: 'Workflow intelligence' },
			{ kind: 'new', area: 'Nodes', text: 'UI Automation records your clicks and inputs and turns them into a reusable step.', link: '/nodes/extension/ui/automation/', label: 'UI Automation' },
			{ kind: 'new', area: 'Marketplace', text: 'A publish wizard with saved drafts, author credit, and installing community workflows.', link: '/app/workflows/publishing/', label: 'Publishing a workflow' },
			{ kind: 'new', area: 'Security', text: 'A “what this flow touches” panel, per-run consent and per-flow credential consent.', link: '/app/troubleshooting/permissions-security/', label: 'Permissions and security' },
			{ kind: 'new', area: 'Workflows', text: 'Narrated workflows explain each step with notes and a story panel.', link: '/app/workflows/narration/', label: 'Narrated workflows' },
			{ kind: 'new', area: 'Marketplace', text: 'A request board to ask for workflows and be notified when one ships.', link: '/app/request-board/', label: 'Request board' },
			{ kind: 'new', area: 'Integrations', text: 'GitHub, Discord, Telegram, Linear, Todoist, Google Calendar, Microsoft 365, HubSpot, Trello, Raindrop, Push Notification, Baserow / NocoDB, Supabase and Obsidian.', link: '/nodes/builtin/integration/github/', label: 'GitHub and more' },
			{ kind: 'new', area: 'Integrations', text: 'Custom API connects any service from its OpenAPI definition.', link: '/nodes/builtin/integration/custom-api/', label: 'Custom API' },
			{ kind: 'improved', area: 'Integrations', text: 'Connections use an auth-code flow with PKCE; the client secret is no longer required.', link: '/app/connections/create/', label: 'Creating credentials' },
			{ kind: 'improved', area: 'Workflows', text: 'Find nodes by outcome, see data shapes while wiring, and get next-step suggestions.', link: '/app/workflows/components/connections/', label: 'Connections' },
			{ kind: 'improved', area: 'App', text: 'Start from a goal, with a configure-to-run checklist and a run-outcome panel.', link: '/get-started/quick-intro/', label: 'Quick intro' },
			{ kind: 'improved', area: 'Nodes', text: 'Browser-native nodes run without extra host permissions and show where they run.', link: '/nodes/', label: 'Node reference' },
			{ kind: 'improved', area: 'App', text: 'Account data now goes through a new AWFlow cloud service; local mode is unchanged.' },
			{ kind: 'fixed', area: 'Marketplace', text: 'Aborted-publish drafts no longer show as “Published”.' },
			{ kind: 'fixed', area: 'Marketplace', text: 'Author configuration is stripped on share and required on fork.' },
			{ kind: 'fixed', area: 'Integrations', text: 'Google external nodes report the correct runtime after the OAuth changes.' },
			{ kind: 'fixed', area: 'App', text: '21 findings from a pre-release audit, and untranslated strings in French, German and Chinese.' },
		],
	},
	{
		version: '0.4.0',
		date: '2026-05-06',
		browsers: ['Chrome'],
		headline: 'Browser automation, loops and new ways to start a workflow',
		summary: 'UI Automation, the Loop node, form tooling, structured extraction, new triggers and Show Notification.',
		breaking: true,
		changes: [
			{ kind: 'new', area: 'Nodes', text: 'UI Automation clicks, types, submits and waits for elements.', link: '/nodes/extension/ui/automation/', label: 'UI Automation' },
			{ kind: 'new', area: 'Nodes', text: 'The Loop node runs the same steps for each item.', link: '/nodes/builtin/flow/loop/', label: 'Loop' },
			{ kind: 'new', area: 'Nodes', text: 'Form Fill fills a page form from your data.', link: '/nodes/extension/ui/form-fill/', label: 'Form Fill' },
			{ kind: 'new', area: 'Nodes', text: 'Page Load, Context Menu, Browser Startup and Schedule triggers.', link: '/nodes/builtin/trigger/schedule/', label: 'Schedule' },
			{ kind: 'new', area: 'Nodes', text: 'Show Notification reports a result without opening the builder.', link: '/nodes/extension/shownotification/', label: 'Show Notification' },
			{ kind: 'improved', area: 'Workflows', text: 'Workflow node limits per plan, and size limits on uploaded text.', link: '/nodes/builtin/rate-limits/', label: 'Rate limits' },
		],
	},
	{
		version: '0.3.0',
		date: '2026-04-23',
		browsers: ['Chrome'],
		headline: 'Retries and error handling you can rely on',
		summary: 'Node parameters, retry logic and error handling make runs easier to reason about when a node fails.',
		changes: [
			{ kind: 'improved', area: 'Workflows', text: 'Retry logic recovers from temporary failures such as slow pages.', link: '/concepts/flow/error-handling/', label: 'Error handling' },
			{ kind: 'improved', area: 'Workflows', text: 'Choose whether a failure stops the run, continues, or passes the error on.', link: '/nodes/builtin/flow/stopanderror/', label: 'Stop and Error' },
			{ kind: 'improved', area: 'Nodes', text: 'More predictable parameter handling for mapped values and expressions.', link: '/concepts/data/data-mapping/data-mapping-expressions/', label: 'Expressions' },
		],
	},
	{
		version: '0.2.4',
		date: '2026-04-15',
		browsers: ['Chrome'],
		headline: 'A stability pass for workflow authoring',
		summary: 'Iteration on the builder; retest workflows that depend on page state or complex mappings.',
		changes: [{ kind: 'improved', area: 'Workflows', text: 'More reliable workflow authoring.', link: '/concepts/flow/workflow-lifecycle/', label: 'Workflow lifecycle' }],
	},
	{
		version: '0.2.3',
		date: '2026-04-09',
		browsers: ['Chrome'],
		headline: 'Maintenance for the early builder',
		summary: 'A maintenance release that continues the early workflow builder iteration.',
		changes: [{ kind: 'improved', area: 'Workflows', text: 'Continued work on the early workflow builder.', link: '/app/workflows/create/', label: 'Create a workflow' }],
	},
	{
		version: '0.2.2',
		date: '2026-04-04',
		browsers: ['Chrome'],
		headline: 'Token-based sign-in for remote assets',
		summary: 'Remote assets are now accessed with JWT-based authentication.',
		breaking: true,
		changes: [{ kind: 'improved', area: 'Security', text: 'Remote asset access uses JWT-based authentication.', link: '/app/troubleshooting/permissions-security/', label: 'Permissions and security' }],
	},
	{
		version: '0.2.1',
		date: '2026-04-04',
		browsers: ['Chrome'],
		headline: 'Profile images and demo fixes',
		summary: 'User images display reliably in settings, and early demos are more dependable.',
		changes: [
			{ kind: 'fixed', area: 'App', text: 'User images display reliably in settings.' },
			{ kind: 'fixed', area: 'App', text: 'Demo workflows run more reliably.', link: '/get-started/quick-intro/', label: 'Quick intro' },
		],
	},
	{
		version: '0.0.2',
		date: '2026-04-04',
		browsers: ['Chrome'],
		headline: 'First fixes and a new design system',
		summary: 'Early bug fixes and a move to the shadcn-svelte design system.',
		changes: [
			{ kind: 'improved', area: 'App', text: 'The interface moved to the shadcn-svelte design system.' },
			{ kind: 'fixed', area: 'App', text: 'General early bug fixes.', link: '/app/troubleshooting/', label: 'Troubleshooting' },
		],
	},
];

/** "0.8.2" → "/releases/v0-8-2/" — the URL the extension opens after an update. */
export function releaseHref(version: string): string {
	return `/releases/v${version.replace(/\./g, '-')}/`;
}

export function getRelease(version: string): Release {
	const release = RELEASES.find((r) => r.version === version);
	if (!release) throw new Error(`Unknown release ${version}: add it to src/data/releases.ts`);
	return release;
}

/** "2026-10-10" → "10 Oct 2026" (fixed locale and UTC so server and client agree). */
export function formatReleaseDate(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	});
}

/**
 * Problems with the release data, given the set of existing docs page paths
 * (e.g. "/app/memory/overview/"). Empty when everything is valid.
 */
export function findReleaseProblems(pagePaths: Set<string>): string[] {
	const problems: string[] = [];
	const seen = new Set<string>();
	for (const r of RELEASES) {
		if (seen.has(r.version)) problems.push(`v${r.version}: duplicate version`);
		seen.add(r.version);
		if (!/^\d+\.\d+\.\d+$/.test(r.version)) problems.push(`v${r.version}: version must be x.y.z`);
		if (Number.isNaN(Date.parse(r.date))) problems.push(`v${r.version}: invalid date ${r.date}`);
		if (!pagePaths.has(releaseHref(r.version))) problems.push(`v${r.version}: missing page ${releaseHref(r.version)}`);
		for (const c of r.changes) {
			if (c.kind === 'new' && !c.link) problems.push(`v${r.version}: "${c.text}" is New but has no link`);
			if (!c.link) continue;
			const path = c.link.split('#')[0];
			if (!path.startsWith('/') || !path.endsWith('/')) problems.push(`v${r.version}: link ${c.link} must be /path/`);
			else if (!pagePaths.has(path)) problems.push(`v${r.version}: link ${c.link} points to no docs page`);
		}
	}
	return problems;
}
