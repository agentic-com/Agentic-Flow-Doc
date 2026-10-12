/**
 * Interface strings, English (source of truth). Flat keys `<area>.<name>`; plurals `<base>_one` /
 * `<base>_other`; placeholders `{name}`. fr.ts, de.ts and zh-cn.ts must define every key
 * (tests/i18n/ui.test.ts). Add a key in all four files in the same commit.
 */
export default {
	'common.minutes': '{n} min',
	'common.lessons_one': '{count} lesson',
	'common.lessons_other': '{count} lessons',
} as const;
