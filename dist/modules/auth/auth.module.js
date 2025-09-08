"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const user_entity_1 = require("../users-auth/entities/user.entity");
const user_role_entity_1 = require("../users-auth/entities/user-role.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const refresh_token_entity_1 = require("../users-auth/entities/refresh-token.entity");
const user_provider_entity_1 = require("../users-auth/entities/user-provider.entity");
const google_strategy_1 = require("./strategies/google.strategy");
const instagram_strategy_1 = require("./strategies/instagram.strategy");
const oauthProviders = [];
if (process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL) {
    oauthProviders.push(google_strategy_1.GoogleStrategy);
}
if (process.env.INSTAGRAM_CLIENT_ID &&
    process.env.INSTAGRAM_CLIENT_SECRET &&
    process.env.INSTAGRAM_REDIRECT_URI) {
    oauthProviders.push(instagram_strategy_1.InstagramStrategy);
}
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserAuth, user_role_entity_1.UserRole, role_entity_1.Role, role_permission_entity_1.RolePermission, permission_entity_1.Permission, refresh_token_entity_1.RefreshToken, user_provider_entity_1.UserProvider]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'change_me',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, ...oauthProviders],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map