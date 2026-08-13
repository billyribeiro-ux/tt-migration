CREATE TYPE "public"."account_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."app_role" AS ENUM('admin', 'member', 'support');--> statement-breakpoint
CREATE TYPE "public"."catalog_kind" AS ENUM('course', 'download', 'service', 'membership', 'product');--> statement-breakpoint
CREATE TYPE "public"."course_access_state" AS ENUM('authenticated', 'api_only', 'legacy_mapping_gap', 'draft', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."course_item_kind" AS ENUM('module', 'chapter', 'lesson', 'assessment');--> statement-breakpoint
CREATE TYPE "public"."entitlement_state" AS ENUM('active', 'pending', 'revoked', 'expired', 'evidence_gap');--> statement-breakpoint
CREATE TYPE "public"."entitlement_subject" AS ENUM('product', 'course', 'download', 'service');--> statement-breakpoint
CREATE TYPE "public"."source_order_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'unknown');--> statement-breakpoint
CREATE TABLE "catalog_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_product_id" integer,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"kind" "catalog_kind" DEFAULT 'product' NOT NULL,
	"source_url" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"source_item_id" integer,
	"parent_source_item_id" integer,
	"kind" "course_item_kind" NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"source_url" text DEFAULT '' NOT NULL,
	"media_provider" text DEFAULT '' NOT NULL,
	"media_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"evidence_missing" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_course_id" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"source_url" text NOT NULL,
	"source_status" text DEFAULT 'unknown' NOT NULL,
	"access_state" "course_access_state" DEFAULT 'unknown' NOT NULL,
	"reported_lesson_count" integer DEFAULT 0 NOT NULL,
	"evidenced_lesson_count" integer DEFAULT 0 NOT NULL,
	"reported_assessment_count" integer DEFAULT 0 NOT NULL,
	"evidenced_assessment_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "download_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"source_url" text DEFAULT '' NOT NULL,
	"provider" text DEFAULT 'woocommerce' NOT NULL,
	"evidence_missing" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"external_line_id" text,
	"product_name" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_minor" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"external_id" text,
	"status" "source_order_status" DEFAULT 'unknown' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"total_minor" integer,
	"placed_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_course_access" (
	"product_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"evidence" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_course_access_product_id_course_id_pk" PRIMARY KEY("product_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "product_downloads" (
	"product_id" uuid NOT NULL,
	"download_id" uuid NOT NULL,
	"evidence" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_downloads_product_id_download_id_pk" PRIMARY KEY("product_id","download_id")
);
--> statement-breakpoint
CREATE TABLE "user_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subject_type" "entitlement_subject" NOT NULL,
	"subject_key" text NOT NULL,
	"state" "entitlement_state" DEFAULT 'active' NOT NULL,
	"source" text DEFAULT 'migration' NOT NULL,
	"evidence" jsonb,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"role" "app_role" DEFAULT 'member' NOT NULL,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"source_system" text DEFAULT 'migration' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learners" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "course_items" ADD CONSTRAINT "course_items_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_course_access" ADD CONSTRAINT "product_course_access_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_course_access" ADD CONSTRAINT "product_course_access_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_downloads" ADD CONSTRAINT "product_downloads_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_downloads" ADD CONSTRAINT "product_downloads_download_id_download_assets_id_fk" FOREIGN KEY ("download_id") REFERENCES "public"."download_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_entitlements" ADD CONSTRAINT "user_entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_products_source_id_idx" ON "catalog_products" USING btree ("source_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_products_slug_idx" ON "catalog_products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "catalog_products_kind_idx" ON "catalog_products" USING btree ("kind");--> statement-breakpoint
CREATE UNIQUE INDEX "course_items_source_id_idx" ON "course_items" USING btree ("course_id","source_item_id");--> statement-breakpoint
CREATE INDEX "course_items_course_order_idx" ON "course_items" USING btree ("course_id","sort_order");--> statement-breakpoint
CREATE INDEX "course_items_slug_idx" ON "course_items" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_source_id_idx" ON "courses" USING btree ("source_course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "courses_access_state_idx" ON "courses" USING btree ("access_state");--> statement-breakpoint
CREATE UNIQUE INDEX "download_assets_slug_idx" ON "download_assets" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_external_id_idx" ON "orders" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "orders_user_status_idx" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_entitlements_subject_idx" ON "user_entitlements" USING btree ("user_id","subject_type","subject_key");--> statement-breakpoint
CREATE INDEX "user_entitlements_state_idx" ON "user_entitlements" USING btree ("user_id","state");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "learners" ADD CONSTRAINT "learners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "learners_user_idx" ON "learners" USING btree ("user_id");