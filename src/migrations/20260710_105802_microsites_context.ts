import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_theme_font_heading" AS ENUM('geist', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_theme_heading_weight" AS ENUM('normal', 'medium', 'semibold', 'bold');
  CREATE TYPE "public"."enum_theme_base_font_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_theme_line_height" AS ENUM('tight', 'normal', 'relaxed');
  CREATE TABLE "microsites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"dev_url" varchar,
  	"production_url" varchar,
  	"primary_color" varchar DEFAULT '#1B8C66',
  	"secondary_color" varchar DEFAULT '#F15A27',
  	"dark_color" varchar DEFAULT '#161F5E',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"event_date" timestamp(3) with time zone,
  	"location" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"microsite_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_events_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_event_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_microsite_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  ALTER TABLE "theme" ALTER COLUMN "light_colors_background" SET DEFAULT '#ffffff';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_foreground" SET DEFAULT '#252525';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_primary" SET DEFAULT '#343434';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_primary_foreground" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_secondary" SET DEFAULT '#f7f7f7';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_secondary_foreground" SET DEFAULT '#343434';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_accent" SET DEFAULT '#f7f7f7';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_accent_foreground" SET DEFAULT '#343434';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_muted" SET DEFAULT '#f7f7f7';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_muted_foreground" SET DEFAULT '#8e8e8e';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_card" SET DEFAULT '#f3f4f6';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_card_foreground" SET DEFAULT '#252525';
  ALTER TABLE "theme" ALTER COLUMN "light_colors_border" SET DEFAULT '#ebebeb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_background" SET DEFAULT '#252525';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_foreground" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_primary" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_primary_foreground" SET DEFAULT '#343434';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_secondary" SET DEFAULT '#434343';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_secondary_foreground" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_accent" SET DEFAULT '#434343';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_accent_foreground" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_muted" SET DEFAULT '#434343';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_muted_foreground" SET DEFAULT '#b5b5b5';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_card" SET DEFAULT '#2a2a2a';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_card_foreground" SET DEFAULT '#fbfbfb';
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_border" SET DEFAULT '#434343';
  ALTER TABLE "pages" ADD COLUMN "microsite_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_microsite_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "posts" ADD COLUMN "microsite_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_microsite_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "microsites_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "theme" ADD COLUMN "hero_dark_overlay" boolean DEFAULT true;
  ALTER TABLE "theme" ADD COLUMN "font_heading" "enum_theme_font_heading" DEFAULT 'geist';
  ALTER TABLE "theme" ADD COLUMN "heading_weight" "enum_theme_heading_weight" DEFAULT 'semibold';
  ALTER TABLE "theme" ADD COLUMN "base_font_size" "enum_theme_base_font_size" DEFAULT 'medium';
  ALTER TABLE "theme" ADD COLUMN "line_height" "enum_theme_line_height" DEFAULT 'normal';
  ALTER TABLE "events_populated_authors" ADD CONSTRAINT "events_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_populated_authors" ADD CONSTRAINT "_events_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_microsite_id_microsites_id_fk" FOREIGN KEY ("version_microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "microsites_slug_idx" ON "microsites" USING btree ("slug");
  CREATE INDEX "microsites_updated_at_idx" ON "microsites" USING btree ("updated_at");
  CREATE INDEX "microsites_created_at_idx" ON "microsites" USING btree ("created_at");
  CREATE INDEX "events_populated_authors_order_idx" ON "events_populated_authors" USING btree ("_order");
  CREATE INDEX "events_populated_authors_parent_id_idx" ON "events_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "events_hero_image_idx" ON "events" USING btree ("hero_image_id");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");
  CREATE INDEX "events_microsite_idx" ON "events" USING btree ("microsite_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_events_id_idx" ON "events_rels" USING btree ("events_id");
  CREATE INDEX "events_rels_categories_id_idx" ON "events_rels" USING btree ("categories_id");
  CREATE INDEX "events_rels_users_id_idx" ON "events_rels" USING btree ("users_id");
  CREATE INDEX "_events_v_version_populated_authors_order_idx" ON "_events_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_events_v_version_populated_authors_parent_id_idx" ON "_events_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_hero_image_idx" ON "_events_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_events_v_version_version_microsite_idx" ON "_events_v" USING btree ("version_microsite_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_events_id_idx" ON "_events_v_rels" USING btree ("events_id");
  CREATE INDEX "_events_v_rels_categories_id_idx" ON "_events_v_rels" USING btree ("categories_id");
  CREATE INDEX "_events_v_rels_users_id_idx" ON "_events_v_rels" USING btree ("users_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_microsite_id_microsites_id_fk" FOREIGN KEY ("version_microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_microsite_id_microsites_id_fk" FOREIGN KEY ("version_microsite_id") REFERENCES "public"."microsites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_microsites_fk" FOREIGN KEY ("microsites_id") REFERENCES "public"."microsites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_microsite_idx" ON "pages" USING btree ("microsite_id");
  CREATE INDEX "pages_rels_events_id_idx" ON "pages_rels" USING btree ("events_id");
  CREATE INDEX "_pages_v_version_version_microsite_idx" ON "_pages_v" USING btree ("version_microsite_id");
  CREATE INDEX "_pages_v_rels_events_id_idx" ON "_pages_v_rels" USING btree ("events_id");
  CREATE INDEX "posts_microsite_idx" ON "posts" USING btree ("microsite_id");
  CREATE INDEX "_posts_v_version_version_microsite_idx" ON "_posts_v" USING btree ("version_microsite_id");
  CREATE INDEX "redirects_rels_events_id_idx" ON "redirects_rels" USING btree ("events_id");
  CREATE INDEX "search_rels_events_id_idx" ON "search_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_microsites_id_idx" ON "payload_locked_documents_rels" USING btree ("microsites_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "header_rels_events_id_idx" ON "header_rels" USING btree ("events_id");
  CREATE INDEX "footer_rels_events_id_idx" ON "footer_rels" USING btree ("events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "microsites" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "microsites" CASCADE;
  DROP TABLE "events_populated_authors" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_populated_authors" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_microsite_id_microsites_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_events_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_microsite_id_microsites_id_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_events_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_microsite_id_microsites_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_microsite_id_microsites_id_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_events_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_microsites_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_events_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_events_fk";
  
  DROP INDEX "pages_microsite_idx";
  DROP INDEX "pages_rels_events_id_idx";
  DROP INDEX "_pages_v_version_version_microsite_idx";
  DROP INDEX "_pages_v_rels_events_id_idx";
  DROP INDEX "posts_microsite_idx";
  DROP INDEX "_posts_v_version_version_microsite_idx";
  DROP INDEX "redirects_rels_events_id_idx";
  DROP INDEX "search_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_microsites_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "header_rels_events_id_idx";
  DROP INDEX "footer_rels_events_id_idx";
  ALTER TABLE "theme" ALTER COLUMN "light_colors_background" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_primary" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_primary_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_secondary" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_secondary_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_accent" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_accent_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_muted" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_muted_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_card" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_card_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "light_colors_border" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_background" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_primary" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_primary_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_secondary" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_secondary_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_accent" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_accent_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_muted" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_muted_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_card" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_card_foreground" DROP DEFAULT;
  ALTER TABLE "theme" ALTER COLUMN "dark_colors_border" DROP DEFAULT;
  ALTER TABLE "pages" DROP COLUMN "microsite_id";
  ALTER TABLE "pages_rels" DROP COLUMN "events_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_microsite_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "events_id";
  ALTER TABLE "posts" DROP COLUMN "microsite_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_microsite_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "events_id";
  ALTER TABLE "search_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "microsites_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "header_rels" DROP COLUMN "events_id";
  ALTER TABLE "footer_rels" DROP COLUMN "events_id";
  ALTER TABLE "theme" DROP COLUMN "hero_dark_overlay";
  ALTER TABLE "theme" DROP COLUMN "font_heading";
  ALTER TABLE "theme" DROP COLUMN "heading_weight";
  ALTER TABLE "theme" DROP COLUMN "base_font_size";
  ALTER TABLE "theme" DROP COLUMN "line_height";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_theme_font_heading";
  DROP TYPE "public"."enum_theme_heading_weight";
  DROP TYPE "public"."enum_theme_base_font_size";
  DROP TYPE "public"."enum_theme_line_height";`)
}
