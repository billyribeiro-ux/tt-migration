<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CourseModule, Lesson } from '$lib/course-data';

	let {
		item,
		module,
		course,
		previous,
		next
	}: {
		item: Lesson;
		module: CourseModule;
		course: { title: string; slug: string; url: string };
		previous?: Lesson;
		next?: Lesson;
	} = $props();

	function playerUrl(mediaUrl: string) {
		if (!mediaUrl) return '';
		const vimeo = mediaUrl.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\/([a-z0-9]+))?/i);
		if (!vimeo) return mediaUrl;
		return `https://player.vimeo.com/video/${vimeo[1]}${vimeo[2] ? `?h=${vimeo[2]}` : ''}`;
	}

	const embeddedMediaUrl = $derived(playerUrl(item.media.url));
	const moduleHref = $derived(`${resolve('/day-trading-academy/[slug]', { slug: course.slug })}#module-${module.slug}`);
</script>

<svelte:head>
	<title>{item.title} — {course.title}</title>
	<meta name="description" content={item.description} />
</svelte:head>

<section class:assessment={item.kind === 'assessment'} class="content-hero">
	<div class="shell">
		<nav aria-label="Breadcrumb">
			<a href={resolve('/day-trading-academy')}>Academy</a><span>/</span>
			<a href={resolve('/day-trading-academy/[slug]', { slug: course.slug })}>{course.title}</a><span>/</span>
			<a {...{ href: moduleHref }}>{module.title}</a>
		</nav>
		<div class="content-heading">
			<div>
				<p class="eyebrow">{item.kind} · {module.title}</p>
				<h1 class="display-title">{item.title}</h1>
			</div>
			<p class="lede">{item.description}</p>
		</div>
	</div>
</section>

