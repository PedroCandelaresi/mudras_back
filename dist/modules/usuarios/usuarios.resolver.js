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
exports.UsuariosResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const usuarios_service_1 = require("./usuarios.service");
const usuario_entity_1 = require("./entities/usuario.entity");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const login_dto_1 = require("./dto/login.dto");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
const users_service_1 = require("../users-auth/users.service");
const usuarios_auth_dto_1 = require("./dto/usuarios-auth.dto");
let UsuariosResolver = class UsuariosResolver {
    constructor(usuariosService, usersAuthService) {
        this.usuariosService = usuariosService;
        this.usersAuthService = usersAuthService;
    }
    createUsuario(createUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }
    listarUsuariosAuth(filtros) {
        return this.usersAuthService.listar(filtros ?? {});
    }
    findAll() {
        return this.usuariosService.findAll();
    }
    findOne(id) {
        return this.usuariosService.findOne(id);
    }
    findByRol(rol) {
        return this.usuariosService.findByRol(rol);
    }
    updateUsuario(id, updateUsuarioDto) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }
    async removeUsuario(id) {
        await this.usuariosService.remove(id);
        return true;
    }
    login(loginDto) {
        return this.usuariosService.login(loginDto);
    }
    async crearUsuariosEjemplo() {
        await this.usuariosService.createUsuariosEjemplo();
        return true;
    }
};
exports.UsuariosResolver = UsuariosResolver;
__decorate([
    (0, graphql_1.Mutation)(() => usuario_entity_1.Usuario),
    __param(0, (0, graphql_1.Args)('createUsuarioInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "createUsuario", null);
__decorate([
    (0, graphql_1.Query)(() => usuarios_auth_dto_1.UsuariosAuthPaginadosModel, { name: 'usuariosAuth' }),
    __param(0, (0, graphql_1.Args)('filtros', { type: () => usuarios_auth_dto_1.ListarUsuariosAuthInput, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuarios_auth_dto_1.ListarUsuariosAuthInput]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "listarUsuariosAuth", null);
__decorate([
    (0, graphql_1.Query)(() => [usuario_entity_1.Usuario], { name: 'usuarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => usuario_entity_1.Usuario, { name: 'usuario' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [usuario_entity_1.Usuario], { name: 'usuariosPorRol' }),
    __param(0, (0, graphql_1.Args)('rol', { type: () => usuario_entity_1.RolUsuario })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "findByRol", null);
__decorate([
    (0, graphql_1.Mutation)(() => usuario_entity_1.Usuario),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('updateUsuarioInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "updateUsuario", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuariosResolver.prototype, "removeUsuario", null);
__decorate([
    (0, graphql_1.Mutation)(() => usuario_entity_1.Usuario),
    __param(0, (0, graphql_1.Args)('loginInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], UsuariosResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosResolver.prototype, "crearUsuariosEjemplo", null);
exports.UsuariosResolver = UsuariosResolver = __decorate([
    (0, graphql_1.Resolver)(() => usuario_entity_1.Usuario),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        users_service_1.UsersService])
], UsuariosResolver);
//# sourceMappingURL=usuarios.resolver.js.map