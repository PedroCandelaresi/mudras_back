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
exports.DetalleOrdenCompra = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const orden_compra_entity_1 = require("./orden-compra.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let DetalleOrdenCompra = class DetalleOrdenCompra {
};
exports.DetalleOrdenCompra = DetalleOrdenCompra;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "ordenId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "precioUnitario", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "cantidadRecibida", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DetalleOrdenCompra.prototype, "costoUnitarioRecepcion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orden_compra_entity_1.OrdenCompra, (o) => o.detalles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ordenId' }),
    __metadata("design:type", orden_compra_entity_1.OrdenCompra)
], DetalleOrdenCompra.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articuloId' }),
    __metadata("design:type", articulo_entity_1.Articulo)
], DetalleOrdenCompra.prototype, "articulo", void 0);
exports.DetalleOrdenCompra = DetalleOrdenCompra = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('tborden_compra_detalle')
], DetalleOrdenCompra);
//# sourceMappingURL=detalle-orden-compra.entity.js.map