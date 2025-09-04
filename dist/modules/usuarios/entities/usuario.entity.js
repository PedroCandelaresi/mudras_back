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
exports.Usuario = exports.EstadoUsuario = exports.RolUsuario = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const cuenta_corriente_entity_1 = require("../../cuentas-corrientes/entities/cuenta-corriente.entity");
const asiento_contable_entity_1 = require("../../contabilidad/entities/asiento-contable.entity");
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["ADMINISTRADOR"] = "administrador";
    RolUsuario["PROGRAMADOR"] = "programador";
    RolUsuario["CAJA"] = "caja";
    RolUsuario["DEPOSITO"] = "deposito";
    RolUsuario["DIS_GRAFICO"] = "dis_grafico";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
(0, graphql_1.registerEnumType)(RolUsuario, {
    name: 'RolUsuario',
    description: 'Roles disponibles para usuarios del sistema',
});
var EstadoUsuario;
(function (EstadoUsuario) {
    EstadoUsuario["ACTIVO"] = "activo";
    EstadoUsuario["INACTIVO"] = "inactivo";
    EstadoUsuario["SUSPENDIDO"] = "suspendido";
})(EstadoUsuario || (exports.EstadoUsuario = EstadoUsuario = {}));
(0, graphql_1.registerEnumType)(EstadoUsuario, {
    name: 'EstadoUsuario',
    description: 'Estados disponibles para usuarios',
});
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RolUsuario,
        default: RolUsuario.CAJA,
    }),
    (0, graphql_1.Field)(() => RolUsuario),
    __metadata("design:type", String)
], Usuario.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoUsuario,
        default: EstadoUsuario.ACTIVO,
    }),
    (0, graphql_1.Field)(() => EstadoUsuario),
    __metadata("design:type", String)
], Usuario.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Usuario.prototype, "salario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaIngreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "ultimoAcceso", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Usuario.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Usuario.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_corriente_entity_1.CuentaCorriente, cuentaCorriente => cuentaCorriente.usuario),
    (0, graphql_1.Field)(() => [cuenta_corriente_entity_1.CuentaCorriente], { nullable: true }),
    __metadata("design:type", Array)
], Usuario.prototype, "cuentasCorrientes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asiento_contable_entity_1.AsientoContable, asiento => asiento.usuario),
    (0, graphql_1.Field)(() => [asiento_contable_entity_1.AsientoContable], { nullable: true }),
    __metadata("design:type", Array)
], Usuario.prototype, "asientosContables", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('usuarios'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['email'], { unique: true }),
    (0, typeorm_1.Index)(['username'], { unique: true }),
    (0, typeorm_1.Index)(['rol']),
    (0, typeorm_1.Index)(['estado'])
], Usuario);
//# sourceMappingURL=usuario.entity.js.map