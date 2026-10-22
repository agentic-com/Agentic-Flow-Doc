/**
 * A stand-in for api.awflow.io, for shots that need a signed-in account (the publish wizard).
 *
 * The app's real UI runs unchanged; only its backend answers come from here: a fictional
 * user "Alex Doe", one cloud workflow (the "Summarise this page" example from fixtures/), the marketplace
 * draft the publish wizard creates and edits, and uploaded preview images (served back from
 * the R2 public domain). Nothing reaches the real API and no real account or data is used.
 * Unknown endpoints answer 404 and are listed in the run's output, so new calls are easy to spot.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createAdminFixtures } from './fakeAdmin.ts';

/** The app's API and R2 public domain: production build, and non-production builds (BACKEND_URL / R2_PUBLIC_DOMAIN). */
export const FAKE_API_ORIGINS = ['https://api.awflow.io', 'http://localhost:8787'];
export const FAKE_R2_ORIGINS = ['https://r2.awflow.io', 'https://pub-f450d08feed94b4f8388a30cfd98be14.r2.dev'];
/** Not a real session: the app only checks that a token is present and sends it back to the (fake) API. */
export const FAKE_BEARER = 'docs-capture-fake-session';

const T0 = Date.UTC(2026, 8, 14, 9, 30);
const USER_ID = 'usr_docs_alex';
/** The signed-in user's one cloud workflow: an example that reads the page, so the review step has access to show. */
export const CLOUD_FIXTURE = 'summarize-page-llm-chain';
const WF_ID = 'wf_docs_summarize_page';
const GRAPH_ID = 'wg_docs_summarize_page_1';

type Json = Record<string, unknown>;
export type FakeRoute = {
	request(): {
		method(): string;
		url(): string;
		headers(): Record<string, string>;
		postData(): string | null;
		postDataBuffer(): Buffer | null;
	};
	fulfill(o: { status?: number; headers?: Record<string, string>; body?: string | Buffer; contentType?: string }): Promise<void>;
};

const user = {
	id: USER_ID,
	name: 'Alex Doe',
	email: 'alex.doe@example.com',
	emailVerified: true,
	image: null,
	role: 'user',
	enabled: true,
	banned: false,
	currentSubscription: 'sub_docs',
	createdAt: T0,
	updatedAt: T0
};

const CATEGORIES = [
	['productivity', 'Productivity', 'Save time on everyday tasks.', '#2563eb', '⚡', 18, ['daily', 'email']],
	['developer_tools', 'Developer tools', 'Encode, hash, format and debug data.', '#7c3aed', '🛠️', 24, ['json', 'encoding']],
	['data_files', 'Data & files', 'Clean, convert and move data.', '#059669', '🗂️', 15, ['csv', 'sheets']],
	['research', 'Research', 'Collect and summarise information from the web.', '#d97706', '🔎', 11, ['ai', 'reading']]
].map(([id, label, description, color, picture, workflowCount, tags], i) => ({
	id: `Workflow_Category:${id}`,
	label,
	description,
	picture,
	tags,
	color,
	sortOrder: i,
	workflowCount
}));

/** Notices from AWFlow (`/config/client`), sent while the `notices` switch is on. */
const NOTICES = [
	{ id: 'docs-maintenance', level: 'warning', message: 'Planned maintenance on Sunday, 06:00–07:00 UTC: sign-in and the Marketplace may be slow.' },
	{ id: 'docs-test-runs', level: 'info', message: 'New: Test runs check that a workflow still answers well after a change.', url: 'https://docs.awflow.io/app/workflows/test-runs/' }
];

/** A workflow installed from the marketplace by Alex Doe: JSON Prettify by a fictional author, v2 installed, v3 approved. */
function installedFixture(fixturesDir: string) {
	const awf = JSON.parse(readFileSync(join(fixturesDir, 'json-prettify.awf'), 'utf8')) as { name: string; description: string; tags: string[]; nodes: Json[]; edges: Json[] };
	const workflowId = 'wf_docs_json_prettify';
	const graph = { id: 'wg_docs_json_prettify_2', workflowId, nodes: awf.nodes, edges: awf.edges, createdDate: T0 - 20 * 86_400_000 };
	const download = {
		id: 'dl_docs_json_prettify',
		publishedWorkflowId: 'pw_docs_json_prettify',
		version: 2,
		latestVersion: 3,
		latestNote: 'Keeps the key order of the original and shows the error line when the JSON is invalid.',
		nodesInputs: null,
		permissionManifest: null,
		requiredInputs: [],
		listingStatus: 'approved',
		workflow: {
			id: workflowId,
			name: awf.name,
			description: awf.description,
			userId: 'usr_docs_sam',
			activeGraph: graph.id,
			status: 'active',
			type: 'triggered',
			visibility: 'public',
			tags: awf.tags,
			installedFrom: null,
			permissionManifest: null,
			basedOn: { listingId: 'pw_docs_json_prettify', name: awf.name, author: 'Sam Lee' },
			createdDate: T0 - 30 * 86_400_000,
			lastModified: T0 - 20 * 86_400_000
		},
		graph
	};
	return { workflowId, download };
}

/** Per-browser-context state: what the wizard saved so far. */
export function createFakeApi(fixturesDir: string, origin: string) {
	const awf = JSON.parse(readFileSync(join(fixturesDir, `${CLOUD_FIXTURE}.awf`), 'utf8')) as {
		name: string;
		description: string;
		tags: string[];
		nodes: Json[];
		edges: Json[];
	};
	const workflow = {
		id: WF_ID,
		name: awf.name,
		description: awf.description,
		userId: USER_ID,
		activeGraph: GRAPH_ID,
		status: 'active',
		type: 'triggered',
		visibility: 'private',
		tags: awf.tags,
		installedFrom: null,
		permissionManifest: null,
		basedOn: null,
		createdDate: T0,
		lastModified: T0 + 3_600_000
	};
	let graph = { id: GRAPH_ID, workflowId: WF_ID, nodes: awf.nodes, edges: awf.edges, createdDate: T0 };
	let listing: Json | null = null;
	/**
	 * Capture-only switches, set by a shot's prepare with `POST /__docs/state` (see shots/admin.ts):
	 * `role` turns Alex Doe into an admin for the admin screens; `newsletterPrompt` lets the
	 * "Stay in the loop" card show; `installed` adds one workflow installed from the marketplace
	 * (an older version, a newer one approved); `notices` makes `/config/client` send two notices
	 * from AWFlow. All are off by default so other shots stay unchanged.
	 */
	const state = { role: 'user', newsletterPrompt: false, newsletter: 'subscribed' as string, installed: false, notices: false };
	const installed = installedFixture(fixturesDir);
	const admin = createAdminFixtures(fixturesDir, user);
	const NOW = Date.now();
	const notifications = [
		{ id: 'n_1', type: 'listing_approved', title: '“Summarise this page in 3 bullets” is live', body: 'It was approved and anyone can install it from the marketplace now.', linkUrl: null, refId: null, readAt: null, createdDate: NOW - 2 * 3_600_000 },
		{ id: 'n_2', type: 'listing_review', title: 'New 5-star review on “Summarise this page in 3 bullets”', body: 'Exactly what I needed for long articles. The bullets are short and to the point.', linkUrl: null, refId: null, readAt: null, createdDate: NOW - 5 * 3_600_000 },
		{ id: 'n_3', type: 'workflow_used', title: "Someone's using your workflow ✨", body: '“Summarise this page in 3 bullets” just got its first install — you built something people want.', linkUrl: null, refId: null, readAt: null, createdDate: NOW - 26 * 3_600_000 },
		{ id: 'n_4', type: 'wanted_flow_fulfilled', title: 'Your requested workflow shipped', body: '"Price-drop alert for any product page" is ready to use.', linkUrl: null, refId: null, readAt: NOW - 50 * 3_600_000, createdDate: NOW - 3 * 86_400_000 },
		{ id: 'n_5', type: 'report_resolved', title: 'Thanks — we acted on your report about “Free followers booster”', body: 'A moderator reviewed it and took action.', linkUrl: null, refId: null, readAt: NOW - 6 * 86_400_000, createdDate: NOW - 7 * 86_400_000 }
	];
	const PLANS = [
		['free', 'Free', 'Get started at no cost.', 0, 0, false, [10, 5, 100, 20, 10]],
		['basic', 'Basic', 'For growing automations.', 1.85, 19.98, false, [30, 10, 100, 40, 20]],
		['premium', 'Premium', 'For power users.', 4.85, 52.38, true, [null, 20, null, 100, 50]],
		['enterprise', 'Enterprise', 'Unlimited everything.', 19.85, 215.38, false, [null, null, null, null, null]]
	].map(([id, name, description, priceMonthly, priceYearly, isPopular, l]) => {
		const [max_workflows, max_workflow_versions, max_workflow_nodes, max_executions, max_credentials] = l as (number | null)[];
		return { id, name, description, priceMonthly, priceYearly, isPopular, highlights: [], limits: { max_workflows, max_workflow_versions, max_workflow_nodes, max_executions, max_credentials } };
	});
	/** Request board: fictional community requests (requesters use example names). */
	const DAY = 86_400_000;
	const wanted = (id: string, title: string, description: string, voteCount: number, status: string, days: number, o: Json = {}) => ({
		id,
		title,
		description,
		category: null,
		requester: { id: `usr_docs_${id}`, name: 'Mei Lin', image: null, verified: false },
		voteCount,
		hasVoted: false,
		status,
		createdDate: NOW - days * DAY,
		etaDate: null as number | null,
		lastModified: NOW - days * DAY,
		fulfilledPublishedWorkflowId: null as string | null,
		...o
	});
	const board = [
		wanted('wr_2', 'Summarise YouTube video transcripts', 'Open a video, get the key points and timestamps as a short list.', 37, 'open', 15),
		wanted('wr_3', 'Export a LinkedIn profile to a Google Sheet', 'One row per profile: name, headline, company and location.', 29, 'open', 11, { hasVoted: true }),
		wanted('wr_6', 'Translate the selected text in place', 'Select a paragraph, pick a language, and replace it with the translation.', 14, 'open', 5),
		wanted('wr_9', 'Daily digest of new GitHub issues', 'Every morning, list the issues opened since yesterday in my repositories.', 8, 'open', 2),
		wanted('wr_1', 'Save the current page to Notion', 'Title, link, a short summary and tags, added to a Notion database.', 48, 'building', 20, { etaDate: NOW + 12 * DAY }),
		wanted('wr_10', 'Fill expense reports from receipts', 'Read a receipt photo and fill the expense form fields.', 19, 'building', 9),
		wanted('wr_5', 'Price-drop alert for any product page', 'Check a product page every day and notify me when the price goes down.', 21, 'fulfilled', 40, { fulfilledPublishedWorkflowId: 'pw_docs_price', lastModified: NOW - 3 * DAY }),
		wanted('wr_11', 'Copy a table from any page to CSV', 'Pick a table on the page and download it as a CSV file.', 16, 'fulfilled', 60, { fulfilledPublishedWorkflowId: 'pw_docs_csv', lastModified: NOW - 12 * DAY })
	];
	const assets = new Map<string, { type: string; data: Buffer }>();
	const unknown = new Set<string>();

	const cors = (req: ReturnType<FakeRoute['request']>) => ({
		'access-control-allow-origin': origin,
		'access-control-allow-credentials': 'true',
		'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
		'access-control-allow-headers': req.headers()['access-control-request-headers'] ?? '*',
		'access-control-expose-headers': 'set-auth-token'
	});

	function newListing(): Json {
		return {
			id: 'pw_docs_summarize_page',
			workflowId: WF_ID,
			name: '',
			description: '',
			icon: '',
			iconEmoji: null,
			language: 'en',
			tags: [],
			previews: [],
			createdDate: T0 + 7_200_000,
			lastModified: T0 + 7_200_000,
			categories: [],
			stats: { downloadCount: 0, rating: 0, lastVersion: 1, rankScore: 0, trendingScore: 0 },
			featured: false,
			curatedRank: null,
			publisher: { id: USER_ID, name: user.name, image: null, verified: false },
			permissionManifest: null,
			status: 'draft',
			moderationNote: null,
			narrationComplete: false,
			nodeNames: [],
			pendingRevision: null,
			minExtensionVersion: '0.0.0'
		};
	}

	/** Pulls the single `file` part out of a multipart body (enough for the app's own uploads). */
	function filePart(body: Buffer, contentType: string): { type: string; data: Buffer } | null {
		const boundary = /boundary=(?:"([^"]+)"|([^;]+))/.exec(contentType);
		if (!boundary) return null;
		const sep = Buffer.from(`--${boundary[1] ?? boundary[2]}`);
		const start = body.indexOf(sep);
		const headEnd = body.indexOf('\r\n\r\n', start);
		const next = body.indexOf(sep, headEnd);
		if (start < 0 || headEnd < 0 || next < 0) return null;
		const head = body.subarray(start, headEnd).toString();
		return { type: /content-type:\s*([^\r\n]+)/i.exec(head)?.[1] ?? 'application/octet-stream', data: body.subarray(headEnd + 4, next - 2) };
	}

	/** Answers one API call: [status, json body] or null when the endpoint isn't stubbed. */
	function answer(method: string, path: string, body: Json, req: ReturnType<FakeRoute['request']>): [number, unknown] | null {
		if (path === '/__docs/state' && method === 'POST') {
			Object.assign(state, body);
			return [200, state];
		}
		const me = { ...user, role: state.role };
		const q = new URL(req.url()).searchParams;
		if (state.role === 'admin') {
			const a = admin.answer(method, path, q, body);
			if (a) return a;
		}
		const session = { id: 'ses_docs', userId: USER_ID, token: FAKE_BEARER, expiresAt: new Date(T0 + 30 * 86_400_000).toISOString() };
		if (path === '/auth/get-session') return [200, { session, user: { ...me, createdAt: new Date(T0).toISOString(), updatedAt: new Date(T0).toISOString() } }];
		if (path === '/me' && method === 'GET') return [200, me];
		if (path === '/me/settings')
			return [200, { id: 'set_docs', userId: USER_ID, profilePicture: null, bio: 'Automates the boring bits of web work.', assistantNotchEnabled: null, assistantNotchConfig: null, createdDate: T0, lastModified: T0 }];
		if (path === '/me/counts') return [200, { workflows: 1, credentials: 0 }];
		if (path === '/me/subscription')
			return [200, { id: 'sub_docs', userId: USER_ID, planId: 'free', billingCycle: 'monthly', status: 'active', startDate: T0, endDate: null }];
		if (path === '/published-workflows/downloads') return [200, state.installed ? [installed.download] : []];
		if (state.installed && path === `/published-workflows/downloads/${installed.workflowId}`) return [200, installed.download];
		if (state.installed && path === `/published-workflows/downloads/${installed.workflowId}/versions`) return [200, [1, 2, 3]];
		if (state.installed && path === `/executions/workflow/${installed.workflowId}`) return [200, []];
		if (path === '/config/client')
			return [200, { notices: state.notices ? NOTICES : [], flags: {}, killSwitch: { nodes: [], integrations: [] } }];
		if (path === '/published-workflows/revocations') return [200, { revoked: [], updatedAt: T0 }];
		if (path === '/me/plan' || path === '/plans/free') return [200, PLANS[0]];
		if (path === '/plans') return [200, PLANS];
		if (path === '/workflows' && method === 'GET') return [200, [workflow]];
		if (path === `/workflows/${WF_ID}` && method === 'GET') return [200, workflow];
		if (path === `/workflows/${WF_ID}` && method === 'PUT') return [200, Object.assign(workflow, body, { lastModified: Date.now() })];
		if (path === `/workflows/${WF_ID}/graphs` && method === 'GET') return [200, [graph]];
		if (path === `/workflows/${WF_ID}/graphs` && method === 'POST') {
			graph = { ...graph, id: `${GRAPH_ID}_${Date.now()}`, nodes: (body.nodes as Json[]) ?? graph.nodes, edges: (body.edges as Json[]) ?? graph.edges };
			workflow.activeGraph = graph.id;
			return [200, graph];
		}
		if (path.startsWith('/workflows/graphs/')) return [200, graph];
		if (path === '/workflow-categories' && method === 'GET') return [200, CATEGORIES];
		if (path.startsWith('/workflow-categories/') && method === 'GET') return [200, CATEGORIES.find((c) => path.endsWith(encodeURIComponent(c.id)) || path.endsWith(c.id)) ?? CATEGORIES[0]];
		if (path === '/published-workflows/mine') return [200, listing ? [listing] : []];
		if (path === '/published-workflows/draft' && method === 'POST') return [200, (listing ??= newListing())];
		if (listing && path === `/published-workflows/draft/${listing.id}` && method === 'PUT') {
			Object.assign(listing, body, { lastModified: Date.now() });
			return [200, listing];
		}
		if (listing && path === `/published-workflows/${listing.id}` && method === 'GET') return [200, listing];
		if (listing && path === `/published-workflows/${listing.id}/releases`) return [200, []];
		if (path === '/assets' && method === 'POST') {
			const part = filePart(req.postDataBuffer() ?? Buffer.alloc(0), req.headers()['content-type'] ?? '');
			if (!part) return [400, { message: 'No file' }];
			const key = `${USER_ID}/preview-${assets.size + 1}.${part.type.split('/')[1] ?? 'png'}`;
			assets.set(key, part);
			return [200, { uploaded: new Date().toISOString(), etag: `etag-${assets.size}`, size: part.data.length, key, url: `${FAKE_R2_ORIGINS[0]}/${key}` }];
		}
		if (path === '/notifications' && method === 'GET') return [200, { items: notifications, unreadCount: notifications.filter((n) => n.readAt == null).length }];
		if (path === '/notifications/read-all') {
			for (const n of notifications) n.readAt ??= Date.now();
			return [200, {}];
		}
		if (path.startsWith('/notifications/')) {
			const n = notifications.find((x) => path === `/notifications/${x.id}/read`);
			if (n) n.readAt ??= Date.now();
			return [200, {}];
		}
		if (path === '/newsletter/prompt-status') return [200, { show: state.newsletterPrompt && state.newsletter === 'undecided' }];
		if (path === '/newsletter/subscription') return [200, { status: state.newsletter }];
		if (path === '/newsletter/subscribe') return [200, { status: (state.newsletter = 'subscribed') }];
		if (path === '/newsletter/unsubscribe-self') return [200, { status: (state.newsletter = 'unsubscribed') }];
		if (path === '/newsletter/dismiss') {
			state.newsletterPrompt = false;
			return [200, { ok: true }];
		}
		if (path === '/workflow-categories' && method === 'POST') return [200, { ...CATEGORIES[0], ...body, id: `Workflow_Category:${body.slug}`, workflowCount: 0 }];
		// The public request board (one lane per call, most-voted first).
		if (path === '/wanted-flows/stats') return [200, { requestsThisWeek: 12, votesThisWeek: 140, shippedThisMonth: 3, inReviewNow: 1 }];
		if (path === '/wanted-flows' && method === 'GET') {
			const lane = q.get('status');
			return [200, board.filter((r) => !lane || r.status === lane).sort((a, b) => b.voteCount - a.voteCount)];
		}
		return null;
	}

	return {
		/** Handler for every api.awflow.io request. */
		async api(route: FakeRoute) {
			const req = route.request();
			const headers = cors(req);
			const method = req.method();
			if (method === 'OPTIONS') return route.fulfill({ status: 204, headers });
			const url = new URL(req.url());
			let body: Json = {};
			try {
				body = JSON.parse(req.postData() ?? '{}') as Json;
			} catch {
				/* multipart or empty */
			}
			const res = answer(method, url.pathname, body, req);
			if (!res) unknown.add(`${method} ${url.pathname}`);
			const [status, json] = res ?? [404, { message: 'Not stubbed in the docs capture' }];
			const extra: Record<string, string> = url.pathname === '/auth/get-session' ? { 'set-auth-token': FAKE_BEARER } : {};
			await route.fulfill({ status, headers: { ...headers, ...extra, 'content-type': 'application/json' }, body: JSON.stringify(json) });
		},
		/** Serves images uploaded through the fake /assets back from the R2 public domain. */
		async r2(route: FakeRoute) {
			const key = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
			const a = assets.get(key);
			if (!a) return route.fulfill({ status: 404, body: '' });
			await route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: a.type, body: a.data });
		},
		unknown
	};
}
