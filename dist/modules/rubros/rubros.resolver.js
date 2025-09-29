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
exports.ArticulosPorRubroResponse = exports.ArticuloRubro = exports.ProveedorRubro = exports.RubrosResolver = exports.RubrosResponse = exports.RubroConEstadisticas = void 0;
const graphql_1 = require("@nestjs/graphql");
const rubros_service_1 = require("./rubros.service");
const rubro_entity_1 = require("./entities/rubro.entity");
let RubroConEstadisticas = class RubroConEstadisticas {
};
exports.RubroConEstadisticas = RubroConEstadisticas;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RubroConEstadisticas.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RubroConEstadisticas.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RubroConEstadisticas.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], RubroConEstadisticas.prototype, "porcentajeRecargo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], RubroConEstadisticas.prototype, "porcentajeDescuento", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RubroConEstadisticas.prototype, "cantidadArticulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RubroConEstadisticas.prototype, "cantidadProveedores", void 0);
exports.RubroConEstadisticas = RubroConEstadisticas = __decorate([
    (0, graphql_1.ObjectType)()
], RubroConEstadisticas);
let RubrosResponse = class RubrosResponse {
};
exports.RubrosResponse = RubrosResponse;
__decorate([
    (0, graphql_1.Field)(() => [RubroConEstadisticas]),
    __metadata("design:type", Array)
], RubrosResponse.prototype, "rubros", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RubrosResponse.prototype, "total", void 0);
exports.RubrosResponse = RubrosResponse = __decorate([
    (0, graphql_1.ObjectType)()
], RubrosResponse);
let RubrosResolver = class RubrosResolver {
    constructor(rubrosService) {
        this.rubrosService = rubrosService;
    }
    findAll(pagina, limite, busqueda) {
        return this.rubrosService.findAll(pagina, limite, busqueda);
    }
    async obtenerTodosRubros() {
        const result = await this.rubrosService.findAll(0, 1000);
        return result.rubros;
    }
    findOne(id) {
        return this.rubrosService.findOne(id);
    }
    findByNombre(rubro) {
        return this.rubrosService.findByNombre(rubro);
    }
    async crearRubro(nombre, codigo, porcentajeRecargo, porcentajeDescuento) {
        return this.rubrosService.create(nombre, codigo, porcentajeRecargo, porcentajeDescuento);
    }
    async actualizarRubro(id, nombre, codigo, porcentajeRecargo, porcentajeDescuento) {
        return this.rubrosService.update(id, nombre, codigo, porcentajeRecargo, porcentajeDescuento);
    }
    async eliminarRubro(id) {
        return this.rubrosService.remove(id);
    }
    async getProveedoresPorRubro(rubroId) {
        return this.rubrosService.getProveedoresPorRubro(rubroId);
    }
    async getArticulosPorRubro(rubroId, filtro, offset, limit) {
        return this.rubrosService.getArticulosPorRubro(rubroId, filtro, offset, limit);
    }
    async eliminarProveedorDeRubro(proveedorId, rubroNombre) {
        return this.rubrosService.eliminarProveedorDeRubro(proveedorId, rubroNombre);
    }
    async eliminarArticuloDeRubro(articuloId) {
        return this.rubrosService.eliminarArticuloDeRubro(articuloId);
    }
    async eliminarArticulosDeRubro(articuloIds) {
        return this.rubrosService.eliminarArticulosDeRubro(articuloIds);
    }
};
exports.RubrosResolver = RubrosResolver;
__decorate([
    (0, graphql_1.Query)(() => RubrosResponse, { name: 'buscarRubros' }),
    __param(0, (0, graphql_1.Args)('pagina', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(1, (0, graphql_1.Args)('limite', { type: () => graphql_1.Int, defaultValue: 50 })),
    __param(2, (0, graphql_1.Args)('busqueda', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => [RubroConEstadisticas], { name: 'obtenerRubros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "obtenerTodosRubros", null);
__decorate([
    (0, graphql_1.Query)(() => rubro_entity_1.Rubro, { name: 'rubro' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => rubro_entity_1.Rubro, { name: 'rubroPorNombre' }),
    __param(0, (0, graphql_1.Args)('rubro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findByNombre", null);
__decorate([
    (0, graphql_1.Mutation)(() => rubro_entity_1.Rubro),
    __param(0, (0, graphql_1.Args)('nombre')),
    __param(1, (0, graphql_1.Args)('codigo', { nullable: true })),
    __param(2, (0, graphql_1.Args)('porcentajeRecargo', { type: () => graphql_1.Float, nullable: true })),
    __param(3, (0, graphql_1.Args)('porcentajeDescuento', { type: () => graphql_1.Float, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "crearRubro", null);
__decorate([
    (0, graphql_1.Mutation)(() => rubro_entity_1.Rubro),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('nombre')),
    __param(2, (0, graphql_1.Args)('codigo', { nullable: true })),
    __param(3, (0, graphql_1.Args)('porcentajeRecargo', { type: () => graphql_1.Float, nullable: true })),
    __param(4, (0, graphql_1.Args)('porcentajeDescuento', { type: () => graphql_1.Float, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "actualizarRubro", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "eliminarRubro", null);
__decorate([
    (0, graphql_1.Query)(() => [ProveedorRubro], { name: 'proveedoresPorRubro' }),
    __param(0, (0, graphql_1.Args)('rubroId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "getProveedoresPorRubro", null);
__decorate([
    (0, graphql_1.Query)(() => ArticulosPorRubroResponse, { name: 'articulosPorRubro' }),
    __param(0, (0, graphql_1.Args)('rubroId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('filtro', { nullable: true })),
    __param(2, (0, graphql_1.Args)('offset', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(3, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 50 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "getArticulosPorRubro", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('rubroNombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "eliminarProveedorDeRubro", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('articuloId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "eliminarArticuloDeRubro", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('articuloIds', { type: () => [graphql_1.Int] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RubrosResolver.prototype, "eliminarArticulosDeRubro", null);
exports.RubrosResolver = RubrosResolver = __decorate([
    (0, graphql_1.Resolver)(() => rubro_entity_1.Rubro),
    __metadata("design:paramtypes", [rubros_service_1.RubrosService])
], RubrosResolver);
let ProveedorRubro = class ProveedorRubro {
};
exports.ProveedorRubro = ProveedorRubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ProveedorRubro.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ProveedorRubro.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProveedorRubro.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProveedorRubro.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ProveedorRubro.prototype, "telefono", void 0);
exports.ProveedorRubro = ProveedorRubro = __decorate([
    (0, graphql_1.ObjectType)()
], ProveedorRubro);
let ArticuloRubro = class ArticuloRubro {
};
exports.ArticuloRubro = ArticuloRubro;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloRubro.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloRubro.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloRubro.prototype, "descripcion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ArticuloRubro.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloRubro.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(() => ProveedorRubro, { nullable: true }),
    __metadata("design:type", ProveedorRubro)
], ArticuloRubro.prototype, "proveedor", void 0);
exports.ArticuloRubro = ArticuloRubro = __decorate([
    (0, graphql_1.ObjectType)()
], ArticuloRubro);
let ArticulosPorRubroResponse = class ArticulosPorRubroResponse {
};
exports.ArticulosPorRubroResponse = ArticulosPorRubroResponse;
__decorate([
    (0, graphql_1.Field)(() => [ArticuloRubro]),
    __metadata("design:type", Array)
], ArticulosPorRubroResponse.prototype, "articulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticulosPorRubroResponse.prototype, "total", void 0);
exports.ArticulosPorRubroResponse = ArticulosPorRubroResponse = __decorate([
    (0, graphql_1.ObjectType)()
], ArticulosPorRubroResponse);
//# sourceMappingURL=rubros.resolver.js.map