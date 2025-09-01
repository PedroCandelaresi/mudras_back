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
exports.ProveedoresResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const proveedores_service_1 = require("./proveedores.service");
const proveedor_entity_1 = require("./entities/proveedor.entity");
let ProveedoresResolver = class ProveedoresResolver {
    constructor(proveedoresService) {
        this.proveedoresService = proveedoresService;
    }
    findAll() {
        return this.proveedoresService.findAll();
    }
    findOne(id) {
        return this.proveedoresService.findOne(id);
    }
    findByCodigo(codigo) {
        return this.proveedoresService.findByCodigo(codigo);
    }
    findByNombre(nombre) {
        return this.proveedoresService.findByNombre(nombre);
    }
};
exports.ProveedoresResolver = ProveedoresResolver;
__decorate([
    (0, graphql_1.Query)(() => [proveedor_entity_1.Proveedor], { name: 'proveedores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => proveedor_entity_1.Proveedor, { name: 'proveedor' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => proveedor_entity_1.Proveedor, { name: 'proveedorPorCodigo' }),
    __param(0, (0, graphql_1.Args)('codigo', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findByCodigo", null);
__decorate([
    (0, graphql_1.Query)(() => [proveedor_entity_1.Proveedor], { name: 'proveedoresPorNombre' }),
    __param(0, (0, graphql_1.Args)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresResolver.prototype, "findByNombre", null);
exports.ProveedoresResolver = ProveedoresResolver = __decorate([
    (0, graphql_1.Resolver)(() => proveedor_entity_1.Proveedor),
    __metadata("design:paramtypes", [proveedores_service_1.ProveedoresService])
], ProveedoresResolver);
//# sourceMappingURL=proveedores.resolver.js.map