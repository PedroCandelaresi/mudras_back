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
exports.VentaCaja = exports.EstadoVentaCaja = exports.TipoVentaCaja = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const user_entity_1 = require("../../users-auth/entities/user.entity");
const punto_mudras_entity_1 = require("../../puntos-mudras/entities/punto-mudras.entity");
const detalle_venta_caja_entity_1 = require("./detalle-venta-caja.entity");
const pago_caja_entity_1 = require("./pago-caja.entity");
const comprobante_afip_entity_1 = require("./comprobante-afip.entity");
var TipoVentaCaja;
(function (TipoVentaCaja) {
    TipoVentaCaja["MOSTRADOR"] = "mostrador";
    TipoVentaCaja["ONLINE"] = "online";
    TipoVentaCaja["MAYORISTA"] = "mayorista";
    TipoVentaCaja["TELEFONICA"] = "telefonica";
    TipoVentaCaja["DELIVERY"] = "delivery";
})(TipoVentaCaja || (exports.TipoVentaCaja = TipoVentaCaja = {}));
(0, graphql_1.registerEnumType)(TipoVentaCaja, {
    name: 'TipoVentaCaja',
    description: 'Tipos de venta en caja registradora',
});
var EstadoVentaCaja;
(function (EstadoVentaCaja) {
    EstadoVentaCaja["BORRADOR"] = "borrador";
    EstadoVentaCaja["CONFIRMADA"] = "confirmada";
    EstadoVentaCaja["CANCELADA"] = "cancelada";
    EstadoVentaCaja["DEVUELTA"] = "devuelta";
    EstadoVentaCaja["DEVUELTA_PARCIAL"] = "devuelta_parcial";
})(EstadoVentaCaja || (exports.EstadoVentaCaja = EstadoVentaCaja = {}));
(0, graphql_1.registerEnumType)(EstadoVentaCaja, {
    name: 'EstadoVentaCaja',
    description: 'Estados de venta en caja',
});
let VentaCaja = class VentaCaja {
};
exports.VentaCaja = VentaCaja;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], VentaCaja.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_venta', length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], VentaCaja.prototype, "numeroVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha', type: 'datetime' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VentaCaja.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tipo_venta',
        type: 'enum',
        enum: TipoVentaCaja,
    }),
    (0, graphql_1.Field)(() => TipoVentaCaja),
    __metadata("design:type", String)
], VentaCaja.prototype, "tipoVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estado',
        type: 'enum',
        enum: EstadoVentaCaja,
        default: EstadoVentaCaja.BORRADOR,
    }),
    (0, graphql_1.Field)(() => EstadoVentaCaja),
    __metadata("design:type", String)
], VentaCaja.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'punto_mudras_id' }),
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], VentaCaja.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => punto_mudras_entity_1.PuntoMudras),
    (0, typeorm_1.JoinColumn)({ name: 'punto_mudras_id' }),
    (0, graphql_1.Field)(() => punto_mudras_entity_1.PuntoMudras),
    __metadata("design:type", punto_mudras_entity_1.PuntoMudras)
], VentaCaja.prototype, "puntoMudras", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cliente_id', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VentaCaja.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, cliente => cliente.ventas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cliente_id' }),
    (0, graphql_1.Field)(() => cliente_entity_1.Cliente, { nullable: true }),
    __metadata("design:type", cliente_entity_1.Cliente)
], VentaCaja.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_cliente', nullable: true, length: 150 }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VentaCaja.prototype, "nombreCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cuit_cliente', nullable: true, length: 15 }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VentaCaja.prototype, "cuitCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'razon_social_cliente', nullable: true, length: 150 }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VentaCaja.prototype, "razonSocialCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_cliente_snapshot', nullable: true, length: 50 }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VentaCaja.prototype, "tipoClienteSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuarioAuthId', type: 'char', length: 36 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], VentaCaja.prototype, "usuarioAuthId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserAuth),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioAuthId' }),
    (0, graphql_1.Field)(() => user_entity_1.UserAuth),
    __metadata("design:type", user_entity_1.UserAuth)
], VentaCaja.prototype, "usuarioAuth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descuento_monto', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "descuentoMonto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "impuestos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "cambio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], VentaCaja.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venta_original_id', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VentaCaja.prototype, "ventaOriginalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VentaCaja, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'venta_original_id' }),
    (0, graphql_1.Field)(() => VentaCaja, { nullable: true }),
    __metadata("design:type", VentaCaja)
], VentaCaja.prototype, "ventaOriginal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VentaCaja.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VentaCaja.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_venta_caja_entity_1.DetalleVentaCaja, detalle => detalle.venta),
    (0, graphql_1.Field)(() => [detalle_venta_caja_entity_1.DetalleVentaCaja], { nullable: true }),
    __metadata("design:type", Array)
], VentaCaja.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pago_caja_entity_1.PagoCaja, pago => pago.venta),
    (0, graphql_1.Field)(() => [pago_caja_entity_1.PagoCaja], { nullable: true }),
    __metadata("design:type", Array)
], VentaCaja.prototype, "pagos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comprobante_afip_entity_1.ComprobanteAfip, comprobante => comprobante.venta, { nullable: true }),
    (0, graphql_1.Field)(() => [comprobante_afip_entity_1.ComprobanteAfip], { nullable: true }),
    __metadata("design:type", Array)
], VentaCaja.prototype, "comprobantesAfip", void 0);
exports.VentaCaja = VentaCaja = __decorate([
    (0, typeorm_1.Entity)('ventas_caja'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['clienteId']),
    (0, typeorm_1.Index)(['usuarioAuthId']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['tipoVenta'])
], VentaCaja);
//# sourceMappingURL=venta-caja.entity.js.map