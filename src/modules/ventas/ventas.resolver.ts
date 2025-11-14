import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VentasService } from './ventas.service';
import { Venta, EstadoVenta, TipoPago } from './entities/venta.entity';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver(() => Venta)
@RequireSecretKey()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class VentasResolver {
  constructor(private readonly ventasService: VentasService) {}

  @Mutation(() => Venta)
  @Permisos('ventas.create')
  crearVenta(
    @Args('clienteId', { type: () => Int }) clienteId: number,
    @Args('usuarioAuthId', { type: () => String }) usuarioAuthId: string,
    @Args('tipoPago', { type: () => TipoPago }) tipoPago: TipoPago,
    @Args('detalles', { type: () => [DetalleVentaInput] }) detalles: DetalleVentaInput[],
    @Args('descuentoGeneral', { defaultValue: 0 }) descuentoGeneral: number,
    @Args('observaciones', { nullable: true }) observaciones?: string,
  ) {
    return this.ventasService.crearVenta(
      clienteId,
      usuarioAuthId,
      tipoPago,
      detalles,
      descuentoGeneral,
      observaciones,
    );
  }

  @Query(() => [Venta], { name: 'ventas' })
  @Permisos('ventas.read')
  findAll() {
    return this.ventasService.findAll();
  }

  @Query(() => Venta, { name: 'venta' })
  @Permisos('ventas.read')
  obtenerVenta(@Args('id', { type: () => Int }) id: number) {
    return this.ventasService.obtenerVenta(id);
  }

  @Query(() => [Venta], { name: 'ventasPorCliente' })
  @Permisos('ventas.read')
  obtenerVentasPorCliente(@Args('clienteId', { type: () => Int }) clienteId: number) {
    return this.ventasService.obtenerVentasPorCliente(clienteId);
  }

  @Query(() => [Venta], { name: 'ventasPorUsuarioAuth' })
  @Permisos('ventas.read')
  obtenerVentasPorUsuarioAuth(@Args('usuarioAuthId', { type: () => String }) usuarioAuthId: string) {
    return this.ventasService.obtenerVentasPorUsuarioAuth(usuarioAuthId);
  }

  @Query(() => [Venta], { name: 'ventasPorFecha' })
  @Permisos('ventas.read')
  obtenerVentasPorFecha(
    @Args('fechaDesde') fechaDesde: Date,
    @Args('fechaHasta') fechaHasta: Date,
  ) {
    return this.ventasService.obtenerVentasPorFecha(fechaDesde, fechaHasta);
  }

  @Mutation(() => Venta)
  @Permisos('ventas.update')
  confirmarVenta(@Args('id', { type: () => Int }) id: number) {
    return this.ventasService.confirmarVenta(id);
  }

  @Mutation(() => Venta)
  @Permisos('ventas.update')
  cancelarVenta(
    @Args('id', { type: () => Int }) id: number,
    @Args('motivoCancelacion') motivoCancelacion: string,
  ) {
    return this.ventasService.cancelarVenta(id, motivoCancelacion);
  }

  @Query(() => ResumenVentas, { name: 'resumenVentas' })
  obtenerResumenVentas(
    @Args('fechaDesde') fechaDesde: Date,
    @Args('fechaHasta') fechaHasta: Date,
  ) {
    return this.ventasService.obtenerResumenVentas(fechaDesde, fechaHasta);
  }

  @Query(() => [TopArticulo], { name: 'topArticulos' })
  obtenerTopArticulos(
    @Args('fechaDesde') fechaDesde: Date,
    @Args('fechaHasta') fechaHasta: Date,
    @Args('limite', { type: () => Int, defaultValue: 10 }) limite: number,
  ) {
    return this.ventasService.obtenerTopArticulos(fechaDesde, fechaHasta, limite);
  }
}

// Input Types para GraphQL
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class DetalleVentaInput {
  @Field(() => Int)
  articuloId: number;

  @Field()
  cantidad: number;

  @Field()
  precioUnitario: number;

  @Field({ nullable: true })
  descuentoPorcentaje?: number;

  @Field({ nullable: true })
  descuentoMonto?: number;
}

@ObjectType()
export class VentasPorTipoPago {
  @Field()
  efectivo: number;

  @Field()
  tarjeta: number;

  @Field()
  transferencia: number;

  @Field()
  cuentaCorriente: number;
}

@ObjectType()
export class ResumenVentas {
  @Field()
  totalVentas: number;

  @Field()
  montoTotal: number;

  @Field()
  ventasConfirmadas: number;

  @Field()
  ventasPendientes: number;

  @Field()
  ventasCanceladas: number;

  @Field(() => VentasPorTipoPago)
  ventasPorTipoPago: VentasPorTipoPago;

  @Field()
  promedioVenta: number;
}

@ObjectType()
export class TopArticulo {
  @Field()
  articuloId: number;

  @Field()
  articuloNombre: string;

  @Field()
  cantidadVendida: number;

  @Field()
  montoTotal: number;

  @Field()
  numeroVentas: number;
}