<section class="lesson-body surface-cream">
	<div class="shell body-grid">
		<aside>
			<p class="aside-label">Module</p>
			<strong>{module.title}</strong>
			<p>{module.description}</p>
			<a {...{ href: moduleHref }}>Back to module <span aria-hidden="true">↗</span></a>
		</aside>
		<article>
			{#if embeddedMediaUrl}
				<div class="media-player">
					<iframe
						src={embeddedMediaUrl}
						title={item.title}
						allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
						allowfullscreen
					></iframe>
					<div>
						<p><span>{item.media.provider || 'embedded'}</span> · authenticated showcase media</p>
						<a {...{ href: item.originalUrl }}>Open source {item.kind} <span aria-hidden="true">↗</span></a>
					</div>
				</div>
			{:else}
				<div class="media-placeholder">
					<div class="media-mark" aria-hidden="true">{item.kind === 'assessment' ? '✓' : '▶'}</div>
					<div>
						<p class="eyebrow">Protected member content</p>
						<h2>{item.kind === 'assessment' ? 'Continue to the original assessment' : 'Media evidence still required'}</h2>
						<p>The source item is evidenced, but its API record did not provide an embeddable media URL. The original member destination remains available while this blank is recovered.</p>
						<a {...{ href: item.originalUrl }} class="button button-signal">Open original {item.kind}</a>
					</div>
				</div>
			{/if}

			<div class="lesson-note">
				<span>Remember</span>
				<p>{item.kind === 'assessment' ? 'Complete the checkpoint honestly. The purpose is to find what needs another pass, not to race through the curriculum.' : 'Go slowly, take notes and apply one idea at a time. Professional skill comes from deliberate repetition.'}</p>
			</div>

			<nav class="lesson-pagination" aria-label="Lesson navigation">
				{#if previous}
					<a class="previous" href={resolve(previous.kind === 'assessment' ? '/assessment/[slug]' : '/course/[slug]', { slug: previous.slug })}><span>← Previous</span><strong>{previous.title}</strong></a>
				{:else}
					<div></div>
				{/if}
				{#if next}
					<a class="next" href={resolve(next.kind === 'assessment' ? '/assessment/[slug]' : '/course/[slug]', { slug: next.slug })}><span>Next →</span><strong>{next.title}</strong></a>
				{/if}
			</nav>
		</article>
	</div>
</section>

<style>
	.content-hero {
		padding-block: clamp(4rem, 8vw, 7rem);
		background: var(--ink);
		color: var(--paper);
	}

	.content-hero.assessment {
		background: var(--blue);
	}

	.content-hero nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.57rem;
		text-transform: uppercase;
		color: var(--muted-paper);
	}

	.content-hero nav a:hover {
		color: var(--paper);
	}

	.content-heading {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		align-items: end;
		gap: clamp(3rem, 7vw, 7rem);
		margin-top: clamp(4rem, 9vw, 8rem);
	}

	.content-heading .eyebrow {
		color: var(--signal);
	}

	.content-heading h1 {
		max-width: 65rem;
		margin-top: 1.4rem;
		font-size: clamp(3rem, 7vw, 6.8rem);
	}

	.content-heading .lede {
		color: var(--muted-paper);
	}

	.lesson-body {
		padding-block: clamp(4rem, 8vw, 8rem);
	}

	.body-grid {
		display: grid;
		grid-template-columns: minmax(12rem, 0.32fr) minmax(0, 1fr);
		gap: clamp(3rem, 8vw, 8rem);
	}

	aside {
		align-self: start;
		padding-top: 1.4rem;
		border-top: 1px solid var(--line);
	}

	.aside-label {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--coral);
	}

	aside strong {
		display: block;
		margin-top: 0.8rem;
		font-family: var(--font-display);
		font-size: 1.7rem;
		font-weight: 400;
	}

	aside > p:not(.aside-label) {
		margin-top: 0.8rem;
		font-size: 0.76rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	aside a {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
		font-size: 0.7rem;
		font-weight: 700;
	}

	.media-placeholder {
		display: grid;
		grid-template-columns: minmax(8rem, 0.42fr) minmax(0, 1fr);
		min-height: 28rem;
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.media-player {
		border: 1px solid var(--line);
		background: var(--ink);
	}

	.media-player iframe {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 0;
		background: #000;
	}

	.media-player > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.2rem;
		font-family: var(--font-mono);
		font-size: 0.56rem;
		text-transform: uppercase;
		color: var(--muted-paper);
	}

	.media-player p span {
		color: var(--signal);
	}

	.media-player a {
		font-weight: 700;
		color: var(--paper);
	}

	.media-mark {
		display: grid;
		place-items: center;
		background: var(--ink);
		font-family: var(--font-display);
		font-size: clamp(3rem, 8vw, 7rem);
		color: var(--signal);
	}

	.media-placeholder > div:last-child {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: clamp(1.5rem, 5vw, 4.5rem);
	}

	.media-placeholder h2 {
		max-width: 35rem;
		margin-top: 1.1rem;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 4vw, 4rem);
		font-weight: 400;
		line-height: 0.96;
	}

	.media-placeholder div > p:last-of-type {
		max-width: 38rem;
		margin-top: 1.3rem;
		font-size: 0.86rem;
		line-height: 1.7;
		color: var(--muted-ink);
	}

	.media-placeholder .button {
		margin-top: 1.7rem;
	}

	.lesson-note {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 2rem;
		margin-top: 1rem;
		padding: 1.5rem;
		background: var(--signal);
	}

	.lesson-note span {
		font-family: var(--font-mono);
		font-size: 0.59rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.lesson-note p {
		font-size: 0.83rem;
		line-height: 1.65;
	}

	.lesson-pagination {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		margin-top: 4rem;
		border: 1px solid var(--line);
		background: var(--line);
	}

	.lesson-pagination a,
	.lesson-pagination > div {
		min-height: 8rem;
		padding: 1.4rem;
		background: var(--paper);
	}

	.lesson-pagination a {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.lesson-pagination .next {
		text-align: right;
	}

	.lesson-pagination span {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--coral);
	}

	.lesson-pagination strong {
		font-size: 0.82rem;
		line-height: 1.4;
	}

	@media (max-width: 760px) {
		.content-heading,
		.body-grid,
		.media-placeholder {
			grid-template-columns: 1fr;
		}

		.media-mark {
			min-height: 12rem;
		}
	}

	@media (max-width: 520px) {
		.lesson-note,
		.lesson-pagination {
			grid-template-columns: 1fr;
		}
	}
</style>
