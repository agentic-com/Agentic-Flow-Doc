/**
 * Interface strings, English (source of truth). Flat keys `<area>.<name>`; plurals `<base>_one` /
 * `<base>_other`; placeholders `{name}`. fr.ts, de.ts and zh-cn.ts must define every key
 * (tests/i18n/ui.test.ts). Add a key in all four files in the same commit.
 */
export default {
	'common.minutes': '{n} min',
	'common.lessons_one': '{count} lesson',
	'common.lessons_other': '{count} lessons',
	'section.get-started': 'Get started',
	'section.app': 'Use the app',
	'section.recipes': 'Recipes',
	'section.nodes': 'Nodes',
	'section.concepts': 'Concepts',
	'section.releases': 'Releases',
	'nav.docsSections': 'Docs sections',
	'header.install': 'Install free',
	'header.releaseNotes': 'Release notes',
	'level.1.title': 'Your first automations',
	'level.2.title': 'Working with data',
	'level.3.title': 'Agents & knowledge',
	'level.fallback': 'Level {n}',
	'rail.label': 'Learning path',
	'rail.level': 'Level {n}',
	'rail.progress': '{done} of {total} done · saved in this browser',
	'rail.done': '(done)',
	'rail.minutes': '{n}m',
	'rail.next': 'next · level {n}',
	'search.group.get-started': 'Get started',
	'search.group.recipes': 'Recipes',
	'search.group.nodes': 'Nodes',
	'search.group.app': 'Guides',
	'search.group.concepts': 'Concepts',
	'search.group.fix': 'Fix it',
	'search.group.releases': 'Releases',
	'search.group.other': 'More',
} as const;
