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
exports.OrdenCompra = exports.EstadoOrdenCompra = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const proveedor_entity_1 = require("../../proveedores/entities/proveedor.entity");
const detalle_orden_compra_entity_1 = require("./detalle-orden-compra.entity");
var EstadoOrdenCompra;
(function (EstadoOrdenCompra) {
    EstadoOrdenCompra["BORRADOR"] = "BORRADOR";
    EstadoOrdenCompra["EMITIDA"] = "EMITIDA";
    EstadoOrdenCompra["RECEPCIONADA"] = "RECEPCIONADA";
    EstadoOrdenCompra["ANULADA"] = "ANULADA";
})(EstadoOrdenCompra || (exports.EstadoOrdenCompra = EstadoOrdenCompra = {}));
(0, graphql_1.registerEnumType)(EstadoOrdenCompra, { name: 'EstadoOrdenCompra' });
let OrdenCompra = class OrdenCompra {
};
exports.OrdenCompra = OrdenCompra;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrdenCompra.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], OrdenCompra.prototype, "proveedorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => EstadoOrdenCompra),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: EstadoOrdenCompra.BORRADOR }),
    __metadata("design:type", String)
], OrdenCompra.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrdenCompra.prototype, "observaciones", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], OrdenCompra.prototype, "creadoEn", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], OrdenCompra.prototype, "actualizadoEn", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], OrdenCompra.prototype, "fechaEmision", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], OrdenCompra.prototype, "fechaRecepcion", void 0);
__decorate([
    (0, graphql_1.Field)(() => [detalle_orden_compra_entity_1.DetalleOrdenCompra], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => detalle_orden_compra_entity_1.DetalleOrdenCompra, (d) => d.orden, { cascade: true }),
    __metadata("design:type", Array)
], OrdenCompra.prototype, "detalles", void 0);
__decorate([
    (0, graphql_1.Field)(() => proveedor_entity_1.Proveedor, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor, (p) => p.ordenesCompra),
    (0, typeorm_1.JoinColumn)({ name: 'proveedorId' }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], OrdenCompra.prototype, "proveedor", void 0);
exports.OrdenCompra = OrdenCompra = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('tborden_compra')
], OrdenCompra);
//# sourceMappingURL=orden-compra.entity.js.map