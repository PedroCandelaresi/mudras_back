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
exports.Cliente = exports.EstadoCliente = exports.TipoCliente = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cuenta_corriente_entity_1 = require("../../cuentas-corrientes/entities/cuenta-corriente.entity");
const venta_entity_1 = require("../../ventas/entities/venta.entity");
var TipoCliente;
(function (TipoCliente) {
    TipoCliente["MINORISTA"] = "minorista";
    TipoCliente["MAYORISTA"] = "mayorista";
    TipoCliente["DISTRIBUIDOR"] = "distribuidor";
})(TipoCliente || (exports.TipoCliente = TipoCliente = {}));
(0, graphql_1.registerEnumType)(TipoCliente, {
    name: 'TipoCliente',
    description: 'Tipos de cliente disponibles',
});
var EstadoCliente;
(function (EstadoCliente) {
    EstadoCliente["ACTIVO"] = "activo";
    EstadoCliente["INACTIVO"] = "inactivo";
    EstadoCliente["MOROSO"] = "moroso";
})(EstadoCliente || (exports.EstadoCliente = EstadoCliente = {}));
(0, graphql_1.registerEnumType)(EstadoCliente, {
    name: 'EstadoCliente',
    description: 'Estados disponibles para clientes',
});
let Cliente = class Cliente {
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Cliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "razonSocial", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, unique: true, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "codigoPostal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoCliente,
        default: TipoCliente.MINORISTA,
    }),
    (0, graphql_1.Field)(() => TipoCliente),
    __metadata("design:type", String)
], Cliente.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCliente,
        default: EstadoCliente.ACTIVO,
    }),
    (0, graphql_1.Field)(() => EstadoCliente),
    __metadata("design:type", String)
], Cliente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Cliente.prototype, "descuentoGeneral", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Cliente.prototype, "limiteCredito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Cliente.prototype, "saldoActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Cliente.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Cliente.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Cliente.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_corriente_entity_1.CuentaCorriente, cuentaCorriente => cuentaCorriente.cliente),
    (0, graphql_1.Field)(() => [cuenta_corriente_entity_1.CuentaCorriente], { nullable: true }),
    __metadata("design:type", Array)
], Cliente.prototype, "cuentasCorrientes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venta_entity_1.Venta, venta => venta.cliente),
    (0, graphql_1.Field)(() => [venta_entity_1.Venta], { nullable: true }),
    __metadata("design:type", Array)
], Cliente.prototype, "ventas", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)('clientes'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['email'], { unique: true }),
    (0, typeorm_1.Index)(['tipo']),
    (0, typeorm_1.Index)(['estado']),
    (0, typeorm_1.Index)(['nombre'])
], Cliente);
//# sourceMappingURL=cliente.entity.js.map