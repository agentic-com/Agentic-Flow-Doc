<script lang="ts">
	/**
	 * Lesson header (awflow/Agentic-Flow#1341): "Lesson 3 of 5 · 8 min · Level 1", an optional
	 * "Works on-device" badge, a "Done" pill once the lesson is marked done, and the
	 * "You will" / "Before you start" cards.
	 *
	 *   <LessonProgress client:visible level={1} order={3} total={5} minutes={8} onDevice
	 *     youWill={['Add a chat model', '…']} before={['AWFlow installed', '…']} />
	 *
	 * Without JavaScript it renders everything except the "Done" pill.
	 */
	import { onMount } from 'svelte';
	import Badge from './Badge.svelte';
	import { lessonIdFromPath, onLessonProgress } from '../../../plugins/starlight-awflow/lib/lesson-progress';

	interface Props {
		level: number;
		order: number;
		/** Lessons in this level. */
		total: number;
		minutes?: number;
		/** Shows a "Works on-device" badge: no account or API key needed. */
		onDevice?: boolean;
		/** What the reader will do, one short item each. */
		youWill?: string[];
		/** Checklist of what the reader needs first. */
		before?: string[];
	}

	let { level, order, total, minutes, onDevice = false, youWill = [], before = [] }: Props = $props();

	let done = $state(false);
	onMount(() => {
		const id = lessonIdFromPath(location.pathname);
		return onLessonProgress((set) => (done = set.has(id)));
	});
</script>

<div class="awf-lesson not-content" data-pagefind-ignore>
	<div class="awf-lesson__meta">
		<span class="awf-lesson__crumb"
			>Lesson {order} of {total}{#if minutes} · {minutes} min{/if} · Level {level}</span
		>
		{#if onDevice}<Badge variant="on-device" text="Works on-device" />{/if}
		{#if done}<span class="awf-lesson__done" role="status">✓ Done</span>{/if}
	</div>
	{#if youWill.length || before.length}
		<div class="awf-lesson__cards">
			{#if youWill.length}
				<div class="awf-lesson__card">
					<span class="awf-lesson__label">You will</span>
					<ul>
						{#each youWill as item (item)}<li>{item}</li>{/each}
					</ul>
				</div>
			{/if}
			{#if before.length}
				<div class="awf-lesson__card">
					<span class="awf-lesson__label">Before you start</span>
					<ul class="awf-lesson__checks">
						{#each before as item (item)}
							<li><label><input type="checkbox" />{item}</label></li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.awf-lesson {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		margin-block: 0 1.5rem;
	}
	.awf-lesson__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.75rem;
	}
	.awf-lesson__crumb,
	.awf-lesson__label {
		font-family: var(--sl-font-mono);
		font-size: 0.75rem;
		color: var(--sl-color-text-accent);
	}
	.awf-lesson__label {
		font-size: 0.6875rem;
		text-transform: lowercase;
	}
	.awf-lesson__done {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		background: #dcfce7;
		color: #166534;
	}
	.awf-lesson__cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.875rem;
	}
	.awf-lesson__card {
		padding: 1rem 1.125rem;
		border-radius: var(--awf-radius, 14px);
		background: var(--awf-surface);
		border: 1px solid var(--awf-line);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.awf-lesson__card ul {
		margin: 0;
		padding-inline-start: 1.1rem;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--sl-color-gray-2);
	}
	.awf-lesson__checks {
		list-style: none;
		padding: 0 !important;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.awf-lesson__checks label {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		cursor: pointer;
	}
	.awf-lesson__checks input {
		flex: none;
		margin-top: 0.3rem;
		width: 1rem;
		height: 1rem;
		accent-color: var(--sl-color-accent);
	}
</style>
