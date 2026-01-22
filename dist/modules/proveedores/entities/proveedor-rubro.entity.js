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
exports.ProveedorRubro = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const proveedor_entity_1 = require("./proveedor.entity");
const rubro_entity_1 = require("../../rubros/entities/rubro.entity");
let ProveedorRubro = class ProveedorRubro {
};
exports.ProveedorRubro = ProveedorRubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryColumn)({ name: 'proveedorId', type: 'int' }),
    __metadata("design:type", Number)
], ProveedorRubro.prototype, "proveedorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryColumn)({ name: 'rubroId', type: 'int' }),
    __metadata("design:type", Number)
], ProveedorRubro.prototype, "rubroId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], ProveedorRubro.prototype, "porcentajeRecargo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], ProveedorRubro.prototype, "porcentajeDescuento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor, (proveedor) => proveedor.proveedorRubros, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'proveedorId' }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], ProveedorRubro.prototype, "proveedor", void 0);
__decorate([
    (0, graphql_1.Field)(() => rubro_entity_1.Rubro),
    (0, typeorm_1.ManyToOne)(() => rubro_entity_1.Rubro, (rubro) => rubro.proveedorRubros, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'rubroId' }),
    __metadata("design:type", rubro_entity_1.Rubro)
], ProveedorRubro.prototype, "rubro", void 0);
exports.ProveedorRubro = ProveedorRubro = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('mudras_proveedores_rubros')
], ProveedorRubro);
//# sourceMappingURL=proveedor-rubro.entity.js.map