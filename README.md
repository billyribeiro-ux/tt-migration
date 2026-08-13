# Trick Trades — Svelte 5 rebuild

A complete SvelteKit conversion of the supplied Trick Trades HTML exports. The app includes the public sales experience, academy, 50-lesson Boot Camp map, four assessments, member resources, safe purchase confirmation, course progress, SEO routes, and Drizzle/Postgres persistence.

## Stack

- Svelte 5.56.9 in runes mode
- SvelteKit 2.70.2 (the current published major; SvelteKit 3 is not published)
- TypeScript 6 and Vite 8
- Drizzle ORM with Neon Postgres for edge-safe persistence
- Cloudflare adapter and Sites-compatible staged worker output
- pnpm 11

## Develop

```sh
pnpm install
pnpm dev
```

Progress works without a database using device storage. To enable synchronized progress, copy `.env.example` to `.env` and provide a Neon Postgres connection string.

## Database

```sh
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

The initial migration creates anonymous learners and per-lesson progress. No purchase or billing details are stored by this app.

## Validate and build

```sh
pnpm check
pnpm build
pnpm build:sites
```

`pnpm build:sites` stages the Cloudflare worker and static assets in `dist/` for the Sites packaging workflow.

## Content boundaries

The exports include curriculum titles, descriptions, navigation, links and one public introduction video. Protected lesson media was not present in the files, so lesson pages preserve a direct route to the original authenticated member page rather than pretending to reproduce unavailable content.
