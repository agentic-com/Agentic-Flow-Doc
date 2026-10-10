import { existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const TYPES: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.wasm': 'application/wasm',
	'.json': 'application/json',
	'.webmanifest': 'application/manifest+json'
};

/** Loopback-only static server for the app's production web build. `/` serves index.html. */
export function serveStatic(dir: string, port: number) {
	const root = resolve(dir);
	return Bun.serve({
		port,
		hostname: '127.0.0.1',
		fetch(req) {
			let decoded: string;
			try {
				decoded = decodeURIComponent(new URL(req.url).pathname);
			} catch {
				return new Response('Not found', { status: 404 });
			}
			const p = normalize(join(root, decoded === '/' ? '/index.html' : decoded));
			const inside = p === root || p.startsWith(root + sep);
			const segs = p.slice(root.length).split(sep);
			if (!inside || segs.some((s) => s.startsWith('.')) || !existsSync(p) || statSync(p).isDirectory())
				return new Response('Not found', { status: 404 });
			return new Response(Bun.file(p), {
				headers: { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }
			});
		}
	});
}
