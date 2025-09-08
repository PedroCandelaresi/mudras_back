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
exports.UserAuth = void 0;
const typeorm_1 = require("typeorm");
const user_provider_entity_1 = require("../../users-auth/entities/user-provider.entity");
const user_role_entity_1 = require("../../users-auth/entities/user-role.entity");
const refresh_token_entity_1 = require("../../users-auth/entities/refresh-token.entity");
let UserAuth = class UserAuth {
};
exports.UserAuth = UserAuth;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], UserAuth.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, nullable: true, unique: true }),
    __metadata("design:type", String)
], UserAuth.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, nullable: true, unique: true }),
    __metadata("design:type", String)
], UserAuth.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserAuth.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], UserAuth.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type', type: 'enum', enum: ['EMPRESA', 'CLIENTE'], default: 'EMPRESA' }),
    __metadata("design:type", String)
], UserAuth.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'must_change_password', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], UserAuth.prototype, "mustChangePassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], UserAuth.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], UserAuth.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], UserAuth.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_provider_entity_1.UserProvider, (up) => up.user),
    __metadata("design:type", Array)
], UserAuth.prototype, "providers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_role_entity_1.UserRole, (ur) => ur.user),
    __metadata("design:type", Array)
], UserAuth.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refresh_token_entity_1.RefreshToken, (rt) => rt.user),
    __metadata("design:type", Array)
], UserAuth.prototype, "refreshTokens", void 0);
exports.UserAuth = UserAuth = __decorate([
    (0, typeorm_1.Entity)({ name: 'mudras_auth_users' })
], UserAuth);
//# sourceMappingURL=user.entity.js.map