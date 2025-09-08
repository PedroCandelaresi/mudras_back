import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePromocionesTable1714848003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('promociones');
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'promociones',
          columns: [
            { name: 'id', type: 'char', length: '36', isPrimary: true },
            { name: 'nombre', type: 'varchar', length: '120', isNullable: false },
            { name: 'inicio', type: 'date', isNullable: false },
            { name: 'fin', type: 'date', isNullable: false },
            { name: 'estado', type: 'enum', enum: ['ACTIVA','PROGRAMADA','FINALIZADA'], default: "'PROGRAMADA'" },
            { name: 'descuento', type: 'int', default: 0 },
            { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('promociones');
    if (hasTable) {
      await queryRunner.dropTable('promociones');
    }
  }
}
