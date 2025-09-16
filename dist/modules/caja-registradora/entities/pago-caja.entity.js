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
exports.PagoCaja = exports.MedioPagoCaja = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const venta_caja_entity_1 = require("./venta-caja.entity");
var MedioPagoCaja;
(function (MedioPagoCaja) {
    MedioPagoCaja["EFECTIVO"] = "efectivo";
    MedioPagoCaja["DEBITO"] = "debito";
    MedioPagoCaja["CREDITO"] = "credito";
    MedioPagoCaja["TRANSFERENCIA"] = "transferencia";
    MedioPagoCaja["QR"] = "qr";
    MedioPagoCaja["CUENTA_CORRIENTE"] = "cuenta_corriente";
})(MedioPagoCaja || (exports.MedioPagoCaja = MedioPagoCaja = {}));
(0, graphql_1.registerEnumType)(MedioPagoCaja, {
    name: 'MedioPagoCaja',
    description: 'Medios de pago disponibles en caja',
});
let PagoCaja = class PagoCaja {
};
exports.PagoCaja = PagoCaja;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], PagoCaja.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PagoCaja.prototype, "ventaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_caja_entity_1.VentaCaja, venta => venta.pagos),
    (0, typeorm_1.JoinColumn)({ name: 'ventaId' }),
    (0, graphql_1.Field)(() => venta_caja_entity_1.VentaCaja),
    __metadata("design:type", venta_caja_entity_1.VentaCaja)
], PagoCaja.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MedioPagoCaja,
    }),
    (0, graphql_1.Field)(() => MedioPagoCaja),
    __metadata("design:type", String)
], PagoCaja.prototype, "medioPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PagoCaja.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PagoCaja.prototype, "marcaTarjeta", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 4, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PagoCaja.prototype, "ultimos4Digitos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PagoCaja.prototype, "cuotas", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PagoCaja.prototype, "numeroAutorizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PagoCaja.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PagoCaja.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PagoCaja.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PagoCaja.prototype, "creadoEn", void 0);
exports.PagoCaja = PagoCaja = __decorate([
    (0, typeorm_1.Entity)('pagos_caja'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['ventaId']),
    (0, typeorm_1.Index)(['medioPago']),
    (0, typeorm_1.Index)(['fecha'])
], PagoCaja);
//# sourceMappingURL=pago-caja.entity.js.map