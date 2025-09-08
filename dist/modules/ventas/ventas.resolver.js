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
exports.TopArticulo = exports.ResumenVentas = exports.VentasPorTipoPago = exports.DetalleVentaInput = exports.VentasResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const ventas_service_1 = require("./ventas.service");
const venta_entity_1 = require("./entities/venta.entity");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let VentasResolver = class VentasResolver {
    constructor(ventasService) {
        this.ventasService = ventasService;
    }
    crearVenta(clienteId, usuarioId, tipoPago, detalles, descuentoGeneral, observaciones) {
        return this.ventasService.crearVenta(clienteId, usuarioId, tipoPago, detalles, descuentoGeneral, observaciones);
    }
    findAll() {
        return this.ventasService.findAll();
    }
    obtenerVenta(id) {
        return this.ventasService.obtenerVenta(id);
    }
    obtenerVentasPorCliente(clienteId) {
        return this.ventasService.obtenerVentasPorCliente(clienteId);
    }
    obtenerVentasPorUsuario(usuarioId) {
        return this.ventasService.obtenerVentasPorUsuario(usuarioId);
    }
    obtenerVentasPorFecha(fechaDesde, fechaHasta) {
        return this.ventasService.obtenerVentasPorFecha(fechaDesde, fechaHasta);
    }
    confirmarVenta(id) {
        return this.ventasService.confirmarVenta(id);
    }
    cancelarVenta(id, motivoCancelacion) {
        return this.ventasService.cancelarVenta(id, motivoCancelacion);
    }
    obtenerResumenVentas(fechaDesde, fechaHasta) {
        return this.ventasService.obtenerResumenVentas(fechaDesde, fechaHasta);
    }
    obtenerTopArticulos(fechaDesde, fechaHasta, limite) {
        return this.ventasService.obtenerTopArticulos(fechaDesde, fechaHasta, limite);
    }
};
exports.VentasResolver = VentasResolver;
__decorate([
    (0, graphql_1.Mutation)(() => venta_entity_1.Venta),
    (0, permissions_decorator_1.Permisos)('ventas.create'),
    __param(0, (0, graphql_1.Args)('clienteId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('tipoPago', { type: () => venta_entity_1.TipoPago })),
    __param(3, (0, graphql_1.Args)('detalles', { type: () => [DetalleVentaInput] })),
    __param(4, (0, graphql_1.Args)('descuentoGeneral', { defaultValue: 0 })),
    __param(5, (0, graphql_1.Args)('observaciones', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Array, Number, String]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "crearVenta", null);
__decorate([
    (0, graphql_1.Query)(() => [venta_entity_1.Venta], { name: 'ventas' }),
    (0, permissions_decorator_1.Permisos)('ventas.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => venta_entity_1.Venta, { name: 'venta' }),
    (0, permissions_decorator_1.Permisos)('ventas.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerVenta", null);
__decorate([
    (0, graphql_1.Query)(() => [venta_entity_1.Venta], { name: 'ventasPorCliente' }),
    (0, permissions_decorator_1.Permisos)('ventas.read'),
    __param(0, (0, graphql_1.Args)('clienteId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerVentasPorCliente", null);
__decorate([
    (0, graphql_1.Query)(() => [venta_entity_1.Venta], { name: 'ventasPorUsuario' }),
    (0, permissions_decorator_1.Permisos)('ventas.read'),
    __param(0, (0, graphql_1.Args)('usuarioId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerVentasPorUsuario", null);
__decorate([
    (0, graphql_1.Query)(() => [venta_entity_1.Venta], { name: 'ventasPorFecha' }),
    (0, permissions_decorator_1.Permisos)('ventas.read'),
    __param(0, (0, graphql_1.Args)('fechaDesde')),
    __param(1, (0, graphql_1.Args)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerVentasPorFecha", null);
__decorate([
    (0, graphql_1.Mutation)(() => venta_entity_1.Venta),
    (0, permissions_decorator_1.Permisos)('ventas.update'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "confirmarVenta", null);
__decorate([
    (0, graphql_1.Mutation)(() => venta_entity_1.Venta),
    (0, permissions_decorator_1.Permisos)('ventas.update'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('motivoCancelacion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "cancelarVenta", null);
__decorate([
    (0, graphql_1.Query)(() => ResumenVentas, { name: 'resumenVentas' }),
    __param(0, (0, graphql_1.Args)('fechaDesde')),
    __param(1, (0, graphql_1.Args)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerResumenVentas", null);
__decorate([
    (0, graphql_1.Query)(() => [TopArticulo], { name: 'topArticulos' }),
    __param(0, (0, graphql_1.Args)('fechaDesde')),
    __param(1, (0, graphql_1.Args)('fechaHasta')),
    __param(2, (0, graphql_1.Args)('limite', { type: () => graphql_1.Int, defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, Number]),
    __metadata("design:returntype", void 0)
], VentasResolver.prototype, "obtenerTopArticulos", null);
exports.VentasResolver = VentasResolver = __decorate([
    (0, graphql_1.Resolver)(() => venta_entity_1.Venta),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [ventas_service_1.VentasService])
], VentasResolver);
const graphql_2 = require("@nestjs/graphql");
let DetalleVentaInput = class DetalleVentaInput {
};
exports.DetalleVentaInput = DetalleVentaInput;
__decorate([
    (0, graphql_2.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], DetalleVentaInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], DetalleVentaInput.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], DetalleVentaInput.prototype, "precioUnitario", void 0);
__decorate([
    (0, graphql_2.Field)({ nullable: true }),
    __metadata("design:type", Number)
], DetalleVentaInput.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, graphql_2.Field)({ nullable: true }),
    __metadata("design:type", Number)
], DetalleVentaInput.prototype, "descuentoMonto", void 0);
exports.DetalleVentaInput = DetalleVentaInput = __decorate([
    (0, graphql_2.InputType)()
], DetalleVentaInput);
let VentasPorTipoPago = class VentasPorTipoPago {
};
exports.VentasPorTipoPago = VentasPorTipoPago;
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], VentasPorTipoPago.prototype, "efectivo", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], VentasPorTipoPago.prototype, "tarjeta", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], VentasPorTipoPago.prototype, "transferencia", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], VentasPorTipoPago.prototype, "cuentaCorriente", void 0);
exports.VentasPorTipoPago = VentasPorTipoPago = __decorate([
    (0, graphql_2.ObjectType)()
], VentasPorTipoPago);
let ResumenVentas = class ResumenVentas {
};
exports.ResumenVentas = ResumenVentas;
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "totalVentas", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "montoTotal", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "ventasConfirmadas", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "ventasPendientes", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "ventasCanceladas", void 0);
__decorate([
    (0, graphql_2.Field)(() => VentasPorTipoPago),
    __metadata("design:type", VentasPorTipoPago)
], ResumenVentas.prototype, "ventasPorTipoPago", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], ResumenVentas.prototype, "promedioVenta", void 0);
exports.ResumenVentas = ResumenVentas = __decorate([
    (0, graphql_2.ObjectType)()
], ResumenVentas);
let TopArticulo = class TopArticulo {
};
exports.TopArticulo = TopArticulo;
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], TopArticulo.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], TopArticulo.prototype, "articuloNombre", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], TopArticulo.prototype, "cantidadVendida", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], TopArticulo.prototype, "montoTotal", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", Number)
], TopArticulo.prototype, "numeroVentas", void 0);
exports.TopArticulo = TopArticulo = __decorate([
    (0, graphql_2.ObjectType)()
], TopArticulo);
//# sourceMappingURL=ventas.resolver.js.map