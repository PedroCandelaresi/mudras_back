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
exports.CuentasCorrientesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const cuentas_corrientes_service_1 = require("./cuentas-corrientes.service");
const cuenta_corriente_entity_1 = require("./entities/cuenta-corriente.entity");
const movimiento_cuenta_corriente_entity_1 = require("./entities/movimiento-cuenta-corriente.entity");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
let CuentasCorrientesResolver = class CuentasCorrientesResolver {
    constructor(cuentasCorrientesService) {
        this.cuentasCorrientesService = cuentasCorrientesService;
    }
    crearCuentaCliente(clienteId, usuarioId, limiteCredito) {
        return this.cuentasCorrientesService.crearCuentaCliente(clienteId, usuarioId, limiteCredito);
    }
    crearCuentaProveedor(proveedorId, usuarioId, limiteCredito) {
        return this.cuentasCorrientesService.crearCuentaProveedor(proveedorId, usuarioId, limiteCredito);
    }
    findAll() {
        return this.cuentasCorrientesService.findAll();
    }
    findOne(id) {
        return this.cuentasCorrientesService.findOne(id);
    }
    findByCliente(clienteId) {
        return this.cuentasCorrientesService.findByCliente(clienteId);
    }
    findByProveedor(proveedorId) {
        return this.cuentasCorrientesService.findByProveedor(proveedorId);
    }
    registrarMovimiento(cuentaId, tipo, concepto, monto, descripcion, usuarioId, numeroComprobante) {
        return this.cuentasCorrientesService.registrarMovimiento(cuentaId, tipo, concepto, monto, descripcion, usuarioId, numeroComprobante);
    }
    obtenerSaldo(cuentaId) {
        return this.cuentasCorrientesService.obtenerSaldo(cuentaId);
    }
    obtenerMovimientos(cuentaId) {
        return this.cuentasCorrientesService.obtenerMovimientos(cuentaId);
    }
    cerrarCuenta(id) {
        return this.cuentasCorrientesService.cerrarCuenta(id);
    }
    suspenderCuenta(id) {
        return this.cuentasCorrientesService.suspenderCuenta(id);
    }
    activarCuenta(id) {
        return this.cuentasCorrientesService.activarCuenta(id);
    }
};
exports.CuentasCorrientesResolver = CuentasCorrientesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __param(0, (0, graphql_1.Args)('clienteId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('limiteCredito', { defaultValue: 0 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "crearCuentaCliente", null);
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('limiteCredito', { defaultValue: 0 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "crearCuentaProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [cuenta_corriente_entity_1.CuentaCorriente], { name: 'cuentasCorrientes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => cuenta_corriente_entity_1.CuentaCorriente, { name: 'cuentaCorriente' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [cuenta_corriente_entity_1.CuentaCorriente], { name: 'cuentasPorCliente' }),
    __param(0, (0, graphql_1.Args)('clienteId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "findByCliente", null);
__decorate([
    (0, graphql_1.Query)(() => [cuenta_corriente_entity_1.CuentaCorriente], { name: 'cuentasPorProveedor' }),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "findByProveedor", null);
__decorate([
    (0, graphql_1.Mutation)(() => movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente),
    __param(0, (0, graphql_1.Args)('cuentaId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('tipo', { type: () => movimiento_cuenta_corriente_entity_1.TipoMovimientoCuentaCorriente })),
    __param(2, (0, graphql_1.Args)('concepto', { type: () => movimiento_cuenta_corriente_entity_1.ConceptoMovimientoCuentaCorriente })),
    __param(3, (0, graphql_1.Args)('monto')),
    __param(4, (0, graphql_1.Args)('descripcion')),
    __param(5, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __param(6, (0, graphql_1.Args)('numeroComprobante', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, String, Number, String]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "registrarMovimiento", null);
__decorate([
    (0, graphql_1.Query)(() => Number, { name: 'saldoCuentaCorriente' }),
    __param(0, (0, graphql_1.Args)('cuentaId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "obtenerSaldo", null);
__decorate([
    (0, graphql_1.Query)(() => [movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente], { name: 'movimientosCuentaCorriente' }),
    __param(0, (0, graphql_1.Args)('cuentaId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "obtenerMovimientos", null);
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "cerrarCuenta", null);
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "suspenderCuenta", null);
__decorate([
    (0, graphql_1.Mutation)(() => cuenta_corriente_entity_1.CuentaCorriente),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentasCorrientesResolver.prototype, "activarCuenta", null);
exports.CuentasCorrientesResolver = CuentasCorrientesResolver = __decorate([
    (0, graphql_1.Resolver)(() => cuenta_corriente_entity_1.CuentaCorriente),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    __metadata("design:paramtypes", [cuentas_corrientes_service_1.CuentasCorrientesService])
], CuentasCorrientesResolver);
//# sourceMappingURL=cuentas-corrientes.resolver.js.map