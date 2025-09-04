"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuentasCorrientesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cuentas_corrientes_service_1 = require("./cuentas-corrientes.service");
const cuentas_corrientes_resolver_1 = require("./cuentas-corrientes.resolver");
const cuenta_corriente_entity_1 = require("./entities/cuenta-corriente.entity");
const movimiento_cuenta_corriente_entity_1 = require("./entities/movimiento-cuenta-corriente.entity");
let CuentasCorrientesModule = class CuentasCorrientesModule {
};
exports.CuentasCorrientesModule = CuentasCorrientesModule;
exports.CuentasCorrientesModule = CuentasCorrientesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cuenta_corriente_entity_1.CuentaCorriente, movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente])],
        providers: [cuentas_corrientes_resolver_1.CuentasCorrientesResolver, cuentas_corrientes_service_1.CuentasCorrientesService],
        exports: [cuentas_corrientes_service_1.CuentasCorrientesService],
    })
], CuentasCorrientesModule);
//# sourceMappingURL=cuentas-corrientes.module.js.map