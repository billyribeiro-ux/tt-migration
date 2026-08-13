<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Purchase Complete — Trick Trades</title>
	<meta name="description" content="Your Trick Trades purchase is complete. Continue to Boot Camp or contact support." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="confirmation-hero">
	<div class="shell confirmation-grid">
		<div class="success-mark" aria-hidden="true">✓</div>
		<div>
			<p class="eyebrow">Purchase complete</p>
			<h1 class="display-title">You’re in. Start with the next right action.</h1>
			<p class="lede">Your receipt and account instructions have been sent to the email address used at checkout.</p>
		</div>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell next-grid">
		<article>
			<span>01</span>
			<h2>Check your inbox</h2>
			<p>Look for the receipt and membership messages. Check spam or promotions if they do not arrive within a few minutes.</p>
		</article>
		<article>
			<span>02</span>
			<h2>Begin Boot Camp</h2>
			<p>Start at Orientation, set up member access and move through the curriculum in order.</p>
			<a href={resolve('/day-trading-academy/boot-camp')}>Open Boot Camp <span aria-hidden="true">↗</span></a>
		</article>
		<article>
			<span>03</span>
			<h2>Ask for help</h2>
			<p>If anything looks wrong with billing, email delivery or course access, the support team can help.</p>
			<a href="https://tricktrades.com/contact-us">Contact support <span aria-hidden="true">↗</span></a>
		</article>
	</div>
</section>

<section class="member-note surface-dark">
	<div class="shell note-grid">
		<p class="eyebrow">A clean handoff</p>
		<p>This rebuilt confirmation page intentionally does not print billing addresses, email addresses, order identifiers or payment details into the page source. Account-specific information remains in the original secure commerce system.</p>
	</div>
</section>

<style>
	.confirmation-hero {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: var(--signal);
	}

	.confirmation-grid {
		display: grid;
		grid-template-columns: minmax(8rem, 0.35fr) 1fr;
		align-items: center;
		gap: clamp(2rem, 7vw, 7rem);
	}

	.success-mark {
		display: grid;
		aspect-ratio: 1;
		place-items: center;
		border: 2px solid var(--ink);
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: clamp(4rem, 10vw, 8rem);
	}

	.confirmation-grid h1 {
		max-width: 65rem;
		margin-top: 1.5rem;
		font-size: clamp(3rem, 7vw, 7rem);
	}

	.confirmation-grid .lede {
		max-width: 44rem;
		margin-top: 2rem;
		color: var(--ink);
	}

	.next-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.next-grid article {
		display: flex;
		min-height: 23rem;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.5rem, 4vw, 3rem);
		background: var(--paper);
	}

	.next-grid article > span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--coral);
	}

	.next-grid h2 {
		margin-top: auto;
		font-family: var(--font-display);
		font-size: clamp(2rem, 3vw, 3rem);
		font-weight: 400;
		line-height: 1;
	}

	.next-grid p {
		margin-top: 1rem;
		font-size: 0.83rem;
		line-height: 1.65;
		color: var(--muted-ink);
	}

	.next-grid a {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.member-note {
		padding-block: 3rem;
	}

	.note-grid {
		display: grid;
		grid-template-columns: 0.35fr 1fr;
		gap: 3rem;
	}

	.note-grid .eyebrow {
		color: var(--signal);
	}

	.note-grid > p:last-child {
		font-size: 0.76rem;
		line-height: 1.65;
		color: var(--muted-paper);
	}

	@media (max-width: 700px) {
		.confirmation-grid,
		.next-grid,
		.note-grid {
			grid-template-columns: 1fr;
		}

		.success-mark {
			width: 8rem;
		}
	}
</style>
