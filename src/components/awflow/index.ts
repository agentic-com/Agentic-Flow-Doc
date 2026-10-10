/**
 * AWFlow docs component library (awflow/Agentic-Flow#1335).
 *
 * In MDX: `import { Badge, Callout } from '@components/awflow';`
 * Styles live in plugins/starlight-awflow/styles/components.css and load on every page.
 * CONTRIBUTING.md documents when to use each component.
 */
export { default as Badge } from './Badge.svelte';
export { default as WorksIn } from './WorksIn.svelte';
export { default as Callout } from './Callout.svelte';
export { default as ParamTable } from './ParamTable.svelte';
export { default as OutputPorts } from './OutputPorts.svelte';
export { default as StepCard } from './StepCard.svelte';
export { default as Screenshot } from './Screenshot.svelte';
// Guided screenshots (Astro components: they resolve images and spot boxes while the site builds).
// One screen → GuidedShot; several screens → one StepShot per step. Import from here in MDX, or
// directly: `import GuidedShot from '@components/awflow/GuidedShot.astro';`. Never import them in a
// hydrated Svelte island (they only run on the server).
export { default as GuidedShot } from './GuidedShot.astro';
export { default as StepShot } from './StepShot.astro';
export { default as PageActions } from './PageActions.svelte';
export { default as RecipeCard } from './RecipeCard.svelte';
export { default as Kbd } from './Kbd.svelte';
export { default as FlowPreview } from './FlowPreview.svelte';
export { default as SearchDialog } from './SearchDialog.svelte';
export { default as ReleaseTimeline } from './ReleaseTimeline.svelte';
export { default as ReleaseChanges } from './ReleaseChanges.svelte';
export { default as OperationTabs } from './OperationTabs.svelte';
export { default as NodeCatalog } from './NodeCatalog.svelte';
export { default as LessonProgress } from './LessonProgress.svelte';
export { default as LessonDone } from './LessonDone.svelte';
export { default as ModelTabs } from './ModelTabs.svelte';
export { default as RecipeGrid } from './RecipeGrid.svelte';
export { default as RecipeMeta } from './RecipeMeta.svelte';
export { default as RecipeUse } from './RecipeUse.svelte';
export { default as RecipeSteps } from './RecipeSteps.svelte';
export { default as ItemsPlayground } from './ItemsPlayground.svelte';
export { default as CompareCards } from './CompareCards.svelte';
