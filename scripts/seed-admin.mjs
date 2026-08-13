import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { randomBytes, scryptSync } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';
import {
	catalogProducts,
	courseItems,
	courses,
	downloadAssets,
	userEntitlements,
	users
} from '../src/lib/server/db/schema.ts';

const databaseUrl = process.env.DATABASE_URL;
const username = process.env.SHOWCASE_ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.SHOWCASE_ADMIN_PASSWORD;

if (!databaseUrl) throw new Error('DATABASE_URL is required to seed the showcase administrator.');
if (!username) throw new Error('SHOWCASE_ADMIN_USERNAME is required to seed the showcase administrator.');
if (!password) throw new Error('SHOWCASE_ADMIN_PASSWORD is required to seed the showcase administrator.');

function hashPassword(value) {
	const salt = randomBytes(16);
	const derivedKey = scryptSync(value, salt, 64);
	return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

const passwordHash = hashPassword(password);

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);
const generatedCoursesPath = new URL('../src/lib/server/courses/generated/', import.meta.url).pathname;
const productsPath = new URL('../src/lib/catalog/products.generated.json', import.meta.url);
const accountEvidencePath = new URL('../evidence/account-access.audit.json', import.meta.url);

const productsFile = JSON.parse(await readFile(productsPath, 'utf8'));
const accountEvidence = JSON.parse(await readFile(accountEvidencePath, 'utf8'));
const courseFiles = [];

