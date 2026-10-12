import { describe, expect, test } from 'bun:test';
import { gitBlobHash, englishFileFor } from '../../src/i18n/blob';

describe('gitBlobHash', () => {
	test('matches git hash-object', async () => {
		const file = 'src/content/docs/get-started/install.mdx';
		const expected = (await Bun.$`git hash-object ${file}`.text()).trim();
		expect(gitBlobHash(await Bun.file(file).bytes())).toBe(expected);
	});
	test('englishFileFor', () => {
		expect(englishFileFor('/r/src/content/docs/fr/app/x.mdx')).toBe('/r/src/content/docs/app/x.mdx');
		expect(englishFileFor('/r/src/content/docs/app/x.mdx')).toBeNull();
	});
});
