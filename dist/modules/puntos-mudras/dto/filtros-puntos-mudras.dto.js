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
exports.FiltrosMovimientosInput = exports.FiltrosStockInput = exports.FiltrosPuntosMudrasInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const punto_mudras_entity_1 = require("../entities/punto-mudras.entity");
let FiltrosPuntosMudrasInput = class FiltrosPuntosMudrasInput {
};
exports.FiltrosPuntosMudrasInput = FiltrosPuntosMudrasInput;
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.TipoPuntoMudras, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(punto_mudras_entity_1.TipoPuntoMudras),
    __metadata("design:type", String)
], FiltrosPuntosMudrasInput.prototype, "tipo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosPuntosMudrasInput.prototype, "activo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosPuntosMudrasInput.prototype, "busqueda", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FiltrosPuntosMudrasInput.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FiltrosPuntosMudrasInput.prototype, "offset", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosPuntosMudrasInput.prototype, "ordenarPor", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosPuntosMudrasInput.prototype, "direccionOrden", void 0);
exports.FiltrosPuntosMudrasInput = FiltrosPuntosMudrasInput = __decorate([
    (0, graphql_1.InputType)()
], FiltrosPuntosMudrasInput);
let FiltrosStockInput = class FiltrosStockInput {
};
exports.FiltrosStockInput = FiltrosStockInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosStockInput.prototype, "busqueda", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosStockInput.prototype, "soloConStock", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltrosStockInput.prototype, "soloBajoStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FiltrosStockInput.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FiltrosStockInput.prototype, "offset", void 0);
exports.FiltrosStockInput = FiltrosStockInput = __decorate([
    (0, graphql_1.InputType)()
], FiltrosStockInput);
let FiltrosMovimientosInput = class FiltrosMovimientosInput {
};
exports.FiltrosMovimientosInput = FiltrosMovimientosInput;
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.TipoPuntoMudras, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(punto_mudras_entity_1.TipoPuntoMudras),
    __metadata("design:type", String)
], FiltrosMovimientosInput.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosMovimientosInput.prototype, "fechaDesde", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosMovimientosInput.prototype, "fechaHasta", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FiltrosMovimientosInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FiltrosMovimientosInput.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FiltrosMovimientosInput.prototype, "offset", void 0);
exports.FiltrosMovimientosInput = FiltrosMovimientosInput = __decorate([
    (0, graphql_1.InputType)()
], FiltrosMovimientosInput);
//# sourceMappingURL=filtros-puntos-mudras.dto.js.map