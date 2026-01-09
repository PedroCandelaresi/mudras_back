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
const serve_static_1 = require("@nestjs/serve-static");
const date_scalar_1 = require("./common/scalars/date.scalar");
const upload_module_1 = require("./modules/upload/upload.module");
const articulos_module_1 = require("./modules/articulos/articulos.module");
const proveedores_module_1 = require("./modules/proveedores/proveedores.module");
const stock_module_1 = require("./modules/stock/stock.module");
const rubros_module_1 = require("./modules/rubros/rubros.module");
const usuarios_module_1 = require("./modules/usuarios/usuarios.module");
const clientes_module_1 = require("./modules/clientes/clientes.module");
const cuentas_corrientes_module_1 = require("./modules/cuentas-corrientes/cuentas-corrientes.module");
const contabilidad_module_1 = require("./modules/contabilidad/contabilidad.module");
const ventas_module_1 = require("./modules/ventas/ventas.module");
const promociones_module_1 = require("./modules/promociones/promociones.module");
const caja_registradora_module_1 = require("./modules/caja-registradora/caja-registradora.module");
const puntos_mudras_module_1 = require("./modules/puntos-mudras/puntos-mudras.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_auth_module_1 = require("./modules/users-auth/users-auth.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const seed_module_1 = require("./modules/seed/seed.module");
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
const promocion_entity_1 = require("./modules/promociones/entities/promocion.entity");
const movimiento_stock_entity_1 = require("./modules/stock/entities/movimiento-stock.entity");
const user_entity_1 = require("./modules/users-auth/entities/user.entity");
const role_entity_1 = require("./modules/roles/entities/role.entity");
const permission_entity_1 = require("./modules/permissions/entities/permission.entity");
const role_permission_entity_1 = require("./modules/roles/entities/role-permission.entity");
const user_role_entity_1 = require("./modules/users-auth/entities/user-role.entity");
const user_provider_entity_1 = require("./modules/users-auth/entities/user-provider.entity");
const refresh_token_entity_1 = require("./modules/users-auth/entities/refresh-token.entity");
const venta_caja_entity_1 = require("./modules/caja-registradora/entities/venta-caja.entity");
const detalle_venta_caja_entity_1 = require("./modules/caja-registradora/entities/detalle-venta-caja.entity");
const pago_caja_entity_1 = require("./modules/caja-registradora/entities/pago-caja.entity");
const comprobante_afip_entity_1 = require("./modules/caja-registradora/entities/comprobante-afip.entity");
const movimiento_inventario_entity_1 = require("./modules/caja-registradora/entities/movimiento-inventario.entity");
const snapshot_inventario_entity_1 = require("./modules/caja-registradora/entities/snapshot-inventario.entity");
const punto_mudras_entity_1 = require("./modules/puntos-mudras/entities/punto-mudras.entity");
const stock_punto_mudras_entity_1 = require("./modules/puntos-mudras/entities/stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("./modules/puntos-mudras/entities/movimiento-stock-punto.entity");
const compras_module_1 = require("./modules/compras/compras.module");
const orden_compra_entity_1 = require("./modules/compras/entities/orden-compra.entity");
const detalle_orden_compra_entity_1 = require("./modules/compras/entities/detalle-orden-compra.entity");
const gastos_module_1 = require("./modules/gastos/gastos.module");
const gasto_entity_1 = require("./modules/gastos/entities/gasto.entity");
const categoria_gasto_entity_1 = require("./modules/gastos/entities/categoria-gasto.entity");
const proveedor_rubro_entity_1 = require("./modules/proveedores/entities/proveedor-rubro.entity");
const usuario_auth_map_entity_1 = require("./modules/users-auth/entities/usuario-auth-map.entity");
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
                charset: 'utf8mb4',
                timezone: process.env.DB_TIMEZONE || '-03:00',
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
                    promocion_entity_1.Promocion,
                    movimiento_stock_entity_1.MovimientoStock,
                    user_entity_1.UserAuth,
                    role_entity_1.Role,
                    permission_entity_1.Permission,
                    role_permission_entity_1.RolePermission,
                    user_role_entity_1.UserRole,
                    user_provider_entity_1.UserProvider,
                    refresh_token_entity_1.RefreshToken,
                    venta_caja_entity_1.VentaCaja,
                    detalle_venta_caja_entity_1.DetalleVentaCaja,
                    pago_caja_entity_1.PagoCaja,
                    comprobante_afip_entity_1.ComprobanteAfip,
                    movimiento_inventario_entity_1.MovimientoInventario,
                    snapshot_inventario_entity_1.SnapshotInventarioMensual,
                    punto_mudras_entity_1.PuntoMudras,
                    stock_punto_mudras_entity_1.StockPuntoMudras,
                    movimiento_stock_punto_entity_1.MovimientoStockPunto,
                    orden_compra_entity_1.OrdenCompra,
                    detalle_orden_compra_entity_1.DetalleOrdenCompra,
                    gasto_entity_1.Gasto,
                    categoria_gasto_entity_1.CategoriaGasto,
                    proveedor_rubro_entity_1.ProveedorRubro,
                    usuario_auth_map_entity_1.UsuarioAuthMap,
                ],
                synchronize: true,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                playground: true,
                introspection: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            upload_module_1.UploadModule,
            articulos_module_1.ArticulosModule,
            proveedores_module_1.ProveedoresModule,
            stock_module_1.StockModule,
            rubros_module_1.RubrosModule,
            usuarios_module_1.UsuariosModule,
            clientes_module_1.ClientesModule,
            cuentas_corrientes_module_1.CuentasCorrientesModule,
            contabilidad_module_1.ContabilidadModule,
            ventas_module_1.VentasModule,
            promociones_module_1.PromocionesModule,
            caja_registradora_module_1.CajaRegistradoraModule,
            puntos_mudras_module_1.PuntosMudrasModule,
            compras_module_1.ComprasModule,
            gastos_module_1.GastosModule,
            auth_module_1.AuthModule,
            users_auth_module_1.UsersAuthModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            seed_module_1.SeedModule,
        ],
        providers: [date_scalar_1.DateTimeScalar],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map