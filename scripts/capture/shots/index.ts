/**
 * Every shot, aggregated from one file per docs area so parallel edits don't collide.
 * To add an area: create shots/<area>.ts exporting `shots`, then add it below.
 * Shots run in this order within one browser session per theme (signed-in shots in a second one),
 * and share its state (imported workflows, runs, memory), so a new shot goes at the end of its file.
 */
import { spotsOf, type ShotDef } from './define.ts';
import { shots as app } from './app.ts';
import { shots as ai } from './ai.ts';
import { shots as workflows } from './workflows.ts';
import { shots as connections } from './connections.ts';
import { shots as settings } from './settings.ts';
import { shots as account } from './account.ts';
import { shots as getStarted } from './get-started.ts';
import { shots as concepts } from './concepts.ts';
import { shots as recipes } from './recipes.ts';
import { shots as publishing } from './publishing.ts';
import { shots as admin } from './admin.ts';

export { Session } from '../lib/session.ts';
export type { ShotDef, SpotDef } from './define.ts';
export { spotsOf } from './define.ts';

export const SHOTS: ShotDef[] = [...app, ...ai, ...workflows, ...connections, ...settings, ...account, ...getStarted, ...concepts, ...recipes, ...publishing, ...admin];

const names = new Set<string>();
for (const s of SHOTS) {
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.name)) throw new Error(`shot name "${s.name}" is not kebab-case`);
	if (names.has(s.name)) throw new Error(`duplicate shot name "${s.name}"`);
	names.add(s.name);
	spotsOf(s);
}
