import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedor.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver(() => Proveedor)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProveedoresResolver {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Query(() => [Proveedor], { name: 'proveedores' })
  @Permisos('proveedores.read')
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Query(() => Proveedor, { name: 'proveedor' })
  @Permisos('proveedores.read')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Query(() => Proveedor, { name: 'proveedorPorCodigo' })
  @Permisos('proveedores.read')
  findByCodigo(@Args('codigo', { type: () => Int }) codigo: number) {
    return this.proveedoresService.findByCodigo(codigo);
  }

  @Query(() => [Proveedor], { name: 'proveedoresPorNombre' })
  @Permisos('proveedores.read')
  findByNombre(@Args('nombre') nombre: string) {
    return this.proveedoresService.findByNombre(nombre);
  }
}
