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
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const puesto_venta_entity_1 = require("./puesto-venta.entity");
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
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], VentaCaja.prototype, "numeroVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VentaCaja.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoVentaCaja,
    }),
    (0, graphql_1.Field)(() => TipoVentaCaja),
    __metadata("design:type", String)
], VentaCaja.prototype, "tipoVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoVentaCaja,
        default: EstadoVentaCaja.BORRADOR,
    }),
    (0, graphql_1.Field)(() => EstadoVentaCaja),
    __metadata("design:type", String)
], VentaCaja.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "puestoVentaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => puesto_venta_entity_1.PuestoVenta, puesto => puesto.ventas),
    (0, typeorm_1.JoinColumn)({ name: 'puestoVentaId' }),
    (0, graphql_1.Field)(() => puesto_venta_entity_1.PuestoVenta),
    __metadata("design:type", puesto_venta_entity_1.PuestoVenta)
], VentaCaja.prototype, "puestoVenta", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, cliente => cliente.ventas),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    (0, graphql_1.Field)(() => cliente_entity_1.Cliente),
    __metadata("design:type", cliente_entity_1.Cliente)
], VentaCaja.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], VentaCaja.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], VentaCaja.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
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
    (0, typeorm_1.Column)({ nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], VentaCaja.prototype, "ventaOriginalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VentaCaja, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ventaOriginalId' }),
    (0, graphql_1.Field)(() => VentaCaja, { nullable: true }),
    __metadata("design:type", VentaCaja)
], VentaCaja.prototype, "ventaOriginal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], VentaCaja.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
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
    (0, typeorm_1.Index)(['numeroVenta'], { unique: true }),
    (0, typeorm_1.Index)(['clienteId']),
    (0, typeorm_1.Index)(['usuarioId']),
    (0, typeorm_1.Index)(['puestoVentaId']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['tipoVenta'])
], VentaCaja);
//# sourceMappingURL=venta-caja.entity.js.map