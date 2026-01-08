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
exports.CuentaContable = exports.EstadoCuentaContable = exports.TipoCuentaContable = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const detalle_asiento_contable_entity_1 = require("./detalle-asiento-contable.entity");
var TipoCuentaContable;
(function (TipoCuentaContable) {
    TipoCuentaContable["ACTIVO"] = "activo";
    TipoCuentaContable["PASIVO"] = "pasivo";
    TipoCuentaContable["PATRIMONIO"] = "patrimonio";
    TipoCuentaContable["INGRESO"] = "ingreso";
    TipoCuentaContable["EGRESO"] = "egreso";
})(TipoCuentaContable || (exports.TipoCuentaContable = TipoCuentaContable = {}));
(0, graphql_1.registerEnumType)(TipoCuentaContable, {
    name: 'TipoCuentaContable',
    description: 'Tipos de cuentas contables',
});
var EstadoCuentaContable;
(function (EstadoCuentaContable) {
    EstadoCuentaContable["ACTIVA"] = "activa";
    EstadoCuentaContable["INACTIVA"] = "inactiva";
})(EstadoCuentaContable || (exports.EstadoCuentaContable = EstadoCuentaContable = {}));
(0, graphql_1.registerEnumType)(EstadoCuentaContable, {
    name: 'EstadoCuentaContable',
    description: 'Estados de cuentas contables',
});
let CuentaContable = class CuentaContable {
};
exports.CuentaContable = CuentaContable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], CuentaContable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CuentaContable.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CuentaContable.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CuentaContable.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoCuentaContable,
    }),
    (0, graphql_1.Field)(() => TipoCuentaContable),
    __metadata("design:type", String)
], CuentaContable.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCuentaContable,
        default: EstadoCuentaContable.ACTIVA,
    }),
    (0, graphql_1.Field)(() => EstadoCuentaContable),
    __metadata("design:type", String)
], CuentaContable.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CuentaContable.prototype, "saldoActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CuentaContable.prototype, "aceptaMovimientos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CuentaContable.prototype, "cuentaPadreId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CuentaContable.prototype, "nivel", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CuentaContable.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CuentaContable.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_asiento_contable_entity_1.DetalleAsientoContable, detalle => detalle.cuentaContable),
    (0, graphql_1.Field)(() => [detalle_asiento_contable_entity_1.DetalleAsientoContable], { nullable: true }),
    __metadata("design:type", Array)
], CuentaContable.prototype, "detallesAsientos", void 0);
exports.CuentaContable = CuentaContable = __decorate([
    (0, typeorm_1.Entity)('cuentas_contables'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['cuentaPadreId'])
], CuentaContable);
//# sourceMappingURL=cuenta-contable.entity.js.map