import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { Gasto } from './entities/gasto.entity';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CrearGastoDto } from './dto/crear-gasto.dto';
import { ActualizarGastoDto } from './dto/actualizar-gasto.dto';
import { CrearCategoriaGastoDto } from './dto/crear-categoria-gasto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class GastosResolver {
  constructor(private readonly service: GastosService) {}

  @Query(() => [Gasto])
  @Permisos('gastos.read')
  gastos(
    @Args('desde', { nullable: true }) desde?: string,
    @Args('hasta', { nullable: true }) hasta?: string,
    @Args('categoriaId', { type: () => Int, nullable: true }) categoriaId?: number,
    @Args('proveedorId', { type: () => Int, nullable: true }) proveedorId?: number,
  ) {
    return this.service.listar(desde, hasta, categoriaId, proveedorId);
  }

  @Query(() => [CategoriaGasto])
  @Permisos('gastos.read')
  categoriasGasto() {
    return this.service.listarCategorias();
  }

  @Mutation(() => Gasto)
  @Roles('administrador')
  @Permisos('gastos.create')
  crearGasto(@Args('input') input: CrearGastoDto) {
    return this.service.crear(input);
  }

  @Mutation(() => Gasto)
  @Roles('administrador')
  @Permisos('gastos.update')
  actualizarGasto(@Args('input') input: ActualizarGastoDto) {
    return this.service.actualizar(input);
  }

  @Mutation(() => Boolean)
  @Roles('administrador')
  @Permisos('gastos.delete')
  eliminarGasto(@Args('id', { type: () => Int }) id: number) {
    return this.service.eliminar(id);
  }

  @Mutation(() => CategoriaGasto)
  @Roles('administrador')
  @Permisos('gastos.update')
  crearCategoriaGasto(@Args('input') input: CrearCategoriaGastoDto) {
    return this.service.crearCategoria(input);
  }
}

