import { findCourseContent } from '$lib/server/courses';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	const result = findCourseContent(params.slug, 'lesson', Boolean(locals.user));
	if (!result) error(404, 'Lesson not found');
	return result;
};
