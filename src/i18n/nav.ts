/**
 * Sidebar and topic label translations for astro.config.mjs and scripts/nodes/sidebar.mjs.
 * Labels are keyed by their English text in nav-labels.ts; a missing one fails the build.
 */
import { NAV_LABELS } from './nav-labels';

const lookup = (label: string) => {
	const tr = NAV_LABELS[label];
	if (!tr) throw new Error(`[i18n] No translation for sidebar label "${label}" (add it to src/i18n/nav-labels.ts)`);
	return tr;
};

/** Spread into a sidebar item: `{ ...nav('Overview'), link: 'app' }`. */
export const nav = (label: string) => ({ label, translations: { ...lookup(label) } });

/** Value for a starlight-sidebar-topics `label`. */
export const topicLabel = (label: string) => {
	const tr = lookup(label);
	return { en: label, fr: tr.fr, de: tr.de, 'zh-CN': tr['zh-CN'], 'zh-cn': tr['zh-CN'] };
};
