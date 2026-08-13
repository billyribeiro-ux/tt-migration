<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CourseModule } from '$lib/course-data';
	import { onMount } from 'svelte';

	let { modules }: { modules: CourseModule[] } = $props();

	let search = $state('');
	let hideCompleted = $state(false);
	let completed = $state<string[]>([]);
	let persistence = $state<'device' | 'database'>('device');

	const totalItems = $derived(modules.reduce((total, module) => total + module.lessons.length + module.assessments.length, 0));
	const completedCount = $derived(completed.length);
	const progress = $derived(totalItems ? Math.round((completedCount / totalItems) * 100) : 0);
	const filteredModules = $derived.by(() => {
		const query = search.trim().toLowerCase();
		return modules
			.map((module) => {
				const items = [...module.lessons, ...module.assessments].filter((item) => {
					const matchesSearch = !query || `${item.title} ${item.description}`.toLowerCase().includes(query);
					return matchesSearch && (!hideCompleted || !completed.includes(item.slug));
				});
				return { ...module, items };
			})
			.filter((module) => module.items.length > 0);
	});

	onMount(async () => {
		const saved = localStorage.getItem('tt-course-progress');
		if (saved) {
			try {
				const localProgress = JSON.parse(saved);
				if (Array.isArray(localProgress)) completed = localProgress.filter((slug): slug is string => typeof slug === 'string');
			} catch {
				localStorage.removeItem('tt-course-progress');
			}
		}

		try {
			const response = await fetch('/api/progress');
			if (response.ok) {
				const result = (await response.json()) as { persisted: boolean; completed: string[] };
				if (result.persisted) {
					completed = [...new Set([...completed, ...result.completed])];
					persistence = 'database';
				}
			}
		} catch {
			// Device storage remains the reliable offline fallback.
		}

		localStorage.setItem('tt-course-progress', JSON.stringify(completed));
	});

	async function toggleComplete(slug: string) {
		const isComplete = completed.includes(slug);
		completed = isComplete ? completed.filter((item) => item !== slug) : [...completed, slug];
		localStorage.setItem('tt-course-progress', JSON.stringify(completed));

		try {
			const response = await fetch('/api/progress', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ slug, completed: !isComplete })
			});
			if (response.ok) {
				const result = (await response.json()) as { persisted: boolean };
				if (result.persisted) persistence = 'database';
			}
		} catch {
			// Progress is already safely stored on this device.
		}
	}
</script>

