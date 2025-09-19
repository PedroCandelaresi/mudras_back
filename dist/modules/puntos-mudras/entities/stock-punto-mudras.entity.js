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
exports.StockPuntoMudras = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const punto_mudras_entity_1 = require("./punto-mudras.entity");
let StockPuntoMudras = class StockPuntoMudras {
};
exports.StockPuntoMudras = StockPuntoMudras;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ name: 'punto_mudras_id' }),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ name: 'articulo_id' }),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'stock_minimo' }),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "stockMinimo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'stock_maximo' }),
    __metadata("design:type", Number)
], StockPuntoMudras.prototype, "stockMaximo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'fecha_actualizacion' }),
    __metadata("design:type", Date)
], StockPuntoMudras.prototype, "fechaActualizacion", void 0);
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.PuntoMudras),
    (0, typeorm_1.ManyToOne)(() => punto_mudras_entity_1.PuntoMudras, punto => punto.stock),
    (0, typeorm_1.JoinColumn)({ name: 'punto_mudras_id' }),
    __metadata("design:type", punto_mudras_entity_1.PuntoMudras)
], StockPuntoMudras.prototype, "puntoMudras", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], StockPuntoMudras.prototype, "estadoStock", void 0);
exports.StockPuntoMudras = StockPuntoMudras = __decorate([
    (0, graphql_1.ObjectType)('StockPuntoMudras'),
    (0, typeorm_1.Entity)('stock_puntos_mudras'),
    (0, typeorm_1.Index)(['puntoMudrasId', 'articuloId'], { unique: true })
], StockPuntoMudras);
//# sourceMappingURL=stock-punto-mudras.entity.js.map