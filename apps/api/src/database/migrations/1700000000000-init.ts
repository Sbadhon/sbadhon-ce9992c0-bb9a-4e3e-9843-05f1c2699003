import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1700000001000 implements MigrationInterface {
  name = 'init1700000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_created";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_action";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_log" CASCADE;`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_category";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_owner";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks" CASCADE;`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);

    // users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" text UNIQUE NOT NULL,
        "passwordHash" text NOT NULL,
        "orgId" uuid NOT NULL,
        "role" text NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_org" ON "users"("orgId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");`);

    // tasks
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orgId" uuid NOT NULL,
        "createdByUserId" uuid NOT NULL,
        "title" text NOT NULL,
        "description" text NULL,
        "status" text NOT NULL DEFAULT 'TODO',
        "category" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tasks_org"      ON "tasks"("orgId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tasks_owner"    ON "tasks"("createdByUserId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tasks_status"   ON "tasks"("status");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tasks_category" ON "tasks"("category");`);

    // audit_log
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_log" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orgId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "action" text NOT NULL,
        "meta" jsonb NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_org"     ON "audit_log"("orgId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_user"    ON "audit_log"("userId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_action"  ON "audit_log"("action");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_created" ON "audit_log"("createdAt");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_created";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_action";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_log";`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_category";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_owner";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tasks_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_org";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
