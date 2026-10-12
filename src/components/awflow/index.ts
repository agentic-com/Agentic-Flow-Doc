/**
 * AWFlow docs component library (awflow/Agentic-Flow#1335).
 *
 * In MDX: `import { Badge, Callout } from '@components/awflow';`
 * Every export is an .astro wrapper: it passes the page language to the Svelte island and takes
 * `hydrate="load|idle|visible"` instead of `client:*`.
 * Styles live in plugins/starlight-awflow/styles/components.css and load on every page.
 * CONTRIBUTING.md documents when to use each component.
 */
export { default as Badge } from './Badge.astro';
export { default as WorksIn } from './WorksIn.astro';
export { default as Callout } from './Callout.astro';
export { default as ParamTable } from './ParamTable.astro';
export { default as OutputPorts } from './OutputPorts.astro';
export { default as StepCard } from './StepCard.astro';
export { default as Screenshot } from './Screenshot.astro';
// Guided screenshots (Astro components: they resolve images and spot boxes while the site builds).
// One screen → GuidedShot; several screens → one StepShot per step. Import from here in MDX, or
// directly: `import GuidedShot from '@components/awflow/GuidedShot.astro';`. Never import them in a
// hydrated Svelte island (they only run on the server).
export { default as GuidedShot } from './GuidedShot.astro';
export { default as StepShot } from './StepShot.astro';
export { default as PageActions } from './PageActions.astro';
export { default as RecipeCard } from './RecipeCard.astro';
export { default as Kbd } from './Kbd.astro';
export { default as FlowPreview } from './FlowPreview.astro';
// SearchDialog is only used by the Search override (plugins/starlight-awflow/overrides/Search.astro).
export { default as ReleaseTimeline } from './ReleaseTimeline.astro';
export { default as ReleaseChanges } from './ReleaseChanges.astro';
export { default as OperationTabs } from './OperationTabs.astro';
export { default as NodeCatalog } from './NodeCatalog.astro';
export { default as LessonProgress } from './LessonProgress.astro';
export { default as LessonDone } from './LessonDone.astro';
export { default as ModelTabs } from './ModelTabs.astro';
export { default as RecipeGrid } from './RecipeGrid.astro';
export { default as RecipeMeta } from './RecipeMeta.astro';
export { default as RecipeUse } from './RecipeUse.astro';
export { default as RecipeSteps } from './RecipeSteps.astro';
export { default as ItemsPlayground } from './ItemsPlayground.astro';
export { default as CompareCards } from './CompareCards.astro';