for (const filename of await readdir(generatedCoursesPath)) {
	if (!filename.endsWith('.json') || filename === 'manifest.generated.json') continue;
	courseFiles.push(JSON.parse(await readFile(join(generatedCoursesPath, filename), 'utf8')));
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function productKind(product) {
	const haystack = `${product.name} ${product.categories.join(' ')}`.toLowerCase();
	if (/course|academy|boot camp|crystal ball|momentum|project alpha/.test(haystack)) return 'course';
	if (/guidance|mentorship|coaching|session/.test(haystack)) return 'service';
	if (/membership|subscription|war room access/.test(haystack)) return 'membership';
	if (/download|dvd|box set|b\.o\.s\.s|technicals|psychology/.test(haystack)) return 'download';
	return 'product';
}

function courseAccess(entry) {
	if (entry.evidence.authenticatedAcademyListed) return 'authenticated';
	if (entry.course.status === 'draft') return 'draft';
	if (entry.course.slug === 'crystal-ball-bonus') return 'legacy_mapping_gap';
	return 'api_only';
}

const [admin] = await db
	.insert(users)
	.values({ username, passwordHash, role: 'admin', status: 'active', sourceSystem: 'showcase-seed' })
	.onConflictDoUpdate({
		target: users.username,
		set: { passwordHash, role: 'admin', status: 'active', sourceSystem: 'showcase-seed', updatedAt: new Date() }
	})
	.returning({ id: users.id });

for (const product of productsFile.products) {
	await db
		.insert(catalogProducts)
		.values({
			sourceProductId: product.id,
			slug: product.slug,
			name: product.name,
			kind: productKind(product),
			sourceUrl: product.url,
			isPublic: true,
			isActive: product.isInStock,
			metadata: { categories: product.categories, price: product.price, isPurchasable: product.isPurchasable }
		})
		.onConflictDoUpdate({
			target: catalogProducts.sourceProductId,
			set: {
				slug: product.slug,
				name: product.name,
				kind: productKind(product),
				sourceUrl: product.url,
				isPublic: true,
				isActive: product.isInStock,
				metadata: { categories: product.categories, price: product.price, isPurchasable: product.isPurchasable },
				updatedAt: new Date()
			}
		});

	await db
		.insert(userEntitlements)
		.values({ userId: admin.id, subjectType: 'product', subjectKey: product.slug, state: 'active', source: 'showcase-seed' })
		.onConflictDoUpdate({
			target: [userEntitlements.userId, userEntitlements.subjectType, userEntitlements.subjectKey],
			set: { state: 'active', source: 'showcase-seed', updatedAt: new Date() }
		});
}

for (const entry of courseFiles) {
	const [course] = await db
		.insert(courses)
		.values({
			sourceCourseId: entry.course.id,
			slug: entry.course.slug,
			title: entry.course.title,
			description: entry.course.description || entry.course.excerpt,
			sourceUrl: entry.course.url,
			sourceStatus: entry.course.status,
			accessState: courseAccess(entry),
			reportedLessonCount: entry.course.reportedLessonCount,
			evidencedLessonCount: entry.items.lessons.length,
			reportedAssessmentCount: entry.course.reportedAssessmentCount,
			evidencedAssessmentCount: entry.items.assessments.length,
			metadata: { evidence: entry.evidence, unresolvedItems: entry.unresolvedItems }
		})
		.onConflictDoUpdate({
			target: courses.sourceCourseId,
			set: {
				slug: entry.course.slug,
				title: entry.course.title,
				description: entry.course.description || entry.course.excerpt,
				sourceUrl: entry.course.url,
				sourceStatus: entry.course.status,
				accessState: courseAccess(entry),
				reportedLessonCount: entry.course.reportedLessonCount,
				evidencedLessonCount: entry.items.lessons.length,
				reportedAssessmentCount: entry.course.reportedAssessmentCount,
				evidencedAssessmentCount: entry.items.assessments.length,
				metadata: { evidence: entry.evidence, unresolvedItems: entry.unresolvedItems },
				updatedAt: new Date()
			}
		})
		.returning({ id: courses.id });

	const evidencedItems = [
		...entry.items.modules,
		...entry.items.chapters,
		...entry.items.lessons,
		...entry.items.assessments
	].filter((item) => item.id !== null);

	for (const item of evidencedItems) {
		const media = item.media.video.url ? item.media.video : item.media.audio;
		await db
			.insert(courseItems)
			.values({
				courseId: course.id,
				sourceItemId: item.id,
				parentSourceItemId: item.parentId,
				kind: item.kind,
				slug: item.slug,
				title: item.title,
				description: item.description,
				sourceUrl: item.url,
				mediaProvider: media.provider,
				mediaUrl: media.url,
				sortOrder: item.order,
				evidenceMissing: false,
				metadata: { lessonType: item.lessonType, resourceCount: item.resourceCount, freemium: item.freemium }
			})
			.onConflictDoUpdate({
				target: [courseItems.courseId, courseItems.sourceItemId],
				set: {
					parentSourceItemId: item.parentId,
					kind: item.kind,
					slug: item.slug,
					title: item.title,
					description: item.description,
					sourceUrl: item.url,
					mediaProvider: media.provider,
					mediaUrl: media.url,
					sortOrder: item.order,
					evidenceMissing: false,
					metadata: { lessonType: item.lessonType, resourceCount: item.resourceCount, freemium: item.freemium },
					updatedAt: new Date()
				}
			});
	}

	await db
		.insert(userEntitlements)
		.values({
			userId: admin.id,
			subjectType: 'course',
			subjectKey: entry.course.slug,
			state: 'active',
			source: 'showcase-seed',
			evidence: { adminOverride: true, legacyAccessState: courseAccess(entry) }
		})
		.onConflictDoUpdate({
			target: [userEntitlements.userId, userEntitlements.subjectType, userEntitlements.subjectKey],
			set: { state: 'active', source: 'showcase-seed', updatedAt: new Date() }
		});
}

const deliveredDownloads = accountEvidence.downloads.delivered.map((name) => ({ name, evidenceMissing: false }));
const missingDownloads = accountEvidence.downloads.legacyWooMappingGaps.map((item) => ({ name: item.name, evidenceMissing: true }));

for (const download of [...deliveredDownloads, ...missingDownloads]) {
	const slug = slugify(download.name);
	const [asset] = await db
		.insert(downloadAssets)
		.values({
			slug,
			name: download.name,
			sourceUrl: '',
			provider: 'woocommerce',
			evidenceMissing: download.evidenceMissing,
			metadata: { accountDownloadsUrl: accountEvidence.downloads.accountDownloadsUrl }
		})
		.onConflictDoUpdate({
			target: downloadAssets.slug,
			set: { name: download.name, evidenceMissing: download.evidenceMissing, updatedAt: new Date() }
		})
		.returning({ id: downloadAssets.id });

	const state = download.evidenceMissing ? 'evidence_gap' : 'active';
	await db
		.insert(userEntitlements)
		.values({
			userId: admin.id,
			subjectType: 'download',
			subjectKey: slug,
			state,
			source: 'showcase-seed',
			evidence: { downloadAssetId: asset.id }
		})
		.onConflictDoUpdate({
			target: [userEntitlements.userId, userEntitlements.subjectType, userEntitlements.subjectKey],
			set: { state, source: 'showcase-seed', updatedAt: new Date() }
		});
}

const [adminRecord] = await db.select({ id: users.id }).from(users).where(and(eq(users.id, admin.id), eq(users.role, 'admin'))).limit(1);
if (!adminRecord) throw new Error('Showcase administrator verification failed.');

await client.end({ timeout: 5 });

console.log(
	JSON.stringify({
		message: 'Migration catalog and showcase administrator seed complete.',
		courses: courseFiles.length,
		products: productsFile.products.length,
		downloads: deliveredDownloads.length + missingDownloads.length
	})
);
