/** Release list for the awflow.io website (awflow/awflow-website `bun run data:sync`). Field changes are breaking. */
import type { APIRoute } from 'astro';
import { RELEASES, releaseHref } from '../../data/releases';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const base = (site ? site.toString() : 'https://docs.awflow.io').replace(/\/$/, '');
	const list = [...RELEASES]
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
		.map((r) => ({
			version: r.version,
			date: r.date,
			title: r.headline,
			summary: r.summary,
			href: `${base}${releaseHref(r.version)}`,
			teaser: r.teaser ?? null,
			breaking: r.breaking ?? false,
			browsers: r.browsers,
		}));
	return new Response(JSON.stringify(list), {
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
	});
};
