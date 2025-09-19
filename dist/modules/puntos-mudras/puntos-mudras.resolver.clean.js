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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntosMudrasResolver = exports.PuntosMudrasResponse = exports.EstadisticasPuntosMudras = void 0;
const graphql_1 = require("@nestjs/graphql");
const puntos_mudras_service_1 = require("./puntos-mudras.service");
const punto_mudras_entity_1 = require("./entities/punto-mudras.entity");
const crear_punto_mudras_dto_1 = require("./dto/crear-punto-mudras.dto");
const actualizar_punto_mudras_dto_1 = require("./dto/actualizar-punto-mudras.dto");
const filtros_puntos_mudras_dto_1 = require("./dto/filtros-puntos-mudras.dto");
let EstadisticasPuntosMudras = class EstadisticasPuntosMudras {
};
exports.EstadisticasPuntosMudras = EstadisticasPuntosMudras;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "totalPuntos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "puntosVenta", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "depositos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "puntosActivos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "articulosConStock", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "valorTotalInventario", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "movimientosHoy", void 0);
exports.EstadisticasPuntosMudras = EstadisticasPuntosMudras = __decorate([
    (0, graphql_1.ObjectType)()
], EstadisticasPuntosMudras);
let PuntosMudrasResponse = class PuntosMudrasResponse {
};
exports.PuntosMudrasResponse = PuntosMudrasResponse;
__decorate([
    (0, graphql_1.Field)(() => [punto_mudras_entity_1.PuntoMudras]),
    __metadata("design:type", Array)
], PuntosMudrasResponse.prototype, "puntos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PuntosMudrasResponse.prototype, "total", void 0);
exports.PuntosMudrasResponse = PuntosMudrasResponse = __decorate([
    (0, graphql_1.ObjectType)()
], PuntosMudrasResponse);
let PuntosMudrasResolver = class PuntosMudrasResolver {
    constructor(puntosMudrasService) {
        this.puntosMudrasService = puntosMudrasService;
    }
    async obtenerPuntosMudras(filtros) {
        return this.puntosMudrasService.obtenerTodos(filtros);
    }
    async obtenerPuntoMudrasPorId(id) {
        return this.puntosMudrasService.obtenerPorId(id);
    }
    async obtenerEstadisticasPuntosMudras() {
        return this.puntosMudrasService.obtenerEstadisticas();
    }
    async crearPuntoMudras(input) {
        return this.puntosMudrasService.crear(input);
    }
    async actualizarPuntoMudras(input) {
        return this.puntosMudrasService.actualizar(input);
    }
    async eliminarPuntoMudras(id) {
        await this.puntosMudrasService.eliminar(id);
        return true;
    }
};
exports.PuntosMudrasResolver = PuntosMudrasResolver;
__decorate([
    (0, graphql_1.Query)(() => PuntosMudrasResponse, { name: 'obtenerPuntosMudras' }),
    __param(0, (0, graphql_1.Args)('filtros', { type: () => filtros_puntos_mudras_dto_1.FiltrosPuntosMudrasInput, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtros_puntos_mudras_dto_1.FiltrosPuntosMudrasInput]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntosMudras", null);
__decorate([
    (0, graphql_1.Query)(() => punto_mudras_entity_1.PuntoMudras, { name: 'obtenerPuntoMudrasPorId' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntoMudrasPorId", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasPuntosMudras, { name: 'obtenerEstadisticasPuntosMudras' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerEstadisticasPuntosMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_punto_mudras_dto_1.CrearPuntoMudrasDto]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "crearPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_punto_mudras_dto_1.ActualizarPuntoMudrasDto]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "actualizarPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "eliminarPuntoMudras", null);
exports.PuntosMudrasResolver = PuntosMudrasResolver = __decorate([
    (0, graphql_1.Resolver)(() => punto_mudras_entity_1.PuntoMudras),
    __metadata("design:paramtypes", [puntos_mudras_service_1.PuntosMudrasService])
], PuntosMudrasResolver);
//# sourceMappingURL=puntos-mudras.resolver.clean.js.map