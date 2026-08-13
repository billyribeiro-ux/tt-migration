<script lang="ts">
	let { inverted = false }: { inverted?: boolean } = $props();
</script>

<span class:inverted class="brand" aria-label="Trick Trades">
	<span class="monogram" aria-hidden="true">TT</span>
	<span class="wordmark"><strong>TRICK</strong><span>TRADES</span></span>
</span>

<style>
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		color: var(--ink);
	}

	.brand.inverted {
		color: var(--paper);
	}

	.monogram {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-family: var(--font-mono);
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: -0.08em;
	}

	.wordmark {
		display: grid;
		line-height: 0.82;
		letter-spacing: 0.15em;
	}

	.wordmark strong {
		font-size: 0.9rem;
	}

	.wordmark span {
		margin-top: 0.26rem;
		font-family: var(--font-mono);
		font-size: 0.54rem;
	}
</style>
