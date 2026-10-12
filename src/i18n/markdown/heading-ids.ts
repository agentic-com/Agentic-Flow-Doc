/**
 * Translated pages keep the English heading ids (by position), so /fr/…/#google works like
 * /…/#google. Runs before Astro's heading-id plugin, which keeps an id that is already set.
 * i18n:check guarantees the heading structure matches English.
 */
import type { HastPluginEntry } from 'satteri';
import { englishHeadingsFor, translatedInfo } from './english-headings';

export const i18nHeadingIds: HastPluginEntry = (ctx) => {
	const info = translatedInfo(ctx.fileURL);
	if (!info) return null;
	let english: { depth: number; slug: string }[] = [];
	let i = 0;
	return {
		name: 'awf-i18n-heading-ids',
		async before() {
			english = await englishHeadingsFor(info.englishPath);
		},
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, c) {
				const match = english[i++];
				if (match && match.depth === Number(node.tagName[1]) && typeof node.properties?.id !== 'string') {
					c.setProperty(node, 'id', match.slug);
				}
			},
		},
	};
};
