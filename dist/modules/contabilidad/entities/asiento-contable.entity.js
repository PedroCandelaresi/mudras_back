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
exports.AsientoContable = exports.EstadoAsientoContable = exports.TipoAsientoContable = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const detalle_asiento_contable_entity_1 = require("./detalle-asiento-contable.entity");
var TipoAsientoContable;
(function (TipoAsientoContable) {
    TipoAsientoContable["VENTA"] = "venta";
    TipoAsientoContable["COMPRA"] = "compra";
    TipoAsientoContable["PAGO"] = "pago";
    TipoAsientoContable["COBRO"] = "cobro";
    TipoAsientoContable["AJUSTE"] = "ajuste";
    TipoAsientoContable["CIERRE_CAJA"] = "cierre_caja";
    TipoAsientoContable["APERTURA_CAJA"] = "apertura_caja";
})(TipoAsientoContable || (exports.TipoAsientoContable = TipoAsientoContable = {}));
(0, graphql_1.registerEnumType)(TipoAsientoContable, {
    name: 'TipoAsientoContable',
    description: 'Tipos de asientos contables',
});
var EstadoAsientoContable;
(function (EstadoAsientoContable) {
    EstadoAsientoContable["BORRADOR"] = "borrador";
    EstadoAsientoContable["CONFIRMADO"] = "confirmado";
    EstadoAsientoContable["ANULADO"] = "anulado";
})(EstadoAsientoContable || (exports.EstadoAsientoContable = EstadoAsientoContable = {}));
(0, graphql_1.registerEnumType)(EstadoAsientoContable, {
    name: 'EstadoAsientoContable',
    description: 'Estados de asientos contables',
});
let AsientoContable = class AsientoContable {
};
exports.AsientoContable = AsientoContable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], AsientoContable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AsientoContable.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoAsientoContable,
    }),
    (0, graphql_1.Field)(() => TipoAsientoContable),
    __metadata("design:type", String)
], AsientoContable.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoAsientoContable,
        default: EstadoAsientoContable.BORRADOR,
    }),
    (0, graphql_1.Field)(() => EstadoAsientoContable),
    __metadata("design:type", String)
], AsientoContable.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AsientoContable.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AsientoContable.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], AsientoContable.prototype, "totalDebe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], AsientoContable.prototype, "totalHaber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AsientoContable.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AsientoContable.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, usuario => usuario.asientosContables),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], AsientoContable.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AsientoContable.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AsientoContable.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], AsientoContable.prototype, "fechaAnulacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AsientoContable.prototype, "usuarioAnulacionId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_asiento_contable_entity_1.DetalleAsientoContable, detalle => detalle.asientoContable),
    (0, graphql_1.Field)(() => [detalle_asiento_contable_entity_1.DetalleAsientoContable], { nullable: true }),
    __metadata("design:type", Array)
], AsientoContable.prototype, "detalles", void 0);
exports.AsientoContable = AsientoContable = __decorate([
    (0, typeorm_1.Entity)('asientos_contables'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['numero'], { unique: true }),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['usuarioId'])
], AsientoContable);
//# sourceMappingURL=asiento-contable.entity.js.map