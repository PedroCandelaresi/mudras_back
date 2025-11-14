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
exports.HistorialVentasResponse = exports.ResumenVenta = exports.FiltrosHistorialInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const venta_caja_entity_1 = require("../entities/venta-caja.entity");
const pago_caja_entity_1 = require("../entities/pago-caja.entity");
let FiltrosHistorialInput = class FiltrosHistorialInput {
    constructor() {
        this.limite = 50;
        this.offset = 0;
    }
};
exports.FiltrosHistorialInput = FiltrosHistorialInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "fechaDesde", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "fechaHasta", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "usuarioAuthId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosHistorialInput.prototype, "puntoMudrasId", void 0);
__decorate([
    (0, graphql_1.Field)(() => pago_caja_entity_1.MedioPagoCaja, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(pago_caja_entity_1.MedioPagoCaja),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "medioPago", void 0);
__decorate([
    (0, graphql_1.Field)(() => venta_caja_entity_1.EstadoVentaCaja, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(venta_caja_entity_1.EstadoVentaCaja),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)(() => venta_caja_entity_1.TipoVentaCaja, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(venta_caja_entity_1.TipoVentaCaja),
    __metadata("design:type", String)
], FiltrosHistorialInput.prototype, "tipoVenta", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosHistorialInput.prototype, "limite", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FiltrosHistorialInput.prototype, "offset", void 0);
exports.FiltrosHistorialInput = FiltrosHistorialInput = __decorate([
    (0, graphql_1.InputType)()
], FiltrosHistorialInput);
let ResumenVenta = class ResumenVenta {
};
exports.ResumenVenta = ResumenVenta;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ResumenVenta.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ResumenVenta.prototype, "numeroVenta", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ResumenVenta.prototype, "fecha", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ResumenVenta.prototype, "nombreCliente", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ResumenVenta.prototype, "nombreUsuario", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ResumenVenta.prototype, "nombrePuesto", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ResumenVenta.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => venta_caja_entity_1.EstadoVentaCaja),
    __metadata("design:type", String)
], ResumenVenta.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)(() => venta_caja_entity_1.TipoVentaCaja),
    __metadata("design:type", String)
], ResumenVenta.prototype, "tipoVenta", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ResumenVenta.prototype, "cantidadItems", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], ResumenVenta.prototype, "mediosPago", void 0);
exports.ResumenVenta = ResumenVenta = __decorate([
    (0, graphql_1.ObjectType)()
], ResumenVenta);
let HistorialVentasResponse = class HistorialVentasResponse {
};
exports.HistorialVentasResponse = HistorialVentasResponse;
__decorate([
    (0, graphql_1.Field)(() => [ResumenVenta]),
    __metadata("design:type", Array)
], HistorialVentasResponse.prototype, "ventas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], HistorialVentasResponse.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], HistorialVentasResponse.prototype, "totalPaginas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], HistorialVentasResponse.prototype, "paginaActual", void 0);
exports.HistorialVentasResponse = HistorialVentasResponse = __decorate([
    (0, graphql_1.ObjectType)()
], HistorialVentasResponse);
//# sourceMappingURL=historial-ventas.dto.js.map