import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "seo_title_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "seo_title_sq" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "seo_description_en" varchar;
    ALTER TABLE "main_site" ADD COLUMN IF NOT EXISTS "seo_description_sq" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "seo_title_en";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "seo_title_sq";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "seo_description_en";
    ALTER TABLE "main_site" DROP COLUMN IF EXISTS "seo_description_sq";
  `)
}
