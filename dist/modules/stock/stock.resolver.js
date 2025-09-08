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
exports.StockResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const stock_service_1 = require("./stock.service");
const stock_entity_1 = require("./entities/stock.entity");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let StockResolver = class StockResolver {
    constructor(stockService) {
        this.stockService = stockService;
    }
    findAll() {
        return this.stockService.findAll();
    }
    findOne(id) {
        return this.stockService.findOne(id);
    }
    findByCodigo(codigo) {
        return this.stockService.findByCodigo(codigo);
    }
    findMovimientosPorFecha(fechaInicio, fechaFin) {
        return this.stockService.findMovimientosPorFecha(fechaInicio, fechaFin);
    }
    findUltimoMovimientoPorCodigo(codigo) {
        return this.stockService.findUltimoMovimientoPorCodigo(codigo);
    }
};
exports.StockResolver = StockResolver;
__decorate([
    (0, graphql_1.Query)(() => [stock_entity_1.Stock], { name: 'movimientosStock' }),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => stock_entity_1.Stock, { name: 'movimientoStock' }),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StockResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [stock_entity_1.Stock], { name: 'movimientosPorCodigo' }),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockResolver.prototype, "findByCodigo", null);
__decorate([
    (0, graphql_1.Query)(() => [stock_entity_1.Stock], { name: 'movimientosPorFecha' }),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('fechaInicio')),
    __param(1, (0, graphql_1.Args)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", void 0)
], StockResolver.prototype, "findMovimientosPorFecha", null);
__decorate([
    (0, graphql_1.Query)(() => stock_entity_1.Stock, { name: 'ultimoMovimientoPorCodigo' }),
    (0, permissions_decorator_1.Permisos)('stock.read'),
    __param(0, (0, graphql_1.Args)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockResolver.prototype, "findUltimoMovimientoPorCodigo", null);
exports.StockResolver = StockResolver = __decorate([
    (0, graphql_1.Resolver)(() => stock_entity_1.Stock),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockResolver);
//# sourceMappingURL=stock.resolver.js.map