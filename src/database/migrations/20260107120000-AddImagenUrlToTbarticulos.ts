import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImagenUrlToTbarticulos20260107120000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('tbarticulos');
        if (table && !table.findColumnByName('ImagenUrl')) {
            await queryRunner.addColumn(
                'tbarticulos',
                new TableColumn({
                    name: 'ImagenUrl',
                    type: 'varchar',
                    length: '512',
                    isNullable: true,
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('tbarticulos');
        if (table && table.findColumnByName('ImagenUrl')) {
            await queryRunner.dropColumn('tbarticulos', 'ImagenUrl');
        }
    }
}
