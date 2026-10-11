/** Static data endpoint for the awflow.io website (awflow/awflow-website `bun run data:sync`). Field changes are breaking. */
import type { APIRoute } from 'astro';
import data from '../../data/integration-groups.json';

export const prerender = true;

export const GET: APIRoute = () =>
	new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
	});
