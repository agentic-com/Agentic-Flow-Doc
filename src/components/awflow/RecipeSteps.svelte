<script lang="ts">
	/**
	 * <RecipeSteps> — "How it works" for a recipe (awflow/Agentic-Flow#1342): one card per step of
	 * the workflow, with the node it uses (linked to its reference page) and a "Make it yours" hint.
	 *
	 *   <RecipeSteps slug="summarize-this-page" steps={[
	 *     { node: 'get-text', title: 'Read the page', body: 'Takes the visible text…', tweak: 'Set **DOM Selector** to `article`…' },
	 *   ]} />
	 *
	 * `node` is the step's id inside the .awf (`also` lists nodes plugged into it, such as the model).
	 * `body` and `tweak` accept `code`, **bold** and [links](/path/).
	 * The build fails when a step names a node the workflow doesn't have.
	 */
	import { getRecipe, type RecipeNode } from './recipes';

	interface Step {
		node: string;
		also?: string[];
		title: string;
		body: string;
		tweak?: string;
	}
	let { slug, steps }: { slug: string; steps: Step[] } = $props();

	// svelte-ignore state_referenced_locally
	const recipe = getRecipe(slug);
	function find(id: string): RecipeNode {
		const n = recipe.graph.find((g) => g.id === id);
		if (!n) throw new Error(`<RecipeSteps slug="${slug}">: the workflow has no node "${id}".`);
		return n;
	}

	const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	/** Tiny inline markdown: `code`, **bold**, [text](href). Input is author-written, escaped first. */
	function inline(s: string): string {
		return escape(s)
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
	}

	// svelte-ignore state_referenced_locally
	const rows = steps.map((s) => ({ ...s, main: find(s.node), extra: (s.also ?? []).map(find) }));
</script>

<ol class="awf-rsteps not-content">
	{#each rows as s, i (s.node)}
		<li class="awf-rsteps__step">
			<span class="awf-rsteps__n" aria-hidden="true">{i + 1}</span>
			<div class="awf-rsteps__body">
				<h3 class="awf-rsteps__title">{s.title}</h3>
				<p class="awf-rsteps__nodes">
					{#each [s.main, ...s.extra] as n (n.id)}
						<span class="awf-rsteps__node" style="--awf-node: var(--awf-family-{n.family}, var(--awf-family-core))">
							{#if n.docLink}<a href={n.docLink}>{n.type}<span class="sr-only"> node</span> reference <span aria-hidden="true">→</span></a>
							{:else}{n.type}{/if}
						</span>
					{/each}
				</p>
				<p class="awf-rsteps__text">{@html inline(s.body)}</p>
				{#if s.tweak}<p class="awf-rsteps__tweak"><strong>Make it yours</strong> — {@html inline(s.tweak)}</p>{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.awf-rsteps {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.awf-rsteps__step {
		display: flex;
		gap: 1rem;
		margin: 0;
		padding: 1.125rem;
		border-radius: 18px;
		background: var(--awf-surface);
		border: 1px solid var(--awf-line);
		transition: border-color var(--awf-base);
	}
	.awf-rsteps__step:hover {
		border-color: #86efac;
	}
	.awf-rsteps__n {
		flex: none;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: var(--awf-section-recipes);
		color: #fff;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.awf-rsteps__body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.awf-rsteps__title {
		margin: 0;
		font-size: 1.0625rem;
		font-weight: 650;
		color: var(--sl-color-white);
	}
	.awf-rsteps__nodes {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.awf-rsteps__node {
		font-size: 0.75rem;
		padding: 2px 9px;
		border-radius: 999px;
		background: var(--awf-node);
		color: #1c1917;
		font-weight: 600;
	}
	.awf-rsteps__node a {
		color: inherit;
		text-decoration: none;
	}
	.awf-rsteps__node a:hover {
		text-decoration: underline;
	}
	.awf-rsteps__text {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
	}
	.awf-rsteps__tweak {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		padding: 0.5rem 0.75rem;
		border-radius: 10px;
		background: color-mix(in srgb, var(--awf-section-recipes) 10%, var(--awf-surface));
		color: var(--sl-color-white);
	}
	.awf-rsteps :global(code) {
		font-size: 0.85em;
	}
	@media (max-width: 30rem) {
		.awf-rsteps__step {
			padding: 0.875rem;
			gap: 0.75rem;
		}
	}
</style>
