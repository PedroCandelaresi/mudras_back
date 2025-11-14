import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajaRegistradoraService } from './services/caja-registradora.service';
import { AfipService } from './services/afip.service';
import { CajaRegistradoraResolver } from './resolvers/caja-registradora.resolver';
import { VentaCaja } from './entities/venta-caja.entity';
import { DetalleVentaCaja } from './entities/detalle-venta-caja.entity';
import { PagoCaja } from './entities/pago-caja.entity';
import { ComprobanteAfip } from './entities/comprobante-afip.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { SnapshotInventarioMensual } from './entities/snapshot-inventario.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';
import { MovimientoStockPunto } from '../puntos-mudras/entities/movimiento-stock-punto.entity';
import { PuntoMudras } from '../puntos-mudras/entities/punto-mudras.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaCaja,
      DetalleVentaCaja,
      PagoCaja,
      ComprobanteAfip,
      MovimientoInventario,
      SnapshotInventarioMensual,
      Articulo,
      Cliente,
      StockPuntoMudras,
      PuntoMudras,
      MovimientoStockPunto,
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
