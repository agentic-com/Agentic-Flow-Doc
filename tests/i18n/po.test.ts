import { expect, test } from 'bun:test';
import { parsePo } from '../../scripts/i18n/po';

test('parsePo', () => {
	const po = [
		'msgid ""', 'msgstr ""', '"Language: fr\\n"', '',
		'#: src/a.svelte', 'msgid "Save"', 'msgstr "Enregistrer"', '',
		'msgid ""', '"Long "', '"text"', 'msgstr ""', '"Texte "', '"long"', '',
		'#, fuzzy', 'msgid "Draft"', 'msgstr "Brouillon"', '',
		'msgid "Empty"', 'msgstr ""', '',
		'msgid "Say \\"hi\\""', 'msgstr "Dites \\"salut\\""',
	].join('\n');
	const m = parsePo(po);
	expect(m.get('Save')).toBe('Enregistrer');
	expect(m.get('Long text')).toBe('Texte long');
	expect(m.has('Draft')).toBe(false);
	expect(m.has('Empty')).toBe(false);
	expect(m.has('')).toBe(false);
	expect(m.get('Say "hi"')).toBe('Dites "salut"');
});
