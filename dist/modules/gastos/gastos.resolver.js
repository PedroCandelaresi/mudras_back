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
exports.GastosResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gastos_service_1 = require("./gastos.service");
const gasto_entity_1 = require("./entities/gasto.entity");
const categoria_gasto_entity_1 = require("./entities/categoria-gasto.entity");
const crear_gasto_dto_1 = require("./dto/crear-gasto.dto");
const actualizar_gasto_dto_1 = require("./dto/actualizar-gasto.dto");
const crear_categoria_gasto_dto_1 = require("./dto/crear-categoria-gasto.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let GastosResolver = class GastosResolver {
    constructor(service) {
        this.service = service;
    }
    gastos(desde, hasta, categoriaId, proveedorId) {
        return this.service.listar(desde, hasta, categoriaId, proveedorId);
    }
    categoriasGasto() {
        return this.service.listarCategorias();
    }
    crearGasto(input) {
        return this.service.crear(input);
    }
    actualizarGasto(input) {
        return this.service.actualizar(input);
    }
    eliminarGasto(id) {
        return this.service.eliminar(id);
    }
    crearCategoriaGasto(input) {
        return this.service.crearCategoria(input);
    }
};
exports.GastosResolver = GastosResolver;
__decorate([
    (0, graphql_1.Query)(() => [gasto_entity_1.Gasto]),
    (0, permissions_decorator_1.Permisos)('gastos.read'),
    __param(0, (0, graphql_1.Args)('desde', { nullable: true })),
    __param(1, (0, graphql_1.Args)('hasta', { nullable: true })),
    __param(2, (0, graphql_1.Args)('categoriaId', { type: () => graphql_1.Int, nullable: true })),
    __param(3, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "gastos", null);
__decorate([
    (0, graphql_1.Query)(() => [categoria_gasto_entity_1.CategoriaGasto]),
    (0, permissions_decorator_1.Permisos)('gastos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "categoriasGasto", null);
__decorate([
    (0, graphql_1.Mutation)(() => gasto_entity_1.Gasto),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('gastos.create'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_gasto_dto_1.CrearGastoDto]),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "crearGasto", null);
__decorate([
    (0, graphql_1.Mutation)(() => gasto_entity_1.Gasto),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('gastos.update'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_gasto_dto_1.ActualizarGastoDto]),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "actualizarGasto", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('gastos.delete'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "eliminarGasto", null);
__decorate([
    (0, graphql_1.Mutation)(() => categoria_gasto_entity_1.CategoriaGasto),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('gastos.update'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_categoria_gasto_dto_1.CrearCategoriaGastoDto]),
    __metadata("design:returntype", void 0)
], GastosResolver.prototype, "crearCategoriaGasto", null);
exports.GastosResolver = GastosResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [gastos_service_1.GastosService])
], GastosResolver);
//# sourceMappingURL=gastos.resolver.js.map