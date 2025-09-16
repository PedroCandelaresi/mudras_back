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
exports.ComprobanteAfip = exports.EstadoComprobanteAfip = exports.TipoComprobanteAfip = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const venta_caja_entity_1 = require("./venta-caja.entity");
var TipoComprobanteAfip;
(function (TipoComprobanteAfip) {
    TipoComprobanteAfip["FACTURA_A"] = "factura_a";
    TipoComprobanteAfip["FACTURA_B"] = "factura_b";
    TipoComprobanteAfip["FACTURA_C"] = "factura_c";
    TipoComprobanteAfip["NOTA_CREDITO_A"] = "nota_credito_a";
    TipoComprobanteAfip["NOTA_CREDITO_B"] = "nota_credito_b";
    TipoComprobanteAfip["NOTA_CREDITO_C"] = "nota_credito_c";
    TipoComprobanteAfip["NOTA_DEBITO_A"] = "nota_debito_a";
    TipoComprobanteAfip["NOTA_DEBITO_B"] = "nota_debito_b";
    TipoComprobanteAfip["NOTA_DEBITO_C"] = "nota_debito_c";
})(TipoComprobanteAfip || (exports.TipoComprobanteAfip = TipoComprobanteAfip = {}));
(0, graphql_1.registerEnumType)(TipoComprobanteAfip, {
    name: 'TipoComprobanteAfip',
    description: 'Tipos de comprobantes AFIP',
});
var EstadoComprobanteAfip;
(function (EstadoComprobanteAfip) {
    EstadoComprobanteAfip["PENDIENTE"] = "pendiente";
    EstadoComprobanteAfip["EMITIDO"] = "emitido";
    EstadoComprobanteAfip["ERROR"] = "error";
    EstadoComprobanteAfip["ANULADO"] = "anulado";
})(EstadoComprobanteAfip || (exports.EstadoComprobanteAfip = EstadoComprobanteAfip = {}));
(0, graphql_1.registerEnumType)(EstadoComprobanteAfip, {
    name: 'EstadoComprobanteAfip',
    description: 'Estados de comprobantes AFIP',
});
let ComprobanteAfip = class ComprobanteAfip {
};
exports.ComprobanteAfip = ComprobanteAfip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "ventaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_caja_entity_1.VentaCaja, venta => venta.comprobantesAfip),
    (0, typeorm_1.JoinColumn)({ name: 'ventaId' }),
    (0, graphql_1.Field)(() => venta_caja_entity_1.VentaCaja),
    __metadata("design:type", venta_caja_entity_1.VentaCaja)
], ComprobanteAfip.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoComprobanteAfip,
    }),
    (0, graphql_1.Field)(() => TipoComprobanteAfip),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "tipoComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoComprobanteAfip,
        default: EstadoComprobanteAfip.PENDIENTE,
    }),
    (0, graphql_1.Field)(() => EstadoComprobanteAfip),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "puntoVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "cae", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], ComprobanteAfip.prototype, "vencimientoCae", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 11, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "cuitCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "importeTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "importeGravado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "importeExento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComprobanteAfip.prototype, "importeIva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "urlPdf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "mensajeError", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ComprobanteAfip.prototype, "datosAfip", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ComprobanteAfip.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ComprobanteAfip.prototype, "actualizadoEn", void 0);
exports.ComprobanteAfip = ComprobanteAfip = __decorate([
    (0, typeorm_1.Entity)('comprobantes_afip'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['ventaId']),
    (0, typeorm_1.Index)(['tipoComprobante']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['puntoVenta', 'numeroComprobante'], { unique: true })
], ComprobanteAfip);
//# sourceMappingURL=comprobante-afip.entity.js.map