import { dev } from '$app/environment';
import { allContent } from '$lib/course-data';
import { db } from '$lib/server/db';
import { learners, lessonProgress } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const learnerCookie = 'tt_learner';

function validLearnerId(value: string | undefined): value is string {
	return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function getLearnerId(cookies: Parameters<RequestHandler>[0]['cookies']) {
	const existing = cookies.get(learnerCookie);
	const learnerId = validLearnerId(existing) ? existing : crypto.randomUUID();

	cookies.set(learnerCookie, learnerId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 365
	});

	if (db) {
		await db.insert(learners).values({ id: learnerId }).onConflictDoNothing();
	}

	return learnerId;
}

export const GET: RequestHandler = async ({ cookies }) => {
	if (!db) return json({ persisted: false, completed: [] });

	const learnerId = await getLearnerId(cookies);
	const rows = await db
		.select({ lessonSlug: lessonProgress.lessonSlug })
		.from(lessonProgress)
		.where(and(eq(lessonProgress.learnerId, learnerId), eq(lessonProgress.completed, true)));

	return json({ persisted: true, completed: rows.map((row) => row.lessonSlug) });
};

export const POST: RequestHandler = async ({ cookies, request }) => {
	const payload = (await request.json().catch(() => null)) as { slug?: unknown; completed?: unknown } | null;
	const slug = typeof payload?.slug === 'string' ? payload.slug : '';
	const completed = payload?.completed;

	if (!allContent.some((item) => item.slug === slug) || typeof completed !== 'boolean') {
		return json({ message: 'Invalid progress update.' }, { status: 400 });
	}

	if (!db) return json({ persisted: false });

	const learnerId = await getLearnerId(cookies);
	await db
		.insert(lessonProgress)
		.values({ learnerId, lessonSlug: slug, completed })
		.onConflictDoUpdate({
			target: [lessonProgress.learnerId, lessonProgress.lessonSlug],
			set: { completed, updatedAt: new Date() }
		});

	return json({ persisted: true });
};
