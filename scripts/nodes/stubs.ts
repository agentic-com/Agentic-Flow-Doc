/**
 * Runtime stubs that let Bun import the app's node registry headlessly.
 *
 * The node classes live in a SvelteKit app: some modules import `.svelte`
 * components (icons, settings widgets) and some stores use Svelte 5 runes
 * (`$state`, `$derived`, …) that only exist after the Svelte compiler runs.
 * Neither matters for reading node metadata, so both are replaced by inert
 * stand-ins before the registry is imported.
 */
import { plugin } from 'bun';

plugin({
	name: 'awflow-docs-node-stubs',
	setup(build) {
		build.onLoad({ filter: /\.svelte$/ }, () => ({
			contents: 'export default function StubComponent() {}',
			loader: 'js'
		}));
	}
});

const g = globalThis as Record<string, unknown>;
g.window ??= globalThis;
const identity = (v: unknown) => v;
g.$state = Object.assign(identity, { raw: identity, snapshot: identity });
g.$derived = Object.assign(identity, {
	by: (f: () => unknown) => {
		try {
			return f();
		} catch {
			return undefined;
		}
	}
});
g.$effect = Object.assign(() => {}, {
	root: () => () => {},
	pre: () => {},
	tracking: () => false
});
g.$props = () => ({});
g.$inspect = () => ({ with: () => {} });
