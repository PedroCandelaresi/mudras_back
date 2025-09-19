"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntoMudras = exports.TipoPuntoMudras = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const stock_punto_mudras_entity_1 = require("./stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("./movimiento-stock-punto.entity");
var TipoPuntoMudras;
(function (TipoPuntoMudras) {
    TipoPuntoMudras["venta"] = "venta";
    TipoPuntoMudras["deposito"] = "deposito";
})(TipoPuntoMudras || (exports.TipoPuntoMudras = TipoPuntoMudras = {}));
(0, graphql_1.registerEnumType)(TipoPuntoMudras, {
    name: 'TipoPuntoMudras',
    description: 'Tipo de punto Mudras: venta o depósito'
});
let PuntoMudras = class PuntoMudras {
};
exports.PuntoMudras = PuntoMudras;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PuntoMudras.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => TipoPuntoMudras),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoPuntoMudras
    }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "tipo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PuntoMudras.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PuntoMudras.prototype, "activo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'permite_ventas_online' }),
    __metadata("design:type", Boolean)
], PuntoMudras.prototype, "permiteVentasOnline", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'maneja_stock_fisico' }),
    __metadata("design:type", Boolean)
], PuntoMudras.prototype, "manejaStockFisico", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'requiere_autorizacion' }),
    __metadata("design:type", Boolean)
], PuntoMudras.prototype, "requiereAutorizacion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], PuntoMudras.prototype, "fechaCreacion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'fecha_actualizacion' }),
    __metadata("design:type", Date)
], PuntoMudras.prototype, "fechaActualizacion", void 0);
__decorate([
    (0, graphql_1.Field)(() => [stock_punto_mudras_entity_1.StockPuntoMudras], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => stock_punto_mudras_entity_1.StockPuntoMudras, stock => stock.puntoMudras),
    __metadata("design:type", Array)
], PuntoMudras.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(() => [movimiento_stock_punto_entity_1.MovimientoStockPunto], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => movimiento_stock_punto_entity_1.MovimientoStockPunto, movimiento => movimiento.puntoOrigen),
    __metadata("design:type", Array)
], PuntoMudras.prototype, "movimientosOrigen", void 0);
__decorate([
    (0, graphql_1.Field)(() => [movimiento_stock_punto_entity_1.MovimientoStockPunto], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => movimiento_stock_punto_entity_1.MovimientoStockPunto, movimiento => movimiento.puntoDestino),
    __metadata("design:type", Array)
], PuntoMudras.prototype, "movimientosDestino", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PuntoMudras.prototype, "totalArticulos", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PuntoMudras.prototype, "valorInventario", void 0);
exports.PuntoMudras = PuntoMudras = __decorate([
    (0, graphql_1.ObjectType)('PuntoMudras'),
    (0, typeorm_1.Entity)('puntos_mudras')
], PuntoMudras);
//# sourceMappingURL=punto-mudras.entity.js.map