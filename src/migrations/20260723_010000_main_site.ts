import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "main_site" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_eyebrow_en" varchar,
      "hero_eyebrow_sq" varchar,
      "hero_title_en" varchar,
      "hero_title_sq" varchar,
      "hero_body_en" varchar,
      "hero_body_sq" varchar,
      "hero_image_id" integer,
      "hero_caption_en" varchar,
      "hero_caption_sq" varchar,
      "platforms_intro_en" varchar,
      "platforms_intro_sq" varchar,
      "story_eyebrow_en" varchar,
      "story_eyebrow_sq" varchar,
      "story_title_en" varchar,
      "story_title_sq" varchar,
      "story_body_en" varchar,
      "story_body_sq" varchar,
      "story_image_id" integer,
      "contact_email" varchar,
      "contact_phone" varchar,
      "address_en" varchar,
      "address_sq" varchar,
      "instagram" varchar,
      "facebook" varchar,
      "linkedin" varchar,
      "youtube" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "main_site_platforms" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title_en" varchar,
      "title_sq" varchar,
      "subtitle_en" varchar,
      "subtitle_sq" varchar,
      "blurb_en" varchar,
      "blurb_sq" varchar,
      "logo_id" integer,
      "link_type" varchar DEFAULT 'microsite',
      "microsite_id" integer,
      "external_url" varchar,
      "ticker_label" varchar
    );

    CREATE TABLE IF NOT EXISTS "main_site_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar,
      "label_en" varchar,
      "label_sq" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "main_site_platforms"
        ADD CONSTRAINT "main_site_platforms_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_stats"
        ADD CONSTRAINT "main_site_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "main_site_platforms_order_idx"
      ON "main_site_platforms" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "main_site_platforms_parent_id_idx"
      ON "main_site_platforms" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "main_site_stats_order_idx"
      ON "main_site_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "main_site_stats_parent_id_idx"
      ON "main_site_stats" USING btree ("_parent_id");

    INSERT INTO "main_site" ("id", "updated_at", "created_at")
    SELECT 1, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "main_site" WHERE "id" = 1);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "main_site_stats" CASCADE;
    DROP TABLE IF EXISTS "main_site_platforms" CASCADE;
    DROP TABLE IF EXISTS "main_site" CASCADE;
  `)
}
