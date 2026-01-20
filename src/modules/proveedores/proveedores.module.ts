import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresResolver } from './proveedores.resolver';
import { Proveedor } from './entities/proveedor.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { ProveedorRubro } from './entities/proveedor-rubro.entity';
import { ArticulosModule } from '../articulos/articulos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proveedor, Rubro, ProveedorRubro]),
    ArticulosModule // Importamos para poder inyectar ArticulosService
  ],
  providers: [ProveedoresResolver, ProveedoresService],
  exports: [ProveedoresService],
})
export class ProveedoresModule { }
