import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741776002736 implements MigrationInterface {
    name = 'Migration1741776002736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6156a79599e274ee9d83b1de13"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "productId" TO "productsId"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME CONSTRAINT "PK_1660e399bbcab2fd34fbb1583d8" TO "PK_bc0bce5de12ebedb70ddcb3bb34"`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d78977f2f60b4f7a1d833e418" ON "product_categories" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_3d78977f2f60b4f7a1d833e4181" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_3d78977f2f60b4f7a1d833e4181"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d78977f2f60b4f7a1d833e418"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME CONSTRAINT "PK_bc0bce5de12ebedb70ddcb3bb34" TO "PK_1660e399bbcab2fd34fbb1583d8"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "productsId" TO "productId"`);
        await queryRunner.query(`CREATE INDEX "IDX_6156a79599e274ee9d83b1de13" ON "product_categories" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
