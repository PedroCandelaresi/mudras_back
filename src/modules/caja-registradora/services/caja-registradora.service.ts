import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { VentaCaja, EstadoVentaCaja } from '../entities/venta-caja.entity';
import { DetalleVentaCaja } from '../entities/detalle-venta-caja.entity';
import { PagoCaja } from '../entities/pago-caja.entity';
import { MovimientoInventario, TipoMovimientoInventario } from '../entities/movimiento-inventario.entity';
import { PuestoVenta } from '../entities/puesto-venta.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { CrearVentaCajaInput } from '../dto/crear-venta-caja.dto';
import { BuscarArticuloInput, ArticuloConStock } from '../dto/buscar-articulo.dto';
import { FiltrosHistorialInput, HistorialVentasResponse, ResumenVenta } from '../dto/historial-ventas.dto';

@Injectable()
export class CajaRegistradoraService {
  constructor(
    @InjectRepository(VentaCaja)
    private ventaCajaRepository: Repository<VentaCaja>,
    @InjectRepository(DetalleVentaCaja)
    private detalleVentaCajaRepository: Repository<DetalleVentaCaja>,
    @InjectRepository(PagoCaja)
    private pagoCajaRepository: Repository<PagoCaja>,
    @InjectRepository(MovimientoInventario)
    private movimientoInventarioRepository: Repository<MovimientoInventario>,
    @InjectRepository(PuestoVenta)
    private puestoVentaRepository: Repository<PuestoVenta>,
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    private dataSource: DataSource,
  ) {}

  async buscarArticulos(input: BuscarArticuloInput): Promise<ArticuloConStock[]> {
    const query = this.articuloRepository.createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.rubro', 'rubro')
      .where('articulo.activo = :activo', { activo: true });

    if (input.codigoBarras) {
      query.andWhere('articulo.codigoBarras = :codigoBarras', { codigoBarras: input.codigoBarras });
    }

    if (input.sku) {
      query.andWhere('articulo.sku = :sku', { sku: input.sku });
    }

    if (input.nombre) {
      query.andWhere('articulo.nombre LIKE :nombre', { nombre: `%${input.nombre}%` });
    }

    query.limit(input.limite);

    const articulos = await query.getMany();

    // Calcular stock disponible para cada artículo
    const articulosConStock: ArticuloConStock[] = [];
    
    for (const articulo of articulos) {
      const stockDisponible = await this.calcularStockDisponible(articulo.id, input.puestoVentaId);
      
      articulosConStock.push({
        ...articulo,
        stockDisponible: articulo.Deposito || 0,
        stockDespuesVenta: stockDisponible, // Se actualizará en el frontend según cantidad seleccionada
        alertaStock: stockDisponible <= 0,
      });
    }

    return articulosConStock;
  }

  async crearVenta(input: CrearVentaCajaInput, usuarioId: number): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar puesto de venta
      const puesto = await queryRunner.manager.findOne(PuestoVenta, {
        where: { id: input.puestoVentaId, activo: true }
      });

      if (!puesto) {
        throw new NotFoundException('Puesto de venta no encontrado o inactivo');
      }

      // Generar número de venta
      const numeroVenta = await this.generarNumeroVenta(queryRunner);

      // Calcular totales
      let subtotal = 0;
      for (const detalle of input.detalles) {
        const subtotalDetalle = detalle.cantidad * detalle.precioUnitario;
        const descuento = detalle.descuentoMonto || (subtotalDetalle * (detalle.descuentoPorcentaje || 0) / 100);
        subtotal += subtotalDetalle - descuento;
      }

      const descuentoTotal = input.descuentoMonto || (subtotal * (input.descuentoPorcentaje || 0) / 100);
      const total = subtotal - descuentoTotal;

      // Validar que el total de pagos coincida
      const totalPagos = input.pagos.reduce((sum, pago) => sum + pago.monto, 0);
      if (Math.abs(totalPagos - total) > 0.01) {
        throw new BadRequestException('El total de pagos no coincide con el total de la venta');
      }

      // Crear venta
      const venta = queryRunner.manager.create(VentaCaja, {
        numeroVenta,
        fecha: new Date(),
        tipoVenta: input.tipoVenta,
        estado: EstadoVentaCaja.CONFIRMADA,
        puestoVentaId: input.puestoVentaId,
        clienteId: input.clienteId,
        usuarioId,
        subtotal,
        descuentoPorcentaje: input.descuentoPorcentaje || 0,
        descuentoMonto: descuentoTotal,
        impuestos: 0, // TODO: Calcular impuestos según configuración
        total,
        cambio: totalPagos - total,
        observaciones: input.observaciones,
      });

      const ventaGuardada = await queryRunner.manager.save(VentaCaja, venta);

      // Crear detalles de venta
      for (const detalleInput of input.detalles) {
        const subtotalDetalle = detalleInput.cantidad * detalleInput.precioUnitario;
        const descuento = detalleInput.descuentoMonto || (subtotalDetalle * (detalleInput.descuentoPorcentaje || 0) / 100);

        const detalle = queryRunner.manager.create(DetalleVentaCaja, {
          ventaId: ventaGuardada.id,
          articuloId: detalleInput.articuloId,
          cantidad: detalleInput.cantidad,
          precioUnitario: detalleInput.precioUnitario,
          descuentoPorcentaje: detalleInput.descuentoPorcentaje || 0,
          descuentoMonto: descuento,
          subtotal: subtotalDetalle - descuento,
          observaciones: detalleInput.observaciones,
        });

        await queryRunner.manager.save(DetalleVentaCaja, detalle);

        // Crear movimiento de inventario (solo si el puesto descuenta stock)
        if (puesto.descontarStock) {
          await this.crearMovimientoInventario(
            queryRunner,
            detalleInput.articuloId,
            input.puestoVentaId,
            -detalleInput.cantidad, // Negativo para salida
            TipoMovimientoInventario.VENTA,
            usuarioId,
            ventaGuardada.id,
            detalleInput.precioUnitario,
            numeroVenta
          );
        }
      }

      // Crear pagos
      for (const pagoInput of input.pagos) {
        const pago = queryRunner.manager.create(PagoCaja, {
          ventaId: ventaGuardada.id,
          medioPago: pagoInput.medioPago,
          monto: pagoInput.monto,
          marcaTarjeta: pagoInput.marcaTarjeta,
          ultimos4Digitos: pagoInput.ultimos4Digitos,
          cuotas: pagoInput.cuotas,
          numeroAutorizacion: pagoInput.numeroAutorizacion,
          numeroComprobante: pagoInput.numeroComprobante,
          observaciones: pagoInput.observaciones,
          fecha: new Date(),
        });

        await queryRunner.manager.save(PagoCaja, pago);
      }

      // TODO: Si se requiere factura AFIP, crear comprobante
      if (input.generarFactura) {
        // Implementar lógica de facturación AFIP
      }

      await queryRunner.commitTransaction();

      // Retornar venta con relaciones
      return await this.ventaCajaRepository.findOne({
        where: { id: ventaGuardada.id },
        relations: ['puestoVenta', 'cliente', 'usuario', 'detalles', 'detalles.articulo', 'pagos']
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerHistorialVentas(filtros: FiltrosHistorialInput): Promise<HistorialVentasResponse> {
    const query = this.ventaCajaRepository.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.puestoVenta', 'puesto')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('venta.pagos', 'pagos')
      .orderBy('venta.fecha', 'DESC');

    if (filtros.fechaDesde) {
      query.andWhere('venta.fecha >= :fechaDesde', { fechaDesde: filtros.fechaDesde });
    }

    if (filtros.fechaHasta) {
      query.andWhere('venta.fecha <= :fechaHasta', { fechaHasta: filtros.fechaHasta });
    }

    if (filtros.usuarioId) {
      query.andWhere('venta.usuarioId = :usuarioId', { usuarioId: filtros.usuarioId });
    }

    if (filtros.puestoVentaId) {
      query.andWhere('venta.puestoVentaId = :puestoVentaId', { puestoVentaId: filtros.puestoVentaId });
    }

    if (filtros.estado) {
      query.andWhere('venta.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.tipoVenta) {
      query.andWhere('venta.tipoVenta = :tipoVenta', { tipoVenta: filtros.tipoVenta });
    }

    if (filtros.medioPago) {
      query.andWhere('pagos.medioPago = :medioPago', { medioPago: filtros.medioPago });
    }

    const total = await query.getCount();
    const ventas = await query
      .skip(filtros.offset)
      .take(filtros.limite)
      .getMany();

    const resumenVentas: ResumenVenta[] = ventas.map(venta => ({
      id: venta.id,
      numeroVenta: venta.numeroVenta,
      fecha: venta.fecha,
      nombreCliente: venta.cliente?.nombre || 'Cliente Genérico',
      nombreUsuario: venta.usuario?.nombre || 'Usuario',
      nombrePuesto: venta.puestoVenta?.nombre || 'Puesto',
      total: venta.total,
      estado: venta.estado,
      tipoVenta: venta.tipoVenta,
      cantidadItems: venta.detalles?.length || 0,
      mediosPago: [...new Set(venta.pagos?.map(p => p.medioPago) || [])],
    }));

    return {
      ventas: resumenVentas,
      total,
      totalPaginas: Math.ceil(total / filtros.limite),
      paginaActual: Math.floor(filtros.offset / filtros.limite) + 1,
    };
  }

  private async calcularStockDisponible(articuloId: number, puestoVentaId?: number): Promise<number> {
    // Obtener stock inicial del artículo
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId }
    });

    if (!articulo) {
      return 0;
    }

    // Calcular movimientos de inventario
    const query = this.movimientoInventarioRepository.createQueryBuilder('mov')
      .where('mov.articuloId = :articuloId', { articuloId });

    if (puestoVentaId) {
      query.andWhere('(mov.puestoVentaId = :puestoVentaId OR mov.puestoVentaId IS NULL)', { puestoVentaId });
    }

    const movimientos = await query.getMany();
    const totalMovimientos = movimientos.reduce((sum, mov) => sum + mov.cantidad, 0);

    return (articulo.Deposito || 0) + totalMovimientos;
  }

  private async crearMovimientoInventario(
    queryRunner: QueryRunner,
    articuloId: number,
    puestoVentaId: number,
    cantidad: number,
    tipoMovimiento: TipoMovimientoInventario,
    usuarioId: number,
    ventaCajaId?: number,
    precioVenta?: number,
    numeroComprobante?: string
  ): Promise<void> {
    const stockAnterior = await this.calcularStockDisponible(articuloId, puestoVentaId);
    const stockNuevo = stockAnterior + cantidad;

    const movimiento = queryRunner.manager.create(MovimientoInventario, {
      articuloId,
      puestoVentaId,
      tipoMovimiento,
      cantidad,
      stockAnterior,
      stockNuevo,
      precioVenta,
      numeroComprobante,
      ventaCajaId,
      fecha: new Date(),
      usuarioId,
    });

    await queryRunner.manager.save(MovimientoInventario, movimiento);
  }

  async obtenerPuestosVenta(): Promise<PuestoVenta[]> {
    return await this.puestoVentaRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' }
    });
  }

  async obtenerDetalleVenta(id: number): Promise<VentaCaja | null> {
    return await this.ventaCajaRepository.findOne({
      where: { id },
      relations: [
        'puestoVenta',
        'cliente',
        'usuario',
        'detalles',
        'detalles.articulo',
        'detalles.articulo.rubro',
        'pagos',
        'comprobantesAfip',
        'ventaOriginal'
      ]
    });
  }

  async cancelarVenta(id: number, usuarioId?: number, motivo?: string): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await queryRunner.manager.findOne(VentaCaja, {
        where: { id },
        relations: ['detalles', 'puestoVenta']
      });

      if (!venta) {
        throw new NotFoundException('Venta no encontrada');
      }

      if (venta.estado === EstadoVentaCaja.CANCELADA) {
        throw new BadRequestException('La venta ya está cancelada');
      }

      // Actualizar estado de venta
      venta.estado = EstadoVentaCaja.CANCELADA;
      venta.observaciones = `${venta.observaciones || ''}\nCANCELADA: ${motivo || 'Sin motivo especificado'}`;
      
      await queryRunner.manager.save(VentaCaja, venta);

      // Crear movimientos inversos de inventario si el puesto descuenta stock
      if (venta.puestoVenta?.descontarStock) {
        for (const detalle of venta.detalles || []) {
          await this.crearMovimientoInventario(
            queryRunner,
            detalle.articuloId,
            venta.puestoVentaId,
            detalle.cantidad, // Positivo para devolver stock
            TipoMovimientoInventario.DEVOLUCION,
            usuarioId || venta.usuarioId,
            venta.id,
            detalle.precioUnitario,
            `CANCELACION-${venta.numeroVenta}`
          );
        }
      }

      await queryRunner.commitTransaction();

      return await this.obtenerDetalleVenta(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async procesarDevolucion(
    ventaOriginalId: number,
    articulosDevolver: Array<{ articuloId: number; cantidad: number }>,
    usuarioId?: number,
    motivo?: string
  ): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ventaOriginal = await queryRunner.manager.findOne(VentaCaja, {
        where: { id: ventaOriginalId },
        relations: ['detalles', 'puestoVenta', 'cliente']
      });

      if (!ventaOriginal) {
        throw new NotFoundException('Venta original no encontrada');
      }

      if (ventaOriginal.estado === EstadoVentaCaja.CANCELADA) {
        throw new BadRequestException('No se puede devolver una venta cancelada');
      }

      // Validar artículos a devolver
      for (const itemDevolver of articulosDevolver) {
        const detalleOriginal = ventaOriginal.detalles?.find(d => d.articuloId === itemDevolver.articuloId);
        if (!detalleOriginal) {
          throw new BadRequestException(`Artículo ${itemDevolver.articuloId} no encontrado en la venta original`);
        }
        if (itemDevolver.cantidad > detalleOriginal.cantidad) {
          throw new BadRequestException(`No se puede devolver más cantidad de la vendida para el artículo ${itemDevolver.articuloId}`);
        }
      }

      // Generar número de devolución
      const numeroDevolucion = await this.generarNumeroDevolucion(queryRunner);

      // Calcular totales de devolución
      let subtotalDevolucion = 0;
      const detallesDevolucion: any[] = [];

      for (const itemDevolver of articulosDevolver) {
        const detalleOriginal = ventaOriginal.detalles?.find(d => d.articuloId === itemDevolver.articuloId);
        if (detalleOriginal) {
          const proporcion = itemDevolver.cantidad / detalleOriginal.cantidad;
          const subtotalItem = detalleOriginal.subtotal * proporcion;
          subtotalDevolucion += subtotalItem;

          detallesDevolucion.push({
            articuloId: itemDevolver.articuloId,
            cantidad: -itemDevolver.cantidad, // Negativo para devolución
            precioUnitario: detalleOriginal.precioUnitario,
            descuentoPorcentaje: detalleOriginal.descuentoPorcentaje,
            descuentoMonto: detalleOriginal.descuentoMonto * proporcion,
            subtotal: -subtotalItem, // Negativo para devolución
            observaciones: `Devolución de ${itemDevolver.cantidad} unidades`
          });
        }
      }

      // Crear venta de devolución
      const ventaDevolucion = queryRunner.manager.create(VentaCaja, {
        numeroVenta: numeroDevolucion,
        fecha: new Date(),
        tipoVenta: ventaOriginal.tipoVenta,
        estado: EstadoVentaCaja.CONFIRMADA,
        puestoVentaId: ventaOriginal.puestoVentaId,
        clienteId: ventaOriginal.clienteId,
        usuarioId: usuarioId || ventaOriginal.usuarioId,
        subtotal: -subtotalDevolucion,
        descuentoPorcentaje: 0,
        descuentoMonto: 0,
        impuestos: 0,
        total: -subtotalDevolucion,
        cambio: 0,
        observaciones: `Devolución parcial de venta ${ventaOriginal.numeroVenta}. Motivo: ${motivo || 'No especificado'}`,
        ventaOriginalId: ventaOriginalId,
      });

      const ventaDevolucionGuardada = await queryRunner.manager.save(VentaCaja, ventaDevolucion);

      // Crear detalles de devolución
      for (const detalleData of detallesDevolucion) {
        const detalle = queryRunner.manager.create(DetalleVentaCaja, {
          ventaId: ventaDevolucionGuardada.id,
          ...detalleData
        });

        await queryRunner.manager.save(DetalleVentaCaja, detalle);

        // Crear movimiento de inventario (devolver stock)
        if (ventaOriginal.puestoVenta?.descontarStock) {
          await this.crearMovimientoInventario(
            queryRunner,
            detalleData.articuloId,
            ventaOriginal.puestoVentaId,
            Math.abs(detalleData.cantidad), // Positivo para devolver stock
            TipoMovimientoInventario.DEVOLUCION,
            usuarioId || ventaOriginal.usuarioId,
            ventaDevolucionGuardada.id,
            detalleData.precioUnitario,
            numeroDevolucion
          );
        }
      }

      // Actualizar estado de venta original
      const totalDevuelto = Math.abs(subtotalDevolucion);
      const totalOriginal = ventaOriginal.total;
      
      if (totalDevuelto >= totalOriginal * 0.99) { // 99% devuelto = devolución total
        ventaOriginal.estado = EstadoVentaCaja.DEVUELTA;
      } else {
        ventaOriginal.estado = EstadoVentaCaja.DEVUELTA_PARCIAL;
      }

      await queryRunner.manager.save(VentaCaja, ventaOriginal);

      await queryRunner.commitTransaction();

      return await this.obtenerDetalleVenta(ventaDevolucionGuardada.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async generarNumeroVenta(queryRunner: QueryRunner): Promise<string> {
    const ultimaVenta = await queryRunner.manager.findOne(VentaCaja, {
      order: { id: 'DESC' }
    });

    const ultimoNumero = ultimaVenta ? parseInt(ultimaVenta.numeroVenta.split('-')[1]) : 0;
    const nuevoNumero = ultimoNumero + 1;
    
    return `V-${nuevoNumero.toString().padStart(8, '0')}`;
  }

  private async generarNumeroDevolucion(queryRunner: QueryRunner): Promise<string> {
    const ultimaDevolucion = await queryRunner.manager.findOne(VentaCaja, {
      where: { numeroVenta: { $like: 'D-%' } as any },
      order: { id: 'DESC' }
    });

    const ultimoNumero = ultimaDevolucion ? parseInt(ultimaDevolucion.numeroVenta.split('-')[1]) : 0;
    const nuevoNumero = ultimoNumero + 1;
    
    return `D-${nuevoNumero.toString().padStart(8, '0')}`;
  }
}
