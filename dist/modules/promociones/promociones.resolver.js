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
exports.PromocionesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const promociones_service_1 = require("./promociones.service");
const promocion_entity_1 = require("./entities/promocion.entity");
const crear_promocion_input_1 = require("./dto/crear-promocion.input");
const actualizar_promocion_input_1 = require("./dto/actualizar-promocion.input");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
let PromocionesResolver = class PromocionesResolver {
    constructor(service) {
        this.service = service;
    }
    listar() {
        return this.service.listar();
    }
    crearPromocion(input) {
        return this.service.crear(input);
    }
    actualizarPromocion(id, input) {
        return this.service.actualizar(id, input);
    }
    eliminarPromocion(id) {
        return this.service.eliminar(id);
    }
};
exports.PromocionesResolver = PromocionesResolver;
__decorate([
    (0, graphql_1.Query)(() => [promocion_entity_1.Promocion], { name: 'promociones' }),
    (0, permissions_decorator_1.Permisos)('promociones.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesResolver.prototype, "listar", null);
__decorate([
    (0, graphql_1.Mutation)(() => promocion_entity_1.Promocion),
    (0, permissions_decorator_1.Permisos)('promociones.create'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_promocion_input_1.CrearPromocionInput]),
    __metadata("design:returntype", void 0)
], PromocionesResolver.prototype, "crearPromocion", null);
__decorate([
    (0, graphql_1.Mutation)(() => promocion_entity_1.Promocion),
    (0, permissions_decorator_1.Permisos)('promociones.update'),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_promocion_input_1.ActualizarPromocionInput]),
    __metadata("design:returntype", void 0)
], PromocionesResolver.prototype, "actualizarPromocion", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, permissions_decorator_1.Permisos)('promociones.delete'),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromocionesResolver.prototype, "eliminarPromocion", null);
exports.PromocionesResolver = PromocionesResolver = __decorate([
    (0, graphql_1.Resolver)(() => promocion_entity_1.Promocion),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [promociones_service_1.PromocionesService])
], PromocionesResolver);
//# sourceMappingURL=promociones.resolver.js.map