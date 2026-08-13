<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const entitledProducts = $derived(data.orders.products.filter((product) => product.entitledByOrderStatus));
</script>

<svelte:head>
	<title>My Migration Account — Trick Trades</title>
	<meta name="description" content="Admin showcase of migrated purchases, courses, downloads and evidence gaps." />
</svelte:head>

<section class="page-hero account-hero">
	<div class="shell account-heading">
		<div>
			<p class="eyebrow">Migration account</p>
			<h1 class="display-title">{data.user?.username || 'Guest'}</h1>
		</div>
		<div>
			<p class="lede">{data.user?.role === 'admin' ? 'Seeded administrator access is active for the client showcase.' : 'Showcase administrator access is not active.'}</p>
			{#if data.user}<span class="role-badge">{data.user.role}{data.user.showcase ? ' · showcase' : ''}</span>{/if}
		</div>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell">
		<div class="account-stats">
			<div><strong>{data.academy.authenticatedCourseCount}</strong><span>Verified courses</span></div>
			<div><strong>{data.academy.authenticatedLearningItemCount}</strong><span>Verified destinations</span></div>
			<div><strong>{entitledProducts.length}</strong><span>Order-backed products</span></div>
			<div><strong>{data.downloads.delivered.length}</strong><span>Delivered downloads</span></div>
			<div class="gap"><strong>{data.downloads.legacyWooMappingGaps.length + data.unassignedMediaCount}</strong><span>Recovery queue</span></div>
		</div>

		<section class="account-section" aria-labelledby="courses-title">
			<div class="section-heading">
				<div><p class="eyebrow">Course access</p><h2 id="courses-title">Complete LMS inventory</h2></div>
				<a href={resolve('/day-trading-academy')}>Open academy <span aria-hidden="true">↗</span></a>
			</div>
			<div class="course-list">
				{#each data.courses as course (course.slug)}
					<a href={resolve('/day-trading-academy/[slug]', { slug: course.slug })}>
						<div><span>{course.authenticated ? 'Verified access' : 'Recovered API record'}</span><h3>{course.title}</h3></div>
						<p>{course.learningItems} items{course.unresolved ? ` · ${course.unresolved} empty` : ''}</p>
					</a>
				{/each}
			</div>
		</section>

		<section class="account-section" aria-labelledby="purchases-title">
			<div class="section-heading">
				<div><p class="eyebrow">Purchase evidence</p><h2 id="purchases-title">Every distinct account product</h2></div>
				<p>{data.orders.recordsScanned} order records scanned</p>
			</div>
			<div class="purchase-grid">
				{#each data.orders.products as product (product.name)}
					<article class:inactive={!product.entitledByOrderStatus}>
						<span>{product.entitledByOrderStatus ? 'Order-backed access' : 'No current qualifying status'}</span>
						<h3>{product.name}</h3>
						<p>{Object.entries(product.statuses).map(([status, count]) => `${status} ${count}`).join(' · ')}</p>
					</article>
				{/each}
			</div>
		</section>

		<section class="account-section" aria-labelledby="downloads-title">
			<div class="section-heading">
				<div><p class="eyebrow">Downloads</p><h2 id="downloads-title">Delivered and missing mappings</h2></div>
				<a {...{ href: data.downloads.accountDownloadsUrl }}>Open legacy downloads <span aria-hidden="true">↗</span></a>
			</div>
			<div class="downloads-grid">
				<div>
					<h3>Delivered</h3>
					<ul>{#each data.downloads.delivered as download (download)}<li><span>✓</span>{download}</li>{/each}</ul>
				</div>
				<div class="missing">
					<h3>Woo mapping gaps</h3>
					<ul>{#each data.downloads.legacyWooMappingGaps as download (download.name)}<li><span>!</span><div>{download.name}<small>{download.value || 'url: ""'}</small></div></li>{/each}</ul>
				</div>
			</div>
		</section>
	</div>
</section>

<style>
	.account-heading,
	.section-heading {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.account-heading .eyebrow {
		color: var(--signal);
	}

	.account-heading h1 {
		margin-top: 1.4rem;
	}

	.role-badge {
		display: inline-block;
		margin-top: 1.3rem;
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--signal);
		border-radius: 99rem;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		text-transform: uppercase;
		color: var(--signal);
	}

	.account-stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border: 1px solid var(--line);
	}

	.account-stats > div {
		padding: 1.3rem;
		border-right: 1px solid var(--line);
		background: var(--paper);
	}

	.account-stats > div:last-child {
		border-right: 0;
	}

	.account-stats .gap {
		background: var(--signal);
	}

	.account-stats strong,
	.account-stats span {
		display: block;
	}

	.account-stats strong {
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 400;
	}

	.account-stats span {
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.5rem;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.account-section {
		margin-top: 7rem;
		padding-top: 4rem;
		border-top: 1px solid var(--line);
	}

	.section-heading h2 {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: clamp(2.7rem, 5vw, 5rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.section-heading > a,
	.section-heading > p {
		justify-self: end;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.course-list {
		margin-top: 3rem;
		border-top: 1px solid var(--line);
	}

	.course-list > a {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 2rem;
		padding: 1.2rem 0;
		border-bottom: 1px solid var(--line);
	}

	.course-list span,
	.purchase-grid span {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		text-transform: uppercase;
		color: var(--coral);
	}

	.course-list h3,
	.purchase-grid h3,
	.downloads-grid h3 {
		margin-top: 0.35rem;
		font-family: var(--font-display);
		font-size: 1.65rem;
		font-weight: 400;
	}

	.course-list > a > p {
		font-family: var(--font-mono);
		font-size: 0.55rem;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.purchase-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: 3rem;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.purchase-grid article {
		min-height: 13rem;
		padding: 1.3rem;
		background: var(--paper);
	}

	.purchase-grid article.inactive {
		opacity: 0.58;
	}

	.purchase-grid p {
		margin-top: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		line-height: 1.6;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.downloads-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 3rem;
	}

	.downloads-grid > div {
		padding: 1.5rem;
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.downloads-grid .missing {
		background: color-mix(in srgb, var(--signal) 18%, var(--paper));
	}

	.downloads-grid ul {
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.downloads-grid li {
		display: flex;
		gap: 0.8rem;
		padding: 0.85rem 0;
		border-top: 1px solid var(--line);
		font-size: 0.76rem;
	}

	.downloads-grid li > span {
		font-family: var(--font-mono);
		color: var(--coral);
	}

	.downloads-grid small {
		display: block;
		margin-top: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.5rem;
		color: var(--muted-ink);
	}

	@media (max-width: 850px) {
		.account-heading,
		.section-heading {
			grid-template-columns: 1fr;
		}

		.account-stats {
			grid-template-columns: 1fr 1fr;
		}

		.account-stats > div {
			border-bottom: 1px solid var(--line);
		}

		.purchase-grid {
			grid-template-columns: 1fr 1fr;
		}

		.section-heading > a,
		.section-heading > p {
			justify-self: start;
		}
	}

	@media (max-width: 580px) {
		.purchase-grid,
		.downloads-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
