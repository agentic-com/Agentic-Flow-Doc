/**
 * Splits a dictionary string that carries inline markup into parts a component can render:
 * `{name}` is a slot (a link, a code span, a key cap: the component decides), `**text**` is bold.
 * Keeps one translatable sentence per key instead of gluing several keys around an element.
 *   richParts(t('catalog.missing.body'))  // fill plain values first with t(key, vars)
 */
export type RichPart =
	| { kind: 'text'; text: string }
	| { kind: 'strong'; text: string }
	| { kind: 'slot'; name: string };

export function richParts(s: string): RichPart[] {
	const out: RichPart[] = [];
	for (const m of s.matchAll(/\*\*([^*]+)\*\*|\{(\w+)\}|[^*{]+|[*{]/g)) {
		if (m[1] !== undefined) out.push({ kind: 'strong', text: m[1] });
		else if (m[2] !== undefined) out.push({ kind: 'slot', name: m[2] });
		else out.push({ kind: 'text', text: m[0] });
	}
	return out;
}
