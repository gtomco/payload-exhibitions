import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_black" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_white" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_accent" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_grey" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_soft" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_film" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "theme_muted" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_about_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_about_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_events_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_events_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_culture_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_culture_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_news_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_news_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_contact_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "nav_contact_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_brand_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_brand_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_cta_primary_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_cta_primary_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_cta_secondary_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "hero_cta_secondary_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_heading_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_heading_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_see_all_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "platforms_see_all_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "story_cta_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "story_cta_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "story_badge_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "story_badge_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_title_before_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_title_before_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_title_accent_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_title_accent_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_body_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_body_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_meet_team_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "culture_meet_team_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "mission_title_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "mission_title_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "mission_body_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "mission_body_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "services_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "services_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "services_heading_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "services_heading_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_title_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_title_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_meta_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_meta_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "film_url" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_heading_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_heading_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_all_label_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "news_all_label_sq" varchar;

    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_title_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_title_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_button_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "cta_button_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_tagline_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_tagline_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_explore_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_explore_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_platforms_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_platforms_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_connect_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "footer_connect_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "copyright_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "copyright_sq" varchar;

    CREATE TABLE IF NOT EXISTS "main_site_culture_values" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title_en" varchar,
      "title_sq" varchar,
      "body_en" varchar,
      "body_sq" varchar
    );

    CREATE TABLE IF NOT EXISTS "main_site_team" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "role_en" varchar,
      "role_sq" varchar,
      "initials" varchar,
      "photo_id" integer
    );

    CREATE TABLE IF NOT EXISTS "main_site_services" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title_en" varchar,
      "title_sq" varchar,
      "body_en" varchar,
      "body_sq" varchar,
      "cta_en" varchar,
      "cta_sq" varchar,
      "cta_href" varchar
    );

    CREATE TABLE IF NOT EXISTS "main_site_news_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "category_en" varchar,
      "category_sq" varchar,
      "title_en" varchar,
      "title_sq" varchar,
      "body_en" varchar,
      "body_sq" varchar,
      "image_id" integer,
      "href" varchar
    );

    CREATE TABLE IF NOT EXISTS "main_site_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title_en" varchar,
      "title_sq" varchar,
      "youtube_url" varchar,
      "cover_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "main_site_culture_values"
        ADD CONSTRAINT "main_site_culture_values_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_team"
        ADD CONSTRAINT "main_site_team_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_services"
        ADD CONSTRAINT "main_site_services_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_news_items"
        ADD CONSTRAINT "main_site_news_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_videos"
        ADD CONSTRAINT "main_site_videos_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "main_site_videos" CASCADE;
    DROP TABLE IF EXISTS "main_site_news_items" CASCADE;
    DROP TABLE IF EXISTS "main_site_services" CASCADE;
    DROP TABLE IF EXISTS "main_site_team" CASCADE;
    DROP TABLE IF EXISTS "main_site_culture_values" CASCADE;
  `)
}
