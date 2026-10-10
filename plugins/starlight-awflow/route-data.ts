import type { AwflowRouteData } from './types';

/**
 * Typed accessor for the data the starlight-awflow middleware attaches to
 * `Astro.locals.starlightRoute.awflow`. Starlight's route data allows extra keys
 * (`[key: string]: unknown`), so this cast is the one place the type is asserted.
 *
 * ```astro
 * ---
 * import { getAwflowRoute } from '../../plugins/starlight-awflow/route-data';
 * const { section, node } = getAwflowRoute(Astro.locals);
 * ---
 * ```
 */
export function getAwflowRoute(locals: App.Locals): AwflowRouteData {
	const data = (locals.starlightRoute as { awflow?: AwflowRouteData }).awflow;
	return (
		data ?? {
			section: undefined,
			tabs: [],
			kind: undefined,
			node: undefined,
			showBanner: false,
			eyebrow: '',
			markdownUrl: undefined,
		}
	);
}
