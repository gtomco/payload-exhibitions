import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Align search.microsite column name with Payload field config (number field, not microsite_id). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "microsite" integer;
    UPDATE "search" SET "microsite" = "microsite_id" WHERE "microsite" IS NULL AND "microsite_id" IS NOT NULL;
    DROP INDEX IF EXISTS "search_microsite_idx";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "microsite_id";
    CREATE INDEX IF NOT EXISTS "search_microsite_idx" ON "search" USING btree ("microsite");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "microsite_id" integer;
    UPDATE "search" SET "microsite_id" = "microsite" WHERE "microsite_id" IS NULL AND "microsite" IS NOT NULL;
    DROP INDEX IF EXISTS "search_microsite_idx";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "microsite";
    CREATE INDEX IF NOT EXISTS "search_microsite_idx" ON "search" USING btree ("microsite_id");
  `)
}
