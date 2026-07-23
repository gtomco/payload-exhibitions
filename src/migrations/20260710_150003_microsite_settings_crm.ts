import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "crm_event_id" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "crm_event_id";
  `)
}
