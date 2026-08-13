import { accountEvidence, unassignedMediaEvidence } from '$lib/server/catalog';
import { courseFiles } from '$lib/server/courses';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => ({
	user: locals.user,
	academy: accountEvidence.academy,
	orders: accountEvidence.orders,
	subscriptions: accountEvidence.subscriptions,
	downloads: accountEvidence.downloads,
	courses: courseFiles.map((entry) => ({
		title: entry.course.title,
		slug: entry.course.slug,
		authenticated: entry.evidence.authenticatedAcademyListed,
		learningItems: entry.items.lessons.length + entry.items.assessments.length,
		unresolved: entry.unresolvedItems.length
	})),
	unassignedMediaCount: unassignedMediaEvidence.items.length
});
