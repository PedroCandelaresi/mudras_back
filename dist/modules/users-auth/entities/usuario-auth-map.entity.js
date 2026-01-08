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
exports.UsuarioAuthMap = void 0;
const typeorm_1 = require("typeorm");
let UsuarioAuthMap = class UsuarioAuthMap {
};
exports.UsuarioAuthMap = UsuarioAuthMap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UsuarioAuthMap.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id', type: 'int' }),
    __metadata("design:type", Number)
], UsuarioAuthMap.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auth_user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], UsuarioAuthMap.prototype, "authUserId", void 0);
exports.UsuarioAuthMap = UsuarioAuthMap = __decorate([
    (0, typeorm_1.Entity)('mudras_usuarios_auth_map')
], UsuarioAuthMap);
//# sourceMappingURL=usuario-auth-map.entity.js.map