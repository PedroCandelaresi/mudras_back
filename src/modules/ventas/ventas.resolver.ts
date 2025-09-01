import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VentasService } from './ventas.service';
import { Venta, EstadoVenta, TipoPago } from './entities/venta.entity';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => Venta)
@RequireSecretKey()
export class VentasResolver {
  constructor(private readonly ventasService: VentasService) {}

  @Mutation(() => Venta)
  crearVenta(
    @Args('clienteId', { type: () => Int }) clienteId: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('tipoPago', { type: () => TipoPago }) tipoPago: TipoPago,
    @Args('detalles', { type: () => [DetalleVentaInput] }) detalles: DetalleVentaInput[],
    @Args('descuentoGeneral', { defaultValue: 0 }) descuentoGeneral: number,
    @Args('observaciones', { nullable: true }) observaciones?: string,
  ) {
    return this.ventasService.crearVenta(
      clienteId,
      usuarioId,
      tipoPago,
      detalles,
      descuentoGeneral,
      observaciones,
    );
  }

  @Query(() => [Venta], { name: 'ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Query(() => Venta, { name: 'venta' })
  obtenerVenta(@Args('id', { type: () => Int }) id: number) {
    return this.ventasService.obtenerVenta(id);
  }

  @Query(() => [Venta], { name: 'ventasPorCliente' })
  obtenerVentasPorCliente(@Args('clienteId', { type: () => Int }) clienteId: number) {
    return this.ventasService.obtenerVentasPorCliente(clienteId);
  }

  @Query(() => [Venta], { name: 'ventasPorUsuario' })
  obtenerVentasPorUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.ventasService.obtenerVentasPorUsuario(usuarioId);
  }

  @Query(() => [Venta], { name: 'ventasPorFecha' })
  obtenerVentasPorFecha(
    @Args('fechaDesde') fechaDesde: Date,
    @Args('fechaHasta') fechaHasta: Date,
  ) {
    return this.ventasService.obtenerVentasPorFecha(fechaDesde, fechaHasta);
  }

  @Mutation(() => Venta)
  confirmarVenta(@Args('id', { type: () => Int }) id: number) {
    return this.ventasService.confirmarVenta(id);
  }

  @Mutation(() => Venta)
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
