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
exports.ComprasResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const compras_service_1 = require("./compras.service");
const orden_compra_entity_1 = require("./entities/orden-compra.entity");
const detalle_orden_compra_entity_1 = require("./entities/detalle-orden-compra.entity");
const crear_orden_compra_dto_1 = require("./dto/crear-orden-compra.dto");
const agregar_detalle_oc_dto_1 = require("./dto/agregar-detalle-oc.dto");
const recepcionar_orden_dto_1 = require("./dto/recepcionar-orden.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ComprasResolver = class ComprasResolver {
    constructor(service) {
        this.service = service;
    }
    getOrden(id) {
        return this.service.getOrden(id);
    }
    listar(estado, proveedorId) {
        return this.service.listar(estado, proveedorId);
    }
    crearOrdenCompra(input) {
        return this.service.crearOrden(input);
    }
    agregarDetalleOrden(input) {
        return this.service.agregarDetalle(input);
    }
    eliminarDetalleOrden(detalleId) {
        return this.service.eliminarDetalle(detalleId);
    }
    emitirOrdenCompra(id) {
        return this.service.emitirOrden(id);
    }
    recepcionarOrdenCompra(input) {
        return this.service.recepcionarOrden(input);
    }
};
exports.ComprasResolver = ComprasResolver;
__decorate([
    (0, graphql_1.Query)(() => orden_compra_entity_1.OrdenCompra, { name: 'ordenCompra' }),
    (0, permissions_decorator_1.Permisos)('compras.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "getOrden", null);
__decorate([
    (0, graphql_1.Query)(() => [orden_compra_entity_1.OrdenCompra], { name: 'ordenesCompra' }),
    (0, permissions_decorator_1.Permisos)('compras.read'),
    __param(0, (0, graphql_1.Args)('estado', { nullable: true, type: () => String })),
    __param(1, (0, graphql_1.Args)('proveedorId', { nullable: true, type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "listar", null);
__decorate([
    (0, graphql_1.Mutation)(() => orden_compra_entity_1.OrdenCompra),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('compras.create'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_orden_compra_dto_1.CrearOrdenCompraDto]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "crearOrdenCompra", null);
__decorate([
    (0, graphql_1.Mutation)(() => detalle_orden_compra_entity_1.DetalleOrdenCompra),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('compras.update'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agregar_detalle_oc_dto_1.AgregarDetalleOcDto]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "agregarDetalleOrden", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('compras.update'),
    __param(0, (0, graphql_1.Args)('detalleId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "eliminarDetalleOrden", null);
__decorate([
    (0, graphql_1.Mutation)(() => orden_compra_entity_1.OrdenCompra),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('compras.update'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "emitirOrdenCompra", null);
__decorate([
    (0, graphql_1.Mutation)(() => orden_compra_entity_1.OrdenCompra),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('compras.update'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recepcionar_orden_dto_1.RecepcionarOrdenDto]),
    __metadata("design:returntype", void 0)
], ComprasResolver.prototype, "recepcionarOrdenCompra", null);
exports.ComprasResolver = ComprasResolver = __decorate([
    (0, graphql_1.Resolver)(() => orden_compra_entity_1.OrdenCompra),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [compras_service_1.ComprasService])
], ComprasResolver);
//# sourceMappingURL=compras.resolver.js.map