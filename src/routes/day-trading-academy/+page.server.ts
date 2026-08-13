import { courseFiles } from '$lib/server/courses';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	courses: courseFiles.map((entry) => ({
		...entry.course,
		evidence: entry.evidence,
		counts: {
			modules: entry.items.modules.length,
			chapters: entry.items.chapters.length,
			lessons: entry.items.lessons.length,
			assessments: entry.items.assessments.length,
			unresolved: entry.unresolvedItems.length,
			mediaUrls: [...entry.items.lessons, ...entry.items.assessments].filter((item) => item.hasVideo || item.hasAudio).length
		}
	}))
});
