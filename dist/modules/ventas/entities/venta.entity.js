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
exports.Venta = exports.TipoPago = exports.EstadoVenta = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const detalle_venta_entity_1 = require("./detalle-venta.entity");
var EstadoVenta;
(function (EstadoVenta) {
    EstadoVenta["PENDIENTE"] = "pendiente";
    EstadoVenta["CONFIRMADA"] = "confirmada";
    EstadoVenta["ENTREGADA"] = "entregada";
    EstadoVenta["CANCELADA"] = "cancelada";
})(EstadoVenta || (exports.EstadoVenta = EstadoVenta = {}));
(0, graphql_1.registerEnumType)(EstadoVenta, {
    name: 'EstadoVenta',
    description: 'Estados de ventas',
});
var TipoPago;
(function (TipoPago) {
    TipoPago["EFECTIVO"] = "efectivo";
    TipoPago["TARJETA_DEBITO"] = "tarjeta_debito";
    TipoPago["TARJETA_CREDITO"] = "tarjeta_credito";
    TipoPago["TRANSFERENCIA"] = "transferencia";
    TipoPago["CUENTA_CORRIENTE"] = "cuenta_corriente";
    TipoPago["MIXTO"] = "mixto";
})(TipoPago || (exports.TipoPago = TipoPago = {}));
(0, graphql_1.registerEnumType)(TipoPago, {
    name: 'TipoPago',
    description: 'Tipos de pago disponibles',
});
let Venta = class Venta {
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Venta.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Venta.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Venta.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, cliente => cliente.ventas),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    (0, graphql_1.Field)(() => cliente_entity_1.Cliente),
    __metadata("design:type", cliente_entity_1.Cliente)
], Venta.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Venta.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], Venta.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoVenta,
        default: EstadoVenta.PENDIENTE,
    }),
    (0, graphql_1.Field)(() => EstadoVenta),
    __metadata("design:type", String)
], Venta.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoPago,
    }),
    (0, graphql_1.Field)(() => TipoPago),
    __metadata("design:type", String)
], Venta.prototype, "tipoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "descuentoMonto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "montoEfectivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "montoTarjeta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "montoTransferencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "montoCuentaCorriente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Venta.prototype, "cambio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Venta.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Venta.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_venta_entity_1.DetalleVenta, detalle => detalle.venta),
    (0, graphql_1.Field)(() => [detalle_venta_entity_1.DetalleVenta], { nullable: true }),
    __metadata("design:type", Array)
], Venta.prototype, "detalles", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)('ventas'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['numero'], { unique: true }),
    (0, typeorm_1.Index)(['clienteId']),
    (0, typeorm_1.Index)(['usuarioId']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['tipoPago'])
], Venta);
//# sourceMappingURL=venta.entity.js.map