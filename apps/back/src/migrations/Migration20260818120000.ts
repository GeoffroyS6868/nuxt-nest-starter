import { Migration } from "@mikro-orm/migrations";

export class Migration20260818120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null default gen_random_uuid(), "role" varchar(255) null, "email" varchar(255) not null, "user_name" varchar(255) not null, "password" varchar(255) null, "avatar_url" varchar(255) null, "created_at" timestamptz not null default now(), "google_id" varchar(255) null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(`create index "user_email_index" on "user" ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
