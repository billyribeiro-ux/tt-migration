import { coursePageData } from '$lib/server/courses';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const course = coursePageData('boot-camp');
	if (!course) error(404, 'Course not found');
	return course;
};
