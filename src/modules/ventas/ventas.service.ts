import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta, EstadoVenta, TipoPago } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detallesVentaRepository: Repository<DetalleVenta>,
  ) {}

  async crearVenta(
    clienteId: number,
    usuarioId: number,
    tipoPago: TipoPago,
    detalles: Array<{
      articuloId: number;
      cantidad: number;
      precioUnitario: number;
      descuentoPorcentaje?: number;
      descuentoMonto?: number;
    }>,
    descuentoGeneral: number = 0,
    observaciones?: string,
  ): Promise<Venta> {
    // Calcular totales
    let subtotal = 0;
    for (const detalle of detalles) {
      const montoDetalle = detalle.cantidad * detalle.precioUnitario;
      const descuentoDetalle = (detalle.descuentoPorcentaje || 0) * montoDetalle / 100 + (detalle.descuentoMonto || 0);
      subtotal += montoDetalle - descuentoDetalle;
    }

    const montoDescuento = descuentoGeneral;
    const total = subtotal - montoDescuento;

    if (total < 0) {
      throw new BadRequestException('El total de la venta no puede ser negativo');
    }

    // Crear la venta
    const venta = this.ventasRepository.create({
      numero: `V-${Date.now()}`, // Generar número único temporal
      clienteId,
      usuarioId,
      tipoPago,
      subtotal,
      descuentoMonto: montoDescuento,
      total,
      observaciones,
      fecha: new Date(),
    });

    const ventaGuardada = await this.ventasRepository.save(venta);

    // Crear los detalles de la venta
    for (const detalle of detalles) {
      const montoDetalle = detalle.cantidad * detalle.precioUnitario;
      const descuentoDetalle = (detalle.descuentoPorcentaje || 0) * montoDetalle / 100 + (detalle.descuentoMonto || 0);
      const totalDetalle = montoDetalle - descuentoDetalle;

      await this.detallesVentaRepository.save({
        ventaId: ventaGuardada.id,
        articuloId: detalle.articuloId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        descuentoPorcentaje: detalle.descuentoPorcentaje || 0,
        descuentoMonto: detalle.descuentoMonto || 0,
        total: totalDetalle,
      });
    }

    return this.obtenerVenta(ventaGuardada.id);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: ['cliente', 'usuario', 'detalles', 'detalles.articulo'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerVenta(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: ['cliente', 'usuario', 'detalles', 'detalles.articulo'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async obtenerVentasPorCliente(clienteId: number): Promise<Venta[]> {
    return this.ventasRepository.find({
      where: { clienteId },
      relations: ['detalles', 'detalles.articulo'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerVentasPorUsuario(usuarioId: number): Promise<Venta[]> {
    return this.ventasRepository.find({
      where: { usuarioId },
      relations: ['cliente', 'detalles', 'detalles.articulo'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerVentasPorFecha(fechaDesde: Date, fechaHasta: Date): Promise<Venta[]> {
    return this.ventasRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('detalles.articulo', 'articulo')
      .where('venta.fecha >= :fechaDesde AND venta.fecha <= :fechaHasta', {
        fechaDesde,
        fechaHasta,
      })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
  }

  async confirmarVenta(id: number): Promise<Venta> {
    const venta = await this.obtenerVenta(id);

    if (venta.estado !== EstadoVenta.PENDIENTE) {
      throw new BadRequestException('Solo se pueden confirmar ventas pendientes');
    }

    venta.estado = EstadoVenta.CONFIRMADA;
    return this.ventasRepository.save(venta);
  }

  async cancelarVenta(id: number, motivoCancelacion: string): Promise<Venta> {
    const venta = await this.obtenerVenta(id);

    if (venta.estado === EstadoVenta.CANCELADA) {
      throw new BadRequestException('La venta ya está cancelada');
    }

    venta.estado = EstadoVenta.CANCELADA;
    venta.observaciones = `${venta.observaciones || ''}\nCANCELADA: ${motivoCancelacion}`;
    return this.ventasRepository.save(venta);
  }

  async obtenerResumenVentas(fechaDesde: Date, fechaHasta: Date): Promise<any> {
    const ventas = await this.obtenerVentasPorFecha(fechaDesde, fechaHasta);
    
    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);
    const ventasConfirmadas = ventas.filter(v => v.estado === EstadoVenta.CONFIRMADA);
    const ventasPendientes = ventas.filter(v => v.estado === EstadoVenta.PENDIENTE);
    const ventasCanceladas = ventas.filter(v => v.estado === EstadoVenta.CANCELADA);

    const ventasPorTipoPago = {
      efectivo: ventas.filter(v => v.tipoPago === TipoPago.EFECTIVO).length,
      tarjeta: ventas.filter(v => v.tipoPago === TipoPago.TARJETA_CREDITO || v.tipoPago === TipoPago.TARJETA_DEBITO).length,
      transferencia: ventas.filter(v => v.tipoPago === TipoPago.TRANSFERENCIA).length,
      cuentaCorriente: ventas.filter(v => v.tipoPago === TipoPago.CUENTA_CORRIENTE).length,
    };

    return {
      totalVentas,
      montoTotal,
      ventasConfirmadas: ventasConfirmadas.length,
      ventasPendientes: ventasPendientes.length,
      ventasCanceladas: ventasCanceladas.length,
      ventasPorTipoPago,
      promedioVenta: totalVentas > 0 ? montoTotal / totalVentas : 0,
    };
  }

  async obtenerTopArticulos(fechaDesde: Date, fechaHasta: Date, limite: number = 10): Promise<any[]> {
    const result = await this.detallesVentaRepository
      .createQueryBuilder('detalle')
      .leftJoin('detalle.venta', 'venta')
      .leftJoin('detalle.articulo', 'articulo')
      .select([
        'articulo.id as articuloId',
        'articulo.nombre as articuloNombre',
        'SUM(detalle.cantidad) as cantidadVendida',
        'SUM(detalle.total) as montoTotal',
        'COUNT(DISTINCT venta.id) as numeroVentas',
      ])
      .where('venta.fecha >= :fechaDesde AND venta.fecha <= :fechaHasta', {
        fechaDesde,
        fechaHasta,
      })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.CONFIRMADA })
      .groupBy('articulo.id, articulo.nombre')
      .orderBy('cantidadVendida', 'DESC')
      .limit(limite)
      .getRawMany();

    return result;
  }
}
