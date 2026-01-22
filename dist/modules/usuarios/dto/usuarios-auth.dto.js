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
exports.ActualizarUsuarioAuthInput = exports.CrearUsuarioAuthInput = exports.UsuarioCajaAuthModel = exports.UsuariosAuthPaginadosModel = exports.UsuarioAuthResumenModel = exports.ListarUsuariosAuthInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let ListarUsuariosAuthInput = class ListarUsuariosAuthInput {
};
exports.ListarUsuariosAuthInput = ListarUsuariosAuthInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ListarUsuariosAuthInput.prototype, "pagina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ListarUsuariosAuthInput.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListarUsuariosAuthInput.prototype, "busqueda", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListarUsuariosAuthInput.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListarUsuariosAuthInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListarUsuariosAuthInput.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListarUsuariosAuthInput.prototype, "estado", void 0);
exports.ListarUsuariosAuthInput = ListarUsuariosAuthInput = __decorate([
    (0, graphql_1.InputType)()
], ListarUsuariosAuthInput);
let UsuarioAuthResumenModel = class UsuarioAuthResumenModel {
};
exports.UsuarioAuthResumenModel = UsuarioAuthResumenModel;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioAuthResumenModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioAuthResumenModel.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioAuthResumenModel.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioAuthResumenModel.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioAuthResumenModel.prototype, "userType", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UsuarioAuthResumenModel.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UsuarioAuthResumenModel.prototype, "mustChangePassword", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], UsuarioAuthResumenModel.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], UsuarioAuthResumenModel.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], UsuarioAuthResumenModel.prototype, "roles", void 0);
exports.UsuarioAuthResumenModel = UsuarioAuthResumenModel = __decorate([
    (0, graphql_1.ObjectType)()
], UsuarioAuthResumenModel);
let UsuariosAuthPaginadosModel = class UsuariosAuthPaginadosModel {
};
exports.UsuariosAuthPaginadosModel = UsuariosAuthPaginadosModel;
__decorate([
    (0, graphql_1.Field)(() => [UsuarioAuthResumenModel]),
    __metadata("design:type", Array)
], UsuariosAuthPaginadosModel.prototype, "items", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], UsuariosAuthPaginadosModel.prototype, "total", void 0);
exports.UsuariosAuthPaginadosModel = UsuariosAuthPaginadosModel = __decorate([
    (0, graphql_1.ObjectType)()
], UsuariosAuthPaginadosModel);
let UsuarioCajaAuthModel = class UsuarioCajaAuthModel {
};
exports.UsuarioCajaAuthModel = UsuarioCajaAuthModel;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioCajaAuthModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioCajaAuthModel.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioCajaAuthModel.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioCajaAuthModel.prototype, "displayName", void 0);
exports.UsuarioCajaAuthModel = UsuarioCajaAuthModel = __decorate([
    (0, graphql_1.ObjectType)()
], UsuarioCajaAuthModel);
let CrearUsuarioAuthInput = class CrearUsuarioAuthInput {
};
exports.CrearUsuarioAuthInput = CrearUsuarioAuthInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CrearUsuarioAuthInput.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CrearUsuarioAuthInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CrearUsuarioAuthInput.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CrearUsuarioAuthInput.prototype, "passwordTemporal", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CrearUsuarioAuthInput.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CrearUsuarioAuthInput.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CrearUsuarioAuthInput.prototype, "userType", void 0);
exports.CrearUsuarioAuthInput = CrearUsuarioAuthInput = __decorate([
    (0, graphql_1.InputType)()
], CrearUsuarioAuthInput);
let ActualizarUsuarioAuthInput = class ActualizarUsuarioAuthInput {
};
exports.ActualizarUsuarioAuthInput = ActualizarUsuarioAuthInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ActualizarUsuarioAuthInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ActualizarUsuarioAuthInput.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], ActualizarUsuarioAuthInput.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ActualizarUsuarioAuthInput.prototype, "roles", void 0);
exports.ActualizarUsuarioAuthInput = ActualizarUsuarioAuthInput = __decorate([
    (0, graphql_1.InputType)()
], ActualizarUsuarioAuthInput);
//# sourceMappingURL=usuarios-auth.dto.js.map