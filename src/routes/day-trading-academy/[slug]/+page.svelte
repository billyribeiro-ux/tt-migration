<script lang="ts">
	import CourseExperience from '$lib/components/CourseExperience.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CourseExperience {...data} />
