/**
 * Where to install the extension. Public, the same in every environment, so these are constants
 * rather than env vars (the env vars shipped placeholder links to production once).
 */
export const CHROME_WEB_STORE_URL =
	'https://chromewebstore.google.com/detail/agentic-workflow/linlkeaipfpnhddjkpcbmldionajfifa';

/**
 * The Firefox Add-ons listing. Not live yet (awflow/Agentic-Flow#1019): while it's null, the home
 * page hides "Add to Firefox" and the install page says the listing is coming.
 */
export const FIREFOX_ADDONS_URL: string | null = null;
