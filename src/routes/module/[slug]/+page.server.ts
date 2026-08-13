import { bootcampModules } from '$lib/course-data';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	if (!bootcampModules.some((module) => module.slug === params.slug)) error(404, 'Module not found');
	redirect(307, `/day-trading-academy/boot-camp#module-${params.slug}`);
};
