<script lang="ts">
	/**
	 * Page actions: copy the page as Markdown (from the starlight-md-txt twin), ask Aria, edit on GitHub.
	 * Interactive: hydrate it in MDX with `client:visible`. Without JS it renders a
	 * "View as Markdown" link instead of the copy button.
	 */
	interface Props {
		/** URL of the Markdown twin. Defaults to `<current path>.md`. */
		markdownUrl?: string;
		editUrl?: string;
		askAriaHref?: string;
		askAriaLabel?: string;
		/** Smaller buttons for tight headers. */
		compact?: boolean;
	}

	let {
		markdownUrl,
		editUrl,
		askAriaHref = '#ask-aria',
		askAriaLabel = 'Ask Aria',
		compact = false,
	}: Props = $props();

	let status = $state('');
	let hydrated = $state(false);
	$effect(() => {
		hydrated = true;
	});

	const twin = () => markdownUrl ?? location.pathname.replace(/\/$/, '') + '.md';

	async function copy() {
		try {
			const res = await fetch(twin());
			if (!res.ok) throw new Error(String(res.status));
			await navigator.clipboard.writeText(await res.text());
			status = 'Copied';
		} catch {
			status = 'Could not copy. Opening the Markdown instead.';
			location.href = twin();
		}
		setTimeout(() => (status = ''), 2400);
	}
</script>

<div class="awf-actions" class:awf-actions--compact={compact}>
	{#if hydrated}
		<button type="button" class="awf-action awf-press" onclick={copy}>
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				><rect x="9" y="9" width="12" height="12" rx="2" /><path
					d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
				/></svg
			>
			{status === 'Copied' ? 'Copied' : 'Copy as Markdown'}
		</button>
	{:else if markdownUrl}
		<a class="awf-action awf-press" href={markdownUrl}>View as Markdown</a>
	{/if}
	<a class="awf-action awf-press" href={askAriaHref}>
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /></svg
		>
		{askAriaLabel}
	</a>
	{#if editUrl}
		<a class="awf-action awf-press" href={editUrl} rel="noopener">
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg
			>
			Edit<span class="sr-only"> this page on GitHub</span>
		</a>
	{/if}
	<span class="sr-only" role="status" aria-live="polite">{status}</span>
</div>
