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
exports.CreateUsuarioDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const usuario_entity_1 = require("../entities/usuario.entity");
let CreateUsuarioDto = class CreateUsuarioDto {
};
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "apellido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => usuario_entity_1.RolUsuario),
    (0, class_validator_1.IsEnum)(usuario_entity_1.RolUsuario),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "rol", void 0);
__decorate([
    (0, graphql_1.Field)(() => usuario_entity_1.EstadoUsuario, { defaultValue: usuario_entity_1.EstadoUsuario.ACTIVO }),
    (0, class_validator_1.IsEnum)(usuario_entity_1.EstadoUsuario),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '2' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "salario", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "fechaIngreso", void 0);
exports.CreateUsuarioDto = CreateUsuarioDto = __decorate([
    (0, graphql_1.InputType)()
], CreateUsuarioDto);
//# sourceMappingURL=create-usuario.dto.js.map