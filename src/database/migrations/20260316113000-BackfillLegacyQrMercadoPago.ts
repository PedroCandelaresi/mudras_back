import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillLegacyQrMercadoPago20260316113000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('pagos_caja');
    if (!table?.findColumnByName('submedio_pago')) return;

    await queryRunner.query(`
      UPDATE pagos_caja
      SET submedio_pago = 'qr_mercadopago'
      WHERE metodo_pago = 'qr'
        AND submedio_pago IS NULL
    `);
  }

  public async down(): Promise<void> {
    // Backfill de datos irreversible: no se revierte para no perder correcciones manuales.
  }
}
