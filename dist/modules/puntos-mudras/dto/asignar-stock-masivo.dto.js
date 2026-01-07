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
exports.AsignarStockMasivoInput = exports.AsignacionItemInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let AsignacionItemInput = class AsignacionItemInput {
};
exports.AsignacionItemInput = AsignacionItemInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AsignacionItemInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AsignacionItemInput.prototype, "cantidad", void 0);
exports.AsignacionItemInput = AsignacionItemInput = __decorate([
    (0, graphql_1.InputType)()
], AsignacionItemInput);
let AsignarStockMasivoInput = class AsignarStockMasivoInput {
};
exports.AsignarStockMasivoInput = AsignarStockMasivoInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AsignarStockMasivoInput.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AsignacionItemInput]),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AsignacionItemInput),
    __metadata("design:type", Array)
], AsignarStockMasivoInput.prototype, "asignaciones", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AsignarStockMasivoInput.prototype, "motivo", void 0);
exports.AsignarStockMasivoInput = AsignarStockMasivoInput = __decorate([
    (0, graphql_1.InputType)()
], AsignarStockMasivoInput);
//# sourceMappingURL=asignar-stock-masivo.dto.js.map