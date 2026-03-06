import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddSubmedioPagoToPagosCaja20260306113000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('pagos_caja');
    if (!table) return;

    if (!table.findColumnByName('submedio_pago')) {
      await queryRunner.addColumn(
        'pagos_caja',
        new TableColumn({
          name: 'submedio_pago',
          type: 'enum',
          enum: ['qr_modo', 'qr_mercadopago'],
          isNullable: true,
        }),
      );
    }

    const refreshed = await queryRunner.getTable('pagos_caja');
    const hasIndex = refreshed?.indices?.some((idx) => idx.name === 'IDX_pagos_caja_submedio_pago');
    if (!hasIndex) {
      await queryRunner.createIndex(
        'pagos_caja',
        new TableIndex({
          name: 'IDX_pagos_caja_submedio_pago',
          columnNames: ['submedio_pago'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('pagos_caja');
    if (!table) return;

    const hasIndex = table.indices?.some((idx) => idx.name === 'IDX_pagos_caja_submedio_pago');
    if (hasIndex) {
      await queryRunner.dropIndex('pagos_caja', 'IDX_pagos_caja_submedio_pago');
    }

    if (table.findColumnByName('submedio_pago')) {
      await queryRunner.dropColumn('pagos_caja', 'submedio_pago');
    }
  }
}
