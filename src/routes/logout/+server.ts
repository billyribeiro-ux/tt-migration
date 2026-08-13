import { sessionCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies, locals }) => {
	cookies.delete(sessionCookie, { path: '/' });
	locals.user = null;
	redirect(303, '/login');
};
