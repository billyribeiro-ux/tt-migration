<script lang="ts">
	import { resolve } from '$app/paths';
	import BrandMark from './BrandMark.svelte';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="shell footer-top">
		<div class="footer-brand">
			<BrandMark inverted />
			<p>Education for traders committed to skill, discipline and emotional control.</p>
		</div>
		<div>
			<p class="footer-label">Learn</p>
			<a href={resolve('/day-trading-academy')}>Academy</a>
			<a href={resolve('/day-trading-academy/boot-camp')}>Boot Camp</a>
			<a href={resolve('/resources')}>Member resources</a>
		</div>
		<div>
			<p class="footer-label">Support</p>
			<a href="https://tricktrades.com/contact-us">Contact</a>
			<a href="https://tricktrades.com/cancellation-policy">Cancellation policy</a>
			<a href="https://tricktrades.com/my-account/edit-account/">My account</a>
		</div>
		<div>
			<p class="footer-label">Legal</p>
			<a href="https://tricktrades.com/privacy-policy">Privacy</a>
			<a href="https://tricktrades.com/disclaimer">Disclaimer</a>
			<a href="https://tricktrades.com/terms-and-conditions">Terms</a>
		</div>
	</div>
	<div class="shell footer-bottom">
		<p>© {year} 2121926 Alberta Ltd.</p>
		<p>Educational content only. Not financial advice. Trading involves substantial risk.</p>
	</div>
</footer>

<style>
	footer {
		padding: 4.5rem 0 1.5rem;
		background: var(--ink);
		color: var(--paper);
	}

	.footer-top {
		display: grid;
		grid-template-columns: minmax(16rem, 2.3fr) repeat(3, 1fr);
		gap: 4rem;
		padding-bottom: 4rem;
	}

	.footer-brand p {
		max-width: 28rem;
		margin-top: 1.5rem;
		color: var(--muted-paper);
	}

	.footer-label {
		margin-bottom: 1.1rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--signal);
	}

	.footer-top > div:not(.footer-brand) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
	}

	.footer-top a {
		font-size: 0.84rem;
		color: var(--muted-paper);
	}

	.footer-top a:hover {
		color: var(--paper);
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		padding-top: 1.4rem;
		border-top: 1px solid color-mix(in srgb, var(--paper) 15%, transparent);
		font-family: var(--font-mono);
		font-size: 0.59rem;
		letter-spacing: 0.05em;
		color: color-mix(in srgb, var(--paper) 55%, transparent);
	}

	@media (max-width: 800px) {
		.footer-top {
			grid-template-columns: 1fr 1fr;
			gap: 2.5rem;
		}

		.footer-brand {
			grid-column: 1 / -1;
		}

		.footer-bottom {
			flex-direction: column;
		}
	}
</style>
