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
exports.DetalleAsientoContable = exports.TipoMovimientoContable = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const asiento_contable_entity_1 = require("./asiento-contable.entity");
const cuenta_contable_entity_1 = require("./cuenta-contable.entity");
var TipoMovimientoContable;
(function (TipoMovimientoContable) {
    TipoMovimientoContable["DEBE"] = "debe";
    TipoMovimientoContable["HABER"] = "haber";
})(TipoMovimientoContable || (exports.TipoMovimientoContable = TipoMovimientoContable = {}));
(0, graphql_1.registerEnumType)(TipoMovimientoContable, {
    name: 'TipoMovimientoContable',
    description: 'Tipo de movimiento contable',
});
let DetalleAsientoContable = class DetalleAsientoContable {
};
exports.DetalleAsientoContable = DetalleAsientoContable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], DetalleAsientoContable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DetalleAsientoContable.prototype, "asientoContableId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asiento_contable_entity_1.AsientoContable, asiento => asiento.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'asientoContableId' }),
    (0, graphql_1.Field)(() => asiento_contable_entity_1.AsientoContable),
    __metadata("design:type", asiento_contable_entity_1.AsientoContable)
], DetalleAsientoContable.prototype, "asientoContable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DetalleAsientoContable.prototype, "cuentaContableId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_contable_entity_1.CuentaContable, cuenta => cuenta.detallesAsientos),
    (0, typeorm_1.JoinColumn)({ name: 'cuentaContableId' }),
    (0, graphql_1.Field)(() => cuenta_contable_entity_1.CuentaContable),
    __metadata("design:type", cuenta_contable_entity_1.CuentaContable)
], DetalleAsientoContable.prototype, "cuentaContable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimientoContable,
    }),
    (0, graphql_1.Field)(() => TipoMovimientoContable),
    __metadata("design:type", String)
], DetalleAsientoContable.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], DetalleAsientoContable.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], DetalleAsientoContable.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], DetalleAsientoContable.prototype, "creadoEn", void 0);
exports.DetalleAsientoContable = DetalleAsientoContable = __decorate([
    (0, typeorm_1.Entity)('detalles_asientos_contables'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['asientoContableId']),
    (0, typeorm_1.Index)(['cuentaContableId']),
    (0, typeorm_1.Index)(['tipo'])
], DetalleAsientoContable);
//# sourceMappingURL=detalle-asiento-contable.entity.js.map