export type ContentKind = 'lesson' | 'assessment';

export type Lesson = {
	slug: string;
	title: string;
	description: string;
	originalUrl: string;
	kind: ContentKind;
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

const lesson = (slug: string, title: string, description: string): Lesson => ({
	slug,
	title,
	description,
	originalUrl: `${source}/course/${slug}`,
	kind: 'lesson'
});

const assessment = (slug: string, title: string, description: string): Lesson => ({
	slug,
	title,
	description,
	originalUrl: `${source}/assessment/${slug}`,
	kind: 'assessment'
});

export const bootcampModules: CourseModule[] = [
	{
		slug: 'orientation',
		title: 'Orientation',
		eyebrow: 'Start here',
		description: 'Quickly get up to speed with the fundamentals at TrickTrades.',
		lessons: [
			lesson(
				'welcome-to-trick-trades-boot-camp',
				'Getting Started at TrickTrades',
				'Learn how the program works and how to get the most from the training process.'
			),
			lesson(
				'new-member-survey',
				'New Member Survey',
				'Benchmark where you are as a trader before beginning Boot Camp.'
			),
			lesson(
				'war-room-access-web',
				'Chat Room Access',
				'Connect to the War Room used during each morning’s live trading session.'
			),
			lesson(
				'size-up-app-getting-started',
				'Size UP App Access',
				'Get started with the sizing strategy designed to grow an account over time.'
			),
			lesson(
				'the-morning-routine',
				'The Morning Routine',
				'Learn the pre-market routine members follow before every trading day.'
			),
			lesson(
				'the-ideal-tricktrades-member',
				'The Ideal TrickTrades Member',
				'Understand the preparation, mindset, teamwork and trust the program expects.'
			),
			lesson(
				'support-interaction-discussion',
				'Support, Interaction and Discussion',
				'Guidance for asking questions and interacting during live morning trading.'
			)
		],
		assessments: [
			assessment(
				'orientation-quiz',
				'Orientation Quiz',
				'Complete the orientation checkpoint before moving to the next module.'
			)
		]
	},
	{
		slug: 'classroom',
		title: 'The Bones',
		eyebrow: 'Core concepts',
		description: 'A high-powered foundation for both new and experienced traders.',
		lessons: [
			lesson('introduction', 'Introduction', 'An introduction to the tools, language and workflow used throughout Boot Camp.'),
			lesson('what-brokers-to-use', 'What Brokers to Use', 'A practical overview of the brokers used at TrickTrades.'),
			lesson(
				'what-type-of-hardware-you-need',
				'What Type of Hardware You Need',
				'A simple, focused guide to the hardware required for the trading workflow.'
			),
			lesson(
				'charting-software-setup',
				'Charting Software & Setup',
				'Configure the charting software and layout used in the live sessions.'
			),
			lesson('candlesticks-basics', 'Candlestick Basics', 'Build a clear foundation for reading the candles that matter.'),
			lesson('candlestick-patterns', 'Candlestick Patterns', 'Review the key candlestick patterns used in the strategy.'),
			lesson('stuff-candle', 'Stuff Candle', 'Learn the Stuff Candle pattern and how it fits into price-action analysis.'),
			lesson(
				'market-maker-algo-patterns',
				'Market Maker & Algo Patterns',
				'Recognize repeatable price behaviors associated with market makers and algorithms.'
			),
			lesson('range-with-equities', 'Range with Equities', 'Understand how range informs equity trade selection and planning.'),
			lesson(
				'edge-with-higher-priced-stocks',
				'Edge with Higher Priced Stocks',
				'Explore why selective higher-priced stocks can offer a cleaner trading edge.'
			),
			lesson('basket-of-stocks', 'Basket of Stocks', 'Learn the focused basket of names used to avoid low-quality opportunities.'),
			lesson('how-to-place-a-trade', 'How to Place a Trade', 'Walk through the mechanics of placing a trade with intention.'),
			lesson('options', 'Options', 'An introduction to using options within the TrickTrades approach.'),
			lesson(
				'introducing-strategy-setups',
				'Introducing Strategy & Setups',
				'Cover optimal trading windows, high-quality setups and when to stay out.'
			),
			lesson('deeper-into-strategy', 'Deeper Into Strategy', 'An in-depth explanation of the core strategy and its decision framework.'),
			lesson(
				'the-most-important-levels',
				'The Most Important Levels',
				'Identify the levels that carry the most weight when planning entries and exits.'
			),
			lesson('how-to-pay-yourself', 'How to Pay Yourself', 'Learn a repeatable approach to taking profits and managing open risk.')
		],
		assessments: [
			assessment(
				'trading-essentials-quiz',
				'Trading Essentials Quiz',
				'Check your understanding of the essential tools, levels and strategy language.'
			)
		]
	},
	{
		slug: 'basic-training',
		title: 'Watch & Learn',
		eyebrow: 'Apply the strategy',
		description: 'The essential information needed to begin trading stocks and options the TT way.',
		lessons: [
			lesson('trading-puzzle-pieces', 'Trading Puzzle Pieces', 'Put the major pieces of the trading process together.'),
			lesson('standard-risk', 'Standard Risk', 'Use a consistent risk framework to protect against avoidable losses.'),
			lesson('day-trading-slang-video', 'Day Trading Slang Video', 'Get familiar with terminology commonly used during live day trading.'),
			lesson(
				'the-most-important-video-lesson-ive-ever-donelisten',
				'The Most Important Video Lesson I’ve Ever Done… Listen',
				'A foundational mindset lesson intended to reset how you approach the craft.'
			),
			lesson(
				'why-market-conditions-matter',
				'Why Market Conditions Matter',
				'Understand how broader market location influences every trade decision.'
			),
			lesson(
				'developing-trade-plans',
				'Developing Trade Plans',
				'Use the same reliable process to prepare high-odds trade plans each morning.'
			),
			lesson(
				'why-we-setup-our-charts-the-way-we-do',
				'Why We Set Up Our Charts the Way We Do',
				'Build an efficient chart layout that keeps crucial information visible.'
			),
			lesson(
				'ranking-of-levels-and-all-important-levels',
				'Ranking of Levels and All Important Levels',
				'Compare intraday, daily, gap, range, moving-average and trend-line levels.'
			),
			lesson('core-strategy', 'Core Strategy', 'Learn the strategy used every day to identify and manage opportunities.'),
			lesson(
				'basic-trade-management',
				'Basic Trade Management',
				'Use chart structure and levels to plan entries, exits and risk on both sides.'
			),
			lesson(
				'how-to-enter-a-trade-that-opens-right-at-a-level',
				'How to Enter a Trade That Opens Right at a Level',
				'Handle the difficult scenario where the market opens directly at a major level.'
			),
			lesson(
				'trend-formation-how-to-use-it-and-what-it-is',
				'Trend Formation: What It Is and How to Use It',
				'Anticipate trend formation and time entries with greater discipline.'
			),
			lesson(
				'managing-a-trade-that-isnt-working-looking-for-a-way-out',
				'Managing a Trade That Isn’t Working',
				'Look for a controlled exit when price action does not behave as planned.'
			)
		],
		assessments: [
			assessment('basic-training-quiz-1', 'Basic Training Quiz 1', 'Checkpoint covering the first half of basic training.'),
			assessment(
				'basic-training-quiz-2',
				'Basic Training Quiz 2 & Final Exam Question',
				'Complete the module’s final knowledge check.'
			)
		]
	},
	{
		slug: 'bonus-module',
		title: 'Bonus Module',
		eyebrow: 'Classic lessons',
		description: 'Classic TrickTrades lessons that have stood the test of time.',
		lessons: [
			lesson('the-daily-chart', 'B1: Daily Chart Lesson', 'Learn why the daily chart is treated as the trading “Bible.”'),
			lesson('at-the-market-open-lesson', 'B2: At the Market Open Lesson', 'Plan for the unique pace and risk of the opening bell.'),
			lesson(
				'how-to-trade-dojis-and-small-bodied-candles-extremely-important',
				'B3: How to Trade Dojis and Small-Bodied Candles',
				'Read indecision candles without forcing a low-quality trade.'
			),
			lesson(
				'hold-your-ground-sticking-to-stops-lesson',
				'B4: Hold Your Ground — Sticking to Stops',
				'Build the discipline to respect the stop defined in your plan.'
			),
			lesson(
				'market-maker-games-and-why-they-do-what-they-do',
				'B5: Market Maker Games',
				'Understand why deceptive price action appears and how to respond.'
			),
			lesson(
				'big-boy-stop-losses-and-how-to-ride-the-wave',
				'B6: Big Boy Stop Losses and How to Ride the Wave',
				'Recognize larger stop events and manage the momentum that follows.'
			),
			lesson(
				'trading-channel-video-lesson-super-important-dont-miss-this',
				'B7: Trading Channel Video Lesson',
				'Use channel structure to frame trend, entries and invalidation.'
			),
			lesson(
				'very-important-lesson-on-hod-lod-short-or-long-bias',
				'B8: Voodoo Line Strategy (Magic Blue)',
				'Learn how the Voodoo Line informs bias and trade location.'
			),
			lesson(
				'very-important-lesson-on-hod-lod-short-or-long-bias-2',
				'B9: HOD/LOD Short or Long Bias',
				'Use high-of-day and low-of-day structure to determine directional bias.'
			),
			lesson(
				'possibly-the-best-long-setup-there-is-part-1',
				'B10: Possibly the Best Long Setup — Part 1',
				'Begin a two-part breakdown of a high-quality long setup.'
			),
			lesson(
				'possibly-the-best-long-setup-part-2',
				'B11: Possibly the Best Long Setup — Part 2',
				'Complete the long setup breakdown with management and confirmation.'
			),
			lesson(
				'yesterdays-hod-support-bounce-earnings-lesson',
				'B12: HOD Support Bounce (Earnings)',
				'Plan a support bounce around the prior high of day after earnings.'
			),
			lesson('b13-waiting-for-confirmation', 'B13: Waiting for Confirmation', 'Let price confirm the thesis before committing risk.')
		],
		assessments: []
	}
];

export const allLessons = bootcampModules.flatMap((module) => module.lessons);
export const allAssessments = bootcampModules.flatMap((module) => module.assessments);
export const allContent = bootcampModules.flatMap((module) => [...module.lessons, ...module.assessments]);

export const findContent = (slug: string, kind?: ContentKind) =>
	allContent.find((item) => item.slug === slug && (!kind || item.kind === kind));

export const findModuleForContent = (slug: string) =>
	bootcampModules.find((module) => [...module.lessons, ...module.assessments].some((item) => item.slug === slug));

export const courseProducts = [
	{
		title: 'Day Trading Boot Camp',
		description: '50 lessons and 4 checkpoints covering the complete training foundation.',
		href: '/day-trading-academy/boot-camp',
		meta: 'Included · Full catalog'
	},
	{
		title: 'Crystal Ball',
		description: 'Focused course access preserved from the original academy navigation.',
		href: `${source}/crystal-ball-course`,
		meta: 'Original member course'
	},
	{
		title: 'Crystal Ball: Gold Edition',
		description: 'Advanced trade-management education for experienced members.',
		href: `${source}/crystal-ball-gold-edition-course`,
		meta: 'Advanced course'
	},
	{
		title: 'Momentum Course',
		description: 'Dedicated momentum curriculum and supporting live member access.',
		href: `${source}/day-trading-academy/momentum-course`,
		meta: 'Original member course'
	},
	{
		title: 'Project ALPHA',
		description: 'Coursework and mindset sessions built around focus and execution.',
		href: `${source}/day-trading-academy/project-alpha`,
		meta: 'Original member course'
	}
] as const;

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
