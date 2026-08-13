import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createSessionToken, sessionCookie, sessionMaxAge, verifyPassword } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/my-account');
	return { username: env.SHOWCASE_ADMIN_USERNAME?.trim().toLowerCase() ?? '' };
};

export const actions: Actions = {
	default: async ({ cookies, locals, request }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '').trim().toLowerCase();
		const password = String(data.get('password') ?? '');

		if (!username || !password || username.length > 100 || password.length > 256) {
			return fail(400, { username, incorrect: true });
		}

		let passwordHash = '';
		let role: NonNullable<App.Locals['user']>['role'] = 'admin';

		if (db) {
			const [record] = await db
				.select({ passwordHash: users.passwordHash, role: users.role, status: users.status })
				.from(users)
				.where(eq(users.username, username))
				.limit(1);
			if (record?.status === 'active') {
				passwordHash = record.passwordHash ?? '';
				role = record.role;
			}
		}

		const configuredUsername = env.SHOWCASE_ADMIN_USERNAME?.trim().toLowerCase();
		if (!passwordHash && username === configuredUsername) {
			passwordHash = env.SHOWCASE_ADMIN_PASSWORD_HASH ?? '';
			role = 'admin';
		}

		if (!passwordHash || !verifyPassword(password, passwordHash)) {
			return fail(400, { username, incorrect: true });
		}

		const secret = env.SHOWCASE_SESSION_SECRET;
		if (!secret) return fail(503, { username, unavailable: true });

		locals.user = { username, role, showcase: role === 'admin' };
		cookies.set(sessionCookie, createSessionToken(locals.user, secret), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: sessionMaxAge
		});

		redirect(303, '/my-account');
	}
};
