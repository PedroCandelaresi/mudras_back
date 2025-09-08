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
exports.FiltrosArticuloDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const articulo_entity_1 = require("../entities/articulo.entity");
let FiltrosArticuloDto = class FiltrosArticuloDto {
};
exports.FiltrosArticuloDto = FiltrosArticuloDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "busqueda", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "marca", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "rubroId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "proveedorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => articulo_entity_1.EstadoArticulo, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(articulo_entity_1.EstadoArticulo),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosArticuloDto.prototype, "soloConStock", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosArticuloDto.prototype, "soloStockBajo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosArticuloDto.prototype, "soloSinStock", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosArticuloDto.prototype, "soloEnPromocion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosArticuloDto.prototype, "soloPublicadosEnTienda", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "precioMinimo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "precioMaximo", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "pagina", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosArticuloDto.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'Descripcion' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "ordenarPor", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'ASC' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosArticuloDto.prototype, "direccionOrden", void 0);
exports.FiltrosArticuloDto = FiltrosArticuloDto = __decorate([
    (0, graphql_1.InputType)()
], FiltrosArticuloDto);
//# sourceMappingURL=filtros-articulo.dto.js.map