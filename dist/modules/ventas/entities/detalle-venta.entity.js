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
exports.DetalleVenta = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const venta_entity_1 = require("./venta.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let DetalleVenta = class DetalleVenta {
};
exports.DetalleVenta = DetalleVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "ventaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, venta => venta.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'ventaId' }),
    (0, graphql_1.Field)(() => venta_entity_1.Venta),
    __metadata("design:type", venta_entity_1.Venta)
], DetalleVenta.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articuloId' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], DetalleVenta.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "descuentoMonto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], DetalleVenta.prototype, "creadoEn", void 0);
exports.DetalleVenta = DetalleVenta = __decorate([
    (0, typeorm_1.Entity)('detalles_ventas'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['ventaId']),
    (0, typeorm_1.Index)(['articuloId'])
], DetalleVenta);
//# sourceMappingURL=detalle-venta.entity.js.map