import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorInput } from './dto/create-proveedor.dto';
import { UpdateProveedorInput } from './dto/update-proveedor.dto';
import { ArticulosPorProveedorResponse } from './dto/articulos-por-proveedor.dto';
import { RubroPorProveedor } from './dto/rubros-por-proveedor.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
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

  @Query(() => ArticulosPorProveedorResponse, { name: 'articulosPorProveedor' })
  @Permisos('proveedores.read')
  findArticulosByProveedor(
    @Args('proveedorId', { type: () => Int }) proveedorId: number,
    @Args('filtro', { nullable: true }) filtro?: string,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.proveedoresService.findArticulosByProveedor(proveedorId, filtro, offset, limit);
  }

  @Query(() => [RubroPorProveedor], { name: 'rubrosPorProveedor' })
  @Permisos('proveedores.read')
  findRubrosByProveedor(@Args('proveedorId', { type: () => ID }) proveedorId: string) {
    const parsedId = Number(proveedorId);
    if (!Number.isFinite(parsedId)) {
      throw new BadRequestException('El identificador del proveedor debe ser numérico.');
    }
    return this.proveedoresService.findRubrosByProveedor(parsedId);
  }

  @Mutation(() => Proveedor, { name: 'crearProveedor' })
  @Permisos('proveedores.create')
  create(@Args('createProveedorInput') createProveedorInput: CreateProveedorInput) {
    return this.proveedoresService.create(createProveedorInput);
  }

  @Mutation(() => Proveedor, { name: 'actualizarProveedor' })
  @Permisos('proveedores.update')
  update(@Args('updateProveedorInput') updateProveedorInput: UpdateProveedorInput) {
    return this.proveedoresService.update(updateProveedorInput);
  }

  @Mutation(() => Boolean, { name: 'eliminarProveedor' })
  @Permisos('proveedores.delete')
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.proveedoresService.remove(id);
  }
}
