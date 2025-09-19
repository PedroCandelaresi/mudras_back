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
exports.AjustarStockInput = exports.TransferirStockInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let TransferirStockInput = class TransferirStockInput {
};
exports.TransferirStockInput = TransferirStockInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'El ID del punto origen debe ser un número entero' }),
    __metadata("design:type", Number)
], TransferirStockInput.prototype, "puntoOrigenId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'El ID del punto destino debe ser un número entero' }),
    __metadata("design:type", Number)
], TransferirStockInput.prototype, "puntoDestinoId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'El ID del artículo debe ser un número entero' }),
    __metadata("design:type", Number)
], TransferirStockInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)({}, { message: 'La cantidad debe ser un número' }),
    (0, class_validator_1.Min)(0.01, { message: 'La cantidad debe ser mayor a 0' }),
    __metadata("design:type", Number)
], TransferirStockInput.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferirStockInput.prototype, "motivo", void 0);
exports.TransferirStockInput = TransferirStockInput = __decorate([
    (0, graphql_1.InputType)()
], TransferirStockInput);
let AjustarStockInput = class AjustarStockInput {
};
exports.AjustarStockInput = AjustarStockInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'El ID del punto debe ser un número entero' }),
    __metadata("design:type", Number)
], AjustarStockInput.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsInt)({ message: 'El ID del artículo debe ser un número entero' }),
    __metadata("design:type", Number)
], AjustarStockInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)({}, { message: 'La nueva cantidad debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'La cantidad no puede ser negativa' }),
    __metadata("design:type", Number)
], AjustarStockInput.prototype, "nuevaCantidad", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AjustarStockInput.prototype, "motivo", void 0);
exports.AjustarStockInput = AjustarStockInput = __decorate([
    (0, graphql_1.InputType)()
], AjustarStockInput);
//# sourceMappingURL=transferir-stock.dto.js.map