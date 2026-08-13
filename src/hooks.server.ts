import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { readSessionToken, sessionCookie } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionUser = readSessionToken(event.cookies.get(sessionCookie), env.SHOWCASE_SESSION_SECRET);
	const automaticLocalShowcase = dev && env.SHOWCASE_ADMIN_ENABLED === 'true';
	const username = env.SHOWCASE_ADMIN_USERNAME?.trim().toLowerCase();

	event.locals.user =
		sessionUser ??
		(automaticLocalShowcase && username
			? {
					username,
					role: 'admin',
					showcase: true
				}
			: null);

	return resolve(event);
};
