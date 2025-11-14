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
exports.DetalleVentaCaja = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const venta_caja_entity_1 = require("./venta-caja.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let DetalleVentaCaja = class DetalleVentaCaja {
};
exports.DetalleVentaCaja = DetalleVentaCaja;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venta_id' }),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "ventaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_caja_entity_1.VentaCaja, venta => venta.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'venta_id' }),
    (0, graphql_1.Field)(() => venta_caja_entity_1.VentaCaja),
    __metadata("design:type", venta_caja_entity_1.VentaCaja)
], DetalleVentaCaja.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'articulo_id' }),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articulo_id' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], DetalleVentaCaja.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cantidad', type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_unitario', type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descuento_monto', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "descuentoMonto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVentaCaja.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'observaciones', type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], DetalleVentaCaja.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], DetalleVentaCaja.prototype, "creadoEn", void 0);
exports.DetalleVentaCaja = DetalleVentaCaja = __decorate([
    (0, typeorm_1.Entity)('detalles_venta_caja'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['ventaId']),
    (0, typeorm_1.Index)(['articuloId'])
], DetalleVentaCaja);
//# sourceMappingURL=detalle-venta-caja.entity.js.map