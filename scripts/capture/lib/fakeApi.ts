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
	['cat_productivity', 'Productivity', 'Save time on everyday tasks.', '#2563eb'],
	['cat_developer', 'Developer tools', 'Encode, hash, format and debug data.', '#7c3aed'],
	['cat_data', 'Data & files', 'Clean, convert and move data.', '#059669'],
	['cat_research', 'Research', 'Collect and summarise information from the web.', '#d97706']
].map(([id, label, description, color], i) => ({
	id: `Workflow_Category:${id}`,
	label,
	description,
	picture: null,
	tags: [],
	color,
	sortOrder: i,
	workflowCount: 0
}));

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
		const session = { id: 'ses_docs', userId: USER_ID, token: FAKE_BEARER, expiresAt: new Date(T0 + 30 * 86_400_000).toISOString() };
		if (path === '/auth/get-session') return [200, { session, user: { ...user, createdAt: new Date(T0).toISOString(), updatedAt: new Date(T0).toISOString() } }];
		if (path === '/me' && method === 'GET') return [200, user];
		if (path === '/me/settings')
			return [200, { id: 'set_docs', userId: USER_ID, profilePicture: null, bio: 'Automates the boring bits of web work.', assistantNotchEnabled: null, assistantNotchConfig: null, createdDate: T0, lastModified: T0 }];
		if (path === '/me/counts') return [200, { workflows: 1, credentials: 0 }];
		if (path === '/me/subscription')
			return [200, { id: 'sub_docs', userId: USER_ID, planId: 'free', billingCycle: 'monthly', status: 'active', startDate: T0, endDate: null }];
		if (path === '/published-workflows/downloads') return [200, []];
		if (path === '/published-workflows/revocations') return [200, { revoked: [], updatedAt: T0 }];
		if (path === '/me/plan' || path === '/plans/free')
			return [200, { id: 'free', name: 'Free', description: 'For individuals.', priceMonthly: 0, priceYearly: 0, isPopular: false, highlights: [], limits: { max_workflows: null, max_workflow_versions: null, max_workflow_nodes: null, max_executions: null, max_credentials: null } }];
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
		if (path === '/workflow-categories') return [200, CATEGORIES];
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
		if (path.startsWith('/notifications')) return [200, method === 'GET' ? [] : {}];
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
