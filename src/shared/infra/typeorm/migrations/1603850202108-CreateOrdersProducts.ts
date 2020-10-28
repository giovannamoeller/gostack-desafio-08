import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrdersProducts1603850202108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'orders_products',
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "order_id",
                    type: "uuid"
                },
                {
                    name: "product_id",
                    type: "uuid"
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
            ],
        }));

        await queryRunner.createForeignKey('orders_products', new TableForeignKey({
            name: 'OrderId',
            columnNames: ['order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }));

        await queryRunner.createForeignKey('orders_products', new TableForeignKey({
            name: 'ProductId',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders_products');
        await queryRunner.dropForeignKey('orders_products', 'OrderId');
        await queryRunner.dropForeignKey('orders_products', 'ProductId');
    }

}
