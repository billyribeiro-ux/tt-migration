import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCE_ORIGIN = 'https://tricktrades.com';
const COURSES_ENDPOINT = `${SOURCE_ORIGIN}/wp-json/tva-public/v1/courses`;
const PRODUCTS_ENDPOINT = `${SOURCE_ORIGIN}/wp-json/wc/store/v1/products?per_page=100&page=1`;
const OUTPUT_DIRECTORY = new URL('../src/lib/server/courses/generated/', import.meta.url);
const CATALOG_DIRECTORY = new URL('../src/lib/catalog/', import.meta.url);

// Verified in the signed-in academy library on 2026-08-13. These are the
// courses the current migration account can see without a lock marker.
const authenticatedCourseSlugs = new Set([
	'boot-camp',
	'project-alpha',
	'momentum-course',
	'boot-camp-non-member-edition',
	'crystal-ball-gold-edition',
	'crystal-ball-volume-1',
	'crystal-ball-volume-2'
]);

const authenticatedListingCounts = new Map([
	['boot-camp', 54],
	['project-alpha', 62],
	['momentum-course', 128],
	['boot-camp-non-member-edition', 46],
	['crystal-ball-gold-edition', 11],
	['crystal-ball-volume-1', 10],
	['crystal-ball-volume-2', 10]
]);

function canonicalUrl(value) {
	if (!value) return '';
	const url = new URL(value, SOURCE_ORIGIN);
	url.search = '';
	url.hash = '';
	return url.href.replace(/\/$/, '');
}

function plainText(value) {
	return String(value || '')
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&quot;/gi, '"')
		.replace(/&#0?39;/gi, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function decodeMarkup(value) {
	return String(value || '')
		.replace(/&quot;/gi, '"')
		.replace(/&#0?39;/gi, "'")
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>');
}

function evidencedMediaUrl(value) {
	const decoded = decodeMarkup(value);
	const match = decoded.match(/https?:\/\/[^\s"'<>]+/i);
	return match ? match[0] : '';
}

async function fetchJson(url) {
	const response = await fetch(url, {
		headers: { accept: 'application/json', 'user-agent': 'TrickTradesMigrationAudit/1.0' }
	});
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
	return response.json();
}

function sanitizeItem(item, kind) {
	const videoUrl = evidencedMediaUrl(item.video?.source);
	const audioUrl = evidencedMediaUrl(item.audio?.source);
	return {
		id: Number(item.id || item.ID),
		kind,
		title: plainText(item.post_title),
		slug: item.post_name || '',
		url: canonicalUrl(item.preview_url),
		parentId: Number(item.post_parent || 0) || null,
		order: Number(item.order || 0),
		status: item.post_status || 'unknown',
		description: plainText(item.post_excerpt),
		lessonType: item.lesson_type || null,
		resourceCount: Number(item.resource_count || 0),
		hasVideo: Boolean(videoUrl),
		hasAudio: Boolean(audioUrl),
		media: {
			video: {
				provider: item.video?.type || '',
				url: videoUrl
			},
			audio: {
				provider: item.audio?.type || '',
				url: audioUrl
			}
		},
		freemium: Boolean(item.freemium)
	};
}

function blankItem(kind, position, reason) {
	return {
		id: null,
		kind,
		title: '',
		slug: '',
		url: '',
		parentId: null,
		order: position,
		status: 'evidence-missing',
		description: '',
		lessonType: null,
		resourceCount: 0,
		hasVideo: false,
		hasAudio: false,
		media: {
			video: { provider: '', url: '' },
			audio: { provider: '', url: '' }
		},
		freemium: false,
		reason
	};
}

function sanitizeProduct(product) {
	return {
		id: Number(product.id),
		name: plainText(product.name),
		slug: product.slug || '',
		url: canonicalUrl(product.permalink),
		type: product.type || 'unknown',
		isPurchasable: Boolean(product.is_purchasable),
		isInStock: Boolean(product.is_in_stock),
		categories: (product.categories || []).map((category) => plainText(category.name)).filter(Boolean),
		price: product.prices
			? {
				currency: product.prices.currency_code || '',
				amountMinor: product.prices.price || '',
				regularAmountMinor: product.prices.regular_price || '',
				saleAmountMinor: product.prices.sale_price || ''
			}
			: null
	};
}

async function writeJson(path, value) {
	await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
await mkdir(CATALOG_DIRECTORY, { recursive: true });

for (const file of await readdir(OUTPUT_DIRECTORY)) {
	if (file.endsWith('.json')) await unlink(join(OUTPUT_DIRECTORY.pathname, file));
}

const observedAt = new Date().toISOString();
const rawCourses = await fetchJson(COURSES_ENDPOINT);
const generatedCourses = [];

for (const rawCourse of rawCourses) {
	const itemsEndpoint = `${SOURCE_ORIGIN}/wp-json/tva-public/v1/course/${rawCourse.id}/items`;
	let rawItems;
	let evidenceError = '';

	try {
		rawItems = await fetchJson(itemsEndpoint);
	} catch (error) {
		evidenceError = error instanceof Error ? error.message : String(error);
		rawItems = { modules: [], chapters: [], lessons: [], assessments: [] };
	}

	const modules = (rawItems.modules || []).map((item) => sanitizeItem(item, 'module'));
	const chapters = (rawItems.chapters || []).map((item) => sanitizeItem(item, 'chapter'));
	const lessons = (rawItems.lessons || []).map((item) => sanitizeItem(item, 'lesson'));
	const assessments = (rawItems.assessments || []).map((item) => sanitizeItem(item, 'assessment'));
	const reportedLessonCount = Number(rawCourse.count_lessons || 0);
	const missingLessonCount = Math.max(0, reportedLessonCount - lessons.length);
	const missingAssessmentCount = Math.max(0, Number(rawCourse.count_assessments || 0) - assessments.length);
	const missingReason = evidenceError || 'The course API reports this item but does not expose an evidenced item record.';
	const unresolvedItems = [
		...Array.from({ length: missingLessonCount }, (_, index) => blankItem('lesson', lessons.length + index, missingReason)),
		...Array.from({ length: missingAssessmentCount }, (_, index) =>
			blankItem('assessment', assessments.length + index, missingReason)
		)
	];
	const listedLearningItemCount = authenticatedListingCounts.get(rawCourse.slug) ?? null;

	const course = {
		schemaVersion: 1,
		observedAt,
		evidence: {
			courseEndpoint: COURSES_ENDPOINT,
			itemsEndpoint,
			authenticatedAcademyListed: authenticatedCourseSlugs.has(rawCourse.slug),
			authenticatedLearningItemCount: listedLearningItemCount,
			allApiItemsPresentInAuthenticatedListing: listedLearningItemCount === null ? null : listedLearningItemCount === lessons.length + assessments.length,
			lockedMarkerPresent: authenticatedCourseSlugs.has(rawCourse.slug) ? false : null,
			error: evidenceError
		},
		course: {
			id: Number(rawCourse.id),
			title: plainText(rawCourse.name),
			slug: rawCourse.slug,
			url: `${SOURCE_ORIGIN}/day-trading-academy/${rawCourse.slug}`,
			status: rawCourse.status || 'unknown',
			isPrivate: Boolean(rawCourse.is_private),
			description: plainText(rawCourse.description),
			excerpt: plainText(rawCourse.excerpt),
			reportedLessonCount,
			publishedLessonCount: Number(rawCourse.published_lessons_count || 0),
			reportedAssessmentCount: Number(rawCourse.count_assessments || 0),
			hasCertificate: Boolean(rawCourse.has_certificate),
			products: (rawCourse.products || []).map((product) => ({
				id: Number(product.id),
				name: plainText(product.name || product.post_title || product.title)
			}))
		},
		items: { modules, chapters, lessons, assessments },
		unresolvedItems
	};

	generatedCourses.push(course);
	await writeJson(new URL(`${rawCourse.slug}.json`, OUTPUT_DIRECTORY), course);
}

const rawProducts = await fetchJson(PRODUCTS_ENDPOINT);
const products = rawProducts.map(sanitizeProduct).sort((left, right) => left.name.localeCompare(right.name));
await writeJson(new URL('products.generated.json', CATALOG_DIRECTORY), {
	schemaVersion: 1,
	observedAt,
	evidenceEndpoint: PRODUCTS_ENDPOINT,
	productCount: products.length,
	products
});

await writeJson(new URL('courses.generated.json', CATALOG_DIRECTORY), {
	schemaVersion: 1,
	observedAt,
	courseCount: generatedCourses.length,
	courses: generatedCourses.map(({ course, evidence, items, unresolvedItems }) => ({
		...course,
		evidence,
		counts: {
			modules: items.modules.length,
			chapters: items.chapters.length,
			lessons: items.lessons.length,
			assessments: items.assessments.length,
			unresolved: unresolvedItems.length,
			mediaUrls: [...items.lessons, ...items.assessments].filter((item) => item.hasVideo || item.hasAudio).length
		}
	}))
});

const courseManifest = generatedCourses.map(({ course, evidence, items, unresolvedItems }) => ({
	id: course.id,
	title: course.title,
	slug: course.slug,
	url: course.url,
	status: course.status,
	authenticatedAcademyListed: evidence.authenticatedAcademyListed,
	counts: {
		modules: items.modules.length,
		chapters: items.chapters.length,
		lessons: items.lessons.length,
		assessments: items.assessments.length,
		unresolved: unresolvedItems.length
	}
}));

await writeJson(new URL('manifest.generated.json', OUTPUT_DIRECTORY), {
	schemaVersion: 1,
	observedAt,
	courseCount: courseManifest.length,
	courses: courseManifest
});

const summary = {
	observedAt,
	courses: courseManifest.length,
	evidencedCourseItems: generatedCourses.reduce(
		(total, entry) =>
			total + entry.items.modules.length + entry.items.chapters.length + entry.items.lessons.length + entry.items.assessments.length,
		0
	),
	unresolvedItems: generatedCourses.reduce((total, entry) => total + entry.unresolvedItems.length, 0),
	products: products.length,
	outputDirectory: OUTPUT_DIRECTORY.pathname
};

console.log(JSON.stringify(summary, null, 2));
