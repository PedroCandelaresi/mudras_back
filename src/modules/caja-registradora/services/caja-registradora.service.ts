import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { VentaCaja, EstadoVentaCaja, TipoVentaCaja } from '../entities/venta-caja.entity';
import { DetalleVentaCaja } from '../entities/detalle-venta-caja.entity';
import { PagoCaja } from '../entities/pago-caja.entity';
import { MovimientoInventario, TipoMovimientoInventario } from '../entities/movimiento-inventario.entity';
// import { PuestoVenta } from '../entities/puesto-venta.entity';
import { PuntoMudras, TipoPuntoMudras } from '../../puntos-mudras/entities/punto-mudras.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { CrearVentaCajaInput } from '../dto/crear-venta-caja.dto';
import { BuscarArticuloInput, ArticuloConStock } from '../dto/buscar-articulo.dto';
import { FiltrosHistorialInput, HistorialVentasResponse, ResumenVenta } from '../dto/historial-ventas.dto';
import { StockPuntoMudras } from '../../puntos-mudras/entities/stock-punto-mudras.entity';
import { MovimientoStockPunto, TipoMovimientoStockPunto } from '../../puntos-mudras/entities/movimiento-stock-punto.entity';
import { Cliente, EstadoCliente, TipoCliente } from '../../clientes/entities/cliente.entity';

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
    // Puestos de venta ya no se utilizan en el flujo de caja
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    @InjectRepository(StockPuntoMudras)
    private stockPuntoRepository: Repository<StockPuntoMudras>,
    @InjectRepository(PuntoMudras)
    private puntoMudrasRepository: Repository<PuntoMudras>,
    private dataSource: DataSource,
  ) { }

  async buscarArticulos(input: BuscarArticuloInput): Promise<ArticuloConStock[]> {
    const query = this.articuloRepository.createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.rubro', 'rubro')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor');

    if (input.codigoBarras) {
      query.andWhere('articulo.Codigo = :codigoBarras', { codigoBarras: input.codigoBarras });
    }

    if (input.sku) {
      query.andWhere('articulo.Codigo = :sku', { sku: input.sku });
    }

    if (input.nombre) {
      const nombre = input.nombre.toLowerCase();
      query.andWhere(
        '(LOWER(articulo.Descripcion) LIKE :nombre OR LOWER(articulo.Codigo) LIKE :nombre OR LOWER(articulo.Rubro) LIKE :nombre)',
        { nombre: `%${nombre}%` },
      );
    }

    query.limit(input.limite);

    const articulos = await query.getMany();

    // Calcular stock disponible para cada artículo
    const articulosConStock: ArticuloConStock[] = [];

    for (const articulo of articulos) {
      const stockDisponible = await this.calcularStockDisponible(
        articulo.id,
        undefined,
        input.puntoMudrasId,
      );

      if (input.puntoMudrasId && stockDisponible <= 0) {
        continue;
      }

      const precioFinal = this.calcularPrecioFinalArticulo(articulo);
      articulo.PrecioVenta = precioFinal;

      articulosConStock.push({
        ...articulo,
        stockDisponible,
        stockDespuesVenta: stockDisponible, // Se actualizará en el frontend según cantidad seleccionada
        alertaStock: stockDisponible <= 0,
      });
    }

    return articulosConStock;
  }

  async crearVenta(input: CrearVentaCajaInput, usuarioAuthId: string): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar punto Mudras (venta)
      if (!input.puntoMudrasId) {
        throw new BadRequestException('Debe seleccionar un punto de Mudras de tipo venta');
      }
      const punto = await queryRunner.manager.findOne(PuntoMudras, {
        where: { id: input.puntoMudrasId, activo: true, tipo: TipoPuntoMudras.venta as any },
      });
      if (!punto) {
        throw new NotFoundException('Punto de Mudras no encontrado, inactivo o no es de tipo venta');
      }

      if (!input.detalles || input.detalles.length === 0) {
        throw new BadRequestException('La venta debe incluir al menos un artículo');
      }

      const puntoMudrasId = input.puntoMudrasId;

      // Validar stock disponible antes de confirmar la venta
      if (punto.manejaStockFisico) {
        for (const detalle of input.detalles) {
          const cantidad = Number(detalle.cantidad);
          if (cantidad <= 0) {
            throw new BadRequestException('La cantidad de cada artículo debe ser mayor a 0');
          }
          await this.verificarStockDisponible(
            queryRunner,
            detalle.articuloId,
            cantidad,
            puntoMudrasId
          );
        }
      }

      // Validación: si hay pagos no efectivos, requerir DNI/CUIT del cliente
      const hayNoEfectivo = (input.pagos || []).some((p) => String(p.medioPago).toLowerCase() !== 'efectivo');
      if (hayNoEfectivo && !(input.cuitCliente && String(input.cuitCliente).trim().length >= 7)) {
        throw new BadRequestException('DNI/CUIT del cliente requerido para pagos no en efectivo');
      }

      // Generar número de venta
      const numeroVenta = await this.generarNumeroVenta(queryRunner);
      const clienteVentaId = await this.obtenerClienteParaVenta(queryRunner, input.clienteId);

      // Calcular totales
      let subtotal = 0;
      for (const detalle of input.detalles) {
        const cantidad = Number(detalle.cantidad);
        const precioUnitario = Number(detalle.precioUnitario);

        if (cantidad <= 0 || precioUnitario < 0) {
          throw new BadRequestException('Cantidad y precio unitario deben ser mayores o iguales a cero');
        }

        const subtotalDetalle = cantidad * precioUnitario;
        const descuentoPorcentaje = Number(detalle.descuentoPorcentaje || 0);
        const descuentoMonto = Number(detalle.descuentoMonto || 0);
        const descuentoCalculado = descuentoMonto || (subtotalDetalle * descuentoPorcentaje / 100);
        subtotal += subtotalDetalle - descuentoCalculado;
      }

      const descuentoTotal = Number(
        input.descuentoMonto || (subtotal * (Number(input.descuentoPorcentaje || 0) / 100))
      );
      const total = subtotal - descuentoTotal;

      // Validar que el total de pagos coincida
      const totalPagos = input.pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
      if (Math.abs(totalPagos - total) > 0.01) {
        throw new BadRequestException('El total de pagos no coincide con el total de la venta');
      }

      // Crear venta
      const venta = queryRunner.manager.create(VentaCaja, {
        numeroVenta,
        fecha: new Date(),
        tipoVenta: input.tipoVenta ?? TipoVentaCaja.MOSTRADOR,
        estado: EstadoVentaCaja.CONFIRMADA,
        puntoMudrasId: puntoMudrasId!,
        clienteId: clienteVentaId ?? null,
        usuarioAuthId,
        subtotal,
        descuentoPorcentaje: Number(input.descuentoPorcentaje || 0),
        descuentoMonto: descuentoTotal,
        impuestos: 0, // TODO: Calcular impuestos según configuración
        total,
        cambio: totalPagos - total,
        observaciones: input.observaciones,
        // Persistir datos snapshot del cliente
        cuitCliente: input.cuitCliente,
        nombreCliente: input.nombreCliente,
        razonSocialCliente: input.razonSocialCliente,
        tipoClienteSnapshot: 'CONSUMIDOR_FINAL' // TODO: Inferir o recibir
      });

      const ventaGuardada = await queryRunner.manager.save(VentaCaja, venta);

      // Crear detalles de venta
      for (const detalleInput of input.detalles) {
        const cantidad = Number(detalleInput.cantidad);
        const precioUnitario = Number(detalleInput.precioUnitario);
        const subtotalDetalle = cantidad * precioUnitario;
        const descuentoPorcentaje = Number(detalleInput.descuentoPorcentaje || 0);
        const descuentoMonto = Number(detalleInput.descuentoMonto || 0);
        const descuentoCalculado =
          descuentoMonto || (subtotalDetalle * descuentoPorcentaje / 100);

        const detalle = queryRunner.manager.create(DetalleVentaCaja, {
          ventaId: ventaGuardada.id,
          articuloId: detalleInput.articuloId,
          cantidad,
          precioUnitario,
          descuentoPorcentaje,
          descuentoMonto: descuentoCalculado,
          subtotal: subtotalDetalle - descuentoCalculado,
          observaciones: detalleInput.observaciones,
        });

        await queryRunner.manager.save(DetalleVentaCaja, detalle);

        // Crear movimiento de inventario (solo si el punto maneja stock físico)
        if (punto.manejaStockFisico) {
          await this.crearMovimientoInventario(
            queryRunner,
            detalleInput.articuloId,
            puntoMudrasId ?? null,
            -cantidad, // Negativo para salida
            TipoMovimientoInventario.VENTA,
            usuarioAuthId,
            ventaGuardada.id,
            precioUnitario,
            numeroVenta
          );

          const { stockAnterior, stockNuevo } = await this.ajustarStockArticulo(queryRunner, detalleInput.articuloId, -cantidad);
          await this.registrarMovimientoStockLegacy(
            queryRunner,
            detalleInput.articuloId,
            stockAnterior,
            stockNuevo,
            usuarioAuthId,
          );

          if (puntoMudrasId) {
            await this.ajustarStockPunto(
              queryRunner,
              puntoMudrasId,
              detalleInput.articuloId,
              -cantidad,
              usuarioAuthId,
              numeroVenta,
              TipoMovimientoStockPunto.VENTA,
              `Venta caja ${numeroVenta}`
            );
          }
        }
      }

      // Crear pagos
      for (const pagoInput of input.pagos) {
        const pago = queryRunner.manager.create(PagoCaja, {
          ventaId: ventaGuardada.id,
          medioPago: pagoInput.medioPago,
          monto: Number(pagoInput.monto),
          marcaTarjeta: pagoInput.marcaTarjeta,
          ultimos4Digitos: pagoInput.ultimos4Digitos,
          cuotas: pagoInput.cuotas ? Number(pagoInput.cuotas) : undefined,
          // En la tabla actual se persiste una única referencia; priorizar número de comprobante si existe
          numeroComprobante: pagoInput.numeroComprobante || pagoInput.numeroAutorizacion,
          observaciones: pagoInput.observaciones,
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
        relations: ['puntoMudras', 'usuarioAuth', 'detalles', 'detalles.articulo', 'pagos']
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
      .leftJoinAndSelect('venta.usuarioAuth', 'usuarioAuth')
      .leftJoinAndSelect('venta.puntoMudras', 'punto')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('venta.pagos', 'pagos')
      .orderBy('venta.fecha', 'DESC');

    if (filtros.fechaDesde) {
      query.andWhere('venta.fecha >= :fechaDesde', { fechaDesde: filtros.fechaDesde });
    }

    if (filtros.fechaHasta) {
      query.andWhere('venta.fecha <= :fechaHasta', { fechaHasta: filtros.fechaHasta });
    }

    if (filtros.usuarioAuthId) {
      query.andWhere('venta.usuarioAuthId = :usuarioAuthId', { usuarioAuthId: filtros.usuarioAuthId });
    }

    if (filtros.puntoMudrasId) {
      query.andWhere('venta.puntoMudrasId = :puntoMudrasId', { puntoMudrasId: filtros.puntoMudrasId });
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
      // Priorizar datos snapshot, luego relación cliente, luego fallback
      nombreCliente: venta.razonSocialCliente || venta.nombreCliente || venta.cliente?.nombre || 'Consumidor Final',
      cuitCliente: venta.cuitCliente || venta.cliente?.cuit,
      razonSocialCliente: venta.razonSocialCliente,
      nombreUsuario: (venta as any)?.usuarioAuth?.displayName || 'Usuario',
      nombrePuesto: (venta as any).puntoMudras?.nombre || 'Punto',
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

  private async calcularStockDisponible(
    articuloId: number,
    _puestoVentaId?: number,
    puntoMudrasId?: number,
  ): Promise<number> {
    const puntoDestinoId = puntoMudrasId;

    if (puntoDestinoId) {
      const stockPunto = await this.stockPuntoRepository.findOne({
        where: { puntoMudrasId: puntoDestinoId, articuloId },
      });
      if (stockPunto) {
        return Number(stockPunto.cantidad);
      }
      return 0;
    }

    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId },
    });

    return 0;
  }

  // Ya no se infiere desde puesto de venta; siempre utilizar puntoMudrasId provisto por input

  private async crearMovimientoInventario(
    queryRunner: QueryRunner,
    articuloId: number,
    puntoMudrasId: number | null,
    cantidad: number,
    tipoMovimiento: TipoMovimientoInventario,
    usuarioAuthId: string,
    ventaCajaId?: number,
    precioVenta?: number,
    numeroComprobante?: string
  ): Promise<void> {
    const movimiento = queryRunner.manager.create(MovimientoInventario, {
      articuloId,
      puntoMudrasId: puntoMudrasId ?? undefined,
      tipoMovimiento,
      cantidad,
      precioVenta,
      numeroComprobante,
      ventaCajaId,
      fecha: new Date(),
      usuarioAuthId,
    });

    await queryRunner.manager.save(MovimientoInventario, movimiento);
  }

  // Ya no se infiere desde puesto de venta.

  private async obtenerClienteParaVenta(queryRunner: QueryRunner, clienteId?: number): Promise<number | null> {
    // Si no se especifica cliente, no tocar la tabla (puede no existir en este entorno)
    if (!clienteId) return null;

    // Si se especifica, intentar validar su existencia
    const clienteExistente = await queryRunner.manager.findOne(Cliente, { where: { id: clienteId } });
    if (!clienteExistente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return clienteExistente.id;
  }

  private async verificarStockDisponible(
    queryRunner: QueryRunner,
    articuloId: number,
    cantidad: number,
    puntoMudrasId?: number | null,
  ): Promise<void> {
    if (puntoMudrasId) {
      const stockPunto = await this.obtenerStockPunto(queryRunner, puntoMudrasId, articuloId, 'pessimistic_read');
      if (stockPunto < cantidad) {
        throw new BadRequestException(
          `Stock insuficiente en el punto seleccionado para el artículo ${articuloId} (disponible: ${stockPunto}, requiere: ${cantidad})`,
        );
      }
      return;
    }

    const stockGlobal = await this.obtenerStockGlobal(queryRunner, articuloId, 'pessimistic_read');
    if (stockGlobal < cantidad) {
      throw new BadRequestException(
        `Stock global insuficiente para el artículo ${articuloId} (disponible: ${stockGlobal}, requiere: ${cantidad})`,
      );
    }
  }

  private async obtenerStockGlobal(
    queryRunner: QueryRunner,
    articuloId: number,
    lock: 'pessimistic_read' | 'pessimistic_write' = 'pessimistic_read',
  ): Promise<number> {
    const articulo = await queryRunner.manager.findOne(Articulo, {
      where: { id: articuloId },
      lock: { mode: lock },
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${articuloId} no encontrado`);
    }

    return 0;
  }

  private async obtenerStockTotalPuntos(
    queryRunner: QueryRunner,
    articuloId: number,
  ): Promise<number> {
    const qb = queryRunner.manager
      .createQueryBuilder(StockPuntoMudras, 'stock')
      .select('COALESCE(SUM(stock.cantidad), 0)', 'total')
      .where('stock.articuloId = :articuloId', { articuloId });

    try {
      qb.setLock('pessimistic_read');
    } catch { }

    const resultado = await qb.getRawOne<{ total: string }>();
    return Number(resultado?.total || 0);
  }

  private async obtenerStockPunto(
    queryRunner: QueryRunner,
    puntoMudrasId: number,
    articuloId: number,
    lock: 'pessimistic_read' | 'pessimistic_write' = 'pessimistic_read',
  ): Promise<number> {
    const registro = await queryRunner.manager.findOne(StockPuntoMudras, {
      where: { puntoMudrasId, articuloId },
      lock: { mode: lock },
    });

    return Number(registro?.cantidad || 0);
  }

  private async ajustarStockArticulo(
    queryRunner: QueryRunner,
    articuloId: number,
    delta: number,
  ): Promise<{ stockAnterior: number; stockNuevo: number }> {
    let stockAnterior = await this.obtenerStockGlobal(queryRunner, articuloId, 'pessimistic_write');
    let stockNuevo = stockAnterior + delta;

    if (stockNuevo < 0) {
      const stockPuntos = await this.obtenerStockTotalPuntos(queryRunner, articuloId);
      if (stockPuntos + delta < 0) {
        throw new BadRequestException(
          `Stock global insuficiente para el artículo ${articuloId} (disponible: ${stockPuntos}, requiere: ${Math.abs(delta)})`,
        );
      }
      stockAnterior = Math.max(stockAnterior, stockPuntos);
      stockNuevo = stockAnterior + delta;
    }

    // await queryRunner.manager.update(Articulo, { id: articuloId }, { Stock: stockNuevo });
    return { stockAnterior, stockNuevo };
  }

  private async ajustarStockPunto(
    queryRunner: QueryRunner,
    puntoMudrasId: number,
    articuloId: number,
    delta: number,
    usuarioId: number | string,
    referencia: string,
    tipoMovimiento: TipoMovimientoStockPunto,
    motivo?: string,
  ): Promise<void> {
    const registro = await queryRunner.manager.findOne(StockPuntoMudras, {
      where: { puntoMudrasId, articuloId },
      lock: { mode: 'pessimistic_write' },
    });

    const cantidadAnterior = Number(registro?.cantidad || 0);
    const cantidadNueva = cantidadAnterior + delta;

    if (cantidadNueva < 0) {
      throw new BadRequestException(
        `El punto seleccionado no posee stock suficiente para el artículo ${articuloId} (resultado: ${cantidadNueva})`,
      );
    }

    if (registro) {
      registro.cantidad = cantidadNueva;
      await queryRunner.manager.save(StockPuntoMudras, registro);
    } else {
      const nuevoRegistro = queryRunner.manager.create(StockPuntoMudras, {
        puntoMudrasId,
        articuloId,
        cantidad: cantidadNueva,
        stockMinimo: 0,
      });
      await queryRunner.manager.save(StockPuntoMudras, nuevoRegistro);
    }

    // Normalizar usuarioId: aceptar string (por ejemplo, UUID de auth) o number (id interno)
    const usuarioIdNum = typeof usuarioId === 'string' ? Number(usuarioId) : usuarioId;

    const movimiento = queryRunner.manager.create(MovimientoStockPunto, {
      puntoMudrasOrigenId: delta < 0 ? puntoMudrasId : undefined,
      puntoMudrasDestinoId: delta > 0 ? puntoMudrasId : undefined,
      articuloId,
      tipoMovimiento,
      cantidad: Math.abs(delta),
      cantidadAnterior,
      cantidadNueva,
      // Si no se puede convertir a número (p.ej. UUID), dejar null
      usuarioId: Number.isFinite(usuarioIdNum as number) ? (usuarioIdNum as number) : undefined,
      referenciaExterna: referencia,
      motivo: motivo ?? (tipoMovimiento === TipoMovimientoStockPunto.VENTA
        ? `Venta caja ${referencia}`
        : tipoMovimiento === TipoMovimientoStockPunto.DEVOLUCION
          ? `Devolución caja ${referencia}`
          : `Movimiento ${tipoMovimiento}`),
    });

    await queryRunner.manager.save(MovimientoStockPunto, movimiento);
  }

  // Registra movimiento en tabla legacy tbStock para reflejar entradas/salidas visibles en UI de movimientos
  private async registrarMovimientoStockLegacy(
    queryRunner: QueryRunner,
    articuloId: number,
    stockAnterior: number,
    stockNuevo: number,
    usuarioAuthId?: string,
  ): Promise<void> {
    try {
      const art = await queryRunner.manager.findOne(Articulo, { where: { id: articuloId } });
      // Asegurar código corto (tbStock.Codigo es VARCHAR(20)) y fallback al ID si no existe
      const rawCodigo = (art as any)?.Codigo ?? String(articuloId);
      const codigo = String(rawCodigo).substring(0, 20);
      let usuarioId: number | null = null;
      if (usuarioAuthId) {
        try {
          const rows = await queryRunner.manager.query(
            'SELECT usuario_id AS usuarioId FROM usuarios_auth_map WHERE auth_user_id = ? LIMIT 1',
            [usuarioAuthId],
          );
          const uid = rows?.[0]?.usuarioId;
          if (typeof uid === 'number' && Number.isFinite(uid)) usuarioId = uid;
          else if (uid != null) {
            const n = Number(uid);
            usuarioId = Number.isFinite(n) ? n : null;
          }
        } catch { }
      }
      // Fecha DATE en tbStock: usar formato 'YYYY-MM-DD' para evitar problemas de conversión
      const hoy = new Date();
      const fechaSql = hoy.toISOString().slice(0, 10);
      await queryRunner.manager.query(
        'INSERT INTO tbStock (Fecha, Codigo, Stock, StockAnterior, Usuario) VALUES (DATE(?), ?, ?, ?, ?)',
        [fechaSql, codigo, stockNuevo, stockAnterior, usuarioId],
      );
    } catch {
      // no interrumpir la transacción de venta por un fallo en el registro legacy
    }
  }

  // obtenerPuestosVenta eliminado en flujo con puntos_mudras

  async obtenerDetalleVenta(id: number): Promise<VentaCaja | null> {
    return await this.ventaCajaRepository.findOne({
      where: { id },
      relations: [
        'puntoMudras',
        'usuarioAuth',
        'detalles',
        'detalles.articulo',
        'detalles.articulo.rubro',
        'pagos',
        'comprobantesAfip',
        'ventaOriginal'
      ]
    });
  }

  async cancelarVenta(id: number, usuarioAuthId?: string, motivo?: string): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await queryRunner.manager.findOne(VentaCaja, {
        where: { id },
        relations: ['detalles', 'puntoMudras']
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

      // Crear movimientos inversos de inventario si el punto maneja stock
      if ((venta as any).puntoMudras) {
        let puntoMudrasId =
          (venta as any).puntoMudras?.id ?? null;

        if (!puntoMudrasId) {
          const movimientoVenta = await queryRunner.manager.findOne(MovimientoStockPunto, {
            where: {
              referenciaExterna: venta.numeroVenta,
              tipoMovimiento: TipoMovimientoStockPunto.VENTA,
            },
          });

          puntoMudrasId =
            movimientoVenta?.puntoMudrasOrigenId ??
            movimientoVenta?.puntoMudrasDestinoId ??
            null;
        }

        for (const detalle of venta.detalles || []) {
          const cantidad = Number(detalle.cantidad);

          await this.crearMovimientoInventario(
            queryRunner,
            detalle.articuloId,
            (venta as any).puntoMudrasId ?? null,
            cantidad, // Positivo para devolver stock
            TipoMovimientoInventario.DEVOLUCION,
            usuarioAuthId || (venta as any).usuarioAuthId,
            venta.id,
            detalle.precioUnitario,
            `CANCELACION-${venta.numeroVenta}`
          );

          const { stockAnterior, stockNuevo } = await this.ajustarStockArticulo(queryRunner, detalle.articuloId, cantidad);
          await this.registrarMovimientoStockLegacy(
            queryRunner,
            detalle.articuloId,
            stockAnterior,
            stockNuevo,
            usuarioAuthId || (venta as any).usuarioAuthId,
          );

          if (puntoMudrasId) {
            await this.ajustarStockPunto(
              queryRunner,
              puntoMudrasId,
              detalle.articuloId,
              cantidad,
              usuarioAuthId || (venta as any).usuarioAuthId,
              `CANCELACION-${venta.numeroVenta}`,
              TipoMovimientoStockPunto.DEVOLUCION,
              `Cancelación ${venta.numeroVenta}`
            );
          }
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
    usuarioAuthId?: string,
    motivo?: string
  ): Promise<VentaCaja> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ventaOriginal = await queryRunner.manager.findOne(VentaCaja, {
        where: { id: ventaOriginalId },
        relations: ['detalles', 'puntoMudras']
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
        puntoMudrasId: (ventaOriginal as any).puntoMudrasId,
        clienteId: ventaOriginal.clienteId,
        usuarioAuthId: usuarioAuthId || (ventaOriginal as any).usuarioAuthId,
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
        if ((ventaOriginal as any).puntoMudras) {
          await this.crearMovimientoInventario(
            queryRunner,
            detalleData.articuloId,
            (ventaOriginal as any).puntoMudrasId ?? null,
            Math.abs(detalleData.cantidad), // Positivo para devolver stock
            TipoMovimientoInventario.DEVOLUCION,
            usuarioAuthId || (ventaOriginal as any).usuarioAuthId,
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
    const ultimaVenta = await queryRunner.manager
      .createQueryBuilder(VentaCaja, 'v')
      .orderBy('v.id', 'DESC')
      .getOne();

    const ultimoNumero = ultimaVenta ? parseInt(ultimaVenta.numeroVenta.split('-')[1]) : 0;
    const nuevoNumero = ultimoNumero + 1;

    return `V-${nuevoNumero.toString().padStart(8, '0')}`;
  }

  private async generarNumeroDevolucion(queryRunner: QueryRunner): Promise<string> {
    const ultimaDevolucion = await queryRunner.manager
      .createQueryBuilder(VentaCaja, 'v')
      .where('v.numeroVenta LIKE :pref', { pref: 'D-%' })
      .orderBy('v.id', 'DESC')
      .getOne();

    const ultimoNumero = ultimaDevolucion ? parseInt(ultimaDevolucion.numeroVenta.split('-')[1]) : 0;
    const nuevoNumero = ultimoNumero + 1;

    return `D-${nuevoNumero.toString().padStart(8, '0')}`;
  }

  private obtenerCostoReferencia(articulo: Articulo): number {
    const fuentes = [
      articulo.PrecioCompra,
      articulo.CostoPromedio,
      articulo.PrecioListaProveedor,
    ];
    for (const fuente of fuentes) {
      if (fuente != null && !Number.isNaN(Number(fuente))) {
        const valor = Number(fuente);
        if (valor > 0) {
          return valor;
        }
      }
    }
    return Number(articulo.PrecioCompra ?? 0) || 0;
  }

  private aplicarIncremento(base: number, porcentaje?: number | null) {
    const valor = Number(porcentaje ?? 0);
    if (!valor) return base;
    const limitado = valor <= -100 ? -99.99 : valor;
    return base * (1 + limitado / 100);
  }

  private aplicarDescuento(base: number, porcentaje?: number | null) {
    const valor = Number(porcentaje ?? 0);
    if (!valor) return base;
    const limitado = Math.min(95, Math.max(0, valor));
    return base * (1 - limitado / 100);
  }

  private calcularPrecioFinalArticulo(articulo: Articulo): number {
    const costo = this.obtenerCostoReferencia(articulo);
    if (!costo) {
      return Number(articulo.PrecioVenta ?? 0) || 0;
    }

    let precio = Math.max(0, costo);
    if (precio === 0) {
      return Number(articulo.PrecioVenta ?? 0) || 0;
    }

    precio = this.aplicarIncremento(precio, articulo.PorcentajeGanancia);
    precio = this.aplicarIncremento(precio, articulo.rubro?.PorcentajeRecargo);
    precio = this.aplicarDescuento(precio, articulo.rubro?.PorcentajeDescuento);
    precio = this.aplicarIncremento(precio, articulo.proveedor?.PorcentajeRecargoProveedor);
    precio = this.aplicarDescuento(precio, articulo.proveedor?.PorcentajeDescuentoProveedor);
    precio = this.aplicarIncremento(precio, articulo.AlicuotaIva);

    if (!Number.isFinite(precio) || precio <= 0) {
      return Number(articulo.PrecioVenta ?? 0) || 0;
    }
    return Number(precio.toFixed(2));
  }
}
