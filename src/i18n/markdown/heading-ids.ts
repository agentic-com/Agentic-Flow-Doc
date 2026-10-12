/**
 * Translated pages keep the English heading ids (by position), so /fr/…/#google works like
 * /…/#google. i18n:check guarantees the heading structure matches English.
 *
 * The English id always wins, even over an id already on the node: starlight-heading-badges
 * unshifts its own id plugins (github-slugger over the translated text) to the front of
 * `hastPlugins`, so by the time this runs translated headings already carry translated ids.
 * Astro's and Starlight's later heading-id plugins keep an existing id, so the TOC and the
 * anchor links follow the English id set here.
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
				if (match && match.depth === Number(node.tagName[1]) && node.properties?.id !== match.slug) {
					c.setProperty(node, 'id', match.slug);
				}
			},
		},
	};
};
