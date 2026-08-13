import { findStructuralDestination } from '$lib/server/courses';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const destination = findStructuralDestination(params.slug);
	if (!destination) error(404, 'Module not found');
	redirect(307, `/day-trading-academy/${destination.courseSlug}#module-${destination.structureSlug}`);
};
