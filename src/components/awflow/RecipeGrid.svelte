<script lang="ts">
	/**
	 * <RecipeGrid> — the filterable recipe cards on /recipes/ (awflow/Agentic-Flow#1342).
	 *
	 *   import { RecipeGrid } from '@components/awflow';
	 *   <RecipeGrid client:load />
	 *
	 * Goal chips, app, level and setup filters are mirrored in the URL query
	 * (?goal=…&app=…&level=…&setup=…) so a filtered list can be shared. Without JS every card shows.
	 */
	import { onMount } from 'svelte';
	import { GOALS, LEVEL_LABEL, SETUP, recipes, type Recipe, type RecipeLevel, type RecipeSetup } from './recipes';

	const ALL = 'all';
	const goals = GOALS.filter((g) => recipes.some((r) => r.goal === g));
	const apps = [...new Set(recipes.flatMap((r) => r.apps))].sort((a, b) => a.localeCompare(b));
	const levels = (Object.keys(LEVEL_LABEL) as RecipeLevel[]).filter((l) => recipes.some((r) => r.level === l));
	const setups = (Object.keys(SETUP) as RecipeSetup[]).filter((s) => recipes.some((r) => r.setup === s));

	let goal = $state<string>(ALL);
	let app = $state<string>(ALL);
	let level = $state<string>(ALL);
	let setup = $state<string>(ALL);

	const shown = $derived(
		recipes.filter(
			(r) =>
				(goal === ALL || r.goal === goal) &&
				(app === ALL || (app === 'none' ? r.apps.length === 0 : r.apps.includes(app))) &&
				(level === ALL || r.level === level) &&
				(setup === ALL || r.setup === setup),
		),
	);
	const filtered = $derived(goal !== ALL || app !== ALL || level !== ALL || setup !== ALL);

	onMount(() => {
		const q = new URLSearchParams(location.search);
		const pick = (key: string, allowed: readonly string[]) => {
			const v = q.get(key);
			return v && allowed.includes(v) ? v : ALL;
		};
		goal = pick('goal', goals);
		app = pick('app', [...apps, 'none']);
		level = pick('level', levels);
		setup = pick('setup', setups);
	});

	function sync() {
		const q = new URLSearchParams(location.search);
		for (const [k, v] of Object.entries({ goal, app, level, setup })) {
			if (v === ALL) q.delete(k);
			else q.set(k, v);
		}
		const s = q.toString();
		history.replaceState(history.state, '', `${location.pathname}${s ? `?${s}` : ''}${location.hash}`);
	}

	function choose(g: string) {
		goal = goal === g ? ALL : g;
		sync();
	}

	function reset() {
		goal = app = level = setup = ALL;
		sync();
	}

	/** The steps a card's thumbnail draws: triggers and actions, not the models plugged into them. */
	const steps = (r: Recipe) => r.graph.filter((n) => !n.attachment);
	const strip = (r: Recipe) => steps(r).slice(0, 3);
	const more = (r: Recipe) => Math.max(0, steps(r).length - 3);
</script>

