<script lang="ts">
	import { resolve } from '$app/paths';
	import { courseProducts } from '$lib/course-data';
</script>

<svelte:head>
	<title>Day Trading Academy — Trick Trades</title>
	<meta name="description" content="Access the Trick Trades curriculum, member courses and complete 50-lesson Boot Camp map." />
</svelte:head>

<section class="page-hero academy-hero">
	<div class="shell academy-heading">
		<div>
			<p class="eyebrow">Member learning hub</p>
			<h1 class="display-title">The academy, organized around action.</h1>
		</div>
		<p class="lede">Every course path found in the original member area is collected here. Boot Camp is rebuilt as a fast Svelte learning experience; specialist courses continue to their existing member pages.</p>
	</div>
	<div class="shell stat-row">
		<div class="stat"><strong>50</strong><span>Boot Camp lessons</span></div>
		<div class="stat"><strong>04</strong><span>Knowledge checks</span></div>
		<div class="stat"><strong>05</strong><span>Course pathways</span></div>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell">
		<div class="section-heading">
			<div>
				<p class="eyebrow">All courses</p>
				<h2 class="section-title">Choose your next focused block of work.</h2>
			</div>
			<p class="lede">Start with Boot Camp if you have not completed the foundation. The remaining programs open on the existing member platform, where your original account access is enforced.</p>
		</div>

		<div class="course-grid">
			{#each courseProducts as course, index (course.title)}
				<article class:primary={index === 0}>
					<div class="course-index">0{index + 1} / 05</div>
					<div>
						<p class="course-meta">{course.meta}</p>
						<h3>{course.title}</h3>
						<p>{course.description}</p>
					</div>
					{#if index === 0}
						<a href={resolve('/day-trading-academy/boot-camp')} class="course-link">Open curriculum <span aria-hidden="true">↗</span></a>
					{:else}
						<a {...{ href: course.href }} class="course-link">Open original course <span aria-hidden="true">↗</span></a>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="path-section surface-dark">
	<div class="shell path-grid">
		<div>
			<p class="eyebrow">Recommended path</p>
			<h2 class="section-title">Build the bones before adding speed.</h2>
		</div>
		<ol>
			<li><span>01</span><div><strong>Orient</strong><p>Set up access, tools, routine and expectations.</p></div></li>
			<li><span>02</span><div><strong>Understand</strong><p>Learn charts, candles, levels, orders and the strategy.</p></div></li>
			<li><span>03</span><div><strong>Apply</strong><p>Build trade plans, define risk and manage live outcomes.</p></div></li>
			<li><span>04</span><div><strong>Refine</strong><p>Use the classic lessons and specialist courses to deepen judgment.</p></div></li>
		</ol>
	</div>
</section>

<style>
	.academy-heading,
	.section-heading,
	.path-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.academy-heading h1 {
		max-width: 58rem;
		margin: 1.5rem 0 4rem;
	}

	.academy-heading .eyebrow {
		color: var(--signal);
	}

	.academy-heading .lede {
		margin-bottom: 4rem;
	}

	.section-heading {
		align-items: end;
	}

	.section-heading h2 {
		max-width: 49rem;
		margin-top: 1.4rem;
	}

	.course-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
		margin-top: 4rem;
	}

	.course-grid article {
		display: flex;
		min-height: 29rem;
		grid-column: span 2;
		flex-direction: column;
		justify-content: space-between;
		padding: 1.7rem;
		border: 1px solid var(--line);
		background: var(--paper);
		transition: transform 180ms ease, box-shadow 180ms ease;
	}

	.course-grid article:nth-child(n + 4) {
		grid-column: span 3;
		min-height: 23rem;
	}

	.course-grid article.primary {
		background: var(--signal);
	}

	.course-grid article:hover {
		box-shadow: 0.65rem 0.65rem 0 var(--ink);
		transform: translate(-0.25rem, -0.25rem);
	}

	.course-index,
	.course-meta {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.course-index {
		color: var(--muted-ink);
	}

	.course-meta {
		margin-bottom: 1rem;
		color: var(--coral);
	}

	.course-grid h3 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 3vw, 3rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.course-grid div > p:last-child {
		margin-top: 1rem;
		font-size: 0.84rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	.course-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.course-link span {
		font-size: 1rem;
	}

	.path-section {
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	.path-grid {
		align-items: start;
	}

	.path-grid .eyebrow {
		color: var(--signal);
	}

	.path-grid h2 {
		max-width: 38rem;
		margin-top: 1.5rem;
	}

	ol {
		margin: 0;
		padding: 0;
		border-top: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		gap: 1rem;
		padding: 1.3rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
	}

	li > span {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		color: var(--signal);
	}

	li strong {
		font-family: var(--font-display);
		font-size: 1.45rem;
		font-weight: 400;
	}

	li p {
		margin-top: 0.35rem;
		font-size: 0.78rem;
		line-height: 1.55;
		color: var(--muted-paper);
	}

	@media (max-width: 800px) {
		.academy-heading,
		.section-heading,
		.path-grid {
			grid-template-columns: 1fr;
		}

		.academy-heading h1 {
			margin-bottom: 0;
		}

		.course-grid {
			grid-template-columns: 1fr 1fr;
		}

		.course-grid article,
		.course-grid article:nth-child(n + 4) {
			grid-column: span 1;
		}
	}

	@media (max-width: 560px) {
		.course-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
