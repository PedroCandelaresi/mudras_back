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
exports.Promocion = exports.EstadoPromocion = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
var EstadoPromocion;
(function (EstadoPromocion) {
    EstadoPromocion["ACTIVA"] = "ACTIVA";
    EstadoPromocion["PROGRAMADA"] = "PROGRAMADA";
    EstadoPromocion["FINALIZADA"] = "FINALIZADA";
})(EstadoPromocion || (exports.EstadoPromocion = EstadoPromocion = {}));
(0, graphql_1.registerEnumType)(EstadoPromocion, { name: 'EstadoPromocion' });
let Promocion = class Promocion {
};
exports.Promocion = Promocion;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Promocion.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], Promocion.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Promocion.prototype, "inicio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Promocion.prototype, "fin", void 0);
__decorate([
    (0, graphql_1.Field)(() => EstadoPromocion),
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoPromocion, default: EstadoPromocion.PROGRAMADA }),
    __metadata("design:type", String)
], Promocion.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Promocion.prototype, "descuento", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Promocion.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Promocion.prototype, "updatedAt", void 0);
exports.Promocion = Promocion = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('promociones')
], Promocion);
//# sourceMappingURL=promocion.entity.js.map