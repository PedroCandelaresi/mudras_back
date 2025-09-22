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
exports.ActualizarPuntoMudrasDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let ActualizarPuntoMudrasDto = class ActualizarPuntoMudrasDto {
};
exports.ActualizarPuntoMudrasDto = ActualizarPuntoMudrasDto;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ActualizarPuntoMudrasDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], ActualizarPuntoMudrasDto.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'La descripción no puede exceder 500 caracteres' }),
    __metadata("design:type", String)
], ActualizarPuntoMudrasDto.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'La dirección no puede exceder 255 caracteres' }),
    __metadata("design:type", String)
], ActualizarPuntoMudrasDto.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'El teléfono no puede exceder 20 caracteres' }),
    __metadata("design:type", String)
], ActualizarPuntoMudrasDto.prototype, "telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener un formato válido' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El email no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], ActualizarPuntoMudrasDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ActualizarPuntoMudrasDto.prototype, "activo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ActualizarPuntoMudrasDto.prototype, "permiteVentasOnline", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ActualizarPuntoMudrasDto.prototype, "requiereAutorizacion", void 0);
exports.ActualizarPuntoMudrasDto = ActualizarPuntoMudrasDto = __decorate([
    (0, graphql_1.InputType)('ActualizarPuntoMudrasInput')
], ActualizarPuntoMudrasDto);
//# sourceMappingURL=actualizar-punto-mudras.dto.js.map