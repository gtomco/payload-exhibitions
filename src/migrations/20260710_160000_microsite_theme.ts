import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_primary" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_secondary" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_dark" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_font" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_home_bg_start" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_home_bg_mid" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_home_bg_end" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_header_bg" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_calendar_bg_start" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_calendar_bg_mid" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_calendar_bg_end" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_calendar_glow_primary_color" varchar;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "theme_calendar_glow_secondary_color" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_primary";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_secondary";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_dark";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_font";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_home_bg_start";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_home_bg_mid";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_home_bg_end";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_header_bg";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_calendar_bg_start";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_calendar_bg_mid";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_calendar_bg_end";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_calendar_glow_primary_color";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "theme_calendar_glow_secondary_color";
  `)
}
