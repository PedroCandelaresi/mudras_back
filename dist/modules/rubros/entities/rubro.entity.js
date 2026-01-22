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
exports.Rubro = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const proveedor_entity_1 = require("../../proveedores/entities/proveedor.entity");
const proveedor_rubro_entity_1 = require("../../proveedores/entities/proveedor-rubro.entity");
let Rubro = class Rubro {
};
exports.Rubro = Rubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Rubro.prototype, "Id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 25, nullable: true }),
    __metadata("design:type", String)
], Rubro.prototype, "Rubro", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], Rubro.prototype, "Codigo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Rubro.prototype, "PorcentajeRecargo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Rubro.prototype, "PorcentajeDescuento", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, default: 'Unidad' }),
    __metadata("design:type", String)
], Rubro.prototype, "unidadMedida", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => articulo_entity_1.Articulo, articulo => articulo.rubro),
    (0, graphql_1.Field)(() => [articulo_entity_1.Articulo], { nullable: true }),
    __metadata("design:type", Array)
], Rubro.prototype, "articulos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proveedor_entity_1.Proveedor, proveedor => proveedor.rubro),
    (0, graphql_1.Field)(() => [proveedor_entity_1.Proveedor], { nullable: true }),
    __metadata("design:type", Array)
], Rubro.prototype, "proveedores", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proveedor_rubro_entity_1.ProveedorRubro, (pr) => pr.rubro),
    __metadata("design:type", Array)
], Rubro.prototype, "proveedorRubros", void 0);
exports.Rubro = Rubro = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('mudras_rubros')
], Rubro);
//# sourceMappingURL=rubro.entity.js.map