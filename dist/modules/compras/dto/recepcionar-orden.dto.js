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
exports.RecepcionarOrdenDto = exports.DetalleRecepcionDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let DetalleRecepcionDto = class DetalleRecepcionDto {
};
exports.DetalleRecepcionDto = DetalleRecepcionDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DetalleRecepcionDto.prototype, "detalleId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DetalleRecepcionDto.prototype, "cantidadRecibida", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DetalleRecepcionDto.prototype, "costoUnitario", void 0);
exports.DetalleRecepcionDto = DetalleRecepcionDto = __decorate([
    (0, graphql_1.InputType)()
], DetalleRecepcionDto);
let RecepcionarOrdenDto = class RecepcionarOrdenDto {
};
exports.RecepcionarOrdenDto = RecepcionarOrdenDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RecepcionarOrdenDto.prototype, "ordenId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [DetalleRecepcionDto]),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DetalleRecepcionDto),
    __metadata("design:type", Array)
], RecepcionarOrdenDto.prototype, "detalles", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Si se especifica, recepciona en ese punto; si no, se suma al stock central (columna Stock de tbarticulos).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RecepcionarOrdenDto.prototype, "puntoMudrasId", void 0);
exports.RecepcionarOrdenDto = RecepcionarOrdenDto = __decorate([
    (0, graphql_1.InputType)()
], RecepcionarOrdenDto);
//# sourceMappingURL=recepcionar-orden.dto.js.map