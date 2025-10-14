import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Normaliza referencias de usuarios a IDs numéricos en MySQL.
 * - Agrega FK ventas_caja.usuario_id -> usuarios(id)
 * - Agrega FK movimientos_inventario.usuario_id -> usuarios(id)
 * - Convierte movimientos_stock_puntos.usuario_id a INT y crea FK a usuarios(id)
 */
export class NormalizeUserIdsMysql20251014103000 implements MigrationInterface {
  name = 'NormalizeUserIdsMysql20251014103000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper para detectar existencia de constraint
    const hasFk = async (table: string, constraint: string): Promise<boolean> => {
      const rows: Array<{ CONSTRAINT_NAME: string }> = await queryRunner.query(
        `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
         WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = ? AND TABLE_NAME = ?`,
        [constraint, table]
      );
      return rows.length > 0;
    };

    // ventas_caja.usuario_id -> usuarios(id)
    const ventasFk = 'FK_ventas_caja_usuario';
    if (!(await hasFk('ventas_caja', ventasFk))) {
      // Asegurar tipo INT
      await queryRunner.query(`ALTER TABLE ventas_caja MODIFY COLUMN usuario_id INT NOT NULL`);
      // Crear FK
      await queryRunner.query(`ALTER TABLE ventas_caja 
        ADD CONSTRAINT ${ventasFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`);
    }

    // movimientos_inventario.usuario_id -> usuarios(id)
    const movInvFk = 'FK_movimientos_inventario_usuario';
    if (!(await hasFk('movimientos_inventario', movInvFk))) {
      await queryRunner.query(`ALTER TABLE movimientos_inventario MODIFY COLUMN usuario_id INT NOT NULL`);
      await queryRunner.query(`ALTER TABLE movimientos_inventario 
        ADD CONSTRAINT ${movInvFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`);
    }

    // movimientos_stock_puntos.usuario_id de CHAR(36) -> INT NULL y FK a usuarios(id)
    const colInfo: Array<{ DATA_TYPE: string; COLUMN_TYPE: string }> = await queryRunner.query(
      `SELECT DATA_TYPE, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'movimientos_stock_puntos' AND COLUMN_NAME = 'usuario_id'`
    );
    if (colInfo.length > 0) {
      const dataType = (colInfo[0].DATA_TYPE || '').toLowerCase();
      if (dataType === 'char' || dataType === 'varchar') {
        // Eliminar FKs existentes sobre la columna
        const fks: Array<{ CONSTRAINT_NAME: string }> = await queryRunner.query(
          `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'movimientos_stock_puntos' 
             AND COLUMN_NAME = 'usuario_id' AND REFERENCED_TABLE_NAME IS NOT NULL`
        );
        for (const row of fks) {
          await queryRunner.query(`ALTER TABLE movimientos_stock_puntos DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``);
        }
        // Cambiar tipo a INT NULL
        await queryRunner.query(`ALTER TABLE movimientos_stock_puntos MODIFY COLUMN usuario_id INT NULL`);
      }
    }
    const movStockFk = 'FK_movimientos_stock_puntos_usuario';
    if (!(await hasFk('movimientos_stock_puntos', movStockFk))) {
      await queryRunner.query(`ALTER TABLE movimientos_stock_puntos 
        ADD CONSTRAINT ${movStockFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Quitar FKs agregados (no revertimos tipos a char por seguridad)
    const dropIfExists = async (table: string, constraint: string) => {
      const rows: Array<{ CONSTRAINT_NAME: string }> = await queryRunner.query(
        `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
         WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = ? AND TABLE_NAME = ?`,
        [constraint, table]
      );
      if (rows.length > 0) {
        await queryRunner.query(`ALTER TABLE ${table} DROP FOREIGN KEY \`${constraint}\``);
      }
    };
    await dropIfExists('ventas_caja', 'FK_ventas_caja_usuario');
    await dropIfExists('movimientos_inventario', 'FK_movimientos_inventario_usuario');
    await dropIfExists('movimientos_stock_puntos', 'FK_movimientos_stock_puntos_usuario');
  }
}

