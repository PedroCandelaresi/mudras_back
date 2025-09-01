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
import { MovimientoStock } from './modules/stock/entities/movimiento-stock.entity';

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
        MovimientoStock,
      ],
      synchronize: false, // No modificar estructura de BD existente
      logging: true,
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
  ],
  providers: [DateTimeScalar],
})
export class AppModule {}
