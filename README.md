# Trick Trades — Svelte 5 migration

This workspace is the evidence-backed SvelteKit migration of the Trick Trades public catalog, member academy, course content, account access, and legacy WooCommerce mappings. The application keeps public summaries separate from server-only course media records and marks every unresolved source item as an explicit evidence gap.

## Stack

- Svelte 5.56.9 in runes mode
- SvelteKit 2.70.2 (the current published major; SvelteKit 3 is not published)
- TypeScript 6 and Vite 8
- Drizzle ORM with PostgreSQL and Neon HTTP for serverless persistence
- Official SvelteKit Vercel adapter
- pnpm 11

## Develop

```sh
pnpm install
pnpm dev
```

Progress works without a database using device storage. To enable synchronized progress in Vercel, provide a Neon PostgreSQL connection string and set `DATABASE_RUNTIME_ENABLED=true` in the Vercel project environment.

Refresh the public source catalog with:

```sh
pnpm catalog:sync
```

The generated catalog currently contains 10 course containers, 382 evidenced course items, 18 explicit unresolved placeholders, and 79 WooCommerce products. Generated media URLs remain in `src/lib/server/courses/generated/` and are never included in public catalog JSON.

## Database

```sh
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

The migration creates users, learners, courses, course items, products, access mappings, orders, download assets, entitlements, and lesson progress. `pnpm db:seed` is idempotent and requires `SHOWCASE_ADMIN_USERNAME` plus `SHOWCASE_ADMIN_PASSWORD`; it securely hashes the password, promotes that identity to admin, and grants it access to the migrated catalog. Production login also requires `SHOWCASE_SESSION_SECRET`. Do not commit `.env`.

## Validate and build

```sh
pnpm check
pnpm build
```

## Content boundaries

The sanitized evidence report is `evidence/account-access.audit.json`. It deliberately omits usernames, order IDs, signed download URLs, session credentials, and other account data.

`project-alpha` and `trick-trades` outside this workspace are read-only showcase references and must not be modified or integrated until the core migration is approved. Pro Trading Room is unrelated and excluded from all discovery, catalog, access, and migration work.

Two user-supplied Vimeo links are retained as evidenced but unassigned records in `src/lib/server/courses/manual-media/unassigned.json`. They are not attached to a course or lesson until source evidence identifies the correct destination.
