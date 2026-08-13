import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const showcaseEnabled = env.SHOWCASE_ADMIN_ENABLED === 'true';
	const username = env.SHOWCASE_ADMIN_USERNAME?.trim().toLowerCase();

	event.locals.user =
		showcaseEnabled && username
			? {
					username,
					role: 'admin',
					showcase: true
				}
			: null;

	return resolve(event);
};
