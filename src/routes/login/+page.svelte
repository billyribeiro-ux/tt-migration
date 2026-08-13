<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Admin sign in — Trick Trades</title>
	<meta name="description" content="Sign in to the Trick Trades migration showcase." />
</svelte:head>

<section class="login-page surface-cream">
	<div class="shell login-grid">
		<div class="login-intro">
			<p class="eyebrow">Migration access</p>
			<h1 class="display-title">Welcome back.</h1>
			<p class="lede">Sign in to review the complete migrated curriculum and authenticated lesson media.</p>
		</div>

		<form method="POST" use:enhance>
			<div>
				<p class="eyebrow">Administrator</p>
				<h2>Secure sign in</h2>
			</div>

			{#if form?.incorrect}<p class="form-message error">The username or password is incorrect.</p>{/if}
			{#if form?.unavailable}<p class="form-message error">Sign-in is temporarily unavailable.</p>{/if}

			<label>
				<span>Username</span>
				<input name="username" autocomplete="username" required maxlength="100" value={form?.username ?? data.username} />
			</label>
			<label>
				<span>Password</span>
				<input name="password" type="password" autocomplete="current-password" required maxlength="256" />
			</label>
			<button class="button button-dark" type="submit">Sign in</button>
			<p class="security-note">Credentials are verified on the server. Passwords are never stored in plaintext.</p>
		</form>
	</div>
</section>

<style>
	.login-page {
		min-height: calc(100vh - 9rem);
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	.login-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.72fr);
		align-items: start;
		gap: clamp(4rem, 10vw, 10rem);
	}

	.login-intro h1 {
		max-width: 42rem;
		margin-top: 1.2rem;
	}

	.login-intro .lede {
		max-width: 38rem;
		margin-top: 2rem;
	}

	form {
		display: grid;
		gap: 1.4rem;
		padding: clamp(1.5rem, 4vw, 3rem);
		border: 1px solid var(--line);
		background: var(--paper);
	}

	form h2 {
		margin-top: 0.6rem;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 4vw, 3.6rem);
		font-weight: 400;
	}

	label,
	label span {
		display: grid;
	}

	label {
		gap: 0.5rem;
	}

	label span,
	.security-note,
	.form-message {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		line-height: 1.6;
		text-transform: uppercase;
	}

	input {
		width: 100%;
		padding: 0.95rem 1rem;
		border: 1px solid var(--line);
		border-radius: 0;
		background: var(--cream);
		font: inherit;
	}

	input:focus-visible {
		outline: 2px solid var(--coral);
		outline-offset: 2px;
	}

	.form-message {
		padding: 0.8rem;
		border: 1px solid var(--coral);
		color: var(--coral);
	}

	.security-note {
		color: var(--muted-ink);
	}

	@media (max-width: 760px) {
		.login-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
