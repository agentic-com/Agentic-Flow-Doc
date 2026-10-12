import { describe, expect, test } from 'bun:test';
import { toChangeItem, toReleaseItem } from './releaseItem.ts';
import { RELEASES } from './releases.ts';

const base = 'https://docs.awflow.io';

describe('releases.json mapping', () => {
	test('maps kind/text/link to type/text/absolute href', () => {
		expect(toChangeItem({ kind: 'new', area: 'Nodes', text: 'T', link: '/a/b/#x', label: 'L' }, base)).toEqual({
			type: 'new',
			text: 'T',
			href: `${base}/a/b/#x`,
		});
		const fixed = toChangeItem({ kind: 'fixed', area: 'App', text: 'F' }, base);
		expect(fixed).toEqual({ type: 'fixed', text: 'F' });
		expect('href' in fixed).toBe(false);
	});

	test('every release keeps all its changes', () => {
		for (const r of RELEASES) {
			const item = toReleaseItem(r, base);
			expect(item.changes).toHaveLength(r.changes.length);
			expect(item.changes.every((c) => ['new', 'improved', 'fixed'].includes(c.type))).toBe(true);
		}
	});
});
