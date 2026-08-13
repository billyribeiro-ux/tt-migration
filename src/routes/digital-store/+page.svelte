<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let search = $state('');
	let category = $state('All');

	const categories = $derived(['All', ...new Set(data.products.flatMap((product) => product.categories))]);
	const visibleProducts = $derived.by(() => {
		const query = search.trim().toLowerCase();
		return data.products.filter((product) => {
			const matchesQuery = !query || `${product.name} ${product.slug} ${product.categories.join(' ')}`.toLowerCase().includes(query);
			const matchesCategory = category === 'All' || product.categories.includes(category);
			return matchesQuery && matchesCategory;
		});
	});

	function priceLabel(product: (typeof data.products)[number]) {
		if (!product.price?.amountMinor || !product.price.currency) return 'Catalog item';
		const amount = Number(product.price.amountMinor) / 10 ** 2;
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: product.price.currency }).format(amount);
	}
</script>

<svelte:head>
	<title>Digital Store Catalog — Trick Trades</title>
	<meta name="description" content="All public WooCommerce products recovered from the Trick Trades API." />
</svelte:head>

<section class="page-hero store-hero">
	<div class="shell hero-grid">
		<div>
			<p class="eyebrow">WooCommerce API inventory</p>
			<h1 class="display-title">All {data.products.length} public products.</h1>
		</div>
		<p class="lede">The migration catalog is generated from the source API, so products are not lost when their purchase-to-content mapping breaks.</p>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell">
		<div class="catalog-tools">
			<label>
				<span>Search catalog</span>
				<input bind:value={search} type="search" placeholder="Course, download, service…" />
			</label>
			<label>
				<span>Category</span>
				<select bind:value={category}>
					{#each categories as option (option)}<option value={option}>{option}</option>{/each}
				</select>
			</label>
			<p>{visibleProducts.length} shown</p>
		</div>

		<div class="product-grid">
			{#each visibleProducts as product (product.id)}
				<article>
					<div class="product-status">
						<span>{product.type}</span>
						<span class:available={product.isPurchasable}>{product.isPurchasable ? 'Purchasable' : 'Catalog only'}</span>
					</div>
					<div>
						<p>{product.categories.join(' · ') || 'Uncategorized'}</p>
						<h2>{product.name}</h2>
					</div>
					<div class="product-footer">
						<strong>{priceLabel(product)}</strong>
						<a {...{ href: product.url }}>Open source product <span aria-hidden="true">↗</span></a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.hero-grid .eyebrow {
		color: var(--signal);
	}

	.hero-grid h1 {
		margin-top: 1.4rem;
	}

	.catalog-tools {
		position: sticky;
		top: 4.7rem;
		z-index: 10;
		display: grid;
		grid-template-columns: 1fr minmax(12rem, 0.35fr) auto;
		align-items: end;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--cream) 94%, transparent);
		backdrop-filter: blur(16px);
	}

	.catalog-tools label span,
	.catalog-tools > p {
		display: block;
		margin-bottom: 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.catalog-tools input,
	.catalog-tools select {
		width: 100%;
		min-height: 2.8rem;
		padding: 0 0.8rem;
		border: 1px solid var(--line);
		background: var(--paper);
		font: inherit;
	}

	.catalog-tools > p {
		margin: 0;
		padding: 0.9rem;
		border: 1px solid var(--line);
		background: var(--paper);
		white-space: nowrap;
	}

	.product-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: 3rem;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.product-grid article {
		display: flex;
		min-height: 23rem;
		flex-direction: column;
		justify-content: space-between;
		gap: 2rem;
		padding: 1.3rem;
		background: var(--paper);
	}

	.product-status,
	.product-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.product-status span,
	.product-grid article > div:nth-child(2) > p {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.product-status span:last-child {
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--line);
		border-radius: 99rem;
	}

	.product-status span.available {
		border-color: var(--blue);
		color: var(--blue);
	}

	.product-grid h2 {
		margin-top: 0.8rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 3vw, 3.2rem);
		font-weight: 400;
		line-height: 0.98;
	}

	.product-footer {
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}

	.product-footer strong {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 400;
	}

	.product-footer a {
		font-size: 0.66rem;
		font-weight: 700;
	}

	@media (max-width: 900px) {
		.product-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 680px) {
		.hero-grid,
		.catalog-tools,
		.product-grid {
			grid-template-columns: 1fr;
		}

		.catalog-tools {
			position: static;
		}
	}
</style>
