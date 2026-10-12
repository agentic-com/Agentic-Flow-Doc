import { releaseHref, type Change, type Release } from './releases';

export type ReleaseChangeItem = { type: 'new' | 'improved' | 'fixed'; text: string; href?: string };

/**
 * Mapping for the public /data/releases.json `changes` field.
 * - `kind` -> `type`: the source ChangeKind is already 'new' | 'improved' | 'fixed', so it is 1:1.
 *   Any unknown kind would fall back to 'improved' (closest neutral bucket).
 * - `text` -> `text` unchanged.
 * - `link` (site-relative docs path, optional #anchor) -> `href`, made absolute with the site base;
 *   omitted when the change has no link.
 * - `area` and `label` are intentionally not exposed.
 */
export function toChangeItem(c: Change, base: string): ReleaseChangeItem {
	const type = c.kind === 'new' || c.kind === 'improved' || c.kind === 'fixed' ? c.kind : 'improved';
	const item: ReleaseChangeItem = { type, text: c.text };
	if (c.link) item.href = `${base}${c.link}`;
	return item;
}

export function toReleaseItem(r: Release, base: string) {
	return {
		version: r.version,
		date: r.date,
		title: r.headline,
		summary: r.summary,
		href: `${base}${releaseHref(r.version)}`,
		teaser: r.teaser ?? null,
		breaking: r.breaking ?? false,
		browsers: r.browsers,
		changes: r.changes.map((c) => toChangeItem(c, base)),
	};
}
