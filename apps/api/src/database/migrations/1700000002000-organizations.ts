import { MigrationInterface, QueryRunner } from 'typeorm';

export class organizations1700000002000 implements MigrationInterface {
  name = 'organizations1700000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "organizations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "parentId" uuid NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_organizations_name" UNIQUE ("name"),
        CONSTRAINT "fk_organizations_parent" FOREIGN KEY ("parentId") REFERENCES "organizations" ("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_org_parent" ON "organizations"("parentId");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_org_name" ON "organizations"("name");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_org_name";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_org_parent";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "organizations";`);
  }
}
