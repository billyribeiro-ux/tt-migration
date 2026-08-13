<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const learningItemCount = $derived(data.courses.reduce((total, course) => total + course.counts.lessons + course.counts.assessments, 0));
	const unresolvedCount = $derived(data.courses.reduce((total, course) => total + course.counts.unresolved, 0));
	const authenticatedCount = $derived(data.courses.filter((course) => course.evidence.authenticatedAcademyListed).length);
</script>

<svelte:head>
	<title>Day Trading Academy — Trick Trades</title>
	<meta name="description" content="The complete API-evidenced Trick Trades course catalog, including authenticated and recovered course content." />
</svelte:head>

<section class="page-hero academy-hero">
	<div class="shell academy-heading">
		<div>
			<p class="eyebrow">Evidence-backed migration</p>
			<h1 class="display-title">Every course the LMS reports. Nothing silently dropped.</h1>
		</div>
		<p class="lede">Authenticated access and raw course existence are tracked separately, so a broken WooCommerce mapping cannot erase valid curriculum.</p>
	</div>
	<div class="shell stat-row">
		<div class="stat"><strong>{String(data.courses.length).padStart(2, '0')}</strong><span>Course containers</span></div>
		<div class="stat"><strong>{learningItemCount}</strong><span>Learning destinations</span></div>
		<div class="stat"><strong>{authenticatedCount}</strong><span>Access-verified courses</span></div>
		<div class="stat"><strong>{unresolvedCount}</strong><span>Empty evidence slots</span></div>
	</div>
</section>

<section class="section surface-cream">
	<div class="shell">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Complete inventory</p>
				<h2 class="section-title">Verified courses first. API recoveries retained.</h2>
			</div>
			<p class="lede">Each card opens the locally migrated curriculum. Media URLs are held in server-only course files and released through the member experience.</p>
		</div>

		<div class="course-grid">
			{#each data.courses as course, index (course.slug)}
				<article class:verified={course.evidence.authenticatedAcademyListed}>
					<div class="course-index">{String(index + 1).padStart(2, '0')} / {String(data.courses.length).padStart(2, '0')}</div>
					<div>
						<p class="course-meta">
							{course.evidence.authenticatedAcademyListed ? 'Authenticated access' : course.status === 'draft' ? 'Draft recovery' : 'API-only recovery'}
						</p>
						<h3>{course.title}</h3>
						<p>{course.excerpt || course.description || 'Course record recovered from the source LMS.'}</p>
					</div>
					<dl>
						<div><dt>Lessons</dt><dd>{course.counts.lessons}</dd></div>
						<div><dt>Checks</dt><dd>{course.counts.assessments}</dd></div>
						<div><dt>Media URLs</dt><dd>{course.counts.mediaUrls}</dd></div>
						<div class:gap={course.counts.unresolved > 0}><dt>Empty</dt><dd>{course.counts.unresolved}</dd></div>
					</dl>
					<a href={resolve('/day-trading-academy/[slug]', { slug: course.slug })} class="course-link">
						Open curriculum <span aria-hidden="true">↗</span>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="path-section surface-dark">
	<div class="shell path-grid">
		<div>
			<p class="eyebrow">Migration rule</p>
			<h2 class="section-title">Evidence gaps stay visible until they are resolved.</h2>
		</div>
		<ol>
			<li><span>01</span><div><strong>Discover</strong><p>Read the LMS and Woo catalogs independently.</p></div></li>
			<li><span>02</span><div><strong>Verify</strong><p>Compare authenticated listings against API item URLs.</p></div></li>
			<li><span>03</span><div><strong>Recover</strong><p>Keep orphaned courses and broken product mappings in the migration queue.</p></div></li>
			<li><span>04</span><div><strong>Fill</strong><p>Use blank slots only when no source evidence exists yet.</p></div></li>
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
		max-width: 66rem;
		margin: 1.5rem 0 4rem;
	}

	.academy-heading .eyebrow,
	.path-grid .eyebrow {
		color: var(--signal);
	}

	.academy-heading .lede {
		margin-bottom: 4rem;
	}

	.stat-row {
		grid-template-columns: repeat(4, 1fr);
	}

	.section-heading h2 {
		max-width: 52rem;
		margin-top: 1.4rem;
	}

	.course-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 4rem;
	}

	.course-grid article {
		display: flex;
		min-height: 30rem;
		flex-direction: column;
		justify-content: space-between;
		padding: 1.7rem;
		border: 1px solid var(--line);
		background: var(--paper);
		transition: box-shadow 180ms ease, transform 180ms ease;
	}

	.course-grid article.verified {
		border-top: 0.35rem solid var(--signal);
	}

	.course-grid article:hover {
		box-shadow: 0.65rem 0.65rem 0 var(--ink);
		transform: translate(-0.25rem, -0.25rem);
	}

	.course-index,
	.course-meta,
	dt,
	dd {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.08em;
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
		font-size: clamp(2.2rem, 4vw, 4rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.course-grid div > p:last-child {
		max-width: 48rem;
		margin-top: 1rem;
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	dl {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin: 2rem 0;
		border: 1px solid var(--line);
	}

	dl div {
		padding: 0.8rem;
		border-right: 1px solid var(--line);
	}

	dl div:last-child {
		border-right: 0;
	}

	dl div.gap {
		background: color-mix(in srgb, var(--coral) 12%, transparent);
	}

	dt {
		color: var(--muted-ink);
	}

	dd {
		margin-top: 0.5rem;
		font-size: 0.8rem;
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

	.path-section {
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	.path-grid {
		align-items: start;
	}

	.path-grid h2 {
		max-width: 42rem;
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

		.course-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 620px) {
		.stat-row,
		dl {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
