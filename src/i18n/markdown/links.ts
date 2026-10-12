/**
 * Sources keep English links; in a translated page, internal page links point at the same
 * locale (/app/x/ → /fr/app/x/). Files and endpoints stay as they are (see localizeHref).
 */
import type { HastPluginEntry } from 'satteri';
import { localizeHref } from '../locales';
import { translatedInfo } from './english-headings';

export const i18nLinks: HastPluginEntry = (ctx) => {
	const info = translatedInfo(ctx.fileURL);
	if (!info) return null;
	return {
		name: 'awf-i18n-links',
		element: {
			filter: ['a'],
			visit(node, c) {
				const href = node.properties?.href;
				if (typeof href !== 'string') return;
				const next = localizeHref(href, info.lang);
				if (next !== href) c.setProperty(node, 'href', next);
			},
		},
	};
};
