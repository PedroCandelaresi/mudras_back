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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPerms = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISOS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPerms || requiredPerms.length === 0)
            return true;
        const gqlCtx = graphql_1.GqlExecutionContext.create(context);
        const req = gqlCtx.getContext()?.req ?? context.switchToHttp().getRequest();
        const user = req.user;
        const userPerms = user?.perms ?? [];
        const roles = (user?.roles ?? []).map((r) => r.toLowerCase());
        const hasByPerms = requiredPerms.some((p) => userPerms.includes(p));
        if (hasByPerms)
            return true;
        if (roles.includes('administrador'))
            return true;
        const rolePermsMap = {
            administrador: ['*'],
        };
        for (const role of roles) {
            const grants = rolePermsMap[role] || [];
            if (grants.includes('*'))
                return true;
            if (requiredPerms.some((p) => grants.includes(p)))
                return true;
        }
        return false;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map