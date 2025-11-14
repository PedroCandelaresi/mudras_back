"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeUserIdsMysql20251014103000 = void 0;
class NormalizeUserIdsMysql20251014103000 {
    constructor() {
        this.name = 'NormalizeUserIdsMysql20251014103000';
    }
    async up(queryRunner) {
        const hasFk = async (table, constraint) => {
            const rows = await queryRunner.query(`SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
         WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = ? AND TABLE_NAME = ?`, [constraint, table]);
            return rows.length > 0;
        };
        const ventasFk = 'FK_ventas_caja_usuario';
        if (!(await hasFk('ventas_caja', ventasFk))) {
            await queryRunner.query(`ALTER TABLE ventas_caja MODIFY COLUMN usuario_id INT NOT NULL`);
            await queryRunner.query(`ALTER TABLE ventas_caja 
        ADD CONSTRAINT ${ventasFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`);
        }
        const movInvFk = 'FK_movimientos_inventario_usuario';
        if (!(await hasFk('movimientos_inventario', movInvFk))) {
            await queryRunner.query(`ALTER TABLE movimientos_inventario MODIFY COLUMN usuario_id INT NOT NULL`);
            await queryRunner.query(`ALTER TABLE movimientos_inventario 
        ADD CONSTRAINT ${movInvFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id)`);
        }
        const colInfo = await queryRunner.query(`SELECT DATA_TYPE, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'movimientos_stock_puntos' AND COLUMN_NAME = 'usuario_id'`);
        if (colInfo.length > 0) {
            const dataType = (colInfo[0].DATA_TYPE || '').toLowerCase();
            if (dataType === 'char' || dataType === 'varchar') {
                const fks = await queryRunner.query(`SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'movimientos_stock_puntos' 
             AND COLUMN_NAME = 'usuario_id' AND REFERENCED_TABLE_NAME IS NOT NULL`);
                for (const row of fks) {
                    await queryRunner.query(`ALTER TABLE movimientos_stock_puntos DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``);
                }
                await queryRunner.query(`ALTER TABLE movimientos_stock_puntos MODIFY COLUMN usuario_id INT NULL`);
            }
        }
        const movStockFk = 'FK_movimientos_stock_puntos_usuario';
        if (!(await hasFk('movimientos_stock_puntos', movStockFk))) {
            await queryRunner.query(`ALTER TABLE movimientos_stock_puntos 
        ADD CONSTRAINT ${movStockFk} FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL`);
        }
    }
    async down(queryRunner) {
        const dropIfExists = async (table, constraint) => {
            const rows = await queryRunner.query(`SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
         WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = ? AND TABLE_NAME = ?`, [constraint, table]);
            if (rows.length > 0) {
                await queryRunner.query(`ALTER TABLE ${table} DROP FOREIGN KEY \`${constraint}\``);
            }
        };
        await dropIfExists('ventas_caja', 'FK_ventas_caja_usuario');
        await dropIfExists('movimientos_inventario', 'FK_movimientos_inventario_usuario');
        await dropIfExists('movimientos_stock_puntos', 'FK_movimientos_stock_puntos_usuario');
    }
}
exports.NormalizeUserIdsMysql20251014103000 = NormalizeUserIdsMysql20251014103000;
//# sourceMappingURL=20251014103000-NormalizeUserIdsMysql.js.map