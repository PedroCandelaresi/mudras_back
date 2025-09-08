"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersAuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_provider_entity_1 = require("./entities/user-provider.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
let UsersAuthModule = class UsersAuthModule {
};
exports.UsersAuthModule = UsersAuthModule;
exports.UsersAuthModule = UsersAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserAuth, user_provider_entity_1.UserProvider, user_role_entity_1.UserRole, refresh_token_entity_1.RefreshToken, role_entity_1.Role])],
        providers: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController],
        exports: [typeorm_1.TypeOrmModule, users_service_1.UsersService],
    })
], UsersAuthModule);
//# sourceMappingURL=users-auth.module.js.map