import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastosResolver } from './gastos.resolver';
import { GastosService } from './gastos.service';
import { Gasto } from './entities/gasto.entity';
import { CategoriaGasto } from './entities/categoria-gasto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto, CategoriaGasto])],
  providers: [GastosResolver, GastosService],
})
export class GastosModule {}

