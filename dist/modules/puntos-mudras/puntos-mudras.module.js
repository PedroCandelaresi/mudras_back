"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntosMudrasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const puntos_mudras_service_1 = require("./puntos-mudras.service");
const puntos_mudras_resolver_clean_1 = require("./puntos-mudras.resolver.clean");
const punto_mudras_entity_1 = require("./entities/punto-mudras.entity");
const stock_punto_mudras_entity_1 = require("./entities/stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("./entities/movimiento-stock-punto.entity");
let PuntosMudrasModule = class PuntosMudrasModule {
};
exports.PuntosMudrasModule = PuntosMudrasModule;
exports.PuntosMudrasModule = PuntosMudrasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                punto_mudras_entity_1.PuntoMudras,
                stock_punto_mudras_entity_1.StockPuntoMudras,
                movimiento_stock_punto_entity_1.MovimientoStockPunto,
            ]),
        ],
        providers: [
            puntos_mudras_service_1.PuntosMudrasService,
            puntos_mudras_resolver_clean_1.PuntosMudrasResolver,
        ],
        exports: [
            puntos_mudras_service_1.PuntosMudrasService,
        ],
    })
], PuntosMudrasModule);
//# sourceMappingURL=puntos-mudras.module.js.map