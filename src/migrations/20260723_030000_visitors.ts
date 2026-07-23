import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_visitors_status" AS ENUM('registered', 'checked_in', 'cancelled');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "visitors" (
      "id" serial PRIMARY KEY NOT NULL,
      "microsite_id" integer,
      "crm_event_id" varchar,
      "crm_event_name" varchar,
      "first_name" varchar NOT NULL,
      "last_name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "phone" varchar,
      "company" varchar,
      "job_title" varchar,
      "country" varchar,
      "ticket_token" varchar NOT NULL,
      "status" "enum_visitors_status" DEFAULT 'registered' NOT NULL,
      "checked_in_at" timestamp(3) with time zone,
      "checked_in_by" varchar,
      "event_title" varchar,
      "event_dates" varchar,
      "event_location" varchar,
      "email_sent_at" timestamp(3) with time zone,
      "email_error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "visitors"
        ADD CONSTRAINT "visitors_microsite_id_microsites_id_fk"
        FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "visitors_ticket_token_idx" ON "visitors" USING btree ("ticket_token");
    CREATE INDEX IF NOT EXISTS "visitors_microsite_idx" ON "visitors" USING btree ("microsite_id");
    CREATE INDEX IF NOT EXISTS "visitors_email_idx" ON "visitors" USING btree ("email");
    CREATE INDEX IF NOT EXISTS "visitors_crm_event_id_idx" ON "visitors" USING btree ("crm_event_id");
    CREATE INDEX IF NOT EXISTS "visitors_updated_at_idx" ON "visitors" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "visitors_created_at_idx" ON "visitors" USING btree ("created_at");

    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "microsite_settings" ADD COLUMN IF NOT EXISTS "check_in_pin" varchar;

    DO $$ BEGIN
      ALTER TABLE "microsite_settings"
        ADD CONSTRAINT "microsite_settings_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "microsite_settings_logo_idx"
      ON "microsite_settings" USING btree ("logo_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "visitors_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_visitors_fk"
        FOREIGN KEY ("visitors_id") REFERENCES "public"."visitors"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_visitors_id_idx"
      ON "payload_locked_documents_rels" USING btree ("visitors_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_visitors_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_visitors_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "visitors_id";

    DROP INDEX IF EXISTS "microsite_settings_logo_idx";
    ALTER TABLE "microsite_settings" DROP CONSTRAINT IF EXISTS "microsite_settings_logo_id_media_id_fk";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "logo_id";
    ALTER TABLE "microsite_settings" DROP COLUMN IF EXISTS "check_in_pin";

    DROP TABLE IF EXISTS "visitors" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_visitors_status";
  `)
}
