import { describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gitBlobHash } from '../../src/i18n/blob';
import { statusOf } from '../../scripts/i18n/status';

const root = mkdtempSync(join(tmpdir(), 'awf-status-'));
const d = (p: string) => join(root, 'src/content/docs', p);
for (const dir of ['app', 'releases', 'fr/app', 'de/app', 'zh-cn/app']) {
	mkdirSync(d(dir), { recursive: true });
}
const a = '---\ntitle: A\n---\nA\n';
writeFileSync(d('app/a.mdx'), a);
writeFileSync(d('app/b.mdx'), '---\ntitle: B\n---\nB\n');
writeFileSync(d('releases/v1.mdx'), '---\ntitle: v1\n---\n');
writeFileSync(d('fr/app/a.mdx'), `---\ntitle: A fr\ni18n:\n  source: ${gitBlobHash(a)}\n---\nA\n`);
writeFileSync(d('fr/app/b.mdx'), `---\ntitle: B fr\ni18n:\n  source: ${'0'.repeat(40)}\n---\nB\n`);
writeFileSync(d('fr/app/gone.mdx'), '---\ntitle: gone\n---\n');
writeFileSync(d('de/app/a.mdx'), '---\ntitle: A de\n---\nA\n');

// An all-digit hash written unquoted must stay a 40-character string, not a YAML number.
const digits = '1'.repeat(40);
const c = '---\ntitle: C\n---\nC\n';
writeFileSync(d('app/c.mdx'), c);
writeFileSync(d('zh-cn/app/c.mdx'), `---\ntitle: C zh\ni18n:\n  source: ${digits}\n---\nC\n`);

describe('statusOf', () => {
	const r = statusOf(root);
	test('fr', () => {
		expect(r.locales.fr.upToDate).toEqual(['app/a.mdx']);
		expect(r.locales.fr.stale.map((s) => s.page)).toEqual(['app/b.mdx']);
		expect(r.locales.fr.orphaned).toEqual(['app/gone.mdx']);
		expect(r.locales.fr.missing).toEqual(['app/c.mdx']);
	});
	test('de: no source counts as unsourced, release notes never missing', () => {
		expect(r.locales.de.unsourced).toEqual(['app/a.mdx']);
		expect(r.locales.de.missing).toEqual(['app/b.mdx', 'app/c.mdx']);
	});
	test('unquoted all-digit source is kept as a string and reported stale, not mangled', () => {
		expect(r.locales['zh-cn'].stale).toEqual([{ page: 'app/c.mdx', source: digits }]);
		expect(r.locales['zh-cn'].upToDate).toEqual([]);
	});
});
