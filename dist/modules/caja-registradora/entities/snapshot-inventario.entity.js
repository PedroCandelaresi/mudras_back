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
exports.SnapshotInventarioMensual = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let SnapshotInventarioMensual = class SnapshotInventarioMensual {
};
exports.SnapshotInventarioMensual = SnapshotInventarioMensual;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "articuloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articuloId' }),
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo),
    __metadata("design:type", articulo_entity_1.Articulo)
], SnapshotInventarioMensual.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "puestoVentaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "mes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "stockInicial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "stockFinal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "totalEntradas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "totalSalidas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "stockCalculado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "diferencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], SnapshotInventarioMensual.prototype, "valorInventario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SnapshotInventarioMensual.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SnapshotInventarioMensual.prototype, "creadoEn", void 0);
exports.SnapshotInventarioMensual = SnapshotInventarioMensual = __decorate([
    (0, typeorm_1.Entity)('snapshots_inventario_mensual'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['articuloId']),
    (0, typeorm_1.Index)(['anio', 'mes'])
], SnapshotInventarioMensual);
//# sourceMappingURL=snapshot-inventario.entity.js.map