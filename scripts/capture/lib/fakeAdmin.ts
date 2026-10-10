/**
 * Admin fixtures for the fake API (lib/fakeApi.ts): fictional accounts, listings, reports, requests,
 * newsletter issues, audit entries, insights and templates, so the admin screens can be captured
 * with realistic data. Every name and address here is invented (example.com); no real user data.
 * Only answered while the fake user is switched to the admin role (see fakeApi.ts, /__docs/state).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Json = Record<string, unknown>;
const DAY = 86_400_000;
const HOUR = 3_600_000;
/** A stable content-hash-looking string (the review pin), derived from a fixture id. */
const hashOf = (id: string) => createHash('sha256').update(id).digest('hex');

export function createAdminFixtures(fixturesDir: string, alex: Json) {
	const NOW = Date.now();
	const ago = (d: number, h = 0) => NOW - d * DAY - h * HOUR;
	const graphOf = (name: string) => {
		const awf = JSON.parse(readFileSync(join(fixturesDir, `${name}.awf`), 'utf8')) as Json;
		return awf as { name: string; description: string; tags: string[]; nodes: Json[]; edges: Json[]; type?: string };
	};

	// ── Users ────────────────────────────────────────────────────────────
	const person = (id: string, name: string, role: string | null, days: number, o: Json = {}) => ({
		id,
		name,
		email: `${name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
		emailVerified: true,
		image: null,
		role,
		enabled: true,
		banned: false,
		currentSubscription: null,
		createdAt: ago(days),
		updatedAt: ago(Math.max(0, days - 2)),
		...o
	});
	const users: Json[] = [
		person('usr_docs_priya', 'Priya Nair', 'user', 2),
		person('usr_docs_tomas', 'Tomás Ortega', 'user', 4, { emailVerified: false }),
		person('usr_docs_mei', 'Mei Lin', 'user', 6),
		person('usr_docs_jonas', 'Jonas Berg', 'user', 9),
		person('usr_docs_amara', 'Amara Okafor', 'user', 13),
		person('usr_docs_omar', 'Omar Haddad', 'user', 17, { banned: true, banReason: 'Spam listings' }),
		person('usr_docs_lucas', 'Lucas Martin', 'user', 22),
		person('usr_docs_sofia', 'Sofia Rossi', 'user', 31),
		person('usr_docs_elena', 'Elena Petrova', 'user', 38, { enabled: false }),
		person('usr_docs_kenji', 'Kenji Watanabe', 'user', 47),
		person('usr_docs_sam', 'Sam Rivera', 'superadmin', 120),
		person('usr_docs_alex', 'Alex Doe', 'admin', 26, { email: alex.email }),
		person('usr_docs_hannah', 'Hannah Becker', 'user', 64),
		person('usr_docs_noah', 'Noah Williams', 'user', 81)
	];
	const freePlan = {
		id: 'free',
		name: 'Free',
		description: 'Get started at no cost.',
		priceMonthly: 0,
		priceYearly: 0,
		isPopular: false,
		highlights: [],
		limits: { max_workflows: 10, max_workflow_versions: 5, max_workflow_nodes: 100, max_executions: 20, max_credentials: 10 }
	};

	function listUsers(q: URLSearchParams) {
		let list = [...users];
		const text = (q.get('q') ?? '').toLowerCase();
		if (text) list = list.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(text));
		const seg = q.get('segment');
		if (seg === 'staff') list = list.filter((u) => u.role === 'admin' || u.role === 'superadmin');
		if (seg === 'banned_disabled') list = list.filter((u) => u.banned || u.enabled === false);
		if (seg === 'new_month') list = list.filter((u) => (u.createdAt as number) > ago(30));
		if (seg === 'published') list = list.filter((u) => ['usr_docs_priya', 'usr_docs_mei', 'usr_docs_jonas', 'usr_docs_alex'].includes(u.id as string));
		const role = q.get('role');
		if (role) list = list.filter((u) => u.role === role);
		const status = q.get('status');
		if (status === 'banned') list = list.filter((u) => u.banned);
		if (status === 'disabled') list = list.filter((u) => u.enabled === false);
		if (status === 'active') list = list.filter((u) => !u.banned && u.enabled !== false);
		list.sort((a, b) => (b.createdAt as number) - (a.createdAt as number));
		return { users: list, total: list.length, page: 1, limit: 20 };
	}

	// ── Marketplace listings ─────────────────────────────────────────────
	const publisher = (id: string, name: string) => ({ id, name, image: null, verified: false });
	const listing = (id: string, src: string, o: Json): Json => {
		const g = graphOf(src);
		return {
			id,
			workflowId: `wf_${id}`,
			name: g.name,
			description: g.description,
			icon: '',
			iconEmoji: null,
			language: 'en',
			tags: g.tags ?? [],
			previews: [],
			createdDate: ago(3),
			lastModified: ago(1),
			categories: [],
			stats: { downloadCount: 0, rating: 0, lastVersion: 1, rankScore: 0, trendingScore: 0 },
			featured: false,
			curatedRank: null,
			publisher: publisher('usr_docs_priya', 'Priya Nair'),
			permissionManifest: null,
			status: 'pending',
			moderationNote: null,
			narrationComplete: true,
			nodeNames: (g.nodes as Json[]).map((n) => ((n.data as Json)?.name as string) ?? String(n.type)),
			pendingRevision: null,
			reviewTarget: { kind: 'listing', version: 1, contentHash: hashOf(id), graphId: `g_${id}` },
			minExtensionVersion: '0.0.0',
			...o
		};
	};
	const listings: Record<string, { l: Json; src: string }> = {};
	const add = (id: string, src: string, o: Json) => (listings[id] = { l: listing(id, src, o), src });
	add('pw_docs_jwt', 'jwt-decoder', { iconEmoji: '🔐', publisher: publisher('usr_docs_mei', 'Mei Lin'), createdDate: ago(2, 5), lastModified: ago(2, 5), categories: ['Workflow_Category:developer_tools'] });
	add('pw_docs_color', 'color-converter', { iconEmoji: '🎨', publisher: publisher('usr_docs_jonas', 'Jonas Berg'), createdDate: ago(1, 7), lastModified: ago(1, 7), categories: ['Workflow_Category:developer_tools'] });
	add('pw_docs_json', 'json-prettify', {
		iconEmoji: '🧹',
		status: 'approved',
		createdDate: ago(40),
		lastModified: ago(0, 9),
		categories: ['Workflow_Category:data_files'],
		stats: { downloadCount: 412, rating: 4.6, lastVersion: 2, rankScore: 0, trendingScore: 0 },
		pendingRevision: {
			status: 'pending',
			name: 'JSON Prettify & Repair',
			description: graphOf('json-prettify').description,
			icon: '',
			iconEmoji: '🧹',
			language: 'en',
			tags: graphOf('json-prettify').tags ?? [],
			previews: [],
			categories: ['Workflow_Category:data_files'],
			narrationComplete: true,
			hasNewVersion: true,
			note: 'Repairs trailing commas and single quotes too.',
			moderationNote: null,
			createdDate: ago(0, 9),
			lastModified: ago(0, 9)
		},
		reviewTarget: { kind: 'revision', version: 3, contentHash: hashOf('pw_docs_json_r'), graphId: 'g_pw_docs_json_r' }
	});
	add('pw_docs_hash', 'hash-text', {
		iconEmoji: '#️⃣',
		status: 'approved',
		createdDate: ago(55),
		lastModified: ago(12),
		featured: true,
		curatedRank: 1,
		categories: ['Workflow_Category:developer_tools'],
		publisher: publisher('usr_docs_amara', 'Amara Okafor'),
		stats: { downloadCount: 1280, rating: 4.8, lastVersion: 3, rankScore: 0, trendingScore: 0 },
		reviewTarget: null
	});
	add('pw_docs_summary', 'summarize-page-llm-chain', {
		iconEmoji: '📝',
		status: 'approved',
		createdDate: ago(20),
		lastModified: ago(6),
		categories: ['Workflow_Category:research'],
		publisher: publisher('usr_docs_lucas', 'Lucas Martin'),
		stats: { downloadCount: 236, rating: 4.3, lastVersion: 1, rankScore: 0, trendingScore: 0 },
		reviewTarget: null
	});
	const pending = () => Object.values(listings).map((x) => x.l).filter((l) => l.status === 'pending' || (l.pendingRevision as Json | null)?.status === 'pending');
	const approved = () => Object.values(listings).map((x) => x.l).filter((l) => l.status === 'approved');

	function snapshot(id: string) {
		const x = listings[id];
		if (!x) return null;
		const g = graphOf(x.src);
		const target = x.l.reviewTarget as Json | null;
		return {
			version: (target?.version as number) ?? 1,
			requiredInputs: [],
			type: g.type ?? 'triggered',
			graph: { id: (target?.graphId as string) ?? `g_${id}`, workflowId: x.l.workflowId, nodes: g.nodes, edges: g.edges, createdDate: ago(2) }
		};
	}

	const reported = [
		{
			...listings.pw_docs_summary.l,
			reports: [
				{ id: 'rep_1', reason: 'malware', detail: 'It asked for access to every site, not just the page I was reading.', reporterName: 'Kenji Watanabe', createdDate: ago(1, 3) },
				{ id: 'rep_2', reason: 'other', detail: 'The summary step sends the page to a server I do not recognise.', reporterName: 'Hannah Becker', createdDate: ago(0, 6) }
			]
		},
		{
			...listings.pw_docs_hash.l,
			reports: [{ id: 'rep_3', reason: 'spam', detail: 'Same workflow listed twice under different names.', reporterName: 'Noah Williams', createdDate: ago(3, 2) }]
		}
	];

	// ── Audit log ────────────────────────────────────────────────────────
	const entry = (id: string, action: string, h: number, o: Json): Json => ({
		id,
		action,
		note: null,
		createdDate: NOW - h * HOUR,
		moderatorId: 'usr_docs_sam',
		moderatorName: 'Sam Rivera',
		targetType: 'listing',
		targetId: null,
		targetName: null,
		publishedWorkflowId: null,
		listingName: null,
		previousStatus: null,
		reason: null,
		attestation: null,
		metadata: null,
		...o
	});
	const audit = [
		entry('au_1', 'approve', 2, { targetId: 'pw_docs_summary', targetName: 'Summarise this page in 3 bullets', publishedWorkflowId: 'pw_docs_summary', listingName: 'Summarise this page in 3 bullets', previousStatus: 'pending', version: 1, attestation: { graphInspected: true, permissionsReviewed: true, contentReviewed: true, sandboxTested: true }, note: 'Clean graph, reads the active tab only.' }),
		entry('au_2', 'feature', 5, { moderatorId: 'usr_docs_alex', moderatorName: 'Alex Doe', targetId: 'pw_docs_hash', targetName: 'Hash Text', publishedWorkflowId: 'pw_docs_hash', listingName: 'Hash Text', metadata: { curatedRank: 1 } }),
		entry('au_3', 'reject', 26, { targetId: 'pw_docs_old', targetName: 'Bulk email sender', listingName: 'Bulk email sender', previousStatus: 'pending', version: 1, note: 'Please explain each step and drop the hard-coded address list.' }),
		entry('au_4', 'request_merge', 30, { moderatorId: 'usr_docs_alex', moderatorName: 'Alex Doe', targetType: 'request', targetId: 'wr_4', targetName: 'Save tweets to Notion', note: null }),
		entry('au_5', 'dismiss_report', 49, { targetId: 'pw_docs_color', targetName: 'Color Converter', listingName: 'Color Converter', note: 'Reported by mistake: works as described.' }),
		entry('au_6', 'category_update', 73, { moderatorId: 'usr_docs_alex', moderatorName: 'Alex Doe', targetType: 'category', targetId: 'research', targetName: 'Research' }),
		entry('au_7', 'suspend', 98, { targetId: 'pw_docs_spam', targetName: 'Free followers booster', listingName: 'Free followers booster', previousStatus: 'approved', reason: 'policy', note: 'Misleading description.' }),
		entry('au_8', 'import', 120, { targetType: 'import', targetName: 'awflow-marketplace-workflows', metadata: { created: 4, updated: 11, skipped: 23, errored: 0 } })
	];

	// ── Requests (request board) ─────────────────────────────────────────
	const req = (id: string, title: string, votes: number, status: string, days: number, o: Json = {}): Json => ({
		id,
		title,
		description: '',
		category: null,
		requester: { id: 'usr_docs_mei', name: 'Mei Lin', image: null, verified: false },
		voteCount: votes,
		hasVoted: false,
		status,
		createdDate: ago(days),
		etaDate: null,
		lastModified: ago(days),
		fulfilledPublishedWorkflowId: null,
		...o
	});
	const requests = [
		req('wr_1', 'Save the current page to Notion', 48, 'building', 20, { etaDate: NOW + 12 * DAY }),
		req('wr_2', 'Summarise YouTube video transcripts', 37, 'open', 15),
		req('wr_3', 'Export a LinkedIn profile to a Google Sheet', 29, 'open', 11),
		req('wr_5', 'Price-drop alert for any product page', 21, 'fulfilled', 40, { fulfilledPublishedWorkflowId: 'pw_docs_price' }),
		req('wr_6', 'Translate the selected text in place', 14, 'open', 5),
		req('wr_7', 'Auto-fill job applications from my CV', 9, 'declined', 30)
	];
	const clusters = [
		{
			canonical: requests[0],
			duplicates: [req('wr_4', 'Clip web pages into Notion', 6, 'open', 3)]
		},
		{
			canonical: requests[1],
			duplicates: [req('wr_8', 'TL;DR for YouTube videos', 3, 'open', 2)]
		}
	];

	// ── Newsletter ───────────────────────────────────────────────────────
	const issues: Json[] = [
		{ id: 'nl_3', subject: 'September: workflows that survive a closed tab', bodyMarkdown: 'Hi {{name}},\n\n…', status: 'sent', sentAt: ago(18), recipientCount: 1184, createdDate: ago(20) },
		{ id: 'nl_2', subject: 'August: the request board is live', bodyMarkdown: 'Hi {{name}},\n\n…', status: 'sent', sentAt: ago(49), recipientCount: 1032, createdDate: ago(50) },
		{ id: 'nl_1', subject: 'Welcome to the AWFlow newsletter', bodyMarkdown: 'Hi {{name}},\n\n…', status: 'sent', sentAt: ago(80), recipientCount: 918, createdDate: ago(82) }
	];
	let nextIssue = 4;

	// ── Workflow templates (first-party) ─────────────────────────────────
	const tpl = (id: string, slug: string, title: string, icon: string, category: string, status: string, order: number, tags: string[], o: Json = {}): Json => ({
		id,
		slug,
		title,
		summary: '',
		icon,
		category,
		tags,
		previews: [],
		status,
		sortOrder: order,
		createdDate: ago(60 - order),
		lastModified: ago(10 - Math.min(order, 9)),
		lock: null,
		...o
	});
	const templates = [
		tpl('tpl_1', 'summarise-page', 'Summarise any page', '📝', 'summarize', 'published', 1, ['ai', 'reading'], { summary: 'Three bullets for the page you are reading.' }),
		tpl('tpl_2', 'daily-digest', 'Daily digest to Slack', '☀️', 'schedule', 'published', 2, ['slack', 'schedule'], { summary: 'Every morning, post your feeds to a channel.' }),
		tpl('tpl_3', 'price-watch', 'Price watch', '🏷️', 'notify', 'published', 3, ['shopping'], { summary: 'Get a notification when a price drops.' }),
		tpl('tpl_4', 'sheet-sync', 'Table to Google Sheets', '📊', 'sync', 'draft', 4, ['sheets', 'scraping'], {
			summary: 'Copy a table from any page into a sheet.',
			lock: { templateId: 'tpl_4', lockedByUserId: 'usr_docs_sam', lockedByName: 'Sam Rivera', acquiredAt: NOW - 600_000, expiresAt: NOW + 600_000 }
		}),
		tpl('tpl_5', 'post-to-x', 'Share the page on X', '📣', 'publish', 'draft', 5, ['social'], { summary: 'Write a post about the page and share it.' })
	];

	// ── Agent templates ──────────────────────────────────────────────────
	const member = (key: string, name: string, role: string) => ({ key, name, role, avatar: null });
	const agentTemplates: Json[] = [
		{
			id: 'at_1',
			kind: 'team',
			name: 'Research desk',
			description: 'A researcher finds sources, a writer drafts a brief and an editor checks every claim against the sources.',
			iconEmoji: '🔎',
			tags: ['research', 'writing'],
			members: [member('lead', 'Ava', 'Editor'), member('r', 'Ravi', 'Researcher'), member('w', 'Wren', 'Writer')],
			memberCount: 3,
			needs: { workflows: ['Summarise this page in 3 bullets'], mcp: [] },
			status: 'pending',
			moderationNote: null,
			revision: null,
			installCount: 0,
			author: { id: 'usr_docs_priya', name: 'Priya Nair', image: null, verified: false },
			isMine: false,
			createdDate: ago(1, 4),
			lastModified: ago(1, 4)
		},
		{
			id: 'at_2',
			kind: 'agent',
			name: 'Inbox triage',
			description: 'Sorts new messages into reply now, later and archive, and drafts short replies for the first group.',
			iconEmoji: '📥',
			tags: ['email', 'productivity'],
			members: [member('main', 'Tess', 'Triage assistant')],
			memberCount: 1,
			needs: { workflows: [], mcp: [] },
			status: 'pending',
			moderationNote: null,
			revision: null,
			installCount: 0,
			author: { id: 'usr_docs_jonas', name: 'Jonas Berg', image: null, verified: false },
			isMine: false,
			createdDate: ago(0, 7),
			lastModified: ago(0, 7)
		}
	];

	// ── Insights ─────────────────────────────────────────────────────────
	const insights = (range: number) => {
		const k = range / 30;
		const n = (v: number) => Math.round(v * k);
		return {
			rangeDays: range,
			since: NOW - range * DAY,
			until: NOW,
			funnel: [
				{ step: 'viewed', count: n(4820) },
				{ step: 'clicked', count: n(1310) },
				{ step: 'allowed', count: n(1040) },
				{ step: 'installed', count: n(986) },
				{ step: 'setup', count: n(742) },
				{ step: 'ran', count: n(655) }
			],
			declines: {
				total: n(270),
				byCapability: [
					{ capability: 'code-execution', count: n(112) },
					{ capability: 'network', count: n(84) },
					{ capability: 'credentials', count: n(51) },
					{ capability: 'page-write', count: n(23) }
				]
			},
			sources: [
				{ source: 'search', count: n(412) },
				{ source: 'home', count: n(318) },
				{ source: 'shared_link', count: n(151) },
				{ source: 'request_board', count: n(64) },
				{ source: 'other', count: n(41) }
			],
			campaigns: [{ campaign: 'october-newsletter', source: 'newsletter', views: n(380), installs: n(96) }],
			listings: [
				{ listingId: 'pw_docs_hash', name: 'Hash Text', views: n(1620), installs: n(402), allowed: n(410), declined: n(12), ran: n(371), installRate: 0.25, declineRate: 0.03, runRate: 0.92, rating: 4.8, ratingCount: 61, flags: [] },
				{ listingId: 'pw_docs_json', name: 'JSON Prettify & Repair', views: n(1210), installs: n(288), allowed: n(296), declined: n(9), ran: n(250), installRate: 0.24, declineRate: 0.03, runRate: 0.87, rating: 4.6, ratingCount: 38, flags: [] },
				{ listingId: 'pw_docs_summary', name: 'Summarise this page in 3 bullets', views: n(980), installs: n(170), allowed: n(178), declined: n(121), ran: n(140), installRate: 0.17, declineRate: 0.4, runRate: 0.82, rating: 4.3, ratingCount: 22, flags: ['high_decline_rate'] },
				{ listingId: 'pw_docs_color', name: 'Color Converter', views: n(640), installs: n(31), allowed: n(33), declined: n(4), ran: n(12), installRate: 0.05, declineRate: 0.11, runRate: 0.39, rating: 4.1, ratingCount: 6, flags: ['low_install_rate', 'low_run_rate'] }
			],
			activity: {
				searches: n(6240),
				zeroResultSearches: n(410),
				publishStarted: n(58),
				publishSubmitted: n(41),
				approved: n(33),
				rejected: n(6),
				reviews: n(87),
				reports: n(5),
				requestsCreated: n(44),
				requestVotes: n(512),
				installFailures: n(7)
			}
		};
	};

	// ── Categories ───────────────────────────────────────────────────────
	const memberWorkflows = (catId: string) => {
		const items = Object.values(listings)
			.map((x) => x.l)
			.filter((l) => l.status === 'approved' && (l.categories as string[]).some((c) => c.endsWith(catId)))
			.map((l) => ({ id: l.id, name: l.name, iconEmoji: l.iconEmoji, icon: '', status: 'approved', downloadCount: (l.stats as Json).downloadCount }));
		return { items, total: items.length, page: 1, limit: 20 };
	};

	/** [status, json] for an admin endpoint, or null when it isn't one. */
	function answer(method: string, path: string, q: URLSearchParams, body: Json): [number, unknown] | null {
		const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
		// Users
		if (path === '/users' && method === 'GET') return [200, listUsers(q)];
		if (path === '/users/bulk') return [200, { requested: 0, applied: 0, skipped: [] }];
		if (seg[0] === 'users' && seg.length >= 2) {
			const u = users.find((x) => x.id === seg[1]);
			if (!u) return [404, { message: 'User not found' }];
			if (seg.length === 2 && method === 'GET')
				return [200, { user: u, plan: freePlan, subscription: { id: `sub_${u.id}`, userId: u.id, planId: 'free', billingCycle: 'monthly', status: 'active', startDate: u.createdAt, endDate: null }, stats: { workflows: 7, listings: 2, runs30d: 143, lastActiveAt: ago(0, 3) } }];
			if (seg[2] === 'content')
				return [200, { workflows: [{ id: 'wf_c1', name: 'JWT Decoder', status: 'active', visibility: 'public', lastModified: ago(2) }, { id: 'wf_c2', name: 'Morning reading list', status: 'inactive', visibility: 'private', lastModified: ago(9) }], listings: [{ id: 'pw_docs_jwt', name: 'JWT Decoder' }] }];
			if (seg[2] === 'activity')
				return [200, [{ kind: 'run', id: 'ex_1', at: ago(0, 3), detail: { workflowName: 'JWT Decoder', status: 'success' } }, { kind: 'session', id: 'se_1', at: ago(0, 5), detail: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141.0 Safari/537.36', ipAddress: '203.0.113.24' } }]];
			if (seg[2] === 'history') return [200, [{ id: 'ah_1', actorId: 'usr_docs_sam', actorName: 'Sam Rivera', action: 'resend_verification', targetUserId: u.id, reason: null, metadata: null, createdAt: ago(4) }]];
			return [200, { ok: true }];
		}
		// Marketplace moderation
		if (path === '/published-workflows/moderation/queue') return [200, pending()];
		if (path === '/published-workflows/moderation/reports') return [200, reported];
		if (path === '/published-workflows/moderation/audit') {
			let items = audit;
			const by = q.get('moderatorId');
			if (by) items = items.filter((a) => a.moderatorId === by);
			return [200, { items, total: items.length, page: 1, limit: 50, moderators: [{ id: 'usr_docs_sam', name: 'Sam Rivera' }, { id: 'usr_docs_alex', name: 'Alex Doe' }] }];
		}
		if (path === '/published-workflows' && method === 'GET') return [200, approved()];
		if (seg[0] === 'published-workflows' && seg[1] && listings[seg[1]]) {
			const id = seg[1];
			if (seg.length === 2 && method === 'GET') return [200, listings[id].l];
			if (seg[2] === 'graph') return [200, snapshot(id)];
			if (seg[2] === 'releases') return [200, [{ version: 1, note: null, date: listings[id].l.createdDate }]];
			if (seg[2] === 'publisher' || seg[2] === 'author') return [200, { id: (listings[id].l.publisher as Json).id, name: (listings[id].l.publisher as Json).name, image: null, verified: false, bio: null, listingCount: 2, totalDownloads: 412, avgRating: 4.6, joinedDate: ago(90) }];
			if (seg[2] === 'reviews') return [200, []];
		}
		if (path === '/published-workflows/import/plan') {
			const states: Record<string, string> = {
				'summarize-this-page': 'update',
				'tone-checker': 'new',
				'keyword-extractor': 'new',
				'classify-text': 'unchanged',
				'flashcards-from-text': 'live-diverged',
				'sentiment-of-text': 'conflict'
			};
			const items = ((body.items as { slug: string }[]) ?? []).map((i) => ({
				slug: i.slug,
				state: states[i.slug] ?? 'new',
				...(states[i.slug] && states[i.slug] !== 'new' ? { publishedWorkflowId: `pw_official_${i.slug.replace(/-/g, '_')}` } : {})
			}));
			return [200, { items }];
		}
		if (path === '/admin/marketplace/insights') return [200, insights(Number(q.get('range') ?? 30))];
		// Requests
		if (path === '/wanted-flows/duplicate-clusters') return [200, clusters];
		if (path === '/wanted-flows' && method === 'GET') return [200, requests];
		if (path === '/wanted-flows/stats') return [200, { requestsThisWeek: 12, votesThisWeek: 140, shippedThisMonth: 3, inReviewNow: 2 }];
		// Newsletter
		if (path === '/newsletter/admin/issues' && method === 'GET') return [200, issues];
		if (path === '/newsletter/admin/issues' && method === 'POST') {
			const issue = { id: `nl_${nextIssue++}`, subject: '', bodyMarkdown: '', status: 'draft', sentAt: null, recipientCount: null, createdDate: Date.now() };
			issues.unshift(issue);
			return [200, issue];
		}
		if (seg[0] === 'newsletter' && seg[1] === 'admin' && seg[2] === 'issues' && seg[3]) {
			const issue = issues.find((i) => i.id === seg[3]);
			if (!issue) return [404, { message: 'Not found' }];
			if (method === 'PATCH') Object.assign(issue, body);
			if (seg[4] === 'test') return [200, { ok: true }];
			return [200, issue];
		}
		if (path === '/newsletter/admin/subscribers/count') return [200, { subscribed: 1207, unsubscribed: 143 }];
		// Templates
		if (path === '/templates/admin/all') return [200, templates];
		if (path === '/templates' && method === 'GET') return [200, templates.filter((t) => t.status === 'published')];
		// Agent templates
		if (path === '/agent-templates/moderation') return [200, agentTemplates.filter((t) => t.status === (q.get('status') ?? 'pending'))];
		// Categories
		if (seg[0] === 'workflow-categories' && seg[2] === 'workflows') return [200, memberWorkflows(seg[1].replace(/^.*:/, ''))];
		return null;
	}

	return { answer };
}
