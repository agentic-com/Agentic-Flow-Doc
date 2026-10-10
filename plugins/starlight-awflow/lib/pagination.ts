import type { StarlightRouteData } from '@astrojs/starlight/route-data';

type Entry = StarlightRouteData['sidebar'][number];
type Group = Extract<Entry, { type: 'group' }>;

function links(entries: Entry[]): string[] {
	return entries.flatMap((e) => (e.type === 'link' ? [e.href] : links(e.entries)));
}

/** Innermost group that contains the current page; undefined when the page sits at the topic root. */
function currentGroup(entries: Entry[]): Group | undefined {
	for (const e of entries) {
		if (e.type === 'link') continue;
		const inner = currentGroup(e.entries);
		if (inner) return inner;
		if (e.entries.some((c) => c.type === 'link' && c.isCurrent)) return e;
	}
	return undefined;
}

/**
 * Keep prev/next inside the current sidebar group so "Get Variable → In-Page Form"
 * style jumps across groups disappear (awflow/Agentic-Flow#1330).
 */
export function scopePagination(route: StarlightRouteData) {
	const group = currentGroup(route.sidebar);
	if (!group) return;
	const allowed = new Set(links(group.entries));
	const { prev, next } = route.pagination;
	if (prev && !allowed.has(prev.href)) route.pagination.prev = undefined;
	if (next && !allowed.has(next.href)) route.pagination.next = undefined;
}
