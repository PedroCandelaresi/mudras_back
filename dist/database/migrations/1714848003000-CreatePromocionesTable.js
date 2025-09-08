"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePromocionesTable1714848003000 = void 0;
const typeorm_1 = require("typeorm");
class CreatePromocionesTable1714848003000 {
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable('promociones');
        if (!hasTable) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'promociones',
                columns: [
                    { name: 'id', type: 'char', length: '36', isPrimary: true },
                    { name: 'nombre', type: 'varchar', length: '120', isNullable: false },
                    { name: 'inicio', type: 'date', isNullable: false },
                    { name: 'fin', type: 'date', isNullable: false },
                    { name: 'estado', type: 'enum', enum: ['ACTIVA', 'PROGRAMADA', 'FINALIZADA'], default: "'PROGRAMADA'" },
                    { name: 'descuento', type: 'int', default: 0 },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }));
        }
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable('promociones');
        if (hasTable) {
            await queryRunner.dropTable('promociones');
        }
    }
}
exports.CreatePromocionesTable1714848003000 = CreatePromocionesTable1714848003000;
//# sourceMappingURL=1714848003000-CreatePromocionesTable.js.map