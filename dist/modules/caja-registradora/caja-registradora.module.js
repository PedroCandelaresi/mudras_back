"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajaRegistradoraModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const caja_registradora_service_1 = require("./services/caja-registradora.service");
const afip_service_1 = require("./services/afip.service");
const caja_registradora_resolver_1 = require("./resolvers/caja-registradora.resolver");
const venta_caja_entity_1 = require("./entities/venta-caja.entity");
const detalle_venta_caja_entity_1 = require("./entities/detalle-venta-caja.entity");
const pago_caja_entity_1 = require("./entities/pago-caja.entity");
const puesto_venta_entity_1 = require("./entities/puesto-venta.entity");
const comprobante_afip_entity_1 = require("./entities/comprobante-afip.entity");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const snapshot_inventario_entity_1 = require("./entities/snapshot-inventario.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const cliente_entity_1 = require("../clientes/entities/cliente.entity");
const stock_punto_mudras_entity_1 = require("../puntos-mudras/entities/stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("../puntos-mudras/entities/movimiento-stock-punto.entity");
let CajaRegistradoraModule = class CajaRegistradoraModule {
};
exports.CajaRegistradoraModule = CajaRegistradoraModule;
exports.CajaRegistradoraModule = CajaRegistradoraModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                venta_caja_entity_1.VentaCaja,
                detalle_venta_caja_entity_1.DetalleVentaCaja,
                pago_caja_entity_1.PagoCaja,
                puesto_venta_entity_1.PuestoVenta,
                comprobante_afip_entity_1.ComprobanteAfip,
                movimiento_inventario_entity_1.MovimientoInventario,
                snapshot_inventario_entity_1.SnapshotInventarioMensual,
                articulo_entity_1.Articulo,
                cliente_entity_1.Cliente,
                stock_punto_mudras_entity_1.StockPuntoMudras,
                movimiento_stock_punto_entity_1.MovimientoStockPunto,
            ]),
        ],
        providers: [
            caja_registradora_service_1.CajaRegistradoraService,
            afip_service_1.AfipService,
            caja_registradora_resolver_1.CajaRegistradoraResolver,
        ],
        exports: [
            caja_registradora_service_1.CajaRegistradoraService,
            afip_service_1.AfipService,
        ],
    })
], CajaRegistradoraModule);
//# sourceMappingURL=caja-registradora.module.js.map