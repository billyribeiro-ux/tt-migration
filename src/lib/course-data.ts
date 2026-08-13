export type ContentKind = 'lesson' | 'assessment';

export type LessonMedia = {
	provider: string;
	url: string;
};

export type Lesson = {
	id: number | null;
	slug: string;
	title: string;
	description: string;
	originalUrl: string;
	kind: ContentKind;
	courseSlug: string;
	courseTitle: string;
	media: LessonMedia;
	resourceCount: number;
};

export type CourseModule = {
	slug: string;
	title: string;
	eyebrow: string;
	description: string;
	lessons: Lesson[];
	assessments: Lesson[];
};

const source = 'https://tricktrades.com';

export const memberResourceGroups = [
	{
		title: 'Live trading',
		links: [
			{ label: 'Guidance Live', href: `${source}/stm-zoom-webinar/guidance-screenshare-live?show_meeting=1` },
			{ label: 'Mentoring Live', href: `${source}/stm-zoom-webinar/mentoring-screenshare-live?show_meeting=1` },
			{ label: 'Watch List (Hyper-Scan)', href: `${source}/category/watch-list` },
			{ label: 'Mentoring Live Classes', href: `${source}/category/mentoring-live-classes` }
		]
	},
	{
		title: 'Tools & community',
		links: [
			{ label: 'Charts', href: `${source}/charts` },
			{ label: 'Member’s Chat', href: `${source}/war-room` },
			{ label: 'CORE Session Guide', href: `${source}/trick-trades-core-session-guide` },
			{ label: 'Vision Members', href: `${source}/category/vision` },
			{ label: 'Polaris', href: `${source}/polaris` }
		]
	},
	{
		title: 'CORE ALPHA',
		links: [
			{ label: 'Focus Session', href: `${source}/meditation/core-alpha-focus` },
			{ label: '1. Surrender', href: `${source}/meditation/core-alpha-surrender` },
			{ label: '2. Neutrality', href: `${source}/meditation/core-alpha-neutrality` },
			{ label: '3. Intention', href: `${source}/meditation/core-alpha-intention` },
			{ label: '4. Identity', href: `${source}/meditation/core-alpha-identity` },
			{ label: '5. Mastery', href: `${source}/meditation/core-alpha-mastery` }
		]
	},
	{
		title: 'Support & account',
		links: [
			{ label: 'My Account', href: `${source}/my-account/edit-account/` },
			{ label: 'Contact Support', href: `${source}/contact-us` },
			{ label: 'Digital Store', href: `${source}/digital-store` },
			{ label: 'Trade Recaps', href: `${source}/category/daily-trade-recaps` },
			{ label: 'Newsletter', href: `${source}/the-situation-room` }
		]
	}
] as const;
