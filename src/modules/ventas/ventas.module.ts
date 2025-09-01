import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasResolver } from './ventas.resolver';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta])],
  providers: [VentasResolver, VentasService],
  exports: [VentasService],
})
export class VentasModule {}
