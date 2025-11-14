import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosService } from './articulos.service';
import { ArticulosResolver } from './articulos.resolver';
import { Articulo } from './entities/articulo.entity';
import { AuthModule } from '../auth/auth.module';
import { Rubro } from '../rubros/entities/rubro.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo, Rubro, StockPuntoMudras]), AuthModule],
  providers: [ArticulosResolver, ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
