/**
 * Route id (as Starlight reports it) → image key under /og/, so the page is /og/<key>.png.
 * Pure (no fs) so the route middleware can share it with the endpoint.
 * A locale home (`fr`) is served at /og/fr.png (astro-og-canvas folds `fr/index` into `fr`).
 */
export const ogPageKey = (routeId: string): string => routeId.replace(/^\/+|\/+$/g, '') || 'index';
