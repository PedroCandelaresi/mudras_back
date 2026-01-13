import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresResolver } from './proveedores.resolver';
import { Proveedor } from './entities/proveedor.entity';
import { Rubro } from '../rubros/entities/rubro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor, Rubro])],
  providers: [ProveedoresResolver, ProveedoresService],
  exports: [ProveedoresService],
})
export class ProveedoresModule { }
