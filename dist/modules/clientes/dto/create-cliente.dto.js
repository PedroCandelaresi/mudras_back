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
exports.CreateClienteDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const cliente_entity_1 = require("../entities/cliente.entity");
let CreateClienteDto = class CreateClienteDto {
};
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "apellido", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "razonSocial", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}-\d{8}-\d{1}$/, { message: 'CUIT debe tener formato XX-XXXXXXXX-X' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "cuit", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "ciudad", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "provincia", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "codigoPostal", void 0);
__decorate([
    (0, graphql_1.Field)(() => cliente_entity_1.TipoCliente, { defaultValue: cliente_entity_1.TipoCliente.MINORISTA }),
    (0, class_validator_1.IsEnum)(cliente_entity_1.TipoCliente),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "tipo", void 0);
__decorate([
    (0, graphql_1.Field)(() => cliente_entity_1.EstadoCliente, { defaultValue: cliente_entity_1.EstadoCliente.ACTIVO }),
    (0, class_validator_1.IsEnum)(cliente_entity_1.EstadoCliente),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '2' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateClienteDto.prototype, "descuentoGeneral", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '2' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateClienteDto.prototype, "limiteCredito", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "observaciones", void 0);
exports.CreateClienteDto = CreateClienteDto = __decorate([
    (0, graphql_1.InputType)()
], CreateClienteDto);
//# sourceMappingURL=create-cliente.dto.js.map