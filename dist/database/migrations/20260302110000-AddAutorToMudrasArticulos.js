"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAutorToMudrasArticulos20260302110000 = void 0;
const typeorm_1 = require("typeorm");
class AddAutorToMudrasArticulos20260302110000 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('mudras_articulos');
        if (table && !table.findColumnByName('Autor')) {
            await queryRunner.addColumn('mudras_articulos', new typeorm_1.TableColumn({
                name: 'Autor',
                type: 'varchar',
                length: '150',
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('mudras_articulos');
        if (table && table.findColumnByName('Autor')) {
            await queryRunner.dropColumn('mudras_articulos', 'Autor');
        }
    }
}
exports.AddAutorToMudrasArticulos20260302110000 = AddAutorToMudrasArticulos20260302110000;
//# sourceMappingURL=20260302110000-AddAutorToMudrasArticulos.js.map