"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEstanteriaEstanteColumns1609459200000 = void 0;
const typeorm_1 = require("typeorm");
class AddEstanteriaEstanteColumns1609459200000 {
    async up(queryRunner) {
        const tableArticulos = await queryRunner.hasColumn('mudras_articulos', 'Estanteria');
        if (!tableArticulos) {
            await queryRunner.addColumn('mudras_articulos', new typeorm_1.TableColumn({
                name: 'Estanteria',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }));
        }
        const tableArticulosEstante = await queryRunner.hasColumn('mudras_articulos', 'Estante');
        if (!tableArticulosEstante) {
            await queryRunner.addColumn('mudras_articulos', new typeorm_1.TableColumn({
                name: 'Estante',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }));
        }
        const tableStock = await queryRunner.hasColumn('stock_puntos_mudras', 'estanteria');
        if (!tableStock) {
            await queryRunner.addColumn('stock_puntos_mudras', new typeorm_1.TableColumn({
                name: 'estanteria',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }));
        }
        const tableStockEstante = await queryRunner.hasColumn('stock_puntos_mudras', 'estante');
        if (!tableStockEstante) {
            await queryRunner.addColumn('stock_puntos_mudras', new typeorm_1.TableColumn({
                name: 'estante',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const tableArticulos = await queryRunner.hasColumn('mudras_articulos', 'Estanteria');
        if (tableArticulos) {
            await queryRunner.dropColumn('mudras_articulos', 'Estanteria');
        }
        const tableArticulosEstante = await queryRunner.hasColumn('mudras_articulos', 'Estante');
        if (tableArticulosEstante) {
            await queryRunner.dropColumn('mudras_articulos', 'Estante');
        }
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
exports.AddEstanteriaEstanteColumns1609459200000 = AddEstanteriaEstanteColumns1609459200000;
//# sourceMappingURL=1609459200000-AddEstanteriaEstanteColumns.js.map