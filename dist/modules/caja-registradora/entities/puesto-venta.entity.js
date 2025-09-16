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
exports.PuestoVenta = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const venta_caja_entity_1 = require("./venta-caja.entity");
let PuestoVenta = class PuestoVenta {
};
exports.PuestoVenta = PuestoVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], PuestoVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PuestoVenta.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PuestoVenta.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PuestoVenta.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PuestoVenta.prototype, "ubicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PuestoVenta.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PuestoVenta.prototype, "permiteFacturacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PuestoVenta.prototype, "descontarStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PuestoVenta.prototype, "configuracion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PuestoVenta.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PuestoVenta.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venta_caja_entity_1.VentaCaja, venta => venta.puestoVenta),
    (0, graphql_1.Field)(() => [venta_caja_entity_1.VentaCaja], { nullable: true }),
    __metadata("design:type", Array)
], PuestoVenta.prototype, "ventas", void 0);
exports.PuestoVenta = PuestoVenta = __decorate([
    (0, typeorm_1.Entity)('puestos_venta'),
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Index)(['codigo'], { unique: true }),
    (0, typeorm_1.Index)(['activo'])
], PuestoVenta);
//# sourceMappingURL=puesto-venta.entity.js.map