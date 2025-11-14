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
exports.Gasto = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const categoria_gasto_entity_1 = require("./categoria-gasto.entity");
const proveedor_entity_1 = require("../../proveedores/entities/proveedor.entity");
let Gasto = class Gasto {
};
exports.Gasto = Gasto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Gasto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Gasto.prototype, "fecha", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Gasto.prototype, "montoNeto", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Gasto.prototype, "alicuotaIva", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Gasto.prototype, "montoIva", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Gasto.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Gasto.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Gasto.prototype, "proveedorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Gasto.prototype, "categoriaId", void 0);
__decorate([
    (0, graphql_1.Field)(() => proveedor_entity_1.Proveedor, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor),
    (0, typeorm_1.JoinColumn)({ name: 'proveedorId' }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], Gasto.prototype, "proveedor", void 0);
__decorate([
    (0, graphql_1.Field)(() => categoria_gasto_entity_1.CategoriaGasto, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => categoria_gasto_entity_1.CategoriaGasto, (c) => c.gastos),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaId' }),
    __metadata("design:type", categoria_gasto_entity_1.CategoriaGasto)
], Gasto.prototype, "categoria", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Gasto.prototype, "creadoEn", void 0);
exports.Gasto = Gasto = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('tbgastos')
], Gasto);
//# sourceMappingURL=gasto.entity.js.map