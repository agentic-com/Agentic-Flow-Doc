import { describe, expect, test } from 'bun:test';
import { langFromPath, localizeHref, prefixOf, stripLocale, toLang } from '../../src/i18n/locales';

describe('toLang', () => {
	test('maps app and browser codes', () => {
		expect(toLang('zh')).toBe('zh-CN');
		expect(toLang('zh-cn')).toBe('zh-CN');
		expect(toLang('zh-CN')).toBe('zh-CN');
		expect(toLang('fr-CA')).toBe('fr');
		expect(toLang('de')).toBe('de');
		expect(toLang('en-US')).toBe('en');
		expect(toLang('es')).toBe('en');
		expect(toLang(undefined)).toBe('en');
		expect(toLang('')).toBe('en');
	});
	test('prefixOf', () => {
		expect(prefixOf('en')).toBe('');
		expect(prefixOf('zh-CN')).toBe('zh-cn');
	});
});

describe('langFromPath / stripLocale', () => {
	test('paths and content ids', () => {
		expect(langFromPath('/fr/app/x/')).toBe('fr');
		expect(langFromPath('zh-cn/get-started')).toBe('zh-CN');
		expect(langFromPath('/app/x/')).toBe('en');
		expect(langFromPath('/french-press/')).toBe('en');
		expect(stripLocale('/fr/app/x/')).toBe('/app/x/');
		expect(stripLocale('de/app/x')).toBe('app/x');
		expect(stripLocale('/zh-cn/')).toBe('/');
		expect(stripLocale('fr')).toBe('');
		expect(stripLocale('/app/fr/')).toBe('/app/fr/');
	});
});

describe('localizeHref', () => {
	test('English is unchanged', () => {
		expect(localizeHref('/app/connections/slack/', 'en')).toBe('/app/connections/slack/');
	});
	test('prefixes internal page links, keeps query and hash', () => {
		expect(localizeHref('/app/connections/slack/', 'fr')).toBe('/fr/app/connections/slack/');
		expect(localizeHref('/', 'zh-CN')).toBe('/zh-cn/');
		expect(localizeHref('/recipes/?goal=monitor-pages', 'de')).toBe('/de/recipes/?goal=monitor-pages');
		expect(localizeHref('/app/connections/oauth-client/#google', 'fr')).toBe('/fr/app/connections/oauth-client/#google');
		expect(localizeHref('/app/connections/slack', 'fr')).toBe('/fr/app/connections/slack');
	});
	test('leaves already-localized, external, relative and anchor links alone', () => {
		expect(localizeHref('/fr/app/x/', 'fr')).toBe('/fr/app/x/');
		expect(localizeHref('/de/app/x/', 'fr')).toBe('/de/app/x/');
		expect(localizeHref('https://awflow.io/', 'fr')).toBe('https://awflow.io/');
		expect(localizeHref('//cdn.example.com/x', 'fr')).toBe('//cdn.example.com/x');
		expect(localizeHref('#ask-aria', 'fr')).toBe('#ask-aria');
		expect(localizeHref('../x/', 'fr')).toBe('../x/');
		expect(localizeHref('mailto:a@example.com', 'fr')).toBe('mailto:a@example.com');
	});
	test('never prefixes files and machine endpoints', () => {
		for (const href of [
			'/examples/summarize-this-page.awf',
			'/og/app.png',
			'/releases/rss.xml',
			'/recipes/listings.json',
			'/app/connections/slack.md',
			'/llms.txt',
			'/llms-full.txt',
			'/favicon.svg',
			'/_astro/x.css',
			'/pagefind/pagefind.js',
		]) {
			expect(localizeHref(href, 'fr')).toBe(href);
		}
	});
});
