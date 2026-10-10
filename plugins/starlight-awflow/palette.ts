import type { AwflowSectionId } from './types';

/** Brand section palette (Main.dc.html · 01). Every solid colour passes AA with white text. */
export const SECTION_PALETTE: Record<AwflowSectionId, { color: string; tint: string }> = {
	'get-started': { color: '#B45309', tint: '#FEF3E2' },
	app: { color: '#BE185D', tint: '#FCE7F3' },
	recipes: { color: '#15803D', tint: '#DCFCE7' },
	nodes: { color: '#4338CA', tint: '#E0E7FF' },
	concepts: { color: '#0F766E', tint: '#CCFBF1' },
	releases: { color: '#6D28D9', tint: '#EDE9FE' },
};
