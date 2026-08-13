<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import BrandMark from './BrandMark.svelte';

	let menuOpen = $state(false);
	const navItems = [
		{ href: '/', label: 'Freedom' },
		{ href: '/day-trading-academy', label: 'Academy' },
		{ href: '/resources', label: 'Member resources' }
	] as const;

	function closeMenu() {
		menuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeMenu();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<a class="skip-link" href="#main-content">Skip to content</a>
<header class:open={menuOpen}>
	<div class="shell header-inner">
		<a class="brand-link" href={resolve('/')} aria-label="Trick Trades home" onclick={closeMenu}>
			<BrandMark />
		</a>

		<button
			class="menu-toggle"
			type="button"
			aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span><span></span>
		</button>

		<nav aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a class:active={page.url.pathname === item.href || (item.href !== '/' && page.url.pathname.startsWith(item.href))} href={resolve(item.href)} onclick={closeMenu}>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="header-actions">
			<a class="account-link" href="https://tricktrades.com/my-account/edit-account/">My account</a>
			<a class="button button-dark button-small" href={resolve('/day-trading-academy/boot-camp')}>Open Boot Camp</a>
		</div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
		background: color-mix(in srgb, var(--paper) 94%, transparent);
		backdrop-filter: blur(18px);
	}

	.header-inner {
		display: grid;
		grid-template-columns: auto 1fr auto;
		min-height: 4.7rem;
		align-items: center;
		gap: 2.2rem;
	}

	.brand-link {
		position: relative;
		z-index: 2;
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 1.7rem;
	}

	nav a,
	.account-link {
		position: relative;
		font-size: 0.77rem;
		font-weight: 650;
		letter-spacing: 0.02em;
		color: var(--muted-ink);
	}

	nav a::after {
		position: absolute;
		left: 0;
		bottom: -0.55rem;
		width: 100%;
		height: 2px;
		background: var(--coral);
		content: '';
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 180ms ease;
	}

	nav a:hover::after,
	nav a.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.menu-toggle {
		display: none;
	}

	@media (max-width: 900px) {
		.header-inner {
			grid-template-columns: 1fr auto;
		}

		.menu-toggle {
			position: relative;
			z-index: 2;
			display: grid;
			width: 2.75rem;
			height: 2.75rem;
			place-content: center;
			gap: 0.4rem;
			border: 1px solid var(--line);
			border-radius: 50%;
			background: transparent;
		}

		.menu-toggle span {
			display: block;
			width: 1rem;
			height: 1px;
			background: var(--ink);
			transition: transform 180ms ease;
		}

		header.open .menu-toggle span:first-child {
			transform: translateY(0.22rem) rotate(45deg);
		}

		header.open .menu-toggle span:last-child {
			transform: translateY(-0.22rem) rotate(-45deg);
		}

		nav,
		.header-actions {
			display: none;
		}

		header.open nav {
			position: absolute;
			inset: 4.7rem 0 auto;
			display: grid;
			justify-content: stretch;
			gap: 0;
			padding: 1rem var(--gutter);
			border-bottom: 1px solid var(--line);
			background: var(--paper);
		}

		header.open nav a {
			padding: 1.15rem 0;
			border-bottom: 1px solid var(--line);
			font-family: var(--font-display);
			font-size: 1.65rem;
			font-weight: 400;
		}
	}
</style>
