import { allContent, findContent, findModuleForContent } from '$lib/course-data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const item = findContent(params.slug, 'lesson');
	const module = findModuleForContent(params.slug);
	if (!item || !module) error(404, 'Lesson not found');

	const index = allContent.findIndex((content) => content.slug === item.slug);
	return { item, module, previous: allContent[index - 1], next: allContent[index + 1] };
};
