/**
 * RSS feed of AWFlow releases at /releases/rss.xml (awflow/Agentic-Flow#1345).
 *
 * Built from src/data/releases.ts. It also validates that data: a "new" change
 * without a link, or a link to a page that does not exist, fails the build
 * (the links validator cannot see links passed to Svelte components as props).
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { KIND_LABEL, RELEASES, findReleaseProblems, releaseHref, type ChangeKind } from '../../data/releases';

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
	const docs = await getCollection('docs');
	const paths = new Set(docs.map((d) => (d.id === 'index' || d.id === '' ? '/' : `/${d.id.replace(/\/index$/, '')}/`)));
	const problems = findReleaseProblems(paths);
	if (problems.length) {
		throw new Error(`src/data/releases.ts has ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
	}

	const site = context.site ?? new URL('https://docs.awflow.io');
	const abs = (path: string) => new URL(path, site).href;

	return rss({
		title: 'AWFlow release notes',
		description: 'What changed in each version of Agentic Workflow (AWFlow), newest first.',
		site: abs('/releases/'),
		trailingSlash: true,
		items: RELEASES.map((r) => {
			const groups = (['new', 'improved', 'fixed'] as ChangeKind[])
				.map((kind) => ({ kind, items: r.changes.filter((c) => c.kind === kind) }))
				.filter((g) => g.items.length)
				.map(
					(g) =>
						`<h3>${KIND_LABEL[g.kind]}</h3><ul>${g.items
							.map(
								(c) =>
									`<li>${escape(c.text)}${c.link ? ` <a href="${escape(abs(c.link))}">${escape(c.label ?? 'Read more')}</a>` : ''}</li>`,
							)
							.join('')}</ul>`,
				)
				.join('');
			return {
				title: `v${r.version}: ${r.headline}`,
				link: releaseHref(r.version),
				pubDate: new Date(`${r.date}T00:00:00Z`),
				description: r.summary,
				content: `<p>${escape(r.summary)}</p>${groups}`,
				categories: Array.from(new Set(r.changes.map((c) => c.area))),
			};
		}),
		customData: '<language>en</language>',
	});
}
