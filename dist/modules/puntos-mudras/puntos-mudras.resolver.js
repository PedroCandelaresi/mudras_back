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
exports.MatrizStockItem = exports.StockPunto = exports.PuntosMudrasResolver = exports.ArticuloFiltrado = exports.RubroBasico = exports.ProveedorBasico = exports.EstadisticasPuntosMudras = exports.ArticuloConStockPuntoMudras = exports.EstadisticasProveedorRubro = exports.RelacionProveedorRubro = exports.RubroInfo = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
const puntos_mudras_service_1 = require("./puntos-mudras.service");
const punto_mudras_entity_1 = require("./entities/punto-mudras.entity");
const crear_punto_mudras_dto_1 = require("./dto/crear-punto-mudras.dto");
const actualizar_punto_mudras_dto_1 = require("./dto/actualizar-punto-mudras.dto");
const transferir_stock_dto_1 = require("./dto/transferir-stock.dto");
const asignar_stock_masivo_dto_1 = require("./dto/asignar-stock-masivo.dto");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
let RubroInfo = class RubroInfo {
};
exports.RubroInfo = RubroInfo;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RubroInfo.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RubroInfo.prototype, "nombre", void 0);
exports.RubroInfo = RubroInfo = __decorate([
    (0, graphql_1.ObjectType)()
], RubroInfo);
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
    (0, graphql_1.Field)(() => RubroInfo, { nullable: true }),
    __metadata("design:type", RubroInfo)
], ArticuloConStockPuntoMudras.prototype, "rubro", void 0);
__decorate([
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo, { nullable: true }),
    __metadata("design:type", articulo_entity_1.Articulo)
], ArticuloConStockPuntoMudras.prototype, "articulo", void 0);
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
    (0, graphql_1.Field)(() => graphql_1.Float),
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
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ArticuloFiltrado.prototype, "stockEnDestino", void 0);
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
        const parsedId = Number(proveedorId);
        if (!Number.isFinite(parsedId)) {
            throw new common_1.BadRequestException('El identificador del proveedor debe ser numérico.');
        }
        return await this.puntosMudrasService.obtenerRubrosPorProveedor(parsedId);
    }
    async buscarArticulosParaAsignacion(proveedorId, rubro, busqueda, destinoId) {
        return await this.puntosMudrasService.buscarArticulosConFiltros(proveedorId, rubro, busqueda, destinoId);
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
    async transferirStock(input) {
        await this.puntosMudrasService.transferirStock(input);
        return true;
    }
    async ajustarStock(input) {
        await this.puntosMudrasService.ajustarStock(input);
        return true;
    }
    async asignarStockMasivo(input) {
        return await this.puntosMudrasService.asignarStockMasivo(input);
    }
    async obtenerRelacionesProveedorRubro() {
        return await this.puntosMudrasService.obtenerRelacionesProveedorRubro();
    }
    async obtenerEstadisticasProveedorRubro() {
        return await this.puntosMudrasService.obtenerEstadisticasProveedorRubro();
    }
    async obtenerMatrizStock(busqueda, rubro, proveedorId) {
        return await this.puntosMudrasService.obtenerMatrizStock({ busqueda, rubro, proveedorId });
    }
};
exports.PuntosMudrasResolver = PuntosMudrasResolver;
__decorate([
    (0, graphql_1.Query)(() => [punto_mudras_entity_1.PuntoMudras]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntosMudras", null);
__decorate([
    (0, graphql_1.Query)(() => punto_mudras_entity_1.PuntoMudras),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerPuntoMudrasPorId", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasPuntosMudras),
    (0, permissions_decorator_1.Permisos)('dashboard.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerEstadisticasPuntosMudras", null);
__decorate([
    (0, graphql_1.Query)(() => [ArticuloConStockPuntoMudras]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('puntoMudrasId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerStockPuntoMudras", null);
__decorate([
    (0, graphql_1.Query)(() => [ProveedorBasico]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerProveedoresConStock", null);
__decorate([
    (0, graphql_1.Query)(() => [RubroBasico]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerRubrosPorProveedor", null);
__decorate([
    (0, graphql_1.Query)(() => [ArticuloFiltrado]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int, nullable: true })),
    __param(1, (0, graphql_1.Args)('rubro', { nullable: true })),
    __param(2, (0, graphql_1.Args)('busqueda', { nullable: true })),
    __param(3, (0, graphql_1.Args)('destinoId', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "buscarArticulosParaAsignacion", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_punto_mudras_dto_1.CrearPuntoMudrasDto]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "crearPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => punto_mudras_entity_1.PuntoMudras),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_punto_mudras_dto_1.ActualizarPuntoMudrasDto]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "actualizarPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "eliminarPuntoMudras", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('puntoMudrasId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('articuloId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('nuevaCantidad', { type: () => graphql_1.Float })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "modificarStockPunto", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transferir_stock_dto_1.TransferirStockInput]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "transferirStock", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transferir_stock_dto_1.AjustarStockInput]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "ajustarStock", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, permissions_decorator_1.Permisos)('stock.update'),
    __param(0, (0, graphql_1.Args)('input', new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asignar_stock_masivo_dto_1.AsignarStockMasivoInput]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "asignarStockMasivo", null);
__decorate([
    (0, graphql_1.Query)(() => [RelacionProveedorRubro]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerRelacionesProveedorRubro", null);
__decorate([
    (0, graphql_1.Query)(() => EstadisticasProveedorRubro),
    (0, permissions_decorator_1.Permisos)('dashboard.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerEstadisticasProveedorRubro", null);
__decorate([
    (0, graphql_1.Query)(() => [MatrizStockItem]),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('busqueda', { nullable: true })),
    __param(1, (0, graphql_1.Args)('rubro', { nullable: true })),
    __param(2, (0, graphql_1.Args)('proveedorId', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], PuntosMudrasResolver.prototype, "obtenerMatrizStock", null);
exports.PuntosMudrasResolver = PuntosMudrasResolver = __decorate([
    (0, graphql_1.Resolver)(() => punto_mudras_entity_1.PuntoMudras),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [puntos_mudras_service_1.PuntosMudrasService])
], PuntosMudrasResolver);
let StockPunto = class StockPunto {
};
exports.StockPunto = StockPunto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], StockPunto.prototype, "puntoId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StockPunto.prototype, "puntoNombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], StockPunto.prototype, "cantidad", void 0);
exports.StockPunto = StockPunto = __decorate([
    (0, graphql_1.ObjectType)()
], StockPunto);
let MatrizStockItem = class MatrizStockItem {
};
exports.MatrizStockItem = MatrizStockItem;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MatrizStockItem.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MatrizStockItem.prototype, "codigo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MatrizStockItem.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MatrizStockItem.prototype, "rubro", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], MatrizStockItem.prototype, "stockTotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => [StockPunto]),
    __metadata("design:type", Array)
], MatrizStockItem.prototype, "stockPorPunto", void 0);
exports.MatrizStockItem = MatrizStockItem = __decorate([
    (0, graphql_1.ObjectType)()
], MatrizStockItem);
//# sourceMappingURL=puntos-mudras.resolver.js.map