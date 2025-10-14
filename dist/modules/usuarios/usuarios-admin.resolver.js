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
exports.UsuariosAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users-auth/users.service");
const usuarios_auth_dto_1 = require("./dto/usuarios-auth.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const usuarios_service_1 = require("./usuarios.service");
const usuario_entity_1 = require("./entities/usuario.entity");
let UsuariosAdminResolver = class UsuariosAdminResolver {
    constructor(usersService, usuariosGestionService) {
        this.usersService = usersService;
        this.usuariosGestionService = usuariosGestionService;
    }
    listarUsuariosAdmin(filtros) {
        return this.usersService.listar(filtros ?? {});
    }
    obtenerUsuarioAdmin(id) {
        return this.usersService.obtener(id);
    }
    crearUsuarioAdmin(input) {
        return this.usersService.crear({
            username: input.username,
            email: input.email ?? null,
            displayName: input.displayName,
            passwordTemporal: input.passwordTemporal,
            isActive: input.isActive,
            roles: input.roles,
        });
    }
    actualizarUsuarioAdmin(id, input) {
        return this.usersService.actualizar({
            id,
            email: input.email,
            displayName: input.displayName,
            isActive: input.isActive,
            roles: input.roles,
        });
    }
    eliminarUsuarioAdmin(id) {
        return this.usersService.eliminar(id);
    }
    asignarRolesUsuarioAdmin(id, roles) {
        return this.usersService.asignarRoles(id, roles);
    }
    async listarUsuariosGestionPorRol(rol) {
        console.log('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:start', { rol });
        try {
            const resultado = await this.usuariosGestionService.findByRol(rol);
            console.log('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:resultado', { rol, cantidad: resultado?.length ?? 0 });
            return resultado;
        }
        catch (error) {
            console.error('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:error', { rol, error });
            throw error;
        }
    }
};
exports.UsuariosAdminResolver = UsuariosAdminResolver;
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Query)(() => usuarios_auth_dto_1.UsuariosAuthPaginadosModel, { name: 'usuariosAdmin' }),
    __param(0, (0, graphql_1.Args)('filtros', { type: () => usuarios_auth_dto_1.ListarUsuariosAuthInput, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuarios_auth_dto_1.ListarUsuariosAuthInput]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "listarUsuariosAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Query)(() => usuarios_auth_dto_1.UsuarioAuthResumenModel, { name: 'usuarioAdmin' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "obtenerUsuarioAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Mutation)(() => usuarios_auth_dto_1.UsuarioAuthResumenModel, { name: 'crearUsuarioAdmin' }),
    __param(0, (0, graphql_1.Args)('input', { type: () => usuarios_auth_dto_1.CrearUsuarioAuthInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuarios_auth_dto_1.CrearUsuarioAuthInput]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "crearUsuarioAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Mutation)(() => usuarios_auth_dto_1.UsuarioAuthResumenModel, { name: 'actualizarUsuarioAdmin' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __param(1, (0, graphql_1.Args)('input', { type: () => usuarios_auth_dto_1.ActualizarUsuarioAuthInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, usuarios_auth_dto_1.ActualizarUsuarioAuthInput]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "actualizarUsuarioAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Mutation)(() => Boolean, { name: 'eliminarUsuarioAdmin' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "eliminarUsuarioAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)('administrador'),
    (0, graphql_1.Mutation)(() => usuarios_auth_dto_1.UsuarioAuthResumenModel, { name: 'asignarRolesUsuarioAdmin' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __param(1, (0, graphql_1.Args)('roles', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], UsuariosAdminResolver.prototype, "asignarRolesUsuarioAdmin", null);
__decorate([
    (0, permissions_decorator_1.Permisos)('caja.read'),
    (0, graphql_1.Query)(() => [usuario_entity_1.Usuario], { name: 'usuariosGestionPorRol' }),
    __param(0, (0, graphql_1.Args)('rol', { type: () => usuario_entity_1.RolUsuario })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosAdminResolver.prototype, "listarUsuariosGestionPorRol", null);
exports.UsuariosAdminResolver = UsuariosAdminResolver = __decorate([
    (0, graphql_1.Resolver)(() => usuarios_auth_dto_1.UsuarioAuthResumenModel),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        usuarios_service_1.UsuariosService])
], UsuariosAdminResolver);
//# sourceMappingURL=usuarios-admin.resolver.js.map