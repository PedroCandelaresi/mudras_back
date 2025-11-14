import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasResolver } from './compras.resolver';
import { ComprasService } from './compras.service';
import { OrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenCompra, DetalleOrdenCompra, Articulo, StockPuntoMudras])],
  providers: [ComprasResolver, ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}

