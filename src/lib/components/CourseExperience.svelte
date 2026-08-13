<script lang="ts">
	import CoursePortal from '$lib/components/CoursePortal.svelte';
	import type { CourseModule } from '$lib/course-data';

	let {
		course,
		evidence,
		modules,
		unresolvedItems
	}: {
		course: {
			title: string;
			slug: string;
			url: string;
			status: string;
			description: string;
			excerpt: string;
			reportedLessonCount: number;
			reportedAssessmentCount: number;
			hasCertificate: boolean;
		};
		evidence: {
			authenticatedAcademyListed: boolean;
			authenticatedLearningItemCount: number | null;
			allApiItemsPresentInAuthenticatedListing: boolean | null;
			lockedMarkerPresent: boolean | null;
		};
		modules: CourseModule[];
		unresolvedItems: Array<{ kind: string; title: string; slug: string; url: string; reason?: string }>;
	} = $props();

	const evidencedItems = $derived(modules.reduce((total, module) => total + module.lessons.length + module.assessments.length, 0));
</script>

<svelte:head>
	<title>{course.title} — Trick Trades Academy</title>
	<meta name="description" content={course.excerpt || course.description || `Browse the complete ${course.title} curriculum.`} />
</svelte:head>

<section class="page-hero course-hero">
	<div class="shell hero-layout">
		<div>
			<p class="eyebrow">Day Trading Academy</p>
			<h1 class="display-title">{course.title}</h1>
		</div>
		<div>
			<p class="lede">{course.excerpt || course.description || 'This course was recovered from the source LMS catalog.'}</p>
			<div class="evidence-row">
				<span class:verified={evidence.authenticatedAcademyListed}>
					{evidence.authenticatedAcademyListed ? 'Authenticated access verified' : 'API recovery'}
				</span>
				<span>{evidencedItems} evidenced items</span>
				{#if unresolvedItems.length}<span>{unresolvedItems.length} empty evidence slots</span>{/if}
			</div>
		</div>
	</div>
</section>

<section class="curriculum-section surface-cream">
	<div class="shell">
		{#if modules.length}
			<CoursePortal {modules} />
		{:else}
			<div class="empty-course">
				<p class="eyebrow">No evidenced curriculum</p>
				<h2>The source course exists, but its item records are empty.</h2>
				<a {...{ href: course.url }} class="button button-dark">Open source course</a>
			</div>
		{/if}

		{#if unresolvedItems.length}
			<section class="unresolved" aria-labelledby="unresolved-title">
				<div class="unresolved-heading">
					<div>
						<p class="eyebrow">Manual recovery queue</p>
						<h2 id="unresolved-title">Reported by the LMS, absent from its evidence response.</h2>
					</div>
					<p>These slots are intentionally blank. Add the title, slug and media URL only when source evidence is available.</p>
				</div>
				<div class="gap-grid">
					{#each unresolvedItems as item, index (`${item.kind}-${index}`)}
						<article>
							<span>{String(index + 1).padStart(2, '0')}</span>
							<p>{item.kind}</p>
							<h3>{item.title || 'Empty'}</h3>
							<code>{item.url || 'url: ""'}</code>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</section>

<style>
	.hero-layout,
	.unresolved-heading {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.hero-layout .eyebrow {
		color: var(--signal);
	}

	.hero-layout h1 {
		margin-top: 1.4rem;
	}

	.evidence-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.evidence-row span {
		padding: 0.45rem 0.7rem;
		border: 1px solid color-mix(in srgb, var(--paper) 28%, transparent);
		border-radius: 99rem;
		font-family: var(--font-mono);
		font-size: 0.52rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-paper);
	}

	.evidence-row span.verified {
		border-color: var(--signal);
		color: var(--signal);
	}

	.curriculum-section {
		padding-block: clamp(4rem, 8vw, 7rem) clamp(6rem, 11vw, 10rem);
	}

	.empty-course {
		max-width: 48rem;
		padding: clamp(2rem, 5vw, 4rem);
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.empty-course h2,
	.unresolved h2 {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: clamp(2.3rem, 4vw, 4.3rem);
		font-weight: 400;
		line-height: 0.98;
	}

	.empty-course .button {
		margin-top: 2rem;
	}

	.unresolved {
		margin-top: 7rem;
		padding-top: 4rem;
		border-top: 1px solid var(--line);
	}

	.unresolved-heading {
		align-items: end;
	}

	.unresolved-heading > p {
		font-size: 0.82rem;
		line-height: 1.65;
		color: var(--muted-ink);
	}

	.gap-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: 3rem;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.gap-grid article {
		min-height: 12rem;
		padding: 1.3rem;
		background: var(--paper);
	}

	.gap-grid span,
	.gap-grid p,
	.gap-grid code {
		font-family: var(--font-mono);
		font-size: 0.55rem;
		text-transform: uppercase;
		color: var(--muted-ink);
	}

	.gap-grid p {
		margin-top: 2rem;
		color: var(--coral);
	}

	.gap-grid h3 {
		margin-top: 0.5rem;
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 400;
	}

	.gap-grid code {
		display: block;
		margin-top: 1.5rem;
		text-transform: none;
	}

	@media (max-width: 760px) {
		.hero-layout,
		.unresolved-heading {
			grid-template-columns: 1fr;
		}

		.gap-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 520px) {
		.gap-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
