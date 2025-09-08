import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionesService } from './promociones.service';
import { PromocionesResolver } from './promociones.resolver';
import { Promocion } from './entities/promocion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promocion])],
  providers: [PromocionesService, PromocionesResolver],
  exports: [PromocionesService],
})
export class PromocionesModule {}
