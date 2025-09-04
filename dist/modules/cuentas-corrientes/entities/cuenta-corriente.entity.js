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
exports.CuentaCorriente = exports.EstadoCuentaCorriente = exports.TipoCuentaCorriente = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const proveedor_entity_1 = require("../../proveedores/entities/proveedor.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const movimiento_cuenta_corriente_entity_1 = require("./movimiento-cuenta-corriente.entity");
var TipoCuentaCorriente;
(function (TipoCuentaCorriente) {
    TipoCuentaCorriente["CLIENTE"] = "cliente";
    TipoCuentaCorriente["PROVEEDOR"] = "proveedor";
})(TipoCuentaCorriente || (exports.TipoCuentaCorriente = TipoCuentaCorriente = {}));
(0, graphql_1.registerEnumType)(TipoCuentaCorriente, {
    name: 'TipoCuentaCorriente',
    description: 'Tipo de cuenta corriente',
});
var EstadoCuentaCorriente;
(function (EstadoCuentaCorriente) {
    EstadoCuentaCorriente["ACTIVA"] = "activa";
    EstadoCuentaCorriente["SUSPENDIDA"] = "suspendida";
    EstadoCuentaCorriente["CERRADA"] = "cerrada";
})(EstadoCuentaCorriente || (exports.EstadoCuentaCorriente = EstadoCuentaCorriente = {}));
(0, graphql_1.registerEnumType)(EstadoCuentaCorriente, {
    name: 'EstadoCuentaCorriente',
    description: 'Estado de la cuenta corriente',
});
let CuentaCorriente = class CuentaCorriente {
};
exports.CuentaCorriente = CuentaCorriente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoCuentaCorriente,
    }),
    (0, graphql_1.Field)(() => TipoCuentaCorriente),
    __metadata("design:type", String)
], CuentaCorriente.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCuentaCorriente,
        default: EstadoCuentaCorriente.ACTIVA,
    }),
    (0, graphql_1.Field)(() => EstadoCuentaCorriente),
    __metadata("design:type", String)
], CuentaCorriente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "saldoActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "limiteCredito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], CuentaCorriente.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CuentaCorriente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CuentaCorriente.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CuentaCorriente.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, cliente => cliente.cuentasCorrientes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    (0, graphql_1.Field)(() => cliente_entity_1.Cliente, { nullable: true }),
    __metadata("design:type", cliente_entity_1.Cliente)
], CuentaCorriente.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "proveedorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor, proveedor => proveedor.cuentasCorrientes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'proveedorId' }),
    (0, graphql_1.Field)(() => proveedor_entity_1.Proveedor, { nullable: true }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], CuentaCorriente.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CuentaCorriente.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, usuario => usuario.cuentasCorrientes),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario),
    __metadata("design:type", usuario_entity_1.Usuario)
], CuentaCorriente.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente, movimiento => movimiento.cuentaCorriente),
    (0, graphql_1.Field)(() => [movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente], { nullable: true }),
    __metadata("design:type", Array)
], CuentaCorriente.prototype, "movimientos", void 0);
exports.CuentaCorriente = CuentaCorriente = __decorate([
    (0, typeorm_1.Entity)('cuentas_corrientes'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['clienteId']),
    (0, typeorm_1.Index)(['proveedorId']),
    (0, typeorm_1.Index)(['usuarioId'])
], CuentaCorriente);
//# sourceMappingURL=cuenta-corriente.entity.js.map