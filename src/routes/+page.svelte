<script lang="ts">
	import { resolve } from '$app/paths';

	const pressurePoints = [
		{ number: '01', title: 'The account is shrinking', text: 'A few undisciplined decisions can erase weeks of progress and confidence.' },
		{ number: '02', title: 'Time is running out', text: 'The clock keeps moving while the same patterns keep producing the same results.' },
		{ number: '03', title: 'Doubters are everywhere', text: 'Without a process, the path to becoming a professional trader starts to fade.' }
	];

	const mastery = [
		{ type: 'Skill', items: ['Structured learning & testing', 'The right tools', 'Live morning training', 'The right stocks', 'Daily coaching'] },
		{ type: 'Emotion', items: ['Fix hesitation', 'Fix fear', 'Fix greed', 'Fix FOMO', 'Fix self-talk'] }
	];

	const experience = [
		{ index: 'A', title: 'Education that compounds', text: 'A complete lesson library, daily breakdowns and live teaching designed to build independent decision-making.' },
		{ index: 'B', title: 'A community that answers', text: 'Ask the entire community questions without getting lost in a chaotic, free-for-all chat room.' },
		{ index: 'C', title: 'A plan before the open', text: 'Start every market day with a live pre-market plan of attack and carefully selected opportunities.' },
		{ index: 'D', title: 'Preparation every night', text: 'Review a video watch list before the next session so you arrive prepared instead of reacting.' },
		{ index: 'E', title: 'Live, every trading day', text: 'Watch the process unfold in real time and learn why a trade is considered — or rejected.' },
		{ index: 'F', title: 'Support beyond the bell', text: 'Keep learning, asking questions and connecting with members after the market closes.' }
	];

	const plans = [
		{
			name: 'Size UP Guidance',
			price: '$247',
			description: 'The complete foundation, daily preparation and live guidance.',
			features: ['50-lesson Boot Camp', 'Nightly watch list', 'Live pre-market plan', 'Daily education', '24/7 member chat'],
			href: 'https://tricktrades.com/product/size-up-guidance'
		},
		{
			name: 'Size UP Mentorship',
			price: '$347',
			description: 'Everything in Guidance, plus deeper weekly training and review.',
			features: ['Everything in Guidance', 'Weekly live mentoring', 'Advanced sizing analysis', 'Trade-plan review', 'Recorded class access'],
			href: 'https://tricktrades.com/product/size-up-mentorship'
		}
	];

	const faqs = [
		{ question: 'Is the education designed for beginners?', answer: 'Yes. Boot Camp starts with brokers, hardware, charting and terminology before moving into levels, strategy, risk and trade management. Experienced traders can use the same sequence to replace inconsistent habits.' },
		{ question: 'Do I receive a nightly watch list?', answer: 'Yes. The Pre-Market Plan of Attack is prepared each evening and refined during the live morning session as pre-market conditions develop.' },
		{ question: 'Are these alerts or financial advice?', answer: 'No. Trick Trades is an educational service. Members are taught a process and remain solely responsible for every decision they make.' },
		{ question: 'Can I participate with a smaller account?', answer: 'The curriculum covers stocks, options and risk frameworks for different account sizes. Trading still involves substantial risk, and no result is guaranteed.' },
		{ question: 'Can I cancel?', answer: 'Membership can be managed from the account dashboard. Review the current cancellation policy before purchasing for the complete terms.' }
	];
</script>

<svelte:head>
	<title>Freedom — Trick Trades</title>
	<meta name="description" content="Build the skill, discipline and emotional control required to trade with a professional process." />
	<meta property="og:title" content="Freedom — Trick Trades" />
	<meta property="og:description" content="Trading education built around mastery of skill and emotion." />
</svelte:head>

