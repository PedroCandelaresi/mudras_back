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
const user_entity_1 = require("../../users-auth/entities/user.entity");
const punto_mudras_entity_1 = require("../../puntos-mudras/entities/punto-mudras.entity");
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
    (0, typeorm_1.Column)({ name: 'articulo_id' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articulo_id' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], MovimientoInventario.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'punto_mudras_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => punto_mudras_entity_1.PuntoMudras, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'punto_mudras_id' }),
    (0, graphql_1.Field)(() => punto_mudras_entity_1.PuntoMudras, { nullable: true }),
    __metadata("design:type", punto_mudras_entity_1.PuntoMudras)
], MovimientoInventario.prototype, "puntoMudras", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tipo_movimiento',
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
    (0, typeorm_1.Column)({ name: 'precio_venta', type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_comprobante', length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venta_caja_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "ventaCajaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_caja_entity_1.VentaCaja, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'venta_caja_id' }),
    (0, graphql_1.Field)(() => venta_caja_entity_1.VentaCaja, { nullable: true }),
    __metadata("design:type", venta_caja_entity_1.VentaCaja)
], MovimientoInventario.prototype, "ventaCaja", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha', type: 'datetime' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuarioAuthId', type: 'char', length: 36 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "usuarioAuthId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserAuth),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioAuthId' }),
    __metadata("design:type", user_entity_1.UserAuth)
], MovimientoInventario.prototype, "usuarioAuth", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "creadoEn", void 0);
exports.MovimientoInventario = MovimientoInventario = __decorate([
    (0, typeorm_1.Entity)('movimientos_inventario'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['articuloId']),
    (0, typeorm_1.Index)(['tipoMovimiento']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['usuarioAuthId']),
    (0, typeorm_1.Index)(['ventaCajaId'])
], MovimientoInventario);
//# sourceMappingURL=movimiento-inventario.entity.js.map