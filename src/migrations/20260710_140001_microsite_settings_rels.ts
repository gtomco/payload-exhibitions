import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Payload locked-documents rel column required when microsite-settings collection is registered. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "microsite_settings_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_microsite_settings_fk"
        FOREIGN KEY ("microsite_settings_id") REFERENCES "public"."microsite_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_microsite_settings_id_idx"
      ON "payload_locked_documents_rels" USING btree ("microsite_settings_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_microsite_settings_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_microsite_settings_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "microsite_settings_id";
  `)
}