<section class="home-hero">
	<div class="shell hero-grid">
		<div class="hero-copy">
			<p class="eyebrow">Trading education · since 2014</p>
			<h1 class="display-title">Trade for the life <em>beyond</em> the P&amp;L.</h1>
			<p class="lede">If trading has become a cycle of hope, hesitation and regret, stop chasing the next setup. Build the process that makes good decisions repeatable.</p>
			<div class="hero-actions">
				<a class="button button-signal" href={resolve('/day-trading-academy/boot-camp')}>Enter Boot Camp</a>
				<a class="watch-link" href="#watch">Watch the introduction <span aria-hidden="true">↓</span></a>
			</div>
		</div>

		<div class="market-card" aria-label="Illustrative market preparation panel">
			<div class="market-topline">
				<span>PROCESS / PRICE ACTION</span><span class="live"><i></i> LIVE</span>
			</div>
			<div class="chart" aria-hidden="true">
				<div class="price price-a">402.80</div>
				<div class="price price-b">399.40</div>
				<div class="level level-a"></div>
				<div class="level level-b"></div>
				{#each [44, 58, 39, 72, 61, 84, 67, 91, 76, 102, 94, 118] as height, index (index)}
					<div class:down={index === 2 || index === 6 || index === 8} class="candle" style={`--height:${height}px; --left:${8 + index * 7.2}%`}></div>
				{/each}
			</div>
			<div class="market-footer">
				<div><span>BIAS</span><strong>Patient</strong></div>
				<div><span>RISK</span><strong>Defined</strong></div>
				<div><span>PLAN</span><strong>Ready</strong></div>
			</div>
		</div>
	</div>
	<div class="hero-tape" aria-hidden="true">
		<span>STRUCTURE</span><i>+</i><span>DISCIPLINE</span><i>+</i><span>EXECUTION</span><i>=</i><span>FREEDOM</span>
	</div>
</section>

<section id="watch" class="section surface-cream">
	<div class="shell intro-grid">
		<div class="intro-heading">
			<p class="eyebrow">Start with the right question</p>
			<h2 class="section-title">Want to make money trading?</h2>
			<p class="lede">The better question is: what are you willing to master to earn your freedom?</p>
		</div>
		<div class="video-frame">
			<iframe src="https://skiv.com/embed/Zrq42Gq?search=0&links=0&logo=0&title=0" title="Trick Trades introduction" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
		</div>
	</div>
</section>

<section class="pressure-section">
	<div class="shell">
		<div class="pressure-header">
			<p class="eyebrow">Is this you?</p>
			<p>The problem is rarely a missing indicator. It is the gap between what you know and what you consistently do under pressure.</p>
		</div>
		<div class="pressure-grid">
			{#each pressurePoints as point (point.number)}
				<article>
					<span>{point.number}</span>
					<h3>{point.title}</h3>
					<p>{point.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section question-section">
	<div class="shell question-grid">
		<div>
			<p class="eyebrow">Go deeper</p>
			<h2 class="section-title">Money is not a strong enough reason.</h2>
		</div>
		<div class="question-copy">
			<p class="lede">Any job can earn money. Trading demands a stronger motive: independence, authorship and the ability to live on your own terms.</p>
			<p>That path requires uncomfortable trades in your own life — letting go of habits, listening without defensiveness, training your mind and refusing to tolerate the actions that keep producing loss.</p>
			<blockquote>“Are you willing to do the work necessary?”</blockquote>
		</div>
	</div>
</section>

<section class="section mastery-section surface-dark">
	<div class="shell">
		<div class="mastery-heading">
			<p class="eyebrow">The massive results formula</p>
			<h2 class="section-title">Mastery of skill <span>+</span> mastery of emotion.</h2>
			<p class="lede">A trained body executes with precision. A trained mind maintains focus under pressure. The professional process needs both.</p>
		</div>
		<div class="mastery-grid">
			{#each mastery as column (column.type)}
				<div class="mastery-column">
					<p>{column.type}</p>
					{#each column.items as item, index (item)}
						<div><span>0{index + 1}</span><strong>{item}</strong></div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="coach-section">
	<div class="shell coach-grid">
		<div class="coach-portrait">
			<div class="portrait-type"><strong>PAT</strong><span>“TRICK”</span><strong>MITCHELL</strong></div>
			<p>Professional trader<br />&amp; coach</p>
		</div>
		<div class="coach-copy">
			<p class="eyebrow">Learn from experience</p>
			<h2 class="section-title">Guidance from someone who walked the hard path first.</h2>
			<p class="lede">A former welder turned professional day trader, Pat Mitchell built his craft through years of trial, error and relentless refinement.</p>
			<p>Trick Trades turns those lessons into a structured process — so members can learn what to stop doing, what to start doing and how to make better decisions under pressure.</p>
			<a class="button button-dark" href={resolve('/day-trading-academy')}>Explore the academy</a>
		</div>
	</div>
</section>

<section class="section experience-section surface-cream">
	<div class="shell">
		<div class="experience-heading">
			<div>
				<p class="eyebrow">The member experience</p>
				<h2 class="section-title">Prepared before the bell. Supported after it.</h2>
			</div>
			<p class="lede">Every part of the system has a job: train the skill, reduce uncertainty and strengthen execution.</p>
		</div>
		<div class="experience-list">
			{#each experience as item (item.index)}
				<article>
					<span>{item.index}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="standards-section surface-dark">
	<div class="shell standards-grid">
		<div>
			<p class="eyebrow">This is education</p>
			<h2 class="section-title">Not alerts. Not advice. Not a shortcut.</h2>
		</div>
		<div>
			<p>Every decision remains yours. The service teaches process, price action, preparation and risk management. It does not trade your money or promise a result.</p>
			<ul>
				<li>Must be 18 or older</li>
				<li>Educational content only</li>
				<li>No alerts or financial advice</li>
				<li>Trading involves substantial risk</li>
			</ul>
		</div>
	</div>
</section>

<section class="proof-section">
	<div class="shell">
		<div class="proof-number"><span>Over</span><strong>30,000</strong><span>students taught</span></div>
		<div class="press-row" aria-label="Media publications listed in the original site">
			<span>CBS</span><span>FOX</span><span>BENZINGA</span><span>NBC</span><span>USA TODAY</span><span>MARKETWATCH</span>
		</div>
	</div>
</section>

<section class="section pricing-section surface-cream" id="pricing">
	<div class="shell">
		<div class="pricing-heading">
			<div>
				<p class="eyebrow">Membership</p>
				<h2 class="section-title">Choose the depth of guidance you need.</h2>
			</div>
			<p class="lede">Both paths include the core education and daily process. Mentorship adds deeper weekly review.</p>
		</div>
		<div class="plan-grid">
			{#each plans as plan, index (plan.name)}
				<article class:featured={index === 1}>
					<div class="plan-top">
						<p>{plan.name}</p>
						{#if index === 1}<span>Deeper guidance</span>{/if}
					</div>
					<div class="price"><strong>{plan.price}</strong><span>/ month</span></div>
					<p class="plan-description">{plan.description}</p>
					<ul>
						{#each plan.features as feature (feature)}<li>{feature}</li>{/each}
					</ul>
					<a {...{ href: plan.href }} class:button-signal={index === 1} class:button-dark={index === 0} class="button">Choose {plan.name}</a>
				</article>
			{/each}
		</div>
		<p class="risk-note">Membership terms, current pricing and cancellation conditions are confirmed on the original checkout page. No trading result is guaranteed.</p>
	</div>
</section>

<section class="section faq-section">
	<div class="shell faq-grid">
		<div>
			<p class="eyebrow">Frequently asked</p>
			<h2 class="section-title">Straight answers before you commit.</h2>
		</div>
		<div class="faq-list">
			{#each faqs as faq, index (faq.question)}
				<details open={index === 0}>
					<summary>{faq.question}<span aria-hidden="true">+</span></summary>
					<p>{faq.answer}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<section class="final-cta surface-dark">
	<div class="shell final-grid">
		<div>
			<p class="eyebrow">Your next disciplined action</p>
			<h2 class="section-title">Start with the full Boot Camp map.</h2>
		</div>
		<div>
			<p class="lede">All 50 lessons, four assessments and original member links are organized in one fast, searchable learning hub.</p>
			<a class="button button-signal" href={resolve('/day-trading-academy/boot-camp')}>Open the curriculum</a>
		</div>
	</div>
</section>

<style>
	.home-hero {
		position: relative;
		overflow: hidden;
		padding-top: clamp(4.5rem, 9vw, 8rem);
		background: var(--ink);
		color: var(--paper);
	}

	.home-hero::before {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 72% 22%, color-mix(in srgb, var(--blue) 36%, transparent), transparent 26%), linear-gradient(color-mix(in srgb, var(--paper) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--paper) 5%, transparent) 1px, transparent 1px);
		background-size: auto, 4.5rem 4.5rem, 4.5rem 4.5rem;
		content: '';
		pointer-events: none;
	}

	.hero-grid {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(22rem, 0.85fr);
		align-items: center;
		gap: clamp(3rem, 7vw, 7rem);
		padding-bottom: clamp(5rem, 9vw, 8rem);
	}

	.hero-copy .eyebrow {
		color: var(--signal);
	}

	.hero-copy h1 {
		max-width: 52rem;
		margin-top: 1.7rem;
	}

	.hero-copy h1 em {
		font-weight: 400;
		color: var(--signal);
	}

	.hero-copy .lede {
		max-width: 41rem;
		margin-top: 2rem;
		color: var(--muted-paper);
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2.3rem;
	}

	.watch-link {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		font-size: 0.76rem;
		font-weight: 700;
	}

	.watch-link span {
		color: var(--signal);
	}

	.market-card {
		position: relative;
		padding: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--paper) 20%, transparent);
		background: color-mix(in srgb, var(--ink) 84%, transparent);
		box-shadow: 2rem 2rem 0 color-mix(in srgb, var(--blue) 34%, transparent);
		transform: rotate(1.6deg);
	}

	.market-topline,
	.market-footer,
	.price {
		font-family: var(--font-mono);
	}

	.market-topline {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0.2rem 1rem;
		font-size: 0.57rem;
		letter-spacing: 0.09em;
		color: var(--muted-paper);
	}

	.live {
		color: var(--signal);
	}

	.live i {
		display: inline-block;
		width: 0.38rem;
		height: 0.38rem;
		margin-right: 0.35rem;
		border-radius: 50%;
		background: currentColor;
	}

	.chart {
		position: relative;
		height: 20rem;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--paper) 14%, transparent);
		background: linear-gradient(color-mix(in srgb, var(--paper) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--paper) 7%, transparent) 1px, transparent 1px);
		background-size: 2.8rem 2.8rem;
	}

	.level {
		position: absolute;
		left: 0;
		width: 100%;
		border-top: 1px dashed;
	}

	.level-a {
		top: 28%;
		color: var(--signal);
	}

	.level-b {
		top: 68%;
		color: var(--coral);
	}

	.price {
		position: absolute;
		right: 0.5rem;
		z-index: 2;
		padding: 0.15rem 0.3rem;
		font-size: 0.52rem;
		color: var(--ink);
	}

	.price-a {
		top: calc(28% - 0.7rem);
		background: var(--signal);
	}

	.price-b {
		top: calc(68% - 0.7rem);
		background: var(--coral);
	}

	.candle {
		position: absolute;
		left: var(--left);
		bottom: 24%;
		width: 0.58rem;
		height: var(--height);
		background: var(--signal);
	}

	.candle::before {
		position: absolute;
		top: -1rem;
		bottom: -1rem;
		left: 50%;
		width: 1px;
		background: inherit;
		content: '';
	}

	.candle.down {
		background: var(--coral);
	}

	.market-footer {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: 1px;
		background: color-mix(in srgb, var(--paper) 12%, transparent);
	}

	.market-footer div {
		padding: 0.9rem 0.7rem;
		background: var(--ink);
	}

	.market-footer span,
	.market-footer strong {
		display: block;
	}

	.market-footer span {
		font-size: 0.46rem;
		letter-spacing: 0.1em;
		color: var(--muted-paper);
	}

	.market-footer strong {
		margin-top: 0.3rem;
		font-size: 0.64rem;
		color: var(--signal);
	}

	.hero-tape {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 1rem;
		overflow: hidden;
		padding: 1rem var(--gutter);
		background: var(--signal);
		font-family: var(--font-mono);
		font-size: clamp(0.6rem, 1.4vw, 0.8rem);
		font-weight: 700;
		letter-spacing: 0.13em;
		color: var(--ink);
	}

	.hero-tape i {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-style: normal;
	}

	.intro-grid {
		display: grid;
		grid-template-columns: minmax(16rem, 0.72fr) minmax(0, 1.28fr);
		align-items: end;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.intro-heading h2 {
		margin-top: 1.4rem;
	}

	.intro-heading .lede {
		margin-top: 1.6rem;
	}

	.video-frame {
		position: relative;
		aspect-ratio: 16 / 9;
		border: 0.65rem solid var(--ink);
		background: var(--ink);
		box-shadow: 1.25rem 1.25rem 0 var(--coral);
	}

	.video-frame iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}

	.pressure-section {
		padding-block: 1px;
		background: var(--ink);
		color: var(--paper);
	}

	.pressure-header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		padding-block: 2.5rem;
		border-bottom: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
	}

	.pressure-header .eyebrow {
		color: var(--coral);
	}

	.pressure-header > p:last-child {
		max-width: 35rem;
		font-size: 0.9rem;
		line-height: 1.65;
		color: var(--muted-paper);
	}

	.pressure-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.pressure-grid article {
		padding: clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3vw, 3rem) clamp(3rem, 6vw, 6rem) 0;
		border-right: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
	}

	.pressure-grid article:not(:first-child) {
		padding-left: clamp(1.5rem, 3vw, 3rem);
	}

	.pressure-grid article:last-child {
		border-right: 0;
	}

	.pressure-grid span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--coral);
	}

	.pressure-grid h3 {
		max-width: 14rem;
		margin-top: 3rem;
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 3vw, 2.7rem);
		font-weight: 400;
		line-height: 0.98;
	}

	.pressure-grid p {
		margin-top: 1rem;
		font-size: 0.83rem;
		line-height: 1.65;
		color: var(--muted-paper);
	}

	.question-section {
		background: var(--paper);
	}

	.question-grid,
	.standards-grid,
	.final-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(3rem, 8vw, 9rem);
	}

	.question-grid h2 {
		max-width: 35rem;
		margin-top: 1.5rem;
	}

	.question-copy > p + p {
		margin-top: 1.5rem;
		line-height: 1.75;
		color: var(--muted-ink);
	}

	.question-copy blockquote {
		margin: 3rem 0 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.7rem);
		font-style: italic;
		line-height: 1;
	}

	.mastery-heading {
		display: grid;
		grid-template-columns: 0.75fr 1.5fr;
		gap: 3rem;
	}

	.mastery-heading .eyebrow {
		color: var(--signal);
	}

	.mastery-heading h2 span {
		color: var(--signal);
	}

	.mastery-heading .lede {
		grid-column: 2;
		max-width: 48rem;
		color: var(--muted-paper);
	}

	.mastery-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		margin-top: 5rem;
		background: color-mix(in srgb, var(--paper) 16%, transparent);
	}

	.mastery-column {
		background: var(--ink);
	}

	.mastery-column > p {
		padding: 1.2rem 1.4rem;
		background: var(--paper);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.mastery-column > div {
		display: grid;
		grid-template-columns: 3rem 1fr;
		align-items: center;
		gap: 1rem;
		padding: 1.35rem 1.4rem;
		border-bottom: 1px solid color-mix(in srgb, var(--paper) 14%, transparent);
	}

	.mastery-column span {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		color: var(--signal);
	}

	.mastery-column strong {
		font-size: 0.9rem;
	}

	.coach-section {
		padding-block: clamp(5rem, 10vw, 10rem);
		background: var(--coral);
	}

	.coach-grid {
		display: grid;
		grid-template-columns: minmax(18rem, 0.82fr) minmax(0, 1.18fr);
		align-items: center;
		gap: clamp(3rem, 9vw, 9rem);
	}

	.coach-portrait {
		display: flex;
		min-height: 37rem;
		flex-direction: column;
		justify-content: space-between;
		padding: 2.3rem;
		background: var(--ink);
		box-shadow: 1.5rem 1.5rem 0 color-mix(in srgb, var(--paper) 46%, transparent);
		color: var(--paper);
		transform: rotate(-2deg);
	}

	.portrait-type {
		display: flex;
		flex-direction: column;
		font-size: clamp(3rem, 7vw, 7rem);
		font-weight: 700;
		letter-spacing: -0.08em;
		line-height: 0.78;
	}

	.portrait-type span {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 400;
		color: var(--signal);
	}

	.coach-portrait p {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.coach-copy h2 {
		margin-top: 1.5rem;
	}

	.coach-copy .lede {
		margin-top: 2rem;
		color: var(--ink);
	}

	.coach-copy > p:not(.eyebrow):not(.lede) {
		margin-top: 1.4rem;
		line-height: 1.75;
	}

	.coach-copy .button {
		margin-top: 2rem;
	}

	.experience-heading,
	.pricing-heading {
		display: grid;
		grid-template-columns: 1.4fr 0.6fr;
		align-items: end;
		gap: 4rem;
	}

	.experience-heading h2,
	.pricing-heading h2 {
		max-width: 50rem;
		margin-top: 1.5rem;
	}

	.experience-list {
		margin-top: 5rem;
		border-top: 1px solid var(--line);
	}

	.experience-list article {
		display: grid;
		grid-template-columns: 3rem minmax(14rem, 0.75fr) 1fr;
		gap: 2rem;
		align-items: start;
		padding: 2rem 0;
		border-bottom: 1px solid var(--line);
	}

	.experience-list span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--coral);
	}

	.experience-list h3 {
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 400;
	}

	.experience-list p {
		font-size: 0.85rem;
		line-height: 1.65;
		color: var(--muted-ink);
	}

	.standards-section {
		padding-block: clamp(5rem, 9vw, 8rem);
	}

	.standards-grid .eyebrow {
		color: var(--coral);
	}

	.standards-grid h2 {
		max-width: 42rem;
		margin-top: 1.5rem;
	}

	.standards-grid > div:last-child > p {
		font-size: 1.03rem;
		line-height: 1.75;
		color: var(--muted-paper);
	}

	.standards-grid ul {
		margin: 2.4rem 0 0;
		padding: 0;
		list-style: none;
	}

	.standards-grid li {
		padding: 1rem 0;
		border-top: 1px solid color-mix(in srgb, var(--paper) 16%, transparent);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.standards-grid li::before {
		margin-right: 0.8rem;
		color: var(--signal);
		content: '✓';
	}

	.proof-section {
		padding-block: clamp(4rem, 8vw, 7rem);
		background: var(--signal);
	}

	.proof-number {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 1.2rem;
		text-align: center;
	}

	.proof-number span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.proof-number strong {
		font-family: var(--font-display);
		font-size: clamp(4.5rem, 12vw, 11rem);
		font-weight: 400;
		letter-spacing: -0.06em;
		line-height: 0.8;
	}

	.press-row {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		margin-top: 5rem;
		border-top: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
	}

	.press-row span {
		display: grid;
		min-height: 5.5rem;
		place-items: center;
		border-right: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
		font-size: clamp(0.65rem, 1.4vw, 0.9rem);
		font-weight: 700;
	}

	.press-row span:last-child {
		border-right: 0;
	}

	.plan-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.2rem;
		margin-top: 4rem;
	}

	.plan-grid article {
		padding: clamp(1.7rem, 4vw, 3.2rem);
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.plan-grid article.featured {
		background: var(--ink);
		color: var(--paper);
	}

	.plan-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.plan-top span {
		padding: 0.3rem 0.55rem;
		border-radius: 99rem;
		background: var(--signal);
		font-size: 0.52rem;
		color: var(--ink);
	}

	.plan-grid .price {
		position: static;
		display: flex;
		align-items: baseline;
		gap: 0.65rem;
		margin-top: 2.2rem;
		padding: 0;
		background: transparent;
		color: inherit;
	}

	.plan-grid .price strong {
		font-family: var(--font-display);
		font-size: clamp(4rem, 8vw, 6.5rem);
		font-weight: 400;
		letter-spacing: -0.06em;
		line-height: 0.8;
	}

	.plan-grid .price span,
	.risk-note {
		font-family: var(--font-mono);
		font-size: 0.6rem;
	}

	.plan-description {
		max-width: 31rem;
		margin-top: 1.8rem;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	.featured .plan-description {
		color: var(--muted-paper);
	}

	.plan-grid ul {
		margin: 2rem 0;
		padding: 0;
		list-style: none;
	}

	.plan-grid li {
		padding: 0.8rem 0;
		border-top: 1px solid currentColor;
		font-size: 0.78rem;
		border-color: color-mix(in srgb, currentColor 18%, transparent);
	}

	.plan-grid li::before {
		margin-right: 0.65rem;
		color: var(--coral);
		content: '•';
	}

	.risk-note {
		max-width: 52rem;
		margin-top: 1.5rem;
		line-height: 1.6;
		color: var(--muted-ink);
	}

	.faq-grid {
		display: grid;
		grid-template-columns: 0.75fr 1.25fr;
		gap: clamp(3rem, 8vw, 8rem);
	}

	.faq-grid h2 {
		margin-top: 1.5rem;
	}

	.faq-list {
		border-top: 1px solid var(--line);
	}

	details {
		border-bottom: 1px solid var(--line);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 1.5rem 0;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary span {
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 400;
		transition: transform 160ms ease;
	}

	details[open] summary span {
		transform: rotate(45deg);
	}

	details > p {
		max-width: 42rem;
		padding: 0 3rem 1.8rem 0;
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--muted-ink);
	}

	.final-cta {
		padding-block: clamp(5rem, 9vw, 8rem);
	}

	.final-cta .eyebrow {
		color: var(--signal);
	}

	.final-cta h2 {
		margin-top: 1.5rem;
	}

	.final-cta .lede {
		color: var(--muted-paper);
	}

	.final-cta .button {
		margin-top: 2rem;
	}

	@media (max-width: 900px) {
		.hero-grid,
		.intro-grid,
		.coach-grid,
		.question-grid,
		.standards-grid,
		.final-grid,
		.faq-grid {
			grid-template-columns: 1fr;
		}

		.market-card {
			max-width: 36rem;
		}

		.intro-grid {
			align-items: start;
		}

		.mastery-heading,
		.experience-heading,
		.pricing-heading {
			grid-template-columns: 1fr;
		}

		.mastery-heading .lede {
			grid-column: 1;
		}

		.press-row {
			grid-template-columns: repeat(3, 1fr);
		}

		.press-row span:nth-child(3) {
			border-right: 0;
		}

		.press-row span:nth-child(-n + 3) {
			border-bottom: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
		}
	}

	@media (max-width: 680px) {
		.hero-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.hero-actions {
			align-items: flex-start;
			flex-direction: column;
		}

		.hero-tape span:nth-of-type(2),
		.hero-tape span:nth-of-type(3),
		.hero-tape i:nth-of-type(2),
		.hero-tape i:nth-of-type(3) {
			display: none;
		}

		.market-card {
			box-shadow: 0.7rem 0.7rem 0 color-mix(in srgb, var(--blue) 34%, transparent);
		}

		.chart {
			height: 15rem;
		}

		.pressure-header,
		.pressure-grid,
		.mastery-grid,
		.plan-grid {
			grid-template-columns: 1fr;
		}

		.pressure-header {
			gap: 1.5rem;
		}

		.pressure-grid article,
		.pressure-grid article:not(:first-child) {
			padding: 2rem 0 3rem;
			border-right: 0;
			border-bottom: 1px solid color-mix(in srgb, var(--paper) 18%, transparent);
		}

		.coach-portrait {
			min-height: 26rem;
			padding: 1.5rem;
			box-shadow: 0.8rem 0.8rem 0 color-mix(in srgb, var(--paper) 46%, transparent);
		}

		.experience-list article {
			grid-template-columns: 2rem 1fr;
			gap: 1rem;
		}

		.experience-list article p {
			grid-column: 2;
		}

		.proof-number {
			align-items: center;
			flex-direction: column;
		}

		.press-row {
			grid-template-columns: 1fr 1fr;
		}

		.press-row span:nth-child(odd) {
			border-right: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
		}

		.press-row span:nth-child(even) {
			border-right: 0;
		}
	}
</style>
