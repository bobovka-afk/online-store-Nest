import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745497650357 implements MigrationInterface {
    name = 'Migration1745497650357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promo_code" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "discountPercent" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a456233366901b110f09fe478e9" UNIQUE ("code"), CONSTRAINT "PK_ded0af550884c7ab3e345e76d73" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "promo_code"`);
    }

}
