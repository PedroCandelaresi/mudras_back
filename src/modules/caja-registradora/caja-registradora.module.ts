import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajaRegistradoraService } from './services/caja-registradora.service';
import { AfipService } from './services/afip.service';
import { CajaRegistradoraResolver } from './resolvers/caja-registradora.resolver';
import { VentaCaja } from './entities/venta-caja.entity';
import { DetalleVentaCaja } from './entities/detalle-venta-caja.entity';
import { PagoCaja } from './entities/pago-caja.entity';
import { PuestoVenta } from './entities/puesto-venta.entity';
import { ComprobanteAfip } from './entities/comprobante-afip.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { SnapshotInventarioMensual } from './entities/snapshot-inventario.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaCaja,
      DetalleVentaCaja,
      PagoCaja,
      PuestoVenta,
      ComprobanteAfip,
      MovimientoInventario,
      SnapshotInventarioMensual,
      Articulo,
      Cliente,
    ]),
  ],
  providers: [
    CajaRegistradoraService,
    AfipService,
    CajaRegistradoraResolver,
  ],
  exports: [
    CajaRegistradoraService,
    AfipService,
  ],
})
export class CajaRegistradoraModule {}
