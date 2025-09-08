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
exports.CrearPromocionInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const promocion_entity_1 = require("../entities/promocion.entity");
let CrearPromocionInput = class CrearPromocionInput {
};
exports.CrearPromocionInput = CrearPromocionInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CrearPromocionInput.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearPromocionInput.prototype, "inicio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearPromocionInput.prototype, "fin", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(promocion_entity_1.EstadoPromocion),
    __metadata("design:type", String)
], CrearPromocionInput.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CrearPromocionInput.prototype, "descuento", void 0);
exports.CrearPromocionInput = CrearPromocionInput = __decorate([
    (0, graphql_1.InputType)()
], CrearPromocionInput);
//# sourceMappingURL=crear-promocion.input.js.map