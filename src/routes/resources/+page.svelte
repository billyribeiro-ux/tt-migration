<script lang="ts">
	import { memberResourceGroups } from '$lib/course-data';
</script>

<svelte:head>
	<title>Member Resources — Trick Trades</title>
	<meta name="description" content="Direct access to Trick Trades live sessions, charts, community, CORE ALPHA and support resources." />
</svelte:head>

<section class="page-hero resources-hero">
	<div class="shell resources-heading">
		<div>
			<p class="eyebrow">Member resources</p>
			<h1 class="display-title">Every important link. None of the hunting.</h1>
		</div>
		<p class="lede">The original site’s live rooms, tools, community pages, mental-performance sessions and account links are grouped below.</p>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell resource-grid">
		{#each memberResourceGroups as group, index (group.title)}
			<section aria-labelledby={`resource-${index}`}>
				<div class="group-heading">
					<span>0{index + 1}</span>
					<h2 id={`resource-${index}`}>{group.title}</h2>
				</div>
				<div class="link-list">
					{#each group.links as link (link.href)}
						<a {...{ href: link.href }}><span>{link.label}</span><span aria-hidden="true">↗</span></a>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</section>

<section class="support-band surface-dark">
	<div class="shell support-grid">
		<div>
			<p class="eyebrow">Need a hand?</p>
			<h2 class="section-title">Questions should get answered.</h2>
		</div>
		<div>
			<p class="lede">Use the original support channel for account, billing or course-access questions.</p>
			<a class="button button-signal" href="https://tricktrades.com/contact-us">Contact support</a>
		</div>
	</div>
</section>

<style>
	.resources-heading,
	.support-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.resources-heading h1 {
		max-width: 64rem;
		margin-top: 1.5rem;
	}

	.resources-heading .eyebrow,
	.support-grid .eyebrow {
		color: var(--signal);
	}

	.resource-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.resource-grid > section {
		padding: clamp(1.5rem, 4vw, 3rem);
		background: var(--paper);
	}

	.group-heading {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding-bottom: 2rem;
	}

	.group-heading span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--coral);
	}

	.group-heading h2 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.4rem);
		font-weight: 400;
		line-height: 1;
	}

	.link-list {
		border-top: 1px solid var(--line);
	}

	.link-list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
		font-size: 0.82rem;
		font-weight: 650;
		transition: padding 160ms ease, color 160ms ease;
	}

	.link-list a:hover {
		padding-inline: 0.5rem;
		color: var(--blue);
	}

	.link-list a span:last-child {
		font-size: 1rem;
	}

	.support-band {
		padding-block: clamp(5rem, 9vw, 8rem);
	}

	.support-grid h2 {
		margin-top: 1.5rem;
	}

	.support-grid .lede {
		color: var(--muted-paper);
	}

	.support-grid .button {
		margin-top: 2rem;
	}

	@media (max-width: 720px) {
		.resources-heading,
		.support-grid,
		.resource-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
