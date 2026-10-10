<script lang="ts">
	/**
	 * Lesson completion card (awflow/Agentic-Flow#1341): "Mark done & continue" saves the lesson as
	 * done (in this browser, see plugins/starlight-awflow/lib/lesson-progress.ts) and opens the next
	 * lesson. "Mark as done" only saves it, so the reader can stay on the page; it toggles back.
	 *
	 *   <LessonDone client:load title="Your workflow thinks now." next={{ href: '/get-started/first-automation/', label: 'Lesson 4' }}>
	 *     Next you'll run it from a schedule, without clicking.
	 *   </LessonDone>
	 */
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import {
		lessonIdFromPath,
		onLessonProgress,
		setLessonDone,
	} from '../../../plugins/starlight-awflow/lib/lesson-progress';

	interface Props {
		/** Headline, e.g. "Nice — your workflow thinks now." */
		title: string;
		/** Where "continue" goes. Omit on the last lesson of the site. */
		next?: { href: string; label: string };
		children?: Snippet;
	}

	let { title, next, children }: Props = $props();

	let id = $state('');
	let done = $state(false);

	onMount(() => {
		id = lessonIdFromPath(location.pathname);
		return onLessonProgress((set) => (done = set.has(id)));
	});

	function toggle() {
		if (id) setLessonDone(id, !done);
	}

	function finish(e: MouseEvent) {
		setLessonDone(id || lessonIdFromPath(location.pathname), true);
		if (!next) e.preventDefault();
	}
</script>

<aside class="awf-done not-content" aria-label="Finish this lesson" data-pagefind-ignore>
	<span class="awf-done__spark awf-done__spark--1" aria-hidden="true"></span>
	<span class="awf-done__spark awf-done__spark--2" aria-hidden="true"></span>
	<div class="awf-done__text">
		<span class="awf-done__title">{title}</span>
		{#if children}<span class="awf-done__body">{@render children()}</span>{/if}
	</div>
	<div class="awf-done__actions">
		<button type="button" class="awf-done__toggle" aria-pressed={done} onclick={toggle}>
			{done ? 'Done ✓' : 'Mark as done'}
		</button>
		{#if next}
			<a class="awf-done__next" href={next.href} onclick={finish}>
				{done ? `Continue to ${next.label}` : 'Mark done & continue'} →
			</a>
		{/if}
	</div>
	<p class="sr-only" aria-live="polite">{done ? 'Lesson marked as done.' : ''}</p>
</aside>

<style>
	.awf-done {
		position: relative;
		overflow: hidden;
		margin-block: 2.5rem 1rem;
		padding: 1.625rem;
		border-radius: var(--awf-radius-xl, 22px);
		background: #1c1917;
		color: #fafaf9;
		display: flex;
		flex-wrap: wrap;
		gap: 1.125rem;
		align-items: center;
	}
	:root:not([data-theme='light']) .awf-done {
		background: var(--awf-surface-2, #292420);
		border: 1px solid var(--awf-line, #3a332e);
	}
	.awf-done__spark {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 999px;
		background: #fbbf24;
		animation: awf-done-twinkle 2.4s ease-in-out infinite;
	}
	.awf-done__spark--1 {
		left: 30px;
		top: 18px;
	}
	.awf-done__spark--2 {
		left: 46%;
		bottom: 16px;
		width: 4px;
		height: 4px;
		animation-delay: 0.6s;
	}
	@keyframes awf-done-twinkle {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(0.6);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}
	.awf-done__text {
		flex: 1 1 18rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.awf-done__title {
		font-size: 1.3125rem;
		font-weight: 650;
		line-height: 1.3;
	}
	.awf-done__body {
		font-size: 0.9375rem;
		line-height: 1.55;
		color: #d6d3d1;
	}
	.awf-done__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem;
		align-items: center;
	}
	.awf-done__toggle,
	.awf-done__next {
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 600;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		cursor: pointer;
		text-decoration: none;
		transition:
			transform var(--awf-fast, 150ms),
			box-shadow var(--awf-base, 300ms),
			background var(--awf-base, 300ms);
	}
	.awf-done__toggle {
		background: transparent;
		color: #fafaf9;
		border: 1px solid rgba(250, 250, 249, 0.35);
	}
	.awf-done__toggle[aria-pressed='true'] {
		background: #dcfce7;
		color: #166534;
		border-color: #bbf7d0;
	}
	.awf-done__next {
		background: #fbbf24;
		color: #1c1917;
	}
	.awf-done__next:hover,
	.awf-done__toggle:hover {
		transform: translateY(-1px);
	}
	.awf-done__next:hover {
		color: #1c1917;
		box-shadow: 0 10px 22px -10px rgba(251, 191, 36, 0.7);
	}
	.awf-done__toggle:focus-visible,
	.awf-done__next:focus-visible {
		outline: 2px solid #fbbf24;
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.awf-done__spark {
			animation: none;
		}
		.awf-done__toggle,
		.awf-done__next {
			transition: none;
		}
		.awf-done__next:hover,
		.awf-done__toggle:hover {
			transform: none;
		}
	}
</style>
