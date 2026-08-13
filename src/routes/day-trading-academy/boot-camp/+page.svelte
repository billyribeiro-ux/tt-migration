<script lang="ts">
	import CoursePortal from '$lib/components/CoursePortal.svelte';
	import { bootcampModules } from '$lib/course-data';
</script>

<svelte:head>
	<title>Boot Camp Curriculum — Trick Trades</title>
	<meta name="description" content="Browse and track all 50 Trick Trades Boot Camp lessons and four assessments." />
</svelte:head>

<section class="page-hero bootcamp-hero">
	<div class="shell hero-layout">
		<div>
			<p class="eyebrow">Day Trading Academy</p>
			<h1 class="display-title">Boot Camp</h1>
		</div>
		<div>
			<p class="lede">Your training starts here. Move deliberately through the tools, strategy, risk and emotional framework needed to build a professional process.</p>
			<p class="source-note">Lessons open in this rebuilt hub, with a direct link to the original member page for protected media and account access.</p>
		</div>
	</div>
</section>

<section class="curriculum-section surface-cream">
	<div class="shell">
		<CoursePortal modules={bootcampModules} />
	</div>
</section>

<style>
	.hero-layout {
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

	.source-note {
		margin-top: 1.3rem;
		padding-top: 1.3rem;
		border-top: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
		font-family: var(--font-mono);
		font-size: 0.59rem;
		line-height: 1.7;
		color: var(--muted-paper);
	}

	.curriculum-section {
		padding-block: clamp(4rem, 8vw, 7rem) clamp(6rem, 11vw, 10rem);
	}

	@media (max-width: 700px) {
		.hero-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
