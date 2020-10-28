import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProducts1603850122652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'products',
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "name",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                },
                {
                    name: "quantity",
                    type: "bigint",
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }, 
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('products');
    }

}
