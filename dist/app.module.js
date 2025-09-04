"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const date_scalar_1 = require("./common/scalars/date.scalar");
const articulos_module_1 = require("./modules/articulos/articulos.module");
const proveedores_module_1 = require("./modules/proveedores/proveedores.module");
const stock_module_1 = require("./modules/stock/stock.module");
const rubros_module_1 = require("./modules/rubros/rubros.module");
const usuarios_module_1 = require("./modules/usuarios/usuarios.module");
const clientes_module_1 = require("./modules/clientes/clientes.module");
const cuentas_corrientes_module_1 = require("./modules/cuentas-corrientes/cuentas-corrientes.module");
const contabilidad_module_1 = require("./modules/contabilidad/contabilidad.module");
const ventas_module_1 = require("./modules/ventas/ventas.module");
const articulo_entity_1 = require("./modules/articulos/entities/articulo.entity");
const proveedor_entity_1 = require("./modules/proveedores/entities/proveedor.entity");
const stock_entity_1 = require("./modules/stock/entities/stock.entity");
const rubro_entity_1 = require("./modules/rubros/entities/rubro.entity");
const usuario_entity_1 = require("./modules/usuarios/entities/usuario.entity");
const cliente_entity_1 = require("./modules/clientes/entities/cliente.entity");
const cuenta_corriente_entity_1 = require("./modules/cuentas-corrientes/entities/cuenta-corriente.entity");
const movimiento_cuenta_corriente_entity_1 = require("./modules/cuentas-corrientes/entities/movimiento-cuenta-corriente.entity");
const asiento_contable_entity_1 = require("./modules/contabilidad/entities/asiento-contable.entity");
const detalle_asiento_contable_entity_1 = require("./modules/contabilidad/entities/detalle-asiento-contable.entity");
const cuenta_contable_entity_1 = require("./modules/contabilidad/entities/cuenta-contable.entity");
const venta_entity_1 = require("./modules/ventas/entities/venta.entity");
const detalle_venta_entity_1 = require("./modules/ventas/entities/detalle-venta.entity");
const movimiento_stock_entity_1 = require("./modules/stock/entities/movimiento-stock.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 3306,
                username: process.env.DB_USERNAME || 'mudras',
                password: process.env.DB_PASSWORD || 'mudras2025',
                database: process.env.DB_DATABASE || 'mudras',
                entities: [
                    articulo_entity_1.Articulo,
                    proveedor_entity_1.Proveedor,
                    stock_entity_1.Stock,
                    rubro_entity_1.Rubro,
                    usuario_entity_1.Usuario,
                    cliente_entity_1.Cliente,
                    cuenta_corriente_entity_1.CuentaCorriente,
                    movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente,
                    asiento_contable_entity_1.AsientoContable,
                    detalle_asiento_contable_entity_1.DetalleAsientoContable,
                    cuenta_contable_entity_1.CuentaContable,
                    venta_entity_1.Venta,
                    detalle_venta_entity_1.DetalleVenta,
                    movimiento_stock_entity_1.MovimientoStock,
                ],
                synchronize: false,
                logging: true,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                playground: true,
                introspection: true,
            }),
            articulos_module_1.ArticulosModule,
            proveedores_module_1.ProveedoresModule,
            stock_module_1.StockModule,
            rubros_module_1.RubrosModule,
            usuarios_module_1.UsuariosModule,
            clientes_module_1.ClientesModule,
            cuentas_corrientes_module_1.CuentasCorrientesModule,
            contabilidad_module_1.ContabilidadModule,
            ventas_module_1.VentasModule,
        ],
        providers: [date_scalar_1.DateTimeScalar],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map