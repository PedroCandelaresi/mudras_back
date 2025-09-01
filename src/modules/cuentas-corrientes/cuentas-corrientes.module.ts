import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasCorrientesService } from './cuentas-corrientes.service';
import { CuentasCorrientesResolver } from './cuentas-corrientes.resolver';
import { CuentaCorriente } from './entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente } from './entities/movimiento-cuenta-corriente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaCorriente, MovimientoCuentaCorriente])],
  providers: [CuentasCorrientesResolver, CuentasCorrientesService],
  exports: [CuentasCorrientesService],
})
export class CuentasCorrientesModule {}
