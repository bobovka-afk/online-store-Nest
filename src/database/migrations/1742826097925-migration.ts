import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742826097925 implements MigrationInterface {
    name = 'Migration1742826097925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_3d78977f2f60b4f7a1d833e4181"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_c642709e6ad4582ed11aca458f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d78977f2f60b4f7a1d833e418"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c642709e6ad4582ed11aca458f"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price_at_order_time" numeric(10,2) NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" double precision NOT NULL, "stockQuantity" integer NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "cartId" integer, "product_id" integer, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_bc0bce5de12ebedb70ddcb3bb34"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_c642709e6ad4582ed11aca458f9" PRIMARY KEY ("categoriesId")`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "productsId"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_c642709e6ad4582ed11aca458f9"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "categoriesId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetToken" character varying`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "productId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_6156a79599e274ee9d83b1de139" PRIMARY KEY ("productId")`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_e65c1adebf00d61f1c84a4f3950" PRIMARY KEY ("productId", "categoryId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6156a79599e274ee9d83b1de13" ON "product_categories" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdef3adba0c284fd103d0fd369" ON "product_categories" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdef3adba0c284fd103d0fd369"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6156a79599e274ee9d83b1de13"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_e65c1adebf00d61f1c84a4f3950"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_6156a79599e274ee9d83b1de139" PRIMARY KEY ("productId")`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetToken"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "categoriesId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_c642709e6ad4582ed11aca458f9" PRIMARY KEY ("categoriesId")`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "productsId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "PK_c642709e6ad4582ed11aca458f9"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "PK_bc0bce5de12ebedb70ddcb3bb34" PRIMARY KEY ("productsId", "categoriesId")`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`CREATE INDEX "IDX_c642709e6ad4582ed11aca458f" ON "product_categories" ("categoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d78977f2f60b4f7a1d833e418" ON "product_categories" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_c642709e6ad4582ed11aca458f9" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_3d78977f2f60b4f7a1d833e4181" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
