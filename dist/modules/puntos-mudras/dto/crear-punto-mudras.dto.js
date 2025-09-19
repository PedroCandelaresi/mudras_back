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
exports.CrearPuntoMudrasDto = exports.ConfiguracionEspecialInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const punto_mudras_entity_1 = require("../entities/punto-mudras.entity");
let ConfiguracionEspecialInput = class ConfiguracionEspecialInput {
};
exports.ConfiguracionEspecialInput = ConfiguracionEspecialInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracionEspecialInput.prototype, "ventasOnline", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracionEspecialInput.prototype, "requiereAutorizacion", void 0);
exports.ConfiguracionEspecialInput = ConfiguracionEspecialInput = __decorate([
    (0, graphql_1.InputType)()
], ConfiguracionEspecialInput);
let CrearPuntoMudrasDto = class CrearPuntoMudrasDto {
};
exports.CrearPuntoMudrasDto = CrearPuntoMudrasDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.TipoPuntoMudras),
    (0, class_validator_1.IsEnum)(punto_mudras_entity_1.TipoPuntoMudras, { message: 'El tipo debe ser "venta" o "deposito"' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "tipo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'La descripción no puede exceder 500 caracteres' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'La dirección no puede exceder 255 caracteres' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'El teléfono no puede exceder 20 caracteres' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener un formato válido' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El email no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], CrearPuntoMudrasDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearPuntoMudrasDto.prototype, "activo", void 0);
__decorate([
    (0, graphql_1.Field)(() => ConfiguracionEspecialInput, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ConfiguracionEspecialInput),
    __metadata("design:type", ConfiguracionEspecialInput)
], CrearPuntoMudrasDto.prototype, "configuracionEspecial", void 0);
exports.CrearPuntoMudrasDto = CrearPuntoMudrasDto = __decorate([
    (0, graphql_1.InputType)()
], CrearPuntoMudrasDto);
//# sourceMappingURL=crear-punto-mudras.dto.js.map