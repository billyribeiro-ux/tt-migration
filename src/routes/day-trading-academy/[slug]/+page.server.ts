import { coursePageData } from '$lib/server/courses';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const course = coursePageData(params.slug);
	if (!course) error(404, 'Course not found');
	return course;
};
