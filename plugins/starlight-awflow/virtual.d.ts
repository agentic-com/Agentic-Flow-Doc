declare module 'virtual:starlight-awflow/config' {
	import type { AwflowSection } from './types';
	const config: {
		sections: (AwflowSection & { topic?: string; match: string[] })[];
		version: { label: string; href?: string } | null;
		install: { label: string; href: string } | null;
		askAria: { href: string; label: string; shortcut: string } | null;
		banner: 'auto' | 'frontmatter';
		pagination: 'group' | 'topic';
		noPagination: string[];
		ogImages: boolean;
	};
	export default config;
}

declare module 'virtual:starlight-awflow/nodes' {
	/** Contents of nodes.json, or null when the generator has not produced it. */
	const nodes: unknown;
	export default nodes;
}
