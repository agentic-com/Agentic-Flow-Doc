/**
 * Real numbers for the docs home (awflow/Agentic-Flow#1317). Everything shown on the home page is
 * derived at build time from the content collection and src/data/*.json — no hard-coded counts.
 */
import { getCollection } from 'astro:content';
import nodes from '../../data/nodes.json';

type NodeEntry = { id: string; name: string; family: string };

// Optional: a recipes catalogue may be generated later; the number is only shown when it exists.
const recipeData = import.meta.glob('/src/data/recipes.json', { eager: true, import: 'default' });

/** Integration nodes that are not a third-party app. */
const NOT_AN_APP = new Set(['builtin/integration/custom-api', 'builtin/integration/push-notification']);

function versionKey(id: string): number[] {
	return (id.match(/v(\d+)-(\d+)-(\d+)/)?.slice(1) ?? []).map(Number);
}

function compareVersions(a: number[], b: number[]): number {
	for (let i = 0; i < 3; i++) if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) - (b[i] ?? 0);
	return 0;
}

export async function getHomeData() {
	const docs = await getCollection('docs');
	const under = (prefix: string) => docs.filter((d) => d.id.startsWith(prefix + '/')).length;

	const releases = docs
		.filter((d) => /^releases\/v\d+-\d+-\d+$/.test(d.id))
		.sort((a, b) => compareVersions(versionKey(b.id), versionKey(a.id)));
	const latest = releases[0];
	const latestVersion = latest ? 'v' + versionKey(latest.id).join('.') : null;

	const list = nodes as NodeEntry[];
	const apps = list
		.filter((n) => n.family === 'integration' && !NOT_AN_APP.has(n.id))
		.map((n) => n.name);
	// Hosted model providers from the chat-model dependency nodes ("Chat OpenAI" → "OpenAI").
	const models = list
		.filter((n) => n.id.startsWith('builtin/ai/aidependencies/llm/') && n.name.startsWith('Chat '))
		.map((n) => n.name.replace(/^Chat /, ''));

	const recipes = Object.values(recipeData)[0] as unknown;
	const recipeList = Array.isArray(recipes)
		? recipes
		: Array.isArray((recipes as { recipes?: unknown[] } | undefined)?.recipes)
			? (recipes as { recipes: unknown[] }).recipes
			: null;

	return {
		nodeCount: list.length,
		appCount: apps.length,
		marquee: [...apps, ...models].sort((a, b) => a.localeCompare(b)),
		recipeCount: recipeList?.length ?? null,
		counts: {
			getStarted: under('get-started'),
			app: under('app'),
			concepts: under('concepts'),
		},
		latest: latest
			? { version: latestVersion!, href: `/${latest.id}/`, description: latest.data.description }
			: null,
	};
}
