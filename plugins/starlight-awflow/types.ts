/**
 * Public types for the in-repo `starlight-awflow` plugin (awflow/Agentic-Flow#1346).
 */

/** Section ids. They match the `section` frontmatter enum in `src/content.config.ts`. */
export type AwflowSectionId = 'get-started' | 'app' | 'recipes' | 'nodes' | 'concepts' | 'releases';

/** Node families. They match `node.family` in `src/content.config.ts`. */
export type AwflowNodeFamily = 'trigger' | 'lambda' | 'inpage' | 'flow' | 'data' | 'core' | 'ai' | 'integration';

export interface AwflowSectionOption {
	/** Section id. Pages opt in with `section: <id>` frontmatter. */
	id: AwflowSectionId;
	/** Tab label shown in the header. */
	label: string;
	/** Where the tab links to (the section landing page). */
	link: string;
	/**
	 * Link of the `starlight-sidebar-topics` topic this tab stands for (e.g. `/app/`).
	 * When the current page belongs to that topic, this tab is the current one.
	 */
	topic?: string;
	/** Extra path prefixes that belong to this section (e.g. `/recipes/`). */
	match?: string[];
	/** Solid section colour. Defaults to the brand colour for `id`. */
	color?: string;
	/** Light tint used for hover states and node headers. Defaults to the brand tint for `id`. */
	tint?: string;
}

export interface StarlightAwflowOptions {
	/**
	 * Header tabs, in order. Each one is a section with its own colour. The list can grow to six tabs
	 * (Get started · Use the app · Recipes · Nodes · Concepts · Releases) without code changes.
	 */
	sections: AwflowSectionOption[];
	/** Version pill in the header, e.g. `v0.8.2`. Omit to hide it. */
	version?: { label: string; href?: string };
	/** Primary call to action in the header. Omit to hide it. */
	install?: { label: string; href: string };
	/** Target of the floating Ask Aria pill. Defaults to `#ask-aria` (wired in a later wave). */
	askAria?: { href?: string; label?: string; shortcut?: string } | false;
	/**
	 * Project-relative path to the generated node metadata (awflow/Agentic-Flow#1313).
	 * A missing file is fine: node pages fall back to frontmatter.
	 * @default '/src/data/nodes.json'
	 */
	nodesData?: string;
	/**
	 * When to render the coloured section banner in place of the plain page title.
	 * - `auto`: whenever a section can be resolved (frontmatter `section`, the sidebar topic, or a path prefix).
	 * - `frontmatter`: only on pages that set `section` or `kind` in frontmatter.
	 * @default 'auto'
	 */
	banner?: 'auto' | 'frontmatter';
	/**
	 * How far prev/next pagination may travel.
	 * - `group`: stay inside the innermost sidebar group of the current page.
	 * - `topic`: stay inside the current sidebar topic (starlight-sidebar-topics behaviour).
	 * @default 'group'
	 */
	pagination?: 'group' | 'topic';
	/**
	 * Path prefixes where prev/next is hidden entirely (reference pages whose sidebar order is
	 * alphabetical, e.g. `/nodes/`). `kind: node` pages never show prev/next either.
	 * @default []
	 */
	noPagination?: string[];
	/** Add `og:image` / `twitter:image` meta pointing at `/og/<slug>.png`. @default true */
	ogImages?: boolean;
}

/** Resolved section exposed to components. */
export interface AwflowSection {
	id: AwflowSectionId;
	label: string;
	link: string;
	color: string;
	tint: string;
}

export interface AwflowTab extends AwflowSection {
	isCurrent: boolean;
}

/** Normalised node metadata: frontmatter merged with `nodes.json` when it exists. */
export interface AwflowNodeMeta {
	id: string;
	family?: AwflowNodeFamily;
	familyLabel?: string;
	agentTool?: boolean;
	deprecated?: boolean;
	since?: string;
	worksIn?: ('extension' | 'web')[];
	/** Icon from nodes.json: an SVG string or an image URL. */
	icon?: string;
	/** "Needs" row: credential or setup. */
	needs?: string;
	operations?: number;
	outputs?: number;
	/** The raw nodes.json entry, untouched. */
	data?: Record<string, unknown>;
}

/** What the route middleware puts on `Astro.locals.starlightRoute.awflow`. */
export interface AwflowRouteData {
	section: AwflowSection | undefined;
	tabs: AwflowTab[];
	kind: string | undefined;
	node: AwflowNodeMeta | undefined;
	/** Whether PageTitle should render the banner / node header. */
	showBanner: boolean;
	/** Breadcrumb-like eyebrow, e.g. `nodes / builtin / flow`. */
	eyebrow: string;
	/** URL of the raw Markdown twin (starlight-md-txt). */
	markdownUrl: string | undefined;
}
