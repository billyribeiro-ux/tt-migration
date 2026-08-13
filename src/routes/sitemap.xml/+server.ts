import { allCourseContent, courseFiles } from '$lib/server/courses';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const staticPaths = ['/', '/day-trading-academy', '/day-trading-academy/boot-camp', '/resources'];
	const contentPaths = [
		...courseFiles.map((course) => `/day-trading-academy/${course.course.slug}`),
		...allCourseContent.map((item) => `/${item.kind === 'assessment' ? 'assessment' : 'course'}/${item.slug}`)
	];
	const entries = [...staticPaths, ...contentPaths]
		.map((path) => `<url><loc>${new URL(path, url.origin).href}</loc></url>`)
		.join('');

	return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
