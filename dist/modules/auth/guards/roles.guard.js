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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const roles_decorator_1 = require("../decorators/roles.decorator");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISOS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles && !requiredPermissions) {
            return true;
        }
        const gqlContext = graphql_1.GqlExecutionContext.create(context);
        const ctx = gqlContext.getContext();
        const request = ctx?.req ?? context.switchToHttp().getRequest();
        const user = request?.user;
        if (!user) {
            return false;
        }
        const roles = Array.isArray(user.roles)
            ? user.roles.map((role) => role?.toLowerCase?.() ?? String(role ?? '').toLowerCase())
            : [];
        const permisos = Array.isArray(user.perms)
            ? user.perms.map((perm) => String(perm))
            : Array.isArray(user.permissions)
                ? user.permissions.map((perm) => String(perm))
                : [];
        if (roles.includes('administrador') || roles.includes('admin')) {
            return true;
        }
        if (requiredRoles) {
            const rolesNormalizados = requiredRoles.map((role) => role.toLowerCase());
            const tieneRol = roles.some((role) => rolesNormalizados.includes(role));
            if (!tieneRol) {
                return false;
            }
        }
        if (requiredPermissions) {
            if (permisos.includes('*')) {
                return true;
            }
            const tienePermisos = requiredPermissions.every((permiso) => permisos.includes(permiso));
            if (!tienePermisos) {
                return false;
            }
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map