/** Release list for the awflow.io website (awflow/awflow-website `bun run data:sync`). Field changes are breaking. */
import type { APIRoute } from 'astro';
import { RELEASES } from '../../data/releases';
import { toReleaseItem } from '../../data/releaseItem';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const base = (site ? site.toString() : 'https://docs.awflow.io').replace(/\/$/, '');
	const list = [...RELEASES]
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
		.map((r) => toReleaseItem(r, base));
	return new Response(JSON.stringify(list), {
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
	});
};
