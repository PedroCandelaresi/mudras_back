"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImagenUrlToTbarticulos20260107120000 = void 0;
const typeorm_1 = require("typeorm");
class AddImagenUrlToTbarticulos20260107120000 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('tbarticulos');
        if (table && !table.findColumnByName('ImagenUrl')) {
            await queryRunner.addColumn('tbarticulos', new typeorm_1.TableColumn({
                name: 'ImagenUrl',
                type: 'varchar',
                length: '512',
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('tbarticulos');
        if (table && table.findColumnByName('ImagenUrl')) {
            await queryRunner.dropColumn('tbarticulos', 'ImagenUrl');
        }
    }
}
exports.AddImagenUrlToTbarticulos20260107120000 = AddImagenUrlToTbarticulos20260107120000;
//# sourceMappingURL=20260107120000-AddImagenUrlToTbarticulos.js.map