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
exports.MovimientoStock = exports.ConceptoMovimientoStock = exports.TipoMovimientoStock = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var TipoMovimientoStock;
(function (TipoMovimientoStock) {
    TipoMovimientoStock["ENTRADA"] = "entrada";
    TipoMovimientoStock["SALIDA"] = "salida";
    TipoMovimientoStock["AJUSTE_POSITIVO"] = "ajuste_positivo";
    TipoMovimientoStock["AJUSTE_NEGATIVO"] = "ajuste_negativo";
    TipoMovimientoStock["TRANSFERENCIA_ENTRADA"] = "transferencia_entrada";
    TipoMovimientoStock["TRANSFERENCIA_SALIDA"] = "transferencia_salida";
})(TipoMovimientoStock || (exports.TipoMovimientoStock = TipoMovimientoStock = {}));
(0, graphql_1.registerEnumType)(TipoMovimientoStock, {
    name: 'TipoMovimientoStock',
    description: 'Tipos de movimientos de stock',
});
var ConceptoMovimientoStock;
(function (ConceptoMovimientoStock) {
    ConceptoMovimientoStock["COMPRA"] = "compra";
    ConceptoMovimientoStock["VENTA"] = "venta";
    ConceptoMovimientoStock["DEVOLUCION_CLIENTE"] = "devolucion_cliente";
    ConceptoMovimientoStock["DEVOLUCION_PROVEEDOR"] = "devolucion_proveedor";
    ConceptoMovimientoStock["AJUSTE_INVENTARIO"] = "ajuste_inventario";
    ConceptoMovimientoStock["ROTURA"] = "rotura";
    ConceptoMovimientoStock["VENCIMIENTO"] = "vencimiento";
    ConceptoMovimientoStock["TRANSFERENCIA"] = "transferencia";
    ConceptoMovimientoStock["PRODUCCION"] = "produccion";
})(ConceptoMovimientoStock || (exports.ConceptoMovimientoStock = ConceptoMovimientoStock = {}));
(0, graphql_1.registerEnumType)(ConceptoMovimientoStock, {
    name: 'ConceptoMovimientoStock',
    description: 'Conceptos de movimientos de stock',
});
let MovimientoStock = class MovimientoStock {
};
exports.MovimientoStock = MovimientoStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo, articulo => articulo.movimientosStock),
    (0, typeorm_1.JoinColumn)({ name: 'articuloId' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], MovimientoStock.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimientoStock,
    }),
    (0, graphql_1.Field)(() => TipoMovimientoStock),
    __metadata("design:type", String)
], MovimientoStock.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConceptoMovimientoStock,
    }),
    (0, graphql_1.Field)(() => ConceptoMovimientoStock),
    __metadata("design:type", String)
], MovimientoStock.prototype, "concepto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "stockAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "stockNuevo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "costoUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "costoTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoStock.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoStock.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoStock.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoStock.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], MovimientoStock.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoStock.prototype, "creadoEn", void 0);
exports.MovimientoStock = MovimientoStock = __decorate([
    (0, typeorm_1.Entity)('movimientos_stock'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['articuloId']),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['concepto']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['usuarioId'])
], MovimientoStock);
//# sourceMappingURL=movimiento-stock.entity.js.map