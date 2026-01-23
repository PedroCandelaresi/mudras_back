"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMudrasProveedoresRubros20260119173000 = void 0;
const typeorm_1 = require("typeorm");
class CreateMudrasProveedoresRubros20260119173000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'mudras_proveedores_rubros',
            columns: [
                {
                    name: 'proveedorId',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'rubroId',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'porcentajeRecargo',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    default: 0,
                    isNullable: true,
                },
                {
                    name: 'porcentajeDescuento',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    default: 0,
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createForeignKey('mudras_proveedores_rubros', new typeorm_1.TableForeignKey({
            columnNames: ['proveedorId'],
            referencedColumnNames: ['IdProveedor'],
            referencedTableName: 'mudras_proveedores',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('mudras_proveedores_rubros', new typeorm_1.TableForeignKey({
            columnNames: ['rubroId'],
            referencedColumnNames: ['Id'],
            referencedTableName: 'mudras_rubros',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('mudras_proveedores_rubros');
        if (table) {
            const foreignKeyProveedor = table.foreignKeys.find((fk) => fk.columnNames.indexOf('proveedorId') !== -1);
            if (foreignKeyProveedor) {
                await queryRunner.dropForeignKey('mudras_proveedores_rubros', foreignKeyProveedor);
            }
            const foreignKeyRubro = table.foreignKeys.find((fk) => fk.columnNames.indexOf('rubroId') !== -1);
            if (foreignKeyRubro) {
                await queryRunner.dropForeignKey('mudras_proveedores_rubros', foreignKeyRubro);
            }
            await queryRunner.dropTable('mudras_proveedores_rubros');
        }
    }
}
exports.CreateMudrasProveedoresRubros20260119173000 = CreateMudrasProveedoresRubros20260119173000;
//# sourceMappingURL=20260119173000-CreateMudrasProveedoresRubros.js.map