import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Convert freestyle nav slug text fields to page relationship FKs,
 * backfilling from existing slug values where matching pages exist.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings_navigation"
      ADD COLUMN IF NOT EXISTS "lead_page_id" integer;

    ALTER TABLE "microsite_settings_navigation_items"
      ADD COLUMN IF NOT EXISTS "page_id" integer;

    UPDATE "microsite_settings_navigation" AS n
    SET "lead_page_id" = p.id
    FROM "microsite_settings" AS s, "pages" AS p
    WHERE n."_parent_id" = s.id
      AND p.slug = n."lead_page_slug"
      AND (
        p.microsite_id = s.microsite_id
        OR (p.microsite_id IS NULL AND s.microsite_id IS NULL)
      )
      AND n."lead_page_slug" IS NOT NULL
      AND n."lead_page_id" IS NULL;

    UPDATE "microsite_settings_navigation_items" AS i
    SET "page_id" = p.id
    FROM "microsite_settings_navigation" AS n,
         "microsite_settings" AS s,
         "pages" AS p
    WHERE i."_parent_id" = n.id
      AND n."_parent_id" = s.id
      AND p.slug = i."page_slug"
      AND (
        p.microsite_id = s.microsite_id
        OR (p.microsite_id IS NULL AND s.microsite_id IS NULL)
      )
      AND i."page_slug" IS NOT NULL
      AND i."page_id" IS NULL;

    DO $$ BEGIN
      ALTER TABLE "microsite_settings_navigation"
        ADD CONSTRAINT "microsite_settings_navigation_lead_page_id_pages_id_fk"
        FOREIGN KEY ("lead_page_id") REFERENCES "public"."pages"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "microsite_settings_navigation_items"
        ADD CONSTRAINT "microsite_settings_navigation_items_page_id_pages_id_fk"
        FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_lead_page_idx"
      ON "microsite_settings_navigation" USING btree ("lead_page_id");
    CREATE INDEX IF NOT EXISTS "microsite_settings_navigation_items_page_idx"
      ON "microsite_settings_navigation_items" USING btree ("page_id");

    ALTER TABLE "microsite_settings_navigation" DROP COLUMN IF EXISTS "lead_page_slug";
    ALTER TABLE "microsite_settings_navigation_items" DROP COLUMN IF EXISTS "page_slug";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings_navigation"
      ADD COLUMN IF NOT EXISTS "lead_page_slug" varchar;
    ALTER TABLE "microsite_settings_navigation_items"
      ADD COLUMN IF NOT EXISTS "page_slug" varchar;

    UPDATE "microsite_settings_navigation" AS n
    SET "lead_page_slug" = p.slug
    FROM "pages" AS p
    WHERE p.id = n."lead_page_id"
      AND n."lead_page_slug" IS NULL;

    UPDATE "microsite_settings_navigation_items" AS i
    SET "page_slug" = p.slug
    FROM "pages" AS p
    WHERE p.id = i."page_id"
      AND i."page_slug" IS NULL;

    DROP INDEX IF EXISTS "microsite_settings_navigation_lead_page_idx";
    DROP INDEX IF EXISTS "microsite_settings_navigation_items_page_idx";

    ALTER TABLE "microsite_settings_navigation"
      DROP CONSTRAINT IF EXISTS "microsite_settings_navigation_lead_page_id_pages_id_fk";
    ALTER TABLE "microsite_settings_navigation_items"
      DROP CONSTRAINT IF EXISTS "microsite_settings_navigation_items_page_id_pages_id_fk";

    ALTER TABLE "microsite_settings_navigation" DROP COLUMN IF EXISTS "lead_page_id";
    ALTER TABLE "microsite_settings_navigation_items" DROP COLUMN IF EXISTS "page_id";
  `)
}
