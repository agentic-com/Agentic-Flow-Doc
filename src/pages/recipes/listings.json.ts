/**
 * Marketplace listing → docs recipe map (awflow/Agentic-Flow#1342). The app fetches this to show a
 * "How it works" link on listings that have a recipe, so new recipes link back without an app release.
 * Served with CORS * (vercel.json).
 */
import type { APIRoute } from 'astro';
import recipesData from '../../data/recipes.json';

type Recipe = { title: string; href: string; marketplaceId?: string | null };

export const GET: APIRoute = ({ site }) => {
	const list = (Array.isArray(recipesData) ? recipesData : (recipesData as { recipes: Recipe[] }).recipes) as Recipe[];
	const base = site ? site.toString().replace(/\/$/, '') : 'https://docs.awflow.io';
	const listings: Record<string, { title: string; url: string }> = {};
	for (const r of list) {
		if (r.marketplaceId) listings[r.marketplaceId] = { title: r.title, url: `${base}${r.href}` };
	}
	return new Response(JSON.stringify({ version: 1, listings }, null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
