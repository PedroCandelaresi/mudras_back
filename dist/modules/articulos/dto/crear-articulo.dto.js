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
exports.CrearArticuloDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const articulo_entity_1 = require("../entities/articulo.entity");
let CrearArticuloDto = class CrearArticuloDto {
};
exports.CrearArticuloDto = CrearArticuloDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "Codigo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "Rubro", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "Descripcion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "Marca", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "precioVenta", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "PrecioCompra", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "stockMinimo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "Unidad", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'unidad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "unidadMedida", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "cantidadPorEmpaque", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'unidad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "tipoEmpaque", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "descuentoMonto", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearArticuloDto.prototype, "EnPromocion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "fechaInicioPromocion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "fechaFinPromocion", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearArticuloDto.prototype, "publicadoEnTienda", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "descripcionTienda", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CrearArticuloDto.prototype, "imagenesUrls", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "codigoBarras", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearArticuloDto.prototype, "manejaStock", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "idProveedor", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearArticuloDto.prototype, "rubroId", void 0);
__decorate([
    (0, graphql_1.Field)(() => articulo_entity_1.EstadoArticulo, { defaultValue: articulo_entity_1.EstadoArticulo.ACTIVO }),
    (0, class_validator_1.IsEnum)(articulo_entity_1.EstadoArticulo),
    __metadata("design:type", String)
], CrearArticuloDto.prototype, "estado", void 0);
exports.CrearArticuloDto = CrearArticuloDto = __decorate([
    (0, graphql_1.InputType)()
], CrearArticuloDto);
//# sourceMappingURL=crear-articulo.dto.js.map