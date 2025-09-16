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
exports.MovimientoInventario = exports.TipoMovimientoInventario = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const puesto_venta_entity_1 = require("./puesto-venta.entity");
const venta_caja_entity_1 = require("./venta-caja.entity");
var TipoMovimientoInventario;
(function (TipoMovimientoInventario) {
    TipoMovimientoInventario["VENTA"] = "venta";
    TipoMovimientoInventario["DEVOLUCION"] = "devolucion";
    TipoMovimientoInventario["AJUSTE_POSITIVO"] = "ajuste_positivo";
    TipoMovimientoInventario["AJUSTE_NEGATIVO"] = "ajuste_negativo";
    TipoMovimientoInventario["TRANSFERENCIA_ENTRADA"] = "transferencia_entrada";
    TipoMovimientoInventario["TRANSFERENCIA_SALIDA"] = "transferencia_salida";
    TipoMovimientoInventario["COMPRA"] = "compra";
    TipoMovimientoInventario["ROTURA"] = "rotura";
    TipoMovimientoInventario["VENCIMIENTO"] = "vencimiento";
    TipoMovimientoInventario["INVENTARIO_INICIAL"] = "inventario_inicial";
})(TipoMovimientoInventario || (exports.TipoMovimientoInventario = TipoMovimientoInventario = {}));
(0, graphql_1.registerEnumType)(TipoMovimientoInventario, {
    name: 'TipoMovimientoInventario',
    description: 'Tipos de movimientos de inventario para caja registradora',
});
let MovimientoInventario = class MovimientoInventario {
};
exports.MovimientoInventario = MovimientoInventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articuloId' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], MovimientoInventario.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "puestoVentaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => puesto_venta_entity_1.PuestoVenta, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'puestoVentaId' }),
    (0, graphql_1.Field)(() => puesto_venta_entity_1.PuestoVenta, { nullable: true }),
    __metadata("design:type", puesto_venta_entity_1.PuestoVenta)
], MovimientoInventario.prototype, "puestoVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimientoInventario,
    }),
    (0, graphql_1.Field)(() => TipoMovimientoInventario),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "stockAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "stockNuevo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "costoUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "ventaCajaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_caja_entity_1.VentaCaja, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ventaCajaId' }),
    (0, graphql_1.Field)(() => venta_caja_entity_1.VentaCaja, { nullable: true }),
    __metadata("design:type", venta_caja_entity_1.VentaCaja)
], MovimientoInventario.prototype, "ventaCaja", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], MovimientoInventario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "creadoEn", void 0);
exports.MovimientoInventario = MovimientoInventario = __decorate([
    (0, typeorm_1.Entity)('movimientos_inventario'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['articuloId']),
    (0, typeorm_1.Index)(['puestoVentaId']),
    (0, typeorm_1.Index)(['tipoMovimiento']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['usuarioId']),
    (0, typeorm_1.Index)(['ventaCajaId'])
], MovimientoInventario);
//# sourceMappingURL=movimiento-inventario.entity.js.map