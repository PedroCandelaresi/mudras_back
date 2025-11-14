import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { OrdenCompra, EstadoOrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';
import { AgregarDetalleOcDto } from './dto/agregar-detalle-oc.dto';
import { RecepcionarOrdenDto } from './dto/recepcionar-orden.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver(() => OrdenCompra)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ComprasResolver {
  constructor(private readonly service: ComprasService) {}

  @Query(() => OrdenCompra, { name: 'ordenCompra' })
  @Permisos('compras.read')
  getOrden(@Args('id', { type: () => Int }) id: number) {
    return this.service.getOrden(id);
  }

  @Query(() => [OrdenCompra], { name: 'ordenesCompra' })
  @Permisos('compras.read')
  listar(
    @Args('estado', { nullable: true, type: () => String }) estado?: EstadoOrdenCompra,
    @Args('proveedorId', { nullable: true, type: () => Int }) proveedorId?: number,
  ) {
    return this.service.listar(estado, proveedorId);
  }

  @Mutation(() => OrdenCompra)
  @Roles('administrador')
  @Permisos('compras.create')
  crearOrdenCompra(@Args('input') input: CrearOrdenCompraDto) {
    return this.service.crearOrden(input);
  }

  @Mutation(() => DetalleOrdenCompra)
  @Roles('administrador')
  @Permisos('compras.update')
  agregarDetalleOrden(@Args('input') input: AgregarDetalleOcDto) {
    return this.service.agregarDetalle(input);
  }

  @Mutation(() => Boolean)
  @Roles('administrador')
  @Permisos('compras.update')
  eliminarDetalleOrden(@Args('detalleId', { type: () => Int }) detalleId: number) {
    return this.service.eliminarDetalle(detalleId);
  }

  @Mutation(() => OrdenCompra)
  @Roles('administrador')
  @Permisos('compras.update')
  emitirOrdenCompra(@Args('id', { type: () => Int }) id: number) {
    return this.service.emitirOrden(id);
  }

  @Mutation(() => OrdenCompra)
  @Roles('administrador')
  @Permisos('compras.update')
  recepcionarOrdenCompra(@Args('input') input: RecepcionarOrdenDto) {
    return this.service.recepcionarOrden(input);
  }
}

