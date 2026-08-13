import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';

export const appRole = pgEnum('app_role', ['admin', 'member', 'support']);
export const accountStatus = pgEnum('account_status', ['active', 'invited', 'disabled']);
export const catalogKind = pgEnum('catalog_kind', ['course', 'download', 'service', 'membership', 'product']);
export const sourceOrderStatus = pgEnum('source_order_status', [
	'pending',
	'processing',
	'completed',
	'failed',
	'cancelled',
	'refunded',
	'unknown'
]);
export const courseAccessState = pgEnum('course_access_state', [
	'authenticated',
	'api_only',
	'legacy_mapping_gap',
	'draft',
	'unknown'
]);
export const courseItemKind = pgEnum('course_item_kind', ['module', 'chapter', 'lesson', 'assessment']);
export const entitlementSubject = pgEnum('entitlement_subject', ['product', 'course', 'download', 'service']);
export const entitlementState = pgEnum('entitlement_state', ['active', 'pending', 'revoked', 'expired', 'evidence_gap']);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		username: text('username').notNull(),
		passwordHash: text('password_hash'),
		displayName: text('display_name'),
		role: appRole('role').notNull().default('member'),
		status: accountStatus('status').notNull().default('active'),
		sourceSystem: text('source_system').notNull().default('migration'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('users_username_idx').on(table.username), index('users_role_idx').on(table.role)]
);

export const learners = pgTable(
	'learners',
	{
		id: uuid('id').primaryKey(),
		userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('learners_user_idx').on(table.userId)]
);

export const catalogProducts = pgTable(
	'catalog_products',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		sourceProductId: integer('source_product_id'),
		slug: text('slug').notNull(),
		name: text('name').notNull(),
		kind: catalogKind('kind').notNull().default('product'),
		sourceUrl: text('source_url'),
		isPublic: boolean('is_public').notNull().default(false),
		isActive: boolean('is_active').notNull().default(true),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('catalog_products_source_id_idx').on(table.sourceProductId),
		uniqueIndex('catalog_products_slug_idx').on(table.slug),
		index('catalog_products_kind_idx').on(table.kind)
	]
);

export const courses = pgTable(
	'courses',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		sourceCourseId: integer('source_course_id').notNull(),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		description: text('description').notNull().default(''),
		sourceUrl: text('source_url').notNull(),
		sourceStatus: text('source_status').notNull().default('unknown'),
		accessState: courseAccessState('access_state').notNull().default('unknown'),
		reportedLessonCount: integer('reported_lesson_count').notNull().default(0),
		evidencedLessonCount: integer('evidenced_lesson_count').notNull().default(0),
		reportedAssessmentCount: integer('reported_assessment_count').notNull().default(0),
		evidencedAssessmentCount: integer('evidenced_assessment_count').notNull().default(0),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('courses_source_id_idx').on(table.sourceCourseId),
		uniqueIndex('courses_slug_idx').on(table.slug),
		index('courses_access_state_idx').on(table.accessState)
	]
);

export const courseItems = pgTable(
	'course_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		courseId: uuid('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
		sourceItemId: integer('source_item_id'),
		parentSourceItemId: integer('parent_source_item_id'),
		kind: courseItemKind('kind').notNull(),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		description: text('description').notNull().default(''),
		sourceUrl: text('source_url').notNull().default(''),
		mediaProvider: text('media_provider').notNull().default(''),
		mediaUrl: text('media_url').notNull().default(''),
		sortOrder: integer('sort_order').notNull().default(0),
		evidenceMissing: boolean('evidence_missing').notNull().default(false),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('course_items_source_id_idx').on(table.courseId, table.sourceItemId),
		index('course_items_course_order_idx').on(table.courseId, table.sortOrder),
		index('course_items_slug_idx').on(table.slug)
	]
);

export const productCourseAccess = pgTable(
	'product_course_access',
	{
		productId: uuid('product_id')
			.notNull()
			.references(() => catalogProducts.id, { onDelete: 'cascade' }),
		courseId: uuid('course_id')
			.notNull()
			.references(() => courses.id, { onDelete: 'cascade' }),
		evidence: jsonb('evidence').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [primaryKey({ columns: [table.productId, table.courseId] })]
);

export const orders = pgTable(
	'orders',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		externalId: text('external_id'),
		status: sourceOrderStatus('status').notNull().default('unknown'),
		currency: text('currency').notNull().default('USD'),
		totalMinor: integer('total_minor'),
		placedAt: timestamp('placed_at', { withTimezone: true }),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('orders_external_id_idx').on(table.externalId), index('orders_user_status_idx').on(table.userId, table.status)]
);

export const orderItems = pgTable(
	'order_items',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		productId: uuid('product_id').references(() => catalogProducts.id, { onDelete: 'set null' }),
		externalLineId: text('external_line_id'),
		productName: text('product_name').notNull(),
		quantity: integer('quantity').notNull().default(1),
		totalMinor: integer('total_minor'),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [index('order_items_order_idx').on(table.orderId), index('order_items_product_idx').on(table.productId)]
);

export const downloadAssets = pgTable(
	'download_assets',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull(),
		name: text('name').notNull(),
		sourceUrl: text('source_url').notNull().default(''),
		provider: text('provider').notNull().default('woocommerce'),
		evidenceMissing: boolean('evidence_missing').notNull().default(false),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('download_assets_slug_idx').on(table.slug)]
);

export const productDownloads = pgTable(
	'product_downloads',
	{
		productId: uuid('product_id')
			.notNull()
			.references(() => catalogProducts.id, { onDelete: 'cascade' }),
		downloadId: uuid('download_id')
			.notNull()
			.references(() => downloadAssets.id, { onDelete: 'cascade' }),
		evidence: jsonb('evidence').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [primaryKey({ columns: [table.productId, table.downloadId] })]
);

export const userEntitlements = pgTable(
	'user_entitlements',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		subjectType: entitlementSubject('subject_type').notNull(),
		subjectKey: text('subject_key').notNull(),
		state: entitlementState('state').notNull().default('active'),
		source: text('source').notNull().default('migration'),
		evidence: jsonb('evidence').$type<Record<string, unknown>>(),
		expiresAt: timestamp('expires_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('user_entitlements_subject_idx').on(table.userId, table.subjectType, table.subjectKey),
		index('user_entitlements_state_idx').on(table.userId, table.state)
	]
);

export const lessonProgress = pgTable(
	'lesson_progress',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		learnerId: uuid('learner_id')
			.notNull()
			.references(() => learners.id, { onDelete: 'cascade' }),
		lessonSlug: text('lesson_slug').notNull(),
		completed: boolean('completed').notNull().default(false),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('lesson_progress_learner_lesson_idx').on(table.learnerId, table.lessonSlug)]
);

export type User = typeof users.$inferSelect;
export type Learner = typeof learners.$inferSelect;
export type CatalogProduct = typeof catalogProducts.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseItem = typeof courseItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type DownloadAsset = typeof downloadAssets.$inferSelect;
export type UserEntitlement = typeof userEntitlements.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
