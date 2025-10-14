import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { CajaRegistradoraService } from '../services/caja-registradora.service';
import { AfipService } from '../services/afip.service';
import { VentaCaja } from '../entities/venta-caja.entity';
import { PuestoVenta } from '../entities/puesto-venta.entity';
import { ComprobanteAfip } from '../entities/comprobante-afip.entity';
import { CrearVentaCajaInput } from '../dto/crear-venta-caja.dto';
import { BuscarArticuloInput, ArticuloConStock } from '../dto/buscar-articulo.dto';
import { FiltrosHistorialInput, HistorialVentasResponse } from '../dto/historial-ventas.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CajaRegistradoraResolver {
  constructor(
    private readonly cajaRegistradoraService: CajaRegistradoraService,
    private readonly afipService: AfipService,
  ) {}

  @Query(() => [ArticuloConStock])
  async buscarArticulosCaja(
    @Args('input') input: BuscarArticuloInput,
  ): Promise<ArticuloConStock[]> {
    return this.cajaRegistradoraService.buscarArticulos(input);
  }

  @Query(() => [PuestoVenta])
  async obtenerPuestosVenta(): Promise<PuestoVenta[]> {
    return this.cajaRegistradoraService.obtenerPuestosVenta();
  }

  @Query(() => HistorialVentasResponse)
  async obtenerHistorialVentas(
    @Args('filtros') filtros: FiltrosHistorialInput,
  ): Promise<HistorialVentasResponse> {
    return this.cajaRegistradoraService.obtenerHistorialVentas(filtros);
  }

  @Query(() => VentaCaja, { nullable: true })
  async obtenerDetalleVenta(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<VentaCaja | null> {
    return this.cajaRegistradoraService.obtenerDetalleVenta(id);
  }

  @Mutation(() => VentaCaja)
  async crearVentaCaja(
    @Args('input') input: CrearVentaCajaInput,
    @CurrentUser() usuario: any,
  ): Promise<VentaCaja> {
    const usuarioActualId =
      typeof usuario?.uid === 'number' && Number.isFinite(usuario.uid)
        ? usuario.uid
        : (typeof usuario?.sub === 'string' ? parseInt(usuario.sub) : NaN);
    const usuarioSeleccionadoId =
      typeof input.usuarioId === 'number' && !Number.isNaN(input.usuarioId)
        ? input.usuarioId
        : usuarioActualId;

    if (Number.isNaN(usuarioSeleccionadoId)) {
      throw new BadRequestException('Usuario inválido para registrar la venta');
    }

    // Evitamos propagar el usuarioId dentro del input al servicio
    const ventaInput: CrearVentaCajaInput = { ...input };
    if (typeof ventaInput.usuarioId !== 'undefined') {
      delete (ventaInput as any).usuarioId;
    }

    return this.cajaRegistradoraService.crearVenta(ventaInput, usuarioSeleccionadoId);
  }

  @Mutation(() => VentaCaja)
  async cancelarVentaCaja(
    @Args('id', { type: () => Int }) id: number,
    @Args('motivo', { nullable: true }) motivo?: string,
    @CurrentUser() usuario?: any,
  ): Promise<VentaCaja> {
    const usuarioId =
      typeof usuario?.uid === 'number' && Number.isFinite(usuario.uid)
        ? usuario.uid
        : (typeof usuario?.sub === 'string' ? parseInt(usuario.sub) : undefined);
    return this.cajaRegistradoraService.cancelarVenta(id, usuarioId, motivo);
  }

  @Mutation(() => VentaCaja)
  async procesarDevolucion(
    @Args('ventaOriginalId', { type: () => Int }) ventaOriginalId: number,
    @Args('articulosDevolver') articulosDevolver: string, // JSON string con artículos y cantidades
    @Args('motivo', { nullable: true }) motivo?: string,
    @CurrentUser() usuario?: any,
  ): Promise<VentaCaja> {
    const articulos = JSON.parse(articulosDevolver);
    const usuarioId =
      typeof usuario?.uid === 'number' && Number.isFinite(usuario.uid)
        ? usuario.uid
        : (typeof usuario?.sub === 'string' ? parseInt(usuario.sub) : undefined);
    return this.cajaRegistradoraService.procesarDevolucion(
      ventaOriginalId,
      articulos,
      usuarioId,
      motivo
    );
  }

  @Query(() => [ComprobanteAfip])
  async obtenerComprobantesAfip(
    @Args('ventaId', { type: () => Int }) ventaId: number,
  ): Promise<ComprobanteAfip[]> {
    return this.afipService.obtenerComprobantesVenta(ventaId);
  }

  @Mutation(() => ComprobanteAfip)
  async reintentarEmisionAfip(
    @Args('comprobanteId', { type: () => Int }) comprobanteId: number,
  ): Promise<ComprobanteAfip> {
    return this.afipService.reintentarEmision(comprobanteId);
  }

  @Query(() => [ComprobanteAfip])
  async obtenerComprobantesPendientes(): Promise<ComprobanteAfip[]> {
    return this.afipService.obtenerComprobantesPendientes();
  }
}
