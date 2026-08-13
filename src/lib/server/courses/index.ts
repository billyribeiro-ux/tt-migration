import type { ContentKind, CourseModule, Lesson } from '$lib/course-data';

export type EvidenceMedia = {
	provider: string;
	url: string;
};

export type EvidenceItem = {
	id: number | null;
	kind: 'module' | 'chapter' | 'lesson' | 'assessment';
	title: string;
	slug: string;
	url: string;
	parentId: number | null;
	order: number;
	status: string;
	description: string;
	lessonType: string | null;
	resourceCount: number;
	hasVideo: boolean;
	hasAudio: boolean;
	media: { video: EvidenceMedia; audio: EvidenceMedia };
	freemium: boolean;
	reason?: string;
};

export type EvidenceCourseFile = {
	schemaVersion: number;
	observedAt: string;
	evidence: {
		courseEndpoint: string;
		itemsEndpoint: string;
		authenticatedAcademyListed: boolean;
		authenticatedLearningItemCount: number | null;
		allApiItemsPresentInAuthenticatedListing: boolean | null;
		lockedMarkerPresent: boolean | null;
		error: string;
	};
	course: {
		id: number;
		title: string;
		slug: string;
		url: string;
		status: string;
		isPrivate: boolean;
		description: string;
		excerpt: string;
		reportedLessonCount: number;
		publishedLessonCount: number;
		reportedAssessmentCount: number;
		hasCertificate: boolean;
		products: Array<{ id: number; name: string }>;
	};
	items: {
		modules: EvidenceItem[];
		chapters: EvidenceItem[];
		lessons: EvidenceItem[];
		assessments: EvidenceItem[];
	};
	unresolvedItems: EvidenceItem[];
};

const generatedModules = import.meta.glob('./generated/*.json', {
	eager: true,
	import: 'default'
}) as Record<string, EvidenceCourseFile>;

export const courseFiles = Object.entries(generatedModules)
	.filter(([path]) => !path.endsWith('/manifest.generated.json'))
	.map(([, value]) => value)
	.sort((left, right) => {
		if (left.evidence.authenticatedAcademyListed !== right.evidence.authenticatedAcademyListed) {
			return left.evidence.authenticatedAcademyListed ? -1 : 1;
		}
		return left.course.title.localeCompare(right.course.title);
	});

export const courseBySlug = new Map(courseFiles.map((entry) => [entry.course.slug, entry]));

function itemMedia(item: EvidenceItem, includeProtectedMedia: boolean): EvidenceMedia {
	const provider = item.media.video.provider || item.media.audio.provider;
	if (!includeProtectedMedia) return { provider, url: '' };
	return item.media.video.url ? item.media.video : item.media.audio;
}

function lessonFromItem(courseFile: EvidenceCourseFile, item: EvidenceItem, includeProtectedMedia: boolean): Lesson {
	return {
		id: item.id,
		slug: item.slug,
		title: item.title,
		description: item.description || 'Open the evidenced source item to continue this part of the course.',
		originalUrl: item.url,
		kind: item.kind as ContentKind,
		courseSlug: courseFile.course.slug,
		courseTitle: courseFile.course.title,
		media: itemMedia(item, includeProtectedMedia),
		resourceCount: item.resourceCount
	};
}

export function buildCourseModules(courseFile: EvidenceCourseFile, includeProtectedMedia = false): CourseModule[] {
	const structuralItems = [...courseFile.items.modules, ...courseFile.items.chapters].sort((a, b) => a.order - b.order);
	const structuralById = new Map(structuralItems.filter((item) => item.id !== null).map((item) => [item.id, item]));
	const learningItems = [...courseFile.items.lessons, ...courseFile.items.assessments].sort((a, b) => a.order - b.order);
	const directItems = learningItems.filter((item) => !item.parentId || !structuralById.has(item.parentId));

	const groups = structuralItems
		.map((structure) => {
			const parent = structure.parentId ? structuralById.get(structure.parentId) : undefined;
			const children = learningItems.filter((item) => item.parentId === structure.id);
			return {
				slug: structure.slug || `group-${structure.id}`,
				title: structure.title,
				eyebrow: parent?.title || (structure.kind === 'module' ? 'Module' : 'Chapter'),
				description: structure.description || courseFile.course.excerpt,
				lessons: children.filter((item) => item.kind === 'lesson').map((item) => lessonFromItem(courseFile, item, includeProtectedMedia)),
				assessments: children
					.filter((item) => item.kind === 'assessment')
					.map((item) => lessonFromItem(courseFile, item, includeProtectedMedia))
			};
		})
		.filter((group) => group.lessons.length + group.assessments.length > 0);

	if (directItems.length) {
		groups.push({
			slug: 'course-content',
			title: 'Course content',
			eyebrow: 'Direct lessons',
			description: courseFile.course.excerpt,
			lessons: directItems.filter((item) => item.kind === 'lesson').map((item) => lessonFromItem(courseFile, item, includeProtectedMedia)),
			assessments: directItems
				.filter((item) => item.kind === 'assessment')
				.map((item) => lessonFromItem(courseFile, item, includeProtectedMedia))
		});
	}

	return groups;
}

export const allCourseContent = courseFiles.flatMap((courseFile) =>
	[...courseFile.items.lessons, ...courseFile.items.assessments].map((item) => lessonFromItem(courseFile, item, false))
);

export function findCourseContent(slug: string, kind: ContentKind, includeProtectedMedia = false) {
	for (const courseFile of courseFiles) {
		const sourceItems = kind === 'lesson' ? courseFile.items.lessons : courseFile.items.assessments;
		const sourceItem = sourceItems.find((item) => item.slug === slug);
		if (!sourceItem) continue;

		const modules = buildCourseModules(courseFile, includeProtectedMedia);
		const module = modules.find((entry) => [...entry.lessons, ...entry.assessments].some((item) => item.slug === slug));
		if (!module) return null;

		const courseContent = modules.flatMap((entry) => [...entry.lessons, ...entry.assessments]);
		const index = courseContent.findIndex((item) => item.slug === slug);
		return {
			item: courseContent[index],
			module,
			course: courseFile.course,
			previous: courseContent[index - 1],
			next: courseContent[index + 1]
		};
	}

	return null;
}

export function findStructuralDestination(slug: string) {
	for (const courseFile of courseFiles) {
		const structure = [...courseFile.items.modules, ...courseFile.items.chapters].find((item) => item.slug === slug);
		if (structure) return { courseSlug: courseFile.course.slug, structureSlug: structure.slug };
	}
	return null;
}

export function coursePageData(slug: string) {
	const courseFile = courseBySlug.get(slug);
	if (!courseFile) return null;
	return {
		course: courseFile.course,
		evidence: courseFile.evidence,
		modules: buildCourseModules(courseFile),
		unresolvedItems: courseFile.unresolvedItems
	};
}
