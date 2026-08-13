<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import '../app.css';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>Trick Trades — Day Trading Education</title>
	<meta name="description" content="A focused trading education platform built around skill, discipline and emotional control." />
	<meta name="theme-color" content="#121613" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Trick Trades" />
	<meta property="og:image" content={new URL(asset('/og.png'), page.url.origin).href} />
	<meta property="og:image:width" content="1731" />
	<meta property="og:image:height" content="909" />
	<meta property="og:image:alt" content="Trick Trades — Trade for the life beyond the P&L." />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={new URL(asset('/og.png'), page.url.origin).href} />
	<link rel="icon" href="https://trick-trades-media-storage.storage.googleapis.com/wp-content/uploads/2020/01/19114523/cropped-logo3-32x32.jpg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wdth,wght@75..100,400..700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<SiteHeader user={data.user} />
<main id="main-content">{@render children()}</main>
<SiteFooter />