<div class="portal">
	<section class="progress-card" aria-labelledby="progress-heading">
		<div class="progress-copy">
			<p class="eyebrow">Your progress</p>
			<h2 id="progress-heading">{completedCount} of {totalItems} complete</h2>
			<p>{persistence === 'database' ? 'Synced to your learner profile' : 'Saved on this device'}</p>
		</div>
		<div class="progress-visual">
			<strong>{progress}%</strong>
			<div class="progress-track" role="progressbar" aria-label="Course completion" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
				<span style={`width: ${progress}%`}></span>
			</div>
		</div>
	</section>

	<section class="portal-tools" aria-label="Curriculum filters">
		<label class="search-box">
			<span class="sr-only">Search lessons</span>
			<span aria-hidden="true">⌕</span>
			<input bind:value={search} type="search" placeholder="Search 50 lessons and 4 assessments" />
		</label>
		<label class="filter-toggle">
			<input bind:checked={hideCompleted} type="checkbox" />
			<span>Hide completed</span>
		</label>
	</section>

	{#if filteredModules.length}
		<div class="module-list">
			{#each filteredModules as module, moduleIndex (module.slug)}
				<section id={`module-${module.slug}`} class="module" aria-labelledby={`module-title-${module.slug}`}>
					<div class="module-heading">
						<div class="module-number">0{moduleIndex + 1}</div>
						<div>
							<p>{module.eyebrow}</p>
							<h2 id={`module-title-${module.slug}`}>{module.title}</h2>
							<span>{module.description}</span>
						</div>
						<div class="module-count">{module.items.length} {module.items.length === 1 ? 'item' : 'items'}</div>
					</div>

					<div class="lesson-list">
						{#each module.items as item (item.slug)}
							<div class:complete={completed.includes(item.slug)} class="lesson-row">
								<button
									class="complete-button"
									type="button"
									aria-label={completed.includes(item.slug) ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
									aria-pressed={completed.includes(item.slug)}
									onclick={() => toggleComplete(item.slug)}
								>
									<span aria-hidden="true">{completed.includes(item.slug) ? '✓' : ''}</span>
								</button>
								<a href={resolve(item.kind === 'assessment' ? '/assessment/[slug]' : '/course/[slug]', { slug: item.slug })}>
									<div>
										<p class="lesson-kind">{item.kind}</p>
										<h3>{item.title}</h3>
										<p>{item.description}</p>
									</div>
									<span class="lesson-arrow" aria-hidden="true">→</span>
								</a>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p class="eyebrow">No results</p>
			<h2>Try a broader search.</h2>
			<button type="button" onclick={() => { search = ''; hideCompleted = false; }}>Clear filters</button>
		</div>
	{/if}
</div>

<style>
	.portal {
		position: relative;
	}

	.progress-card {
		display: grid;
		grid-template-columns: 1fr 0.75fr;
		align-items: end;
		gap: 3rem;
		padding: clamp(1.5rem, 4vw, 3rem);
		background: var(--signal);
		box-shadow: 0.8rem 0.8rem 0 var(--ink);
	}

	.progress-card .eyebrow {
		font-size: 0.58rem;
	}

	.progress-card h2 {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 4vw, 3.7rem);
		font-weight: 400;
		line-height: 1;
	}

	.progress-copy > p:last-child {
		margin-top: 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		text-transform: uppercase;
	}

	.progress-visual strong {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(3rem, 7vw, 6rem);
		font-weight: 400;
		letter-spacing: -0.06em;
		line-height: 0.8;
		text-align: right;
	}

	.progress-track {
		height: 0.55rem;
		margin-top: 1.3rem;
		background: color-mix(in srgb, var(--ink) 20%, transparent);
	}

	.progress-track span {
		display: block;
		height: 100%;
		background: var(--ink);
		transition: width 220ms ease;
	}

	.portal-tools {
		position: sticky;
		top: 4.7rem;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 4rem;
		padding: 1rem;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--cream) 94%, transparent);
		backdrop-filter: blur(16px);
	}

	.search-box {
		display: flex;
		min-width: 0;
		flex: 1;
		align-items: center;
		gap: 0.8rem;
		padding-inline: 0.4rem;
	}

	.search-box > span {
		font-size: 1.5rem;
		line-height: 1;
	}

	.search-box input {
		width: 100%;
		border: 0;
		outline: 0;
		background: transparent;
		font-size: 0.83rem;
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		font-size: 0.7rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.filter-toggle input {
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--ink);
	}

	.module-list {
		margin-top: 4rem;
	}

	.module {
		scroll-margin-top: 10rem;
		padding-top: 4rem;
		border-top: 1px solid var(--line);
	}

	.module + .module {
		margin-top: 5rem;
	}

	.module-heading {
		display: grid;
		grid-template-columns: 3rem 1fr auto;
		gap: 1.5rem;
		align-items: start;
		padding-bottom: 2.2rem;
	}

	.module-number,
	.module-heading p,
	.module-count,
	.lesson-kind {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.module-number,
	.module-heading p,
	.lesson-kind {
		color: var(--coral);
	}

	.module-heading h2 {
		margin-top: 0.65rem;
		font-family: var(--font-display);
		font-size: clamp(2.7rem, 5vw, 4.8rem);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 0.9;
	}

	.module-heading div > span {
		display: block;
		max-width: 42rem;
		margin-top: 1rem;
		font-size: 0.84rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	.module-count {
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 99rem;
		color: var(--muted-ink);
	}

	.lesson-list {
		border-top: 1px solid var(--line);
	}

	.lesson-row {
		display: grid;
		grid-template-columns: 3.2rem 1fr;
		border-bottom: 1px solid var(--line);
		transition: background 160ms ease;
	}

	.lesson-row:hover {
		background: var(--paper);
	}

	.complete-button {
		display: grid;
		width: 100%;
		place-items: center;
		border: 0;
		border-right: 1px solid var(--line);
		background: transparent;
		cursor: pointer;
	}

	.complete-button span {
		display: grid;
		width: 1.15rem;
		height: 1.15rem;
		place-items: center;
		border: 1px solid var(--muted-ink);
		border-radius: 50%;
		font-size: 0.65rem;
	}

	.complete .complete-button span {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--signal);
	}

	.lesson-row > a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 1.3rem 1rem 1.3rem 1.4rem;
	}

	.lesson-row h3 {
		margin-top: 0.35rem;
		font-size: 0.96rem;
		font-weight: 700;
		line-height: 1.35;
	}

	.lesson-row a div > p:last-child {
		max-width: 54rem;
		margin-top: 0.4rem;
		font-size: 0.76rem;
		line-height: 1.55;
		color: var(--muted-ink);
	}

	.complete h3,
	.complete a div > p:last-child {
		color: color-mix(in srgb, var(--muted-ink) 60%, transparent);
	}

	.lesson-arrow {
		font-size: 1.1rem;
		transition: transform 160ms ease;
	}

	.lesson-row > a:hover .lesson-arrow {
		transform: translateX(0.3rem);
	}

	.empty-state {
		margin-top: 4rem;
		padding: 5rem 2rem;
		border: 1px solid var(--line);
		text-align: center;
	}

	.empty-state h2 {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 400;
	}

	.empty-state button {
		margin-top: 1.5rem;
		padding: 0;
		border: 0;
		border-bottom: 1px solid;
		background: transparent;
		font-size: 0.75rem;
		font-weight: 700;
		cursor: pointer;
	}

	@media (max-width: 640px) {
		.progress-card {
			grid-template-columns: 1fr;
		}

		.progress-visual strong {
			text-align: left;
		}

		.portal-tools {
			align-items: stretch;
			flex-direction: column;
		}

		.search-box {
			padding: 0.6rem 0.4rem;
		}

		.filter-toggle {
			padding: 0.6rem 0.4rem;
		}

		.module-heading {
			grid-template-columns: 2rem 1fr;
			gap: 1rem;
		}

		.module-count {
			grid-column: 2;
			justify-self: start;
		}

		.lesson-row {
			grid-template-columns: 2.8rem 1fr;
		}

		.lesson-row > a {
			gap: 1rem;
			padding-inline: 1rem 0.5rem;
		}

		.lesson-row a div > p:last-child {
			display: none;
		}
	}
</style>
