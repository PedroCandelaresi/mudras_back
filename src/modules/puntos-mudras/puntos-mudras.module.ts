import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntosMudrasResolver } from './puntos-mudras.resolver';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { StockPuntoMudras } from './entities/stock-punto-mudras.entity';
import { MovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { Articulo } from '../articulos/entities/articulo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PuntoMudras,
      StockPuntoMudras,
      MovimientoStockPunto,
      Articulo,
    ]),
  ],
  providers: [
    PuntosMudrasService,
    PuntosMudrasResolver,
  ],
  exports: [
    PuntosMudrasService,
  ],
})
export class PuntosMudrasModule {}