<div class="awf-rgrid not-content">
	<div class="awf-rgrid__goals" role="group" aria-label="Filter by goal">
		<button type="button" class="awf-rgrid__goal" aria-pressed={goal === ALL} onclick={() => choose(ALL)}>All goals</button>
		{#each goals as g (g)}
			<button type="button" class="awf-rgrid__goal" aria-pressed={goal === g} onclick={() => choose(g)}>{g}</button>
		{/each}
	</div>

	<div class="awf-rgrid__filters">
		<label>
			App
			<select bind:value={app} onchange={sync}>
				<option value={ALL}>Any</option>
				<option value="none">None (no account)</option>
				{#each apps as a (a)}<option value={a}>{a}</option>{/each}
			</select>
		</label>
		<label>
			Level
			<select bind:value={level} onchange={sync}>
				<option value={ALL}>All</option>
				{#each levels as l (l)}<option value={l}>{LEVEL_LABEL[l]}</option>{/each}
			</select>
		</label>
		<label>
			Setup
			<select bind:value={setup} onchange={sync}>
				<option value={ALL}>Any</option>
				{#each setups as s (s)}<option value={s}>{SETUP[s].label}</option>{/each}
			</select>
		</label>
		<span class="awf-rgrid__count" aria-live="polite">
			{shown.length} of {recipes.length} recipes
			{#if filtered}<button type="button" class="awf-rgrid__reset" onclick={reset}>Clear filters</button>{/if}
		</span>
	</div>

	{#if shown.length}
		<ul class="awf-rgrid__list" role="list">
			{#each shown as r (r.slug)}
				<li>
					<a class="awf-rcard" href={r.href}>
						<span class="awf-rcard__thumb" aria-hidden="true">
							{#each strip(r) as n, i (n.id)}
								{#if i > 0}<span class="awf-rcard__wire"><i style="animation-delay: {(i - 1) * 0.6}s"></i></span>{/if}
								<span class="awf-rcard__node" style="--awf-node: var(--awf-family-{n.family}, var(--awf-family-core))" title={n.type}
									><span>{n.type}</span></span
								>
							{/each}
							{#if more(r)}<span class="awf-rcard__more">+{more(r)}</span>{/if}
						</span>
						<span class="awf-rcard__body">
							<span class="awf-rcard__goal">{r.goal}</span>
							<span class="awf-rcard__title">{r.title}</span>
							<span class="awf-rcard__desc">{r.description}</span>
							<span class="awf-rcard__meta">
								<span class="awf-chip">{LEVEL_LABEL[r.level]}</span>
								<span class="awf-chip">{r.minutes} min</span>
								<span class="awf-badge awf-badge--{SETUP[r.setup].variant}">{SETUP[r.setup].label}</span>
								{#each r.apps as a (a)}<span class="awf-chip">{a}</span>{/each}
								<span class="awf-rcard__try">Try it <span aria-hidden="true">→</span></span>
							</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="awf-rgrid__empty">
			No recipe matches these filters yet. <button type="button" class="awf-rgrid__reset" onclick={reset}>Clear filters</button>
		</p>
	{/if}

	<div class="awf-rgrid__cta">
		<p><strong>Can't find it?</strong> Describe the outcome and Aria builds a first version for you, or ask for it on the request board.</p>
		<a class="awf-rgrid__aria" href="#ask-aria">Describe it to Aria</a>
		<a class="awf-rgrid__request" href="https://app.awflow.io/#/app/marketplace/requests" target="_blank" rel="noopener">Request a recipe</a>
	</div>
</div>

<style>
	@media (min-width: 72rem) {
		:global(:root:has(.awf-rgrid)) {
			--sl-content-width: 64rem;
		}
	}
	.awf-rgrid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}
	.awf-rgrid__goals {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.awf-rgrid__goal {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.5rem 0.875rem;
		border-radius: 999px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--sl-color-gray-2);
		cursor: pointer;
		transition:
			transform var(--awf-fast) var(--awf-ease),
			background var(--awf-fast);
	}
	.awf-rgrid__goal:hover {
		transform: translateY(-1px);
		border-color: var(--awf-section-recipes);
	}
	.awf-rgrid__goal[aria-pressed='true'] {
		background: var(--awf-section-recipes);
		border-color: var(--awf-section-recipes);
		color: #fff;
	}
	.awf-rgrid__goal:focus-visible,
	.awf-rgrid__reset:focus-visible,
	.awf-rgrid select:focus-visible,
	.awf-rcard:focus-visible {
		outline: 2px solid var(--awf-section-recipes);
		outline-offset: 2px;
	}
	.awf-rgrid__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem 1rem;
		align-items: center;
		font-size: 0.875rem;
	}
	.awf-rgrid__filters label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--sl-color-gray-2);
	}
	.awf-rgrid select {
		font: inherit;
		font-size: 0.875rem;
		padding: 0.375rem 0.5rem;
		border-radius: 10px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: var(--sl-color-white);
		max-width: 12rem;
	}
	.awf-rgrid__count {
		margin-left: auto;
		display: inline-flex;
		gap: 0.75rem;
		align-items: center;
		font-family: var(--__sl-font-mono);
		font-size: 0.75rem;
		color: var(--awf-muted);
	}
	.awf-rgrid__reset {
		font: inherit;
		font-size: 0.8125rem;
		background: none;
		border: none;
		padding: 0;
		color: var(--sl-color-text-accent);
		text-decoration: underline;
		cursor: pointer;
	}
	.awf-rgrid__list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
		gap: 1rem;
	}
	.awf-rgrid__list > li {
		margin: 0;
		display: flex;
	}
	.awf-rgrid__empty {
		padding: 1.25rem;
		border-radius: 16px;
		border: 1px dashed var(--awf-line);
		color: var(--sl-color-gray-2);
	}

	.awf-rcard {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 18px;
		border: 1px solid var(--awf-line);
		background: var(--awf-surface);
		color: inherit;
		text-decoration: none;
		transition:
			transform var(--awf-base) var(--awf-ease),
			box-shadow var(--awf-base),
			border-color var(--awf-base);
	}
	.awf-rcard:hover {
		transform: translateY(-4px);
		box-shadow: 0 24px 46px -28px rgba(21, 128, 61, 0.55);
		border-color: #86efac;
		color: inherit;
	}
	.awf-rcard__thumb {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 6.5rem;
		padding: 1rem 0.75rem;
		background-color: color-mix(in srgb, var(--awf-section-recipes) 8%, var(--awf-surface));
		background-image: radial-gradient(color-mix(in srgb, var(--awf-section-recipes) 28%, transparent) 1px, transparent 1px);
		background-size: 14px 14px;
	}
	.awf-rcard__node {
		flex: 0 1 auto;
		min-width: 4.25rem;
		max-width: 6.5rem;
		padding: 0.375rem 0.5rem;
		border-radius: 10px;
		background: var(--awf-node);
		border: 1px solid rgba(0, 0, 0, 0.08);
		color: #1c1917;
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
	}
	.awf-rcard__more {
		flex: none;
		margin-left: 0.375rem;
		font-family: var(--__sl-font-mono);
		font-size: 0.6875rem;
		color: var(--awf-muted);
	}
	.awf-rcard__node > span {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.awf-rcard__wire {
		position: relative;
		flex: 0 0 auto;
		width: 18px;
		height: 2px;
		background: repeating-linear-gradient(90deg, #86a98f 0 5px, transparent 5px 9px);
	}
	.awf-rcard__wire i {
		position: absolute;
		top: -3px;
		left: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--awf-ember);
		box-shadow: 0 0 10px var(--awf-ember);
		opacity: 0;
	}
	.awf-rcard:hover .awf-rcard__wire i {
		animation: awf-rcard-travel 1.8s cubic-bezier(0.6, 0, 0.4, 1) infinite;
	}
	@keyframes awf-rcard-travel {
		0% {
			left: -4px;
			opacity: 0;
		}
		15%,
		85% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 4px);
			opacity: 0;
		}
	}
	.awf-rcard__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 1.125rem 1.125rem;
	}
	.awf-rcard__goal {
		font-family: var(--__sl-font-mono);
		font-size: 0.6875rem;
		text-transform: lowercase;
		color: var(--awf-section-recipes);
	}
	:global([data-theme='dark']) .awf-rcard__goal {
		color: #86efac;
	}
	.awf-rcard__title {
		font-size: 1.0625rem;
		font-weight: 650;
		line-height: 1.35;
		color: var(--sl-color-white);
	}
	.awf-rcard__desc {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--sl-color-gray-2);
	}
	.awf-rcard__meta {
		margin-top: auto;
		padding-top: 0.25rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		align-items: center;
	}
	.awf-rcard__try {
		margin-left: auto;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--awf-section-recipes);
	}
	:global([data-theme='dark']) .awf-rcard__try {
		color: #86efac;
	}
	.awf-rgrid__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-top: 1rem;
		padding: 1.25rem 1.375rem;
		border-radius: 20px;
		background: #1c1917;
		color: #fafaf9;
	}
	.awf-rgrid__cta p {
		flex: 1 1 18rem;
		margin: 0;
		line-height: 1.55;
	}
	.awf-rgrid__cta a {
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		padding: 0.625rem 0.875rem;
		border-radius: 10px;
	}
	.awf-rgrid__aria {
		color: #1c1917;
		background: #fbbf24;
	}
	.awf-rgrid__aria:hover {
		color: #1c1917;
		background: #f59e0b;
	}
	.awf-rgrid__request {
		color: #fafaf9;
		border: 1px solid #57534e;
	}
	.awf-rgrid__request:hover {
		color: #fff;
		border-color: #a8a29e;
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-rcard,
		.awf-rgrid__goal {
			transition: none;
		}
		.awf-rcard:hover {
			transform: none;
		}
		.awf-rcard:hover .awf-rcard__wire i {
			animation: none;
		}
	}
</style>
