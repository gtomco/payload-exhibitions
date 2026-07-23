import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_eyebrow_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_eyebrow_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_heading_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_heading_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_intro_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "gallery_intro_sq" varchar;

    CREATE TABLE IF NOT EXISTS "main_site_gallery_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption_en" varchar,
      "caption_sq" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "main_site_gallery_items"
        ADD CONSTRAINT "main_site_gallery_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."main_site"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "main_site_gallery_items"
        ADD CONSTRAINT "main_site_gallery_items_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "main_site_gallery_items_order_idx"
      ON "main_site_gallery_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "main_site_gallery_items_parent_id_idx"
      ON "main_site_gallery_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "main_site_gallery_items_image_idx"
      ON "main_site_gallery_items" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "main_site_gallery_items" CASCADE;
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_eyebrow_en";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_eyebrow_sq";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_heading_en";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_heading_sq";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_intro_en";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "gallery_intro_sq";
  `)
}
