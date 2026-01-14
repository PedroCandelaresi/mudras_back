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
exports.ProveedoresResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const proveedores_service_1 = require("./proveedores.service");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const create_proveedor_dto_1 = require("./dto/create-proveedor.dto");
const update_proveedor_dto_1 = require("./dto/update-proveedor.dto");
const articulos_por_proveedor_dto_1 = require("./dto/articulos-por-proveedor.dto");
const rubros_por_proveedor_dto_1 = require("./dto/rubros-por-proveedor.dto");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ProveedoresResolver = class ProveedoresResolver {
    constructor(proveedoresService) {
        this.proveedoresService = proveedoresService;
    }
    findAll() {
        return this.proveedoresService.findAll();
    }
    findOne(id) {
        return this.proveedoresService.findOne(id);
    }
    findByCodigo(codigo) {
        return this.proveedoresService.findByCodigo(codigo);
    }
    findByNombre(nombre) {
        return this.proveedoresService.findByNombre(nombre);
    }
    findArticulosByProveedor(proveedorId, filtro, offset, limit) {
        return this.proveedoresService.findArticulosByProveedor(proveedorId, filtro, offset, limit);
    }
    findRubrosByProveedor(proveedorId) {
        const parsedId = Number(proveedorId);
        if (!Number.isFinite(parsedId)) {
            throw new common_1.BadRequestException('El identificador del proveedor debe ser numérico.');
        }
        return this.proveedoresService.findRubrosByProveedor(parsedId);
    }
    create(createProveedorInput) {
        return this.proveedoresService.create(createProveedorInput);
    }
    update(updateProveedorInput) {
        return this.proveedoresService.update(updateProveedorInput);
    }
    remove(id) {
        return this.proveedoresService.remove(id);
    }
};
exports.ProveedoresResolver = ProveedoresResolver;
__decorate([
    (0, graphql_1.Query)(() => [proveedor_entity_1.Proveedor], { name: 'proveedores' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => proveedor_entity_1.Proveedor, { name: 'proveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => proveedor_entity_1.Proveedor, { name: 'proveedorPorCodigo' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __param(0, (0, graphql_1.Args)('codigo', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findByCodigo", null);
__decorate([
    (0, graphql_1.Query)(() => [proveedor_entity_1.Proveedor], { name: 'proveedoresPorNombre' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __param(0, (0, graphql_1.Args)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findByNombre", null);
__decorate([
    (0, graphql_1.Query)(() => articulos_por_proveedor_dto_1.ArticulosPorProveedorResponse, { name: 'articulosPorProveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('filtro', { nullable: true })),
    __param(2, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, nullable: true })),
    __param(3, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findArticulosByProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [rubros_por_proveedor_dto_1.RubroPorProveedor], { name: 'rubrosPorProveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.read'),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findRubrosByProveedor", null);
__decorate([
    (0, graphql_1.Mutation)(() => proveedor_entity_1.Proveedor, { name: 'crearProveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.create'),
    __param(0, (0, graphql_1.Args)('createProveedorInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proveedor_dto_1.CreateProveedorInput]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "create", null);
__decorate([
    (0, graphql_1.Mutation)(() => proveedor_entity_1.Proveedor, { name: 'actualizarProveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.update'),
    __param(0, (0, graphql_1.Args)('updateProveedorInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_proveedor_dto_1.UpdateProveedorInput]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "update", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'eliminarProveedor' }),
    (0, permissions_decorator_1.Permisos)('proveedores.delete'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "remove", null);
exports.ProveedoresResolver = ProveedoresResolver = __decorate([
    (0, graphql_1.Resolver)(() => proveedor_entity_1.Proveedor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [proveedores_service_1.ProveedoresService])
], ProveedoresResolver);
//# sourceMappingURL=proveedores.resolver.js.map