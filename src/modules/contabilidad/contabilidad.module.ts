import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContabilidadService } from './contabilidad.service';
import { ContabilidadResolver } from './contabilidad.resolver';
import { AsientoContable } from './entities/asiento-contable.entity';
import { DetalleAsientoContable } from './entities/detalle-asiento-contable.entity';
import { CuentaContable } from './entities/cuenta-contable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsientoContable, DetalleAsientoContable, CuentaContable])],
  providers: [ContabilidadResolver, ContabilidadService],
  exports: [ContabilidadService],
})
export class ContabilidadModule {}
