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
exports.ArticulosResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const articulos_service_1 = require("./articulos.service");
const articulo_entity_1 = require("./entities/articulo.entity");
let ArticulosResolver = class ArticulosResolver {
    constructor(articulosService) {
        this.articulosService = articulosService;
    }
    findAll() {
        return this.articulosService.findAll();
    }
    findOne(id) {
        return this.articulosService.findOne(id);
    }
    findByCodigo(codigo) {
        return this.articulosService.findByCodigo(codigo);
    }
    findByRubro(rubro) {
        return this.articulosService.findByRubro(rubro);
    }
    findByDescripcion(descripcion) {
        return this.articulosService.findByDescripcion(descripcion);
    }
    findByProveedor(idProveedor) {
        return this.articulosService.findByProveedor(idProveedor);
    }
    findConStock() {
        return this.articulosService.findConStock();
    }
    findSinStock() {
        return this.articulosService.findSinStock();
    }
    findStockBajo() {
        return this.articulosService.findStockBajo();
    }
    findEnPromocion() {
        return this.articulosService.findEnPromocion();
    }
};
exports.ArticulosResolver = ArticulosResolver;
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => articulo_entity_1.Articulo, { name: 'articulo' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => articulo_entity_1.Articulo, { name: 'articuloPorCodigo' }),
    __param(0, (0, graphql_1.Args)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByCodigo", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorRubro' }),
    __param(0, (0, graphql_1.Args)('rubro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByRubro", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorDescripcion' }),
    __param(0, (0, graphql_1.Args)('descripcion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByDescripcion", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorProveedor' }),
    __param(0, (0, graphql_1.Args)('idProveedor', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosConStock' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findConStock", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosSinStock' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findSinStock", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosStockBajo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findStockBajo", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosEnPromocion' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findEnPromocion", null);
exports.ArticulosResolver = ArticulosResolver = __decorate([
    (0, graphql_1.Resolver)(() => articulo_entity_1.Articulo),
    __metadata("design:paramtypes", [articulos_service_1.ArticulosService])
], ArticulosResolver);
//# sourceMappingURL=articulos.resolver.js.map