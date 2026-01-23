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
exports.RolesResolver = exports.PermissionPublic = exports.RolePublic = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const role_inputs_1 = require("./dto/role.inputs");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let RolePublic = class RolePublic {
};
exports.RolePublic = RolePublic;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RolePublic.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RolePublic.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RolePublic.prototype, "slug", void 0);
exports.RolePublic = RolePublic = __decorate([
    (0, graphql_1.ObjectType)()
], RolePublic);
let PermissionPublic = class PermissionPublic {
};
exports.PermissionPublic = PermissionPublic;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PermissionPublic.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PermissionPublic.prototype, "resource", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PermissionPublic.prototype, "action", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PermissionPublic.prototype, "attributes", void 0);
exports.PermissionPublic = PermissionPublic = __decorate([
    (0, graphql_1.ObjectType)()
], PermissionPublic);
let RolesResolver = class RolesResolver {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async roles() {
        const all = await this.rolesService.listar();
        return all.map((r) => ({
            id: r.id,
            nombre: r.name,
            slug: r.slug,
        }));
    }
    async permisos() {
        return this.rolesService.listarPermisos();
    }
    async crearRol(input) {
        const r = await this.rolesService.crear(input);
        return {
            id: r.id,
            nombre: r.name,
            slug: r.slug,
        };
    }
    async actualizarRol(input) {
        const r = await this.rolesService.actualizar(input);
        return {
            id: r.id,
            nombre: r.name,
            slug: r.slug,
        };
    }
    async eliminarRol(id) {
        return this.rolesService.eliminar(id);
    }
    async asignarPermisosRol(id, permissions) {
        const result = await this.rolesService.asignarPermisos(id, permissions);
        return result.ok;
    }
};
exports.RolesResolver = RolesResolver;
__decorate([
    (0, graphql_1.Query)(() => [RolePublic], { name: 'roles' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "roles", null);
__decorate([
    (0, graphql_1.Query)(() => [PermissionPublic], { name: 'permisos' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "permisos", null);
__decorate([
    (0, graphql_1.Mutation)(() => RolePublic, { name: 'crearRol' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_inputs_1.CrearRolInput]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "crearRol", null);
__decorate([
    (0, graphql_1.Mutation)(() => RolePublic, { name: 'actualizarRol' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_inputs_1.ActualizarRolInput]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "actualizarRol", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'eliminarRol' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "eliminarRol", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'asignarPermisosRol' }),
    (0, roles_decorator_1.Roles)('administrador'),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('permissions', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "asignarPermisosRol", null);
exports.RolesResolver = RolesResolver = __decorate([
    (0, graphql_1.Resolver)(() => RolePublic),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesResolver);
//# sourceMappingURL=roles.resolver.js.map