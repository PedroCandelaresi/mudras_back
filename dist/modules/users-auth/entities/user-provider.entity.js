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
exports.UserProvider = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserProvider = class UserProvider {
};
exports.UserProvider = UserProvider;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], UserProvider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], UserProvider.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserAuth, (u) => u.providers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserAuth)
], UserProvider.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['google', 'instagram'] }),
    __metadata("design:type", String)
], UserProvider.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_user_id', type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], UserProvider.prototype, "providerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, nullable: true }),
    __metadata("design:type", String)
], UserProvider.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_token', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserProvider.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserProvider.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], UserProvider.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], UserProvider.prototype, "updatedAt", void 0);
exports.UserProvider = UserProvider = __decorate([
    (0, typeorm_1.Entity)({ name: 'mudras_auth_user_providers' }),
    (0, typeorm_1.Index)('idx_provider_user', ['provider', 'providerUserId'])
], UserProvider);
//# sourceMappingURL=user-provider.entity.js.map