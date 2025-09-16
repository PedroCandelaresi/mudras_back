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
exports.ArticuloConStock = exports.BuscarArticuloInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let BuscarArticuloInput = class BuscarArticuloInput {
    constructor() {
        this.limite = 10;
    }
};
exports.BuscarArticuloInput = BuscarArticuloInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BuscarArticuloInput.prototype, "codigoBarras", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BuscarArticuloInput.prototype, "sku", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BuscarArticuloInput.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BuscarArticuloInput.prototype, "puestoVentaId", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BuscarArticuloInput.prototype, "limite", void 0);
exports.BuscarArticuloInput = BuscarArticuloInput = __decorate([
    (0, graphql_1.InputType)()
], BuscarArticuloInput);
let ArticuloConStock = class ArticuloConStock extends articulo_entity_1.Articulo {
};
exports.ArticuloConStock = ArticuloConStock;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticuloConStock.prototype, "stockDisponible", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticuloConStock.prototype, "stockDespuesVenta", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ArticuloConStock.prototype, "alertaStock", void 0);
exports.ArticuloConStock = ArticuloConStock = __decorate([
    (0, graphql_1.ObjectType)()
], ArticuloConStock);
//# sourceMappingURL=buscar-articulo.dto.js.map