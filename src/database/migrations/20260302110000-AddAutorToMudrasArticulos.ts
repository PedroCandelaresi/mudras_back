import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAutorToMudrasArticulos20260302110000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('mudras_articulos');
    if (table && !table.findColumnByName('Autor')) {
      await queryRunner.addColumn(
        'mudras_articulos',
        new TableColumn({
          name: 'Autor',
          type: 'varchar',
          length: '150',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('mudras_articulos');
    if (table && table.findColumnByName('Autor')) {
      await queryRunner.dropColumn('mudras_articulos', 'Autor');
    }
  }
}
