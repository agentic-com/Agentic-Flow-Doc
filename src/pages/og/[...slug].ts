/**
 * Open Graph images, one per docs page, in brand style (awflow/Agentic-Flow#1330).
 * Served at /og/<page-id>.png; the starlight-awflow middleware adds the og:image meta tags.
 */
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import awflow from 'virtual:starlight-awflow/config';
import { langFromPath, stripLocale } from '../../i18n/locales';
import { ogPageKey } from '../../i18n/og-key';
import { ogFamilies, ogFonts } from '../../i18n/og-fonts';

const hexToRgb = (hex: string): [number, number, number] => {
	const n = parseInt(hex.replace('#', ''), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const trim = (s: string) => s.replace(/^\/+|\/+$/g, '');

const entries = await getCollection('docs');
// Pages without a translation render the English page under the locale prefix (Starlight fallback),
// and the middleware points their og:image at /og/<prefix>/<id>.png, so give those an image too.
const english = entries.filter((e) => langFromPath(e.id) === 'en');
const translatedIds = new Set(entries.map((e) => e.id));
const pages = Object.fromEntries([
	...entries.map(({ id, data }) => [ogPageKey(id), data] as const),
	...(['fr', 'de', 'zh-cn'] as const).flatMap((p) =>
		english
			.filter((e) => !translatedIds.has(e.id ? `${p}/${e.id}` : p))
			.map(({ id, data }) => [ogPageKey(id ? `${p}/${id}` : p), data] as const),
	),
]);

const sectionFor = (id: string, section?: string) =>
	awflow.sections.find((s) => s.id === section) ??
	awflow.sections.find((s) => [s.link, s.topic ?? '', ...s.match].some((p) => trim(p) && id.startsWith(trim(p))));

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	getImageOptions: (id, page: (typeof entries)[number]['data']) => {
		const lang = langFromPath(id);
		const accent = sectionFor(stripLocale(id), page.section)?.color ?? '#B45309';
		return {
			title: page.title,
			description: page.description,
			logo: { path: './src/assets/logo.png', size: [72] },
			bgGradient: [hexToRgb('#FFFBF5'), hexToRgb('#FFF3E3')],
			border: { color: hexToRgb(accent), width: 24, side: 'inline-start' },
			padding: 72,
			font: {
				title: { families: ogFamilies(lang), weight: 'Bold', size: 68, lineHeight: 1.1, color: hexToRgb('#1C1917') },
				description: { families: ogFamilies(lang), size: 34, lineHeight: 1.4, color: hexToRgb('#57534E') },
			},
			fonts: ogFonts(lang),
		};
	},
});
