<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Trick Trades</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error-page surface-dark">
	<div class="shell">
		<p class="eyebrow">Error {page.status}</p>
		<h1 class="display-title">This level isn’t on the chart.</h1>
		<p class="lede">{page.error?.message ?? 'The page could not be found.'}</p>
		<a class="button button-signal" href={resolve('/day-trading-academy')}>Return to the academy</a>
	</div>
</section>

<style>
	.error-page {
		display: grid;
		min-height: 70vh;
		place-items: center;
		padding-block: 6rem;
	}

	.error-page .eyebrow { color: var(--coral); }
	.error-page h1 { max-width: 58rem; margin-top: 1.5rem; }
	.error-page .lede { margin-top: 2rem; color: var(--muted-paper); }
	.error-page .button { margin-top: 2rem; }
</style>
