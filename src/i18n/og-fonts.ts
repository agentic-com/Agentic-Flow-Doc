import type { Lang } from './locales';

const GEIST = [
	'./node_modules/@fontsource/geist/files/geist-latin-700-normal.woff',
	'./node_modules/@fontsource/geist/files/geist-latin-400-normal.woff',
];
const NOTO_DIR = './node_modules/@fontsource/noto-sans-sc/files';

// Fontsource's `chinese-simplified` files hold ~7.9k simplified-Chinese glyphs in one font. They are
// named "Noto Sans SC Thin" inside the file (a Fontsource quirk; the weight is still 400/700), and that
// is the family name canvaskit matches. The numbered unicode-range chunks (noto-sans-sc-<n>-<weight>)
// all share the family "Noto Sans SC" and canvaskit only resolves one of them, leaving tofu.
const NOTO = [`${NOTO_DIR}/noto-sans-sc-chinese-simplified-700-normal.woff`, `${NOTO_DIR}/noto-sans-sc-chinese-simplified-400-normal.woff`];

/** Fonts for a page's OG image. Chinese titles need CJK glyphs (Geist is Latin only). */
export const ogFonts = (lang: Lang): string[] => (lang === 'zh-CN' ? [...GEIST, ...NOTO] : GEIST);

export const ogFamilies = (lang: Lang): string[] => (lang === 'zh-CN' ? ['Geist', 'Noto Sans SC Thin'] : ['Geist']);
