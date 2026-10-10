/**
 * starlight-awflow — the in-repo Starlight plugin behind the AWFlow docs redesign
 * (awflow/Agentic-Flow#1346, epic #1308).
 *
 * It only uses documented Starlight extension points: component overrides that wrap the default
 * components, a route middleware, and customCss. No fork.
 */
import type { StarlightPlugin } from '@astrojs/starlight/types';
import { fileURLToPath } from 'node:url';
import { SECTION_PALETTE } from './palette';
import type { AwflowSection, StarlightAwflowOptions } from './types';

export type * from './types';
export { SECTION_PALETTE };

const VIRTUAL_CONFIG = 'virtual:starlight-awflow/config';
const VIRTUAL_NODES = 'virtual:starlight-awflow/nodes';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default function starlightAwflow(options: StarlightAwflowOptions): StarlightPlugin {
	if (!options?.sections?.length) {
		throw new Error('[starlight-awflow] `sections` must list at least one header tab.');
	}

	const sections: (AwflowSection & { topic?: string; match: string[] })[] = options.sections.map((s) => ({
		id: s.id,
		label: s.label,
		link: s.link,
		topic: s.topic,
		match: s.match ?? [],
		color: s.color ?? SECTION_PALETTE[s.id]?.color ?? '#B45309',
		tint: s.tint ?? SECTION_PALETTE[s.id]?.tint ?? '#FEF3E2',
	}));

	const resolved = {
		sections,
		version: options.version ?? null,
		install: options.install ?? null,
		askAria:
			options.askAria === false
				? null
				: {
						href: options.askAria?.href ?? '#ask-aria',
						label: options.askAria?.label ?? 'Ask Aria',
						shortcut: options.askAria?.shortcut ?? '⌘I',
					},
		banner: options.banner ?? 'auto',
		pagination: options.pagination ?? 'group',
		noPagination: options.noPagination ?? [],
		ogImages: options.ogImages ?? true,
	};
	const nodesData = options.nodesData ?? '/src/data/nodes.json';

	return {
		name: 'starlight-awflow',
		hooks: {
			'config:setup'({ addIntegration, addRouteMiddleware, config, updateConfig }) {
				// Our overrides go first so a project-level override in astro.config.mjs still wins.
				updateConfig({
					components: {
						Header: here('./overrides/Header.astro'),
						PageTitle: here('./overrides/PageTitle.astro'),
						PageSidebar: here('./overrides/PageSidebar.astro'),
						Footer: here('./overrides/Footer.astro'),
						...config.components,
					},
					customCss: [
						'@fontsource-variable/geist',
						'@fontsource-variable/geist-mono',
						...(config.customCss ?? []),
						here('./styles/tokens.css'),
						here('./styles/layout.css'),
						here('./styles/motion.css'),
						here('./styles/content.css'),
						here('./styles/components.css'),
						here('./styles/mermaid.css'),
					],
				});

				// Runs after starlight-sidebar-topics (order: 'pre'), so the current topic is known.
				addRouteMiddleware({ entrypoint: here('./route-middleware.ts') });

				addIntegration({
					name: 'starlight-awflow-virtual-modules',
					hooks: {
						'astro:config:setup'({ updateConfig: updateAstroConfig }) {
							updateAstroConfig({
								vite: {
									plugins: [
										{
											name: 'vite-plugin-starlight-awflow',
											resolveId(id: string) {
												if (id === VIRTUAL_CONFIG || id === VIRTUAL_NODES) return '\0' + id;
											},
											load(id: string) {
												if (id === '\0' + VIRTUAL_CONFIG) {
													return `export default ${JSON.stringify(resolved)};`;
												}
												if (id === '\0' + VIRTUAL_NODES) {
													// import.meta.glob tolerates a missing file: the generator (#1313) may not have run yet.
													return [
														`const found = import.meta.glob(${JSON.stringify(nodesData)}, { eager: true, import: 'default' });`,
														`export default Object.values(found)[0] ?? null;`,
													].join('\n');
												}
											},
										},
									],
								},
							});
						},
					},
				});
			},
		},
	};
}
