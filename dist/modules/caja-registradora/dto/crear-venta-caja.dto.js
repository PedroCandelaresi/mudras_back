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
exports.CrearVentaCajaInput = exports.PagoCajaInput = exports.DetalleVentaCajaInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const venta_caja_entity_1 = require("../entities/venta-caja.entity");
const pago_caja_entity_1 = require("../entities/pago-caja.entity");
let DetalleVentaCajaInput = class DetalleVentaCajaInput {
};
exports.DetalleVentaCajaInput = DetalleVentaCajaInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DetalleVentaCajaInput.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], DetalleVentaCajaInput.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DetalleVentaCajaInput.prototype, "precioUnitario", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DetalleVentaCajaInput.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DetalleVentaCajaInput.prototype, "descuentoMonto", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DetalleVentaCajaInput.prototype, "observaciones", void 0);
exports.DetalleVentaCajaInput = DetalleVentaCajaInput = __decorate([
    (0, graphql_1.InputType)()
], DetalleVentaCajaInput);
let PagoCajaInput = class PagoCajaInput {
};
exports.PagoCajaInput = PagoCajaInput;
__decorate([
    (0, graphql_1.Field)(() => pago_caja_entity_1.MedioPagoCaja),
    (0, class_validator_1.IsEnum)(pago_caja_entity_1.MedioPagoCaja),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "medioPago", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PagoCajaInput.prototype, "monto", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "marcaTarjeta", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "ultimos4Digitos", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PagoCajaInput.prototype, "cuotas", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "numeroAutorizacion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "numeroComprobante", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PagoCajaInput.prototype, "observaciones", void 0);
exports.PagoCajaInput = PagoCajaInput = __decorate([
    (0, graphql_1.InputType)()
], PagoCajaInput);
let CrearVentaCajaInput = class CrearVentaCajaInput {
};
exports.CrearVentaCajaInput = CrearVentaCajaInput;
__decorate([
    (0, graphql_1.Field)(() => venta_caja_entity_1.TipoVentaCaja),
    (0, class_validator_1.IsEnum)(venta_caja_entity_1.TipoVentaCaja),
    __metadata("design:type", String)
], CrearVentaCajaInput.prototype, "tipoVenta", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "puestoVentaId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "clienteId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [DetalleVentaCajaInput]),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DetalleVentaCajaInput),
    __metadata("design:type", Array)
], CrearVentaCajaInput.prototype, "detalles", void 0);
__decorate([
    (0, graphql_1.Field)(() => [PagoCajaInput]),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PagoCajaInput),
    __metadata("design:type", Array)
], CrearVentaCajaInput.prototype, "pagos", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "descuentoPorcentaje", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "descuentoMonto", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearVentaCajaInput.prototype, "observaciones", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CrearVentaCajaInput.prototype, "generarFactura", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearVentaCajaInput.prototype, "cuitCliente", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearVentaCajaInput.prototype, "usuarioId", void 0);
exports.CrearVentaCajaInput = CrearVentaCajaInput = __decorate([
    (0, graphql_1.InputType)()
], CrearVentaCajaInput);
//# sourceMappingURL=crear-venta-caja.dto.js.map