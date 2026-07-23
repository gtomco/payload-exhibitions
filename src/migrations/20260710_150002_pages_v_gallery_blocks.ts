import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "style" varchar DEFAULT 'slideshow',
      "autoplay_seconds" numeric,
      "_uuid" varchar,
      "block_name" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_gallery"
        ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_order_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_parent_id_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_path_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "link" varchar,
      "_uuid" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_gallery_slides"
        ADD CONSTRAINT "_pages_v_blocks_gallery_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_gallery_slides"
        ADD CONSTRAINT "_pages_v_blocks_gallery_slides_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_slides_order_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_slides_parent_id_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_slides_image_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_slides" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery" CASCADE;
  `)
}
