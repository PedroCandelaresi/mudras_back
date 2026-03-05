import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDeleteToMudrasArticulos20260305103000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('mudras_articulos');
    if (!table) return;

    if (!table.findColumnByName('Activo')) {
      await queryRunner.addColumn(
        'mudras_articulos',
        new TableColumn({
          name: 'Activo',
          type: 'tinyint',
          default: '1',
          isNullable: false,
        }),
      );
    }

    if (!table.findColumnByName('FechaBaja')) {
      await queryRunner.addColumn(
        'mudras_articulos',
        new TableColumn({
          name: 'FechaBaja',
          type: 'datetime',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('mudras_articulos');
    if (!table) return;

    if (table.findColumnByName('FechaBaja')) {
      await queryRunner.dropColumn('mudras_articulos', 'FechaBaja');
    }

    if (table.findColumnByName('Activo')) {
      await queryRunner.dropColumn('mudras_articulos', 'Activo');
    }
  }
}
