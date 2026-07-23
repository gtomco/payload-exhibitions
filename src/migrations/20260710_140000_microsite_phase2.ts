import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "redirects" ADD COLUMN IF NOT EXISTS "microsite_id" integer;
    DO $$ BEGIN
      ALTER TABLE "redirects"
        ADD CONSTRAINT "redirects_microsite_id_microsites_id_fk"
        FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "redirects_microsite_idx" ON "redirects" USING btree ("microsite_id");

    CREATE TABLE IF NOT EXISTS "microsite_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "microsite_id" integer,
      "contact_email" varchar,
      "contact_phone" varchar,
      "address" varchar,
      "hero_eyebrow" varchar,
      "hero_title" varchar,
      "hero_subtitle" varchar,
      "footer_note" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    DO $$ BEGIN
      ALTER TABLE "microsite_settings"
        ADD CONSTRAINT "microsite_settings_microsite_id_microsites_id_fk"
        FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "microsite_settings_microsite_idx" ON "microsite_settings" USING btree ("microsite_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "microsite_settings_microsite_id_unique" ON "microsite_settings" USING btree ("microsite_id");

    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "microsite_id" integer;
    CREATE INDEX IF NOT EXISTS "search_microsite_idx" ON "search" USING btree ("microsite_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "search_microsite_idx";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "microsite_id";

    DROP TABLE IF EXISTS "microsite_settings" CASCADE;

    DROP INDEX IF EXISTS "redirects_microsite_idx";
    ALTER TABLE "redirects" DROP CONSTRAINT IF EXISTS "redirects_microsite_id_microsites_id_fk";
    ALTER TABLE "redirects" DROP COLUMN IF EXISTS "microsite_id";
  `)
}
