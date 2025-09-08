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
const common_1 = require("@nestjs/common");
const articulos_service_1 = require("./articulos.service");
const articulo_entity_1 = require("./entities/articulo.entity");
const crear_articulo_dto_1 = require("./dto/crear-articulo.dto");
const actualizar_articulo_dto_1 = require("./dto/actualizar-articulo.dto");
const filtros_articulo_dto_1 = require("./dto/filtros-articulo.dto");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
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
    crearArticulo(crearArticuloDto) {
        return this.articulosService.crear(crearArticuloDto);
    }
    actualizarArticulo(actualizarArticuloDto) {
        return this.articulosService.actualizar(actualizarArticuloDto);
    }
    eliminarArticulo(id) {
        return this.articulosService.eliminar(id);
    }
    buscarArticulos(filtros) {
        return this.articulosService.buscarConFiltros(filtros);
    }
    estadisticasArticulos() {
        return this.articulosService.obtenerEstadisticas();
    }
    articuloPorCodigoBarras(codigoBarras) {
        return this.articulosService.buscarPorCodigoBarras(codigoBarras);
    }
    actualizarStockArticulo(id, nuevoStock) {
        return this.articulosService.actualizarStock(id, nuevoStock);
    }
};
exports.ArticulosResolver = ArticulosResolver;
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulos' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => articulo_entity_1.Articulo, { name: 'articulo' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => articulo_entity_1.Articulo, { name: 'articuloPorCodigo' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByCodigo", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorRubro' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('rubro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByRubro", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorDescripcion' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('descripcion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByDescripcion", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosPorProveedor' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('idProveedor', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findByProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosConStock' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findConStock", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosSinStock' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findSinStock", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosStockBajo' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findStockBajo", null);
__decorate([
    (0, graphql_1.Query)(() => [articulo_entity_1.Articulo], { name: 'articulosEnPromocion' }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "findEnPromocion", null);
__decorate([
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('productos.create'),
    (0, graphql_1.Mutation)(() => articulo_entity_1.Articulo),
    __param(0, (0, graphql_1.Args)('crearArticuloDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_articulo_dto_1.CrearArticuloDto]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "crearArticulo", null);
__decorate([
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('productos.update'),
    (0, graphql_1.Mutation)(() => articulo_entity_1.Articulo),
    __param(0, (0, graphql_1.Args)('actualizarArticuloDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_articulo_dto_1.ActualizarArticuloDto]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "actualizarArticulo", null);
__decorate([
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('productos.delete'),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "eliminarArticulo", null);
__decorate([
    (0, graphql_1.Query)(() => ArticulosConPaginacion),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('filtros')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtros_articulo_dto_1.FiltrosArticuloDto]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "buscarArticulos", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasArticulos),
    (0, permissions_decorator_1.Permisos)('dashboard.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "estadisticasArticulos", null);
__decorate([
    (0, graphql_1.Query)(() => articulo_entity_1.Articulo, { nullable: true }),
    (0, permissions_decorator_1.Permisos)('productos.read'),
    __param(0, (0, graphql_1.Args)('codigoBarras')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "articuloPorCodigoBarras", null);
__decorate([
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, roles_decorator_1.Roles)('administrador'),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    (0, graphql_1.Mutation)(() => articulo_entity_1.Articulo),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('nuevoStock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ArticulosResolver.prototype, "actualizarStockArticulo", null);
exports.ArticulosResolver = ArticulosResolver = __decorate([
    (0, graphql_1.Resolver)(() => articulo_entity_1.Articulo),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [articulos_service_1.ArticulosService])
], ArticulosResolver);
let ArticulosConPaginacion = class ArticulosConPaginacion {
};
__decorate([
    (0, graphql_1.Field)(() => [articulo_entity_1.Articulo]),
    __metadata("design:type", Array)
], ArticulosConPaginacion.prototype, "articulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticulosConPaginacion.prototype, "total", void 0);
ArticulosConPaginacion = __decorate([
    (0, graphql_1.ObjectType)()
], ArticulosConPaginacion);
let EstadisticasArticulos = class EstadisticasArticulos {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "totalArticulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosActivos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosConStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosSinStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosStockBajo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosEnPromocion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "articulosPublicadosEnTienda", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], EstadisticasArticulos.prototype, "valorTotalStock", void 0);
EstadisticasArticulos = __decorate([
    (0, graphql_1.ObjectType)()
], EstadisticasArticulos);
//# sourceMappingURL=articulos.resolver.js.map