"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let SecretKeyGuard = class SecretKeyGuard {
    canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const secretKey = request.headers['x-secret-key'];
        const expectedSecretKey = process.env.X_SECRET_KEY;
        if (!expectedSecretKey) {
            throw new common_1.UnauthorizedException('Configuración de seguridad no encontrada');
        }
        if (!secretKey || secretKey !== expectedSecretKey) {
            throw new common_1.UnauthorizedException('Clave secreta inválida o faltante');
        }
        return true;
    }
};
exports.SecretKeyGuard = SecretKeyGuard;
exports.SecretKeyGuard = SecretKeyGuard = __decorate([
    (0, common_1.Injectable)()
], SecretKeyGuard);
//# sourceMappingURL=secret-key.guard.js.map