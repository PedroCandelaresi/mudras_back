import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEstanteriaEstanteColumns1609459200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas a mudras_articulos
    const tableArticulos = await queryRunner.hasColumn('mudras_articulos', 'Estanteria');
    if (!tableArticulos) {
      await queryRunner.addColumn(
        'mudras_articulos',
        new TableColumn({
          name: 'Estanteria',
          type: 'varchar',
          length: '50',
          isNullable: true,
        })
      );
    }

    const tableArticulosEstante = await queryRunner.hasColumn('mudras_articulos', 'Estante');
    if (!tableArticulosEstante) {
      await queryRunner.addColumn(
        'mudras_articulos',
        new TableColumn({
          name: 'Estante',
          type: 'varchar',
          length: '50',
          isNullable: true,
        })
      );
    }

    // Agregar columnas a stock_puntos_mudras
    const tableStock = await queryRunner.hasColumn('stock_puntos_mudras', 'estanteria');
    if (!tableStock) {
      await queryRunner.addColumn(
        'stock_puntos_mudras',
        new TableColumn({
          name: 'estanteria',
          type: 'varchar',
          length: '50',
          isNullable: true,
        })
      );
    }

    const tableStockEstante = await queryRunner.hasColumn('stock_puntos_mudras', 'estante');
    if (!tableStockEstante) {
      await queryRunner.addColumn(
        'stock_puntos_mudras',
        new TableColumn({
          name: 'estante',
          type: 'varchar',
          length: '50',
          isNullable: true,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios en mudras_articulos
    const tableArticulos = await queryRunner.hasColumn('mudras_articulos', 'Estanteria');
    if (tableArticulos) {
      await queryRunner.dropColumn('mudras_articulos', 'Estanteria');
    }

    const tableArticulosEstante = await queryRunner.hasColumn('mudras_articulos', 'Estante');
    if (tableArticulosEstante) {
      await queryRunner.dropColumn('mudras_articulos', 'Estante');
    }

    // Revertir cambios en stock_puntos_mudras
    const tableStock = await queryRunner.hasColumn('stock_puntos_mudras', 'estanteria');
    if (tableStock) {
      await queryRunner.dropColumn('stock_puntos_mudras', 'estanteria');
    }

    const tableStockEstante = await queryRunner.hasColumn('stock_puntos_mudras', 'estante');
    if (tableStockEstante) {
      await queryRunner.dropColumn('stock_puntos_mudras', 'estante');
    }
  }
}
