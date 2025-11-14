"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const compras_resolver_1 = require("./compras.resolver");
const compras_service_1 = require("./compras.service");
const orden_compra_entity_1 = require("./entities/orden-compra.entity");
const detalle_orden_compra_entity_1 = require("./entities/detalle-orden-compra.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const stock_punto_mudras_entity_1 = require("../puntos-mudras/entities/stock-punto-mudras.entity");
let ComprasModule = class ComprasModule {
};
exports.ComprasModule = ComprasModule;
exports.ComprasModule = ComprasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([orden_compra_entity_1.OrdenCompra, detalle_orden_compra_entity_1.DetalleOrdenCompra, articulo_entity_1.Articulo, stock_punto_mudras_entity_1.StockPuntoMudras])],
        providers: [compras_resolver_1.ComprasResolver, compras_service_1.ComprasService],
        exports: [compras_service_1.ComprasService],
    })
], ComprasModule);
//# sourceMappingURL=compras.module.js.map