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
exports.PuntosMudrasResolver = exports.ArticuloFiltrado = exports.RubroBasico = exports.ProveedorBasico = exports.EstadisticasPuntosMudras = exports.ArticuloConStockPuntoMudras = exports.EstadisticasProveedorRubro = exports.RelacionProveedorRubro = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const puntos_mudras_service_1 = require("./puntos-mudras.service");
const punto_mudras_entity_1 = require("./entities/punto-mudras.entity");
const crear_punto_mudras_dto_1 = require("./dto/crear-punto-mudras.dto");
const actualizar_punto_mudras_dto_1 = require("./dto/actualizar-punto-mudras.dto");
let RelacionProveedorRubro = class RelacionProveedorRubro {
};
exports.RelacionProveedorRubro = RelacionProveedorRubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RelacionProveedorRubro.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RelacionProveedorRubro.prototype, "proveedorId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RelacionProveedorRubro.prototype, "proveedorNombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RelacionProveedorRubro.prototype, "rubroNombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RelacionProveedorRubro.prototype, "cantidadArticulos", void 0);
exports.RelacionProveedorRubro = RelacionProveedorRubro = __decorate([
    (0, graphql_1.ObjectType)()
], RelacionProveedorRubro);
let EstadisticasProveedorRubro = class EstadisticasProveedorRubro {
};
exports.EstadisticasProveedorRubro = EstadisticasProveedorRubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasProveedorRubro.prototype, "totalRelaciones", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasProveedorRubro.prototype, "proveedoresUnicos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasProveedorRubro.prototype, "rubrosUnicos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasProveedorRubro.prototype, "totalArticulos", void 0);
exports.EstadisticasProveedorRubro = EstadisticasProveedorRubro = __decorate([
    (0, graphql_1.ObjectType)()
], EstadisticasProveedorRubro);
let ArticuloConStockPuntoMudras = class ArticuloConStockPuntoMudras {
};
exports.ArticuloConStockPuntoMudras = ArticuloConStockPuntoMudras;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloConStockPuntoMudras.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloConStockPuntoMudras.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloConStockPuntoMudras.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloConStockPuntoMudras.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloConStockPuntoMudras.prototype, "stockAsignado", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloConStockPuntoMudras.prototype, "stockTotal", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ArticuloConStockPuntoMudras.prototype, "rubro", void 0);
exports.ArticuloConStockPuntoMudras = ArticuloConStockPuntoMudras = __decorate([
    (0, graphql_1.ObjectType)()
], ArticuloConStockPuntoMudras);
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
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "valorTotalInventario", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasPuntosMudras.prototype, "movimientosHoy", void 0);
exports.EstadisticasPuntosMudras = EstadisticasPuntosMudras = __decorate([
    (0, graphql_1.ObjectType)()
], EstadisticasPuntosMudras);
let ProveedorBasico = class ProveedorBasico {
};
exports.ProveedorBasico = ProveedorBasico;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], ProveedorBasico.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ProveedorBasico.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProveedorBasico.prototype, "codigo", void 0);
exports.ProveedorBasico = ProveedorBasico = __decorate([
    (0, graphql_1.ObjectType)()
], ProveedorBasico);
let RubroBasico = class RubroBasico {
};
exports.RubroBasico = RubroBasico;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RubroBasico.prototype, "rubro", void 0);
exports.RubroBasico = RubroBasico = __decorate([
    (0, graphql_1.ObjectType)()
], RubroBasico);
let ArticuloFiltrado = class ArticuloFiltrado {
};
exports.ArticuloFiltrado = ArticuloFiltrado;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloFiltrado.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloFiltrado.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "stockTotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "stockAsignado", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "stockDisponible", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloFiltrado.prototype, "rubro", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloFiltrado.prototype, "proveedor", void 0);
exports.ArticuloFiltrado = ArticuloFiltrado = __decorate([
    (0, graphql_1.ObjectType)()
], ArticuloFiltrado);
let PuntosMudrasResolver = class PuntosMudrasResolver {
    constructor(puntosMudrasService) {
        this.puntosMudrasService = puntosMudrasService;
    }
    async obtenerPuntosMudras() {
        const resultado = await this.puntosMudrasService.obtenerTodos();
        return resultado.puntos;
    }
    async obtenerPuntoMudrasPorId(id) {
        return await this.puntosMudrasService.obtenerPorId(id);
    }
    async obtenerEstadisticasPuntosMudras() {
        return await this.puntosMudrasService.obtenerEstadisticas();
    }
    async obtenerStockPuntoMudras(puntoMudrasId) {
        return await this.puntosMudrasService.obtenerArticulosConStockPunto(puntoMudrasId);
    }
    async obtenerProveedoresConStock() {
        return await this.puntosMudrasService.obtenerProveedores();
    }
    async obtenerRubrosPorProveedor(proveedorId) {
        return await this.puntosMudrasService.obtenerRubrosPorProveedor(proveedorId);
    }
    async buscarArticulosParaAsignacion(proveedorId, rubro, busqueda) {
        return await this.puntosMudrasService.buscarArticulosConFiltros(proveedorId, rubro, busqueda);
    }
    async crearPuntoMudras(input) {
        return await this.puntosMudrasService.crear(input);
    }
    async actualizarPuntoMudras(input) {
        return await this.puntosMudrasService.actualizar(input);
    }
    async eliminarPuntoMudras(id) {
        await this.puntosMudrasService.eliminar(id);
        return true;
    }
    async modificarStockPunto(puntoMudrasId, articuloId, nuevaCantidad) {
        return await this.puntosMudrasService.modificarStockPunto(puntoMudrasId, articuloId, nuevaCantidad);
    }
    async obtenerRelacionesProveedorRubro() {
        return await this.puntosMudrasService.obtenerRelacionesProveedorRubro();
    }
    async obtenerEstadisticasProveedorRubro() {
        return await this.puntosMudrasService.obtenerEstadisticasProveedorRubro();
    }
};
exports.PuntosMudrasResolver = PuntosMudrasResolver;
__decorate([
    (0, graphql_1.Query)(() => [punto_mudras_entity_1.PuntoMudras]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntosMudras", null);
__decorate([
    (0, graphql_1.Query)(() => punto_mudras_entity_1.PuntoMudras),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntoMudrasPorId", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasPuntosMudras),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerEstadisticasPuntosMudras", null);
__decorate([
    (0, graphql_1.Query)(() => [ArticuloConStockPuntoMudras]),
    __param(0, (0, graphql_1.Args)('puntoMudrasId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerStockPuntoMudras", null);
__decorate([
    (0, graphql_1.Query)(() => [ProveedorBasico]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerProveedoresConStock", null);
__decorate([
    (0, graphql_1.Query)(() => [RubroBasico]),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerRubrosPorProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [ArticuloFiltrado]),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int, nullable: true })),
    __param(1, (0, graphql_1.Args)('rubro', { nullable: true })),
    __param(2, (0, graphql_1.Args)('busqueda', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "buscarArticulosParaAsignacion", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_punto_mudras_dto_1.CrearPuntoMudrasDto]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "crearPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
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
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('puntoMudrasId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('articuloId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('nuevaCantidad', { type: () => graphql_1.Float })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "modificarStockPunto", null);
__decorate([
    (0, graphql_1.Query)(() => [RelacionProveedorRubro]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerRelacionesProveedorRubro", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasProveedorRubro),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerEstadisticasProveedorRubro", null);
exports.PuntosMudrasResolver = PuntosMudrasResolver = __decorate([
    (0, graphql_1.Resolver)(() => punto_mudras_entity_1.PuntoMudras),
    __metadata("design:paramtypes", [puntos_mudras_service_1.PuntosMudrasService])
], PuntosMudrasResolver);
//# sourceMappingURL=puntos-mudras.resolver.js.map