/** Minimal gettext .po reader for the glossary (msgid → msgstr). Plurals: msgstr[0] is used. */
const unquote = (s: string) => JSON.parse(s.replace(/\\t/g, '\\t'));

export function parsePo(text: string): Map<string, string> {
	const out = new Map<string, string>();
	let fuzzy = false;
	let field: 'id' | 'str' | null = null;
	let id = '';
	let str = '';
	const flush = () => {
		if (id && str && !fuzzy) out.set(id, str);
		id = ''; str = ''; field = null; fuzzy = false;
	};
	for (const raw of text.split('\n')) {
		const line = raw.trim();
		if (line === '') { flush(); continue; }
		if (line.startsWith('#,') && line.includes('fuzzy')) { fuzzy = true; continue; }
		if (line.startsWith('#')) continue;
		let m;
		if ((m = /^msgid\s+(".*")$/.exec(line))) { if (field === 'str') flush(); field = 'id'; id = unquote(m[1]); continue; }
		if (/^msgid_plural\s/.test(line)) { field = null; continue; }
		if ((m = /^msgstr(?:\[0\])?\s+(".*")$/.exec(line))) { field = 'str'; str = unquote(m[1]); continue; }
		if (/^msgstr\[\d+\]/.test(line)) { field = null; continue; }
		if ((m = /^(".*")$/.exec(line))) {
			if (field === 'id') id += unquote(m[1]);
			else if (field === 'str') str += unquote(m[1]);
		}
	}
	flush();
	return out;
}
