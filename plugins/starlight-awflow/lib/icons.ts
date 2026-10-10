import type { AwflowNodeFamily } from '../types';

/** Generic 24px stroke glyphs per node family, used when nodes.json has no icon. */
export const FAMILY_ICONS: Record<AwflowNodeFamily | 'default', string> = {
	trigger: 'M13 2 4 14h7l-1 8 9-12h-7z',
	lambda: 'M6 4h3l9 16M6 20l6-9',
	inpage: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M9 21V9',
	flow: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
	data: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
	core: 'M8 6 2 12l6 6M16 6l6 6-6 6',
	ai: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z',
	integration: 'M9 3v18M15 3v18M3 9h18M3 15h18',
	default: 'M4 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM12 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM12 7.5h2a3 3 0 0 1 3 3V13',
};
