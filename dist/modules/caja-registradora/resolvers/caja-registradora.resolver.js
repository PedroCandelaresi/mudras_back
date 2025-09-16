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
exports.CajaRegistradoraResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users-auth/entities/user.entity");
const caja_registradora_service_1 = require("../services/caja-registradora.service");
const afip_service_1 = require("../services/afip.service");
const venta_caja_entity_1 = require("../entities/venta-caja.entity");
const puesto_venta_entity_1 = require("../entities/puesto-venta.entity");
const comprobante_afip_entity_1 = require("../entities/comprobante-afip.entity");
const crear_venta_caja_dto_1 = require("../dto/crear-venta-caja.dto");
const buscar_articulo_dto_1 = require("../dto/buscar-articulo.dto");
const historial_ventas_dto_1 = require("../dto/historial-ventas.dto");
let CajaRegistradoraResolver = class CajaRegistradoraResolver {
    constructor(cajaRegistradoraService, afipService) {
        this.cajaRegistradoraService = cajaRegistradoraService;
        this.afipService = afipService;
    }
    async buscarArticulosCaja(input) {
        return this.cajaRegistradoraService.buscarArticulos(input);
    }
    async obtenerPuestosVenta() {
        return this.cajaRegistradoraService.obtenerPuestosVenta();
    }
    async obtenerHistorialVentas(filtros) {
        return this.cajaRegistradoraService.obtenerHistorialVentas(filtros);
    }
    async obtenerDetalleVenta(id) {
        return this.cajaRegistradoraService.obtenerDetalleVenta(id);
    }
    async crearVentaCaja(input, usuario) {
        const usuarioId = parseInt(usuario.id);
        return this.cajaRegistradoraService.crearVenta(input, usuarioId);
    }
    async cancelarVentaCaja(id, motivo, usuario) {
        const usuarioId = usuario?.id ? parseInt(usuario.id) : undefined;
        return this.cajaRegistradoraService.cancelarVenta(id, usuarioId, motivo);
    }
    async procesarDevolucion(ventaOriginalId, articulosDevolver, motivo, usuario) {
        const articulos = JSON.parse(articulosDevolver);
        const usuarioId = usuario?.id ? parseInt(usuario.id) : undefined;
        return this.cajaRegistradoraService.procesarDevolucion(ventaOriginalId, articulos, usuarioId, motivo);
    }
    async obtenerComprobantesAfip(ventaId) {
        return this.afipService.obtenerComprobantesVenta(ventaId);
    }
    async reintentarEmisionAfip(comprobanteId) {
        return this.afipService.reintentarEmision(comprobanteId);
    }
    async obtenerComprobantesPendientes() {
        return this.afipService.obtenerComprobantesPendientes();
    }
};
exports.CajaRegistradoraResolver = CajaRegistradoraResolver;
__decorate([
    (0, graphql_1.Query)(() => [buscar_articulo_dto_1.ArticuloConStock]),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [buscar_articulo_dto_1.BuscarArticuloInput]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "buscarArticulosCaja", null);
__decorate([
    (0, graphql_1.Query)(() => [puesto_venta_entity_1.PuestoVenta]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "obtenerPuestosVenta", null);
__decorate([
    (0, graphql_1.Query)(() => historial_ventas_dto_1.HistorialVentasResponse),
    __param(0, (0, graphql_1.Args)('filtros')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [historial_ventas_dto_1.FiltrosHistorialInput]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "obtenerHistorialVentas", null);
__decorate([
    (0, graphql_1.Query)(() => venta_caja_entity_1.VentaCaja, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "obtenerDetalleVenta", null);
__decorate([
    (0, graphql_1.Mutation)(() => venta_caja_entity_1.VentaCaja),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_venta_caja_dto_1.CrearVentaCajaInput,
        user_entity_1.UserAuth]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "crearVentaCaja", null);
__decorate([
    (0, graphql_1.Mutation)(() => venta_caja_entity_1.VentaCaja),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('motivo', { nullable: true })),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, user_entity_1.UserAuth]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "cancelarVentaCaja", null);
__decorate([
    (0, graphql_1.Mutation)(() => venta_caja_entity_1.VentaCaja),
    __param(0, (0, graphql_1.Args)('ventaOriginalId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('articulosDevolver')),
    __param(2, (0, graphql_1.Args)('motivo', { nullable: true })),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, user_entity_1.UserAuth]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "procesarDevolucion", null);
__decorate([
    (0, graphql_1.Query)(() => [comprobante_afip_entity_1.ComprobanteAfip]),
    __param(0, (0, graphql_1.Args)('ventaId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "obtenerComprobantesAfip", null);
__decorate([
    (0, graphql_1.Mutation)(() => comprobante_afip_entity_1.ComprobanteAfip),
    __param(0, (0, graphql_1.Args)('comprobanteId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "reintentarEmisionAfip", null);
__decorate([
    (0, graphql_1.Query)(() => [comprobante_afip_entity_1.ComprobanteAfip]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CajaRegistradoraResolver.prototype, "obtenerComprobantesPendientes", null);
exports.CajaRegistradoraResolver = CajaRegistradoraResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [caja_registradora_service_1.CajaRegistradoraService,
        afip_service_1.AfipService])
], CajaRegistradoraResolver);
//# sourceMappingURL=caja-registradora.resolver.js.map