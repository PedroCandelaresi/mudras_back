import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DateTimeScalar } from './common/scalars/date.scalar';

// Módulos
import { ArticulosModule } from './modules/articulos/articulos.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { StockModule } from './modules/stock/stock.module';
import { RubrosModule } from './modules/rubros/rubros.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { CuentasCorrientesModule } from './modules/cuentas-corrientes/cuentas-corrientes.module';
import { ContabilidadModule } from './modules/contabilidad/contabilidad.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { PromocionesModule } from './modules/promociones/promociones.module';
import { CajaRegistradoraModule } from './modules/caja-registradora/caja-registradora.module';
import { PuntosMudrasModule } from './modules/puntos-mudras/puntos-mudras.module';
// RBAC / Auth
import { AuthModule } from './modules/auth/auth.module';
import { UsersAuthModule } from './modules/users-auth/users-auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { SeedModule } from './modules/seed/seed.module';
import { UploadModule } from './modules/upload/upload.module';

// Entidades
import { Articulo } from './modules/articulos/entities/articulo.entity';
import { Proveedor } from './modules/proveedores/entities/proveedor.entity';
import { Stock } from './modules/stock/entities/stock.entity';
import { Rubro } from './modules/rubros/entities/rubro.entity';
import { Usuario } from './modules/usuarios/entities/usuario.entity';
import { Cliente } from './modules/clientes/entities/cliente.entity';
import { CuentaCorriente } from './modules/cuentas-corrientes/entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente } from './modules/cuentas-corrientes/entities/movimiento-cuenta-corriente.entity';
import { AsientoContable } from './modules/contabilidad/entities/asiento-contable.entity';
import { DetalleAsientoContable } from './modules/contabilidad/entities/detalle-asiento-contable.entity';
import { CuentaContable } from './modules/contabilidad/entities/cuenta-contable.entity';
import { Venta } from './modules/ventas/entities/venta.entity';
import { DetalleVenta } from './modules/ventas/entities/detalle-venta.entity';
import { Promocion } from './modules/promociones/entities/promocion.entity';
import { MovimientoStock } from './modules/stock/entities/movimiento-stock.entity';
import { UserAuth } from './modules/users-auth/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Permission } from './modules/permissions/entities/permission.entity';
import { RolePermission } from './modules/roles/entities/role-permission.entity';
import { UserRole } from './modules/users-auth/entities/user-role.entity';
import { UserProvider } from './modules/users-auth/entities/user-provider.entity';
import { RefreshToken } from './modules/users-auth/entities/refresh-token.entity';
import { VentaCaja } from './modules/caja-registradora/entities/venta-caja.entity';
import { DetalleVentaCaja } from './modules/caja-registradora/entities/detalle-venta-caja.entity';
import { PagoCaja } from './modules/caja-registradora/entities/pago-caja.entity';
import { ComprobanteAfip } from './modules/caja-registradora/entities/comprobante-afip.entity';
import { MovimientoInventario } from './modules/caja-registradora/entities/movimiento-inventario.entity';
import { SnapshotInventarioMensual } from './modules/caja-registradora/entities/snapshot-inventario.entity';
import { PuntoMudras } from './modules/puntos-mudras/entities/punto-mudras.entity';
import { StockPuntoMudras } from './modules/puntos-mudras/entities/stock-punto-mudras.entity';
import { MovimientoStockPunto } from './modules/puntos-mudras/entities/movimiento-stock-punto.entity';
import { ComprasModule } from './modules/compras/compras.module';
import { OrdenCompra } from './modules/compras/entities/orden-compra.entity';
import { DetalleOrdenCompra } from './modules/compras/entities/detalle-orden-compra.entity';
import { GastosModule } from './modules/gastos/gastos.module';
import { Gasto } from './modules/gastos/entities/gasto.entity';
import { CategoriaGasto } from './modules/gastos/entities/categoria-gasto.entity';
import { ProveedorRubro } from './modules/proveedores/entities/proveedor-rubro.entity';
import { UsuarioAuthMap } from './modules/users-auth/entities/usuario-auth-map.entity';


@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración TypeORM para MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'mudras',
      password: process.env.DB_PASSWORD || 'mudras2025',
      database: process.env.DB_DATABASE || 'mudras',
      charset: 'utf8mb4',
      timezone: process.env.DB_TIMEZONE || '-03:00',
      entities: [
        Articulo,
        Proveedor,
        Stock,
        Rubro,
        Usuario,
        Cliente,
        CuentaCorriente,
        MovimientoCuentaCorriente,
        AsientoContable,
        DetalleAsientoContable,
        CuentaContable,
        Venta,
        DetalleVenta,
        Promocion,
        MovimientoStock,
        // RBAC entities
        UserAuth,
        Role,
        Permission,
        RolePermission,
        UserRole,
        UserProvider,
        RefreshToken,
        // Caja Registradora entities
        VentaCaja,
        DetalleVentaCaja,
        PagoCaja,
        ComprobanteAfip,
        MovimientoInventario,
        SnapshotInventarioMensual,
        // Puntos Mudras entities
        PuntoMudras,
        StockPuntoMudras,
        MovimientoStockPunto,
        // Compras
        OrdenCompra,
        DetalleOrdenCompra,
        Gasto,
        CategoriaGasto,
        ProveedorRubro,
        UsuarioAuthMap,
      ],
      synchronize: true, // Auto-create tables as requested
    }),

    // Configuración GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    // Módulos de dominio
    ArticulosModule,
    ProveedoresModule,
    StockModule,
    RubrosModule,
    UsuariosModule,
    ClientesModule,
    CuentasCorrientesModule,
    ContabilidadModule,
    VentasModule,
    PromocionesModule,
    CajaRegistradoraModule,
    PuntosMudrasModule,
    ComprasModule,
    GastosModule,
    // RBAC / Auth modules
    AuthModule,
    UsersAuthModule,
    RolesModule,
    PermissionsModule,
    SeedModule,
    UploadModule,
  ],
  providers: [DateTimeScalar],
})
export class AppModule { }
