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
exports.MovimientoCuentaCorriente = exports.ConceptoMovimientoCuentaCorriente = exports.TipoMovimientoCuentaCorriente = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cuenta_corriente_entity_1 = require("./cuenta-corriente.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var TipoMovimientoCuentaCorriente;
(function (TipoMovimientoCuentaCorriente) {
    TipoMovimientoCuentaCorriente["DEBITO"] = "debito";
    TipoMovimientoCuentaCorriente["CREDITO"] = "credito";
})(TipoMovimientoCuentaCorriente || (exports.TipoMovimientoCuentaCorriente = TipoMovimientoCuentaCorriente = {}));
(0, graphql_1.registerEnumType)(TipoMovimientoCuentaCorriente, {
    name: 'TipoMovimientoCuentaCorriente',
    description: 'Tipo de movimiento en cuenta corriente',
});
var ConceptoMovimientoCuentaCorriente;
(function (ConceptoMovimientoCuentaCorriente) {
    ConceptoMovimientoCuentaCorriente["VENTA"] = "venta";
    ConceptoMovimientoCuentaCorriente["PAGO"] = "pago";
    ConceptoMovimientoCuentaCorriente["COMPRA"] = "compra";
    ConceptoMovimientoCuentaCorriente["AJUSTE"] = "ajuste";
    ConceptoMovimientoCuentaCorriente["INTERES"] = "interes";
    ConceptoMovimientoCuentaCorriente["DESCUENTO"] = "descuento";
})(ConceptoMovimientoCuentaCorriente || (exports.ConceptoMovimientoCuentaCorriente = ConceptoMovimientoCuentaCorriente = {}));
(0, graphql_1.registerEnumType)(ConceptoMovimientoCuentaCorriente, {
    name: 'ConceptoMovimientoCuentaCorriente',
    description: 'Concepto del movimiento en cuenta corriente',
});
let MovimientoCuentaCorriente = class MovimientoCuentaCorriente {
};
exports.MovimientoCuentaCorriente = MovimientoCuentaCorriente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "cuentaCorrienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_corriente_entity_1.CuentaCorriente, cuentaCorriente => cuentaCorriente.movimientos),
    (0, typeorm_1.JoinColumn)({ name: 'cuentaCorrienteId' }),
    (0, graphql_1.Field)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __metadata("design:type", cuenta_corriente_entity_1.CuentaCorriente)
], MovimientoCuentaCorriente.prototype, "cuentaCorriente", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimientoCuentaCorriente,
    }),
    (0, graphql_1.Field)(() => TipoMovimientoCuentaCorriente),
    __metadata("design:type", String)
], MovimientoCuentaCorriente.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConceptoMovimientoCuentaCorriente,
    }),
    (0, graphql_1.Field)(() => ConceptoMovimientoCuentaCorriente),
    __metadata("design:type", String)
], MovimientoCuentaCorriente.prototype, "concepto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "saldoAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "saldoNuevo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoCuentaCorriente.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoCuentaCorriente.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoCuentaCorriente.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MovimientoCuentaCorriente.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], MovimientoCuentaCorriente.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MovimientoCuentaCorriente.prototype, "creadoEn", void 0);
exports.MovimientoCuentaCorriente = MovimientoCuentaCorriente = __decorate([
    (0, typeorm_1.Entity)('movimientos_cuenta_corriente'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['cuentaCorrienteId']),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['concepto']),
    (0, typeorm_1.Index)(['fecha']),
    (0, typeorm_1.Index)(['usuarioId'])
], MovimientoCuentaCorriente);
//# sourceMappingURL=movimiento-cuenta-corriente.entity.js.map