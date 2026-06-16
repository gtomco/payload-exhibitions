import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_theme_default_mode" AS ENUM('light', 'dark', 'system');
  CREATE TYPE "public"."enum_theme_font_sans" AS ENUM('geist', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_theme_font_mono" AS ENUM('geist', 'sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_theme_radius" AS ENUM('none', 'small', 'medium', 'large', 'xlarge');
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"default_mode" "enum_theme_default_mode" DEFAULT 'light',
  	"font_sans" "enum_theme_font_sans" DEFAULT 'geist',
  	"font_mono" "enum_theme_font_mono" DEFAULT 'mono',
  	"radius" "enum_theme_radius" DEFAULT 'medium',
  	"sticky_header" boolean DEFAULT false,
  	"light_colors_background" varchar,
  	"light_colors_foreground" varchar,
  	"light_colors_primary" varchar,
  	"light_colors_primary_foreground" varchar,
  	"light_colors_secondary" varchar,
  	"light_colors_secondary_foreground" varchar,
  	"light_colors_accent" varchar,
  	"light_colors_accent_foreground" varchar,
  	"light_colors_muted" varchar,
  	"light_colors_muted_foreground" varchar,
  	"light_colors_card" varchar,
  	"light_colors_card_foreground" varchar,
  	"light_colors_border" varchar,
  	"dark_colors_background" varchar,
  	"dark_colors_foreground" varchar,
  	"dark_colors_primary" varchar,
  	"dark_colors_primary_foreground" varchar,
  	"dark_colors_secondary" varchar,
  	"dark_colors_secondary_foreground" varchar,
  	"dark_colors_accent" varchar,
  	"dark_colors_accent_foreground" varchar,
  	"dark_colors_muted" varchar,
  	"dark_colors_muted_foreground" varchar,
  	"dark_colors_card" varchar,
  	"dark_colors_card_foreground" varchar,
  	"dark_colors_border" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "theme" ADD CONSTRAINT "theme_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "theme" ADD CONSTRAINT "theme_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "theme_logo_idx" ON "theme" USING btree ("logo_id");
  CREATE INDEX "theme_logo_dark_idx" ON "theme" USING btree ("logo_dark_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "theme" CASCADE;
  DROP TYPE "public"."enum_theme_default_mode";
  DROP TYPE "public"."enum_theme_font_sans";
  DROP TYPE "public"."enum_theme_font_mono";
  DROP TYPE "public"."enum_theme_radius";`)
}
