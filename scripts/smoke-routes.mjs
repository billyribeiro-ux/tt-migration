const base = process.argv[2] ?? 'http://127.0.0.1:5173';
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);

const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
urls.push(`${base}/thank-you-for-your-purchase`, `${base}/module/orientation`);

const results = await Promise.all(
	urls.map(async (url) => {
		const response = await fetch(url, { redirect: 'follow' });
		return { url, status: response.status };
	})
);

const failures = results.filter((result) => result.status !== 200);
const progress = await fetch(`${base}/api/progress`);
const progressPayload = await progress.json();
const progressUpdate = await fetch(`${base}/api/progress`, {
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify({ slug: 'welcome-to-trick-trades-boot-camp', completed: true })
});
const progressUpdatePayload = await progressUpdate.json();

console.log(JSON.stringify({
	checked: results.length,
	failures,
	progress: { status: progress.status, payload: progressPayload },
	progressUpdate: { status: progressUpdate.status, payload: progressUpdatePayload }
}, null, 2));
if (failures.length || !progress.ok || !progressUpdate.ok) process.exitCode = 1;
