import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_banner" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "style" "enum_pages_blocks_banner_style" DEFAULT 'info',
      "content" jsonb,
      "block_name" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_banner"
        ADD CONSTRAINT "pages_blocks_banner_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_blocks_banner_order_idx"
      ON "pages_blocks_banner" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_banner_parent_id_idx"
      ON "pages_blocks_banner" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_banner_path_idx"
      ON "pages_blocks_banner" USING btree ("_path");

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_banner" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "style" "enum__pages_v_blocks_banner_style" DEFAULT 'info',
      "content" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_banner"
        ADD CONSTRAINT "_pages_v_blocks_banner_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_order_idx"
      ON "_pages_v_blocks_banner" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_parent_id_idx"
      ON "_pages_v_blocks_banner" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_banner_path_idx"
      ON "_pages_v_blocks_banner" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_banner" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_banner" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_banner_style";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_banner_style";
  `)
}
