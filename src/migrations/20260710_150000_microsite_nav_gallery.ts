import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsites" ADD COLUMN IF NOT EXISTS "crm_event_id" varchar;

    CREATE TABLE IF NOT EXISTS "microsite_settings_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "key" varchar,
      "title_sq" varchar,
      "title_en" varchar,
      "lead_sq" varchar,
      "lead_en" varchar,
      "lead_page_slug" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "microsite_settings_navigation"
        ADD CONSTRAINT "microsite_settings_navigation_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."microsite_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_order_idx"
      ON "microsite_settings_navigation" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_parent_id_idx"
      ON "microsite_settings_navigation" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "microsite_settings_navigation_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "page_slug" varchar,
      "label_sq" varchar,
      "label_en" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "microsite_settings_navigation_items"
        ADD CONSTRAINT "microsite_settings_navigation_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."microsite_settings_navigation"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_items_order_idx"
      ON "microsite_settings_navigation_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_items_parent_id_idx"
      ON "microsite_settings_navigation_items" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_blocks_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "style" varchar DEFAULT 'slideshow',
      "autoplay_seconds" numeric,
      "block_name" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_gallery"
        ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_order_idx"
      ON "pages_blocks_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_parent_id_idx"
      ON "pages_blocks_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_path_idx"
      ON "pages_blocks_gallery" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_slides" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "link" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_gallery_slides"
        ADD CONSTRAINT "pages_blocks_gallery_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_gallery_slides"
        ADD CONSTRAINT "pages_blocks_gallery_slides_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_slides_order_idx"
      ON "pages_blocks_gallery_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_slides_parent_id_idx"
      ON "pages_blocks_gallery_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_slides_image_idx"
      ON "pages_blocks_gallery_slides" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_gallery_slides" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery" CASCADE;
    DROP TABLE IF EXISTS "microsite_settings_navigation_items" CASCADE;
    DROP TABLE IF EXISTS "microsite_settings_navigation" CASCADE;
    ALTER TABLE "microsites" DROP COLUMN IF EXISTS "crm_event_id";
  `)
}
