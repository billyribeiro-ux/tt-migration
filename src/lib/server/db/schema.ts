import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const learners = pgTable('learners', {
	id: uuid('id').primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

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

export type Learner = typeof learners.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
