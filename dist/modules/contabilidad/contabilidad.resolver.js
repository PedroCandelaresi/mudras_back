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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceGeneral = exports.DetalleAsientoInput = exports.ContabilidadResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const contabilidad_service_1 = require("./contabilidad.service");
const asiento_contable_entity_1 = require("./entities/asiento-contable.entity");
const cuenta_contable_entity_1 = require("./entities/cuenta-contable.entity");
const detalle_asiento_contable_entity_1 = require("./entities/detalle-asiento-contable.entity");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ContabilidadResolver = class ContabilidadResolver {
    constructor(contabilidadService) {
        this.contabilidadService = contabilidadService;
    }
    crearCuentaContable(codigo, nombre, tipo, cuentaPadreId) {
        return this.contabilidadService.crearCuentaContable(codigo, nombre, tipo, cuentaPadreId);
    }
    obtenerCuentasContables() {
        return this.contabilidadService.obtenerCuentasContables();
    }
    obtenerCuentaContable(id) {
        return this.contabilidadService.obtenerCuentaContable(id);
    }
    crearAsientoContable(tipo, descripcion, usuarioId, detalles) {
        return this.contabilidadService.crearAsientoContable(tipo, descripcion, usuarioId, detalles);
    }
    obtenerAsientosContables() {
        return this.contabilidadService.obtenerAsientosContables();
    }
    obtenerAsientoContable(id) {
        return this.contabilidadService.obtenerAsientoContable(id);
    }
    anularAsientoContable(id, usuarioId) {
        return this.contabilidadService.anularAsientoContable(id, usuarioId);
    }
    obtenerBalanceGeneral() {
        return this.contabilidadService.obtenerBalanceGeneral();
    }
    async crearCuentasContablesBasicas() {
        await this.contabilidadService.crearCuentasContablesBasicas();
        return true;
    }
};
exports.ContabilidadResolver = ContabilidadResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_contable_entity_1.CuentaContable),
    (0, permissions_decorator_1.Permisos)('contabilidad.create'),
    __param(0, (0, graphql_1.Args)('codigo')),
    __param(1, (0, graphql_1.Args)('nombre')),
    __param(2, (0, graphql_1.Args)('tipo', { type: () => cuenta_contable_entity_1.TipoCuentaContable })),
    __param(3, (0, graphql_1.Args)('cuentaPadreId', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "crearCuentaContable", null);
__decorate([
    (0, graphql_1.Query)(() => [cuenta_contable_entity_1.CuentaContable], { name: 'cuentasContables' }),
    (0, permissions_decorator_1.Permisos)('contabilidad.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "obtenerCuentasContables", null);
__decorate([
    (0, graphql_1.Query)(() => cuenta_contable_entity_1.CuentaContable, { name: 'cuentaContable' }),
    (0, permissions_decorator_1.Permisos)('contabilidad.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "obtenerCuentaContable", null);
__decorate([
    (0, graphql_1.Mutation)(() => asiento_contable_entity_1.AsientoContable),
    (0, permissions_decorator_1.Permisos)('contabilidad.create'),
    __param(0, (0, graphql_1.Args)('tipo', { type: () => asiento_contable_entity_1.TipoAsientoContable })),
    __param(1, (0, graphql_1.Args)('descripcion')),
    __param(2, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __param(3, (0, graphql_1.Args)('detalles', { type: () => [DetalleAsientoInput] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Array]),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "crearAsientoContable", null);
__decorate([
    (0, graphql_1.Query)(() => [asiento_contable_entity_1.AsientoContable], { name: 'asientosContables' }),
    (0, permissions_decorator_1.Permisos)('contabilidad.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "obtenerAsientosContables", null);
__decorate([
    (0, graphql_1.Query)(() => asiento_contable_entity_1.AsientoContable, { name: 'asientoContable' }),
    (0, permissions_decorator_1.Permisos)('contabilidad.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "obtenerAsientoContable", null);
__decorate([
    (0, graphql_1.Mutation)(() => asiento_contable_entity_1.AsientoContable),
    (0, permissions_decorator_1.Permisos)('contabilidad.update'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "anularAsientoContable", null);
__decorate([
    (0, graphql_1.Query)(() => BalanceGeneral, { name: 'balanceGeneral' }),
    (0, permissions_decorator_1.Permisos)('contabilidad.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContabilidadResolver.prototype, "obtenerBalanceGeneral", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, permissions_decorator_1.Permisos)('contabilidad.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContabilidadResolver.prototype, "crearCuentasContablesBasicas", null);
exports.ContabilidadResolver = ContabilidadResolver = __decorate([
    (0, graphql_1.Resolver)(() => asiento_contable_entity_1.AsientoContable),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [contabilidad_service_1.ContabilidadService])
], ContabilidadResolver);
const graphql_2 = require("@nestjs/graphql");
let DetalleAsientoInput = class DetalleAsientoInput {
};
exports.DetalleAsientoInput = DetalleAsientoInput;
__decorate([
    (0, graphql_2.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], DetalleAsientoInput.prototype, "cuentaContableId", void 0);
__decorate([
    (0, graphql_2.Field)(() => detalle_asiento_contable_entity_1.TipoMovimientoContable),
    __metadata("design:type", String)
], DetalleAsientoInput.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], DetalleAsientoInput.prototype, "monto", void 0);
__decorate([
    (0, graphql_2.Field)({ nullable: true }),
    __metadata("design:type", String)
], DetalleAsientoInput.prototype, "descripcion", void 0);
exports.DetalleAsientoInput = DetalleAsientoInput = __decorate([
    (0, graphql_2.InputType)()
], DetalleAsientoInput);
const graphql_3 = require("@nestjs/graphql");
let BalanceGeneral = class BalanceGeneral {
};
exports.BalanceGeneral = BalanceGeneral;
__decorate([
    (0, graphql_2.Field)(() => [cuenta_contable_entity_1.CuentaContable]),
    __metadata("design:type", Array)
], BalanceGeneral.prototype, "activos", void 0);
__decorate([
    (0, graphql_2.Field)(() => [cuenta_contable_entity_1.CuentaContable]),
    __metadata("design:type", Array)
], BalanceGeneral.prototype, "pasivos", void 0);
__decorate([
    (0, graphql_2.Field)(() => [cuenta_contable_entity_1.CuentaContable]),
    __metadata("design:type", Array)
], BalanceGeneral.prototype, "patrimonio", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], BalanceGeneral.prototype, "totalActivos", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], BalanceGeneral.prototype, "totalPasivos", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], BalanceGeneral.prototype, "totalPatrimonio", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], BalanceGeneral.prototype, "diferencia", void 0);
exports.BalanceGeneral = BalanceGeneral = __decorate([
    (0, graphql_3.ObjectType)()
], BalanceGeneral);
//# sourceMappingURL=contabilidad.resolver.js.map