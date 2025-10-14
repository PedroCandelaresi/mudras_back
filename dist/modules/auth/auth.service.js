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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users-auth/entities/user.entity");
const user_role_entity_1 = require("../users-auth/entities/user-role.entity");
const refresh_token_entity_1 = require("../users-auth/entities/refresh-token.entity");
const crypto_1 = require("crypto");
const role_entity_1 = require("../roles/entities/role.entity");
const user_provider_entity_1 = require("../users-auth/entities/user-provider.entity");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
function parseDurationMs(input) {
    const match = String(input).trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
    if (!match)
        return Number(input) || 0;
    const value = Number(match[1]);
    const unit = (match[2] || 'ms').toLowerCase();
    switch (unit) {
        case 'ms': return value;
        case 's': return value * 1000;
        case 'm': return value * 60000;
        case 'h': return value * 3600000;
        case 'd': return value * 86400000;
        default: return value;
    }
}
let AuthService = class AuthService {
    constructor(usersRepo, userRolesRepo, rolesRepo, providersRepo, refreshRepo, rolePermRepo, permsRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.userRolesRepo = userRolesRepo;
        this.rolesRepo = rolesRepo;
        this.providersRepo = providersRepo;
        this.refreshRepo = refreshRepo;
        this.rolePermRepo = rolePermRepo;
        this.permsRepo = permsRepo;
        this.jwtService = jwtService;
    }
    async validateUser(username, plainPassword) {
        const user = await this.usersRepo.findOne({ where: { username } });
        if (!user || !user.isActive || user.userType !== 'EMPRESA') {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('Usuario sin contraseña local');
        }
        const ok = await bcrypt.compare(plainPassword, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return user;
    }
    async getUserRolesSlugs(userId) {
        const rows = await this.userRolesRepo.find({ where: { userId }, relations: ['role'] });
        return rows.map((r) => r.role.slug);
    }
    async obtenerPermisosEfectivos(userId) {
        const userRoles = await this.userRolesRepo.find({ where: { userId } });
        const roleIds = userRoles.map((ur) => ur.roleId);
        if (roleIds.length === 0)
            return [];
        const rolePerms = await this.rolePermRepo.find({ where: { roleId: (0, typeorm_2.In)(roleIds) }, relations: ['permission'] });
        const set = new Set();
        for (const rp of rolePerms) {
            if (rp.permission)
                set.add(`${rp.permission.resource}.${rp.permission.action}`);
        }
        const roles = await this.getUserRolesSlugs(userId);
        if (roles.includes('administrador'))
            set.add('*');
        return Array.from(set);
    }
    async emitirTokens(user) {
        const roles = await this.getUserRolesSlugs(user.id);
        const perms = await this.obtenerPermisosEfectivos(user.id);
        const payload = {
            sub: user.id,
            username: user.username,
            roles,
            typ: user.userType,
            perms,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const opaque = (0, crypto_1.randomUUID)();
        const tokenHash = await bcrypt.hash(opaque, 10);
        const refresh = this.refreshRepo.create({
            id: (0, crypto_1.randomUUID)(),
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d')),
            revoked: false,
        });
        await this.refreshRepo.save(refresh);
        return { accessToken, refreshToken: opaque };
    }
    async refrescarTokens(refreshToken) {
        const rows = await this.refreshRepo.find({ where: { revoked: false } });
        let match = null;
        for (const row of rows) {
            const ok = await bcrypt.compare(refreshToken, row.tokenHash);
            if (ok) {
                match = row;
                break;
            }
        }
        if (!match || match.expiresAt.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
        const user = await this.usersRepo.findOne({ where: { id: match.userId } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Usuario inválido');
        }
        match.revoked = true;
        await this.refreshRepo.save(match);
        return this.emitirTokens(user);
    }
    async logout(refreshToken) {
        const rows = await this.refreshRepo.find({ where: { revoked: false } });
        for (const row of rows) {
            const ok = await bcrypt.compare(refreshToken, row.tokenHash);
            if (ok) {
                row.revoked = true;
                await this.refreshRepo.save(row);
                break;
            }
        }
    }
    async handleOAuthLogin(input) {
        if (input.email) {
            const interno = await this.usersRepo.findOne({ where: { email: input.email } });
            if (interno && interno.userType === 'EMPRESA') {
                throw new common_1.UnauthorizedException('El email pertenece a un usuario interno');
            }
        }
        let provider = await this.providersRepo.findOne({ where: { provider: input.provider, providerUserId: input.providerUserId } });
        let user = null;
        if (provider) {
            user = await this.usersRepo.findOne({ where: { id: provider.userId } });
        }
        if (!user) {
            user = this.usersRepo.create({
                id: (0, crypto_1.randomUUID)(),
                username: null,
                email: input.email,
                displayName: input.displayName,
                userType: 'CLIENTE',
                mustChangePassword: false,
                isActive: true,
                passwordHash: null,
            });
            await this.usersRepo.save(user);
            const rolCliente = await this.rolesRepo.findOne({ where: { slug: 'cliente' } });
            if (rolCliente) {
                await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rolCliente.id }));
            }
        }
        if (!provider) {
            provider = this.providersRepo.create({
                id: (0, crypto_1.randomUUID)(),
                userId: user.id,
                provider: input.provider,
                providerUserId: input.providerUserId,
                email: input.email,
                accessToken: input.accessToken,
                refreshToken: input.refreshToken,
            });
        }
        else {
            provider.email = input.email;
            provider.accessToken = input.accessToken;
            provider.refreshToken = input.refreshToken;
        }
        await this.providersRepo.save(provider);
        const tokens = await this.emitirTokens(user);
        return { ...tokens, user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserAuth)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(user_provider_entity_1.UserProvider)),
    __param(4, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(5, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(6, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map