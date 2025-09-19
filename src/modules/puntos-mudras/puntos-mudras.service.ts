import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PuntoMudras, TipoPuntoMudras } from './entities/punto-mudras.entity';
import { StockPuntoMudras } from './entities/stock-punto-mudras.entity';
import { MovimientoStockPunto, TipoMovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { FiltrosPuntosMudrasInput, FiltrosStockInput, FiltrosMovimientosInput } from './dto/filtros-puntos-mudras.dto';
import { TransferirStockInput, AjustarStockInput } from './dto/transferir-stock.dto';

@Injectable()
export class PuntosMudrasService {
  constructor(
    @InjectRepository(PuntoMudras)
    private puntosMudrasRepository: Repository<PuntoMudras>,
    @InjectRepository(StockPuntoMudras)
    private stockRepository: Repository<StockPuntoMudras>,
    @InjectRepository(MovimientoStockPunto)
    private movimientosRepository: Repository<MovimientoStockPunto>,
    private dataSource: DataSource,
  ) {}

  // CRUD Puntos Mudras
  async crear(input: CrearPuntoMudrasDto): Promise<PuntoMudras> {
    const punto = this.puntosMudrasRepository.create({
      ...input,
      tipo: input.tipo as TipoPuntoMudras,
      activo: input.activo ?? true,
      permiteVentasOnline: input.permiteVentasOnline ?? false,
      manejaStockFisico: true, // Siempre true por defecto
      requiereAutorizacion: input.requiereAutorizacion ?? false,
    });

    const puntoGuardado = await this.puntosMudrasRepository.save(punto);

    // Si maneja stock físico, inicializar stock para todos los artículos
    if (puntoGuardado.manejaStockFisico) {
      await this.inicializarStockPunto(puntoGuardado.id);
    }

    await this.calcularEstadisticasPunto(puntoGuardado);
    return puntoGuardado;
  }

  async obtenerTodos(filtros?: FiltrosPuntosMudrasInput): Promise<{ puntos: PuntoMudras[]; total: number }> {
    const query = this.puntosMudrasRepository.createQueryBuilder('punto');

    if (filtros?.tipo) {
      query.andWhere('punto.tipo = :tipo', { tipo: filtros.tipo });
    }

    if (filtros?.activo !== undefined) {
      query.andWhere('punto.activo = :activo', { activo: filtros.activo });
    }

    if (filtros?.busqueda) {
      query.andWhere(
        '(punto.nombre ILIKE :busqueda OR punto.descripcion ILIKE :busqueda OR punto.direccion ILIKE :busqueda)',
        { busqueda: `%${filtros.busqueda}%` }
      );
    }

    // Ordenamiento
    const ordenarPor = filtros?.ordenarPor || 'fechaCreacion';
    const direccion = filtros?.direccionOrden || 'DESC';
    query.orderBy(`punto.${ordenarPor}`, direccion as 'ASC' | 'DESC');

    // Paginación
    if (filtros?.limite) {
      query.take(filtros.limite);
    }
    if (filtros?.offset) {
      query.skip(filtros.offset);
    }

    const [puntos, total] = await query.getManyAndCount();

    // Calcular campos adicionales
    for (const punto of puntos) {
      await this.calcularEstadisticasPunto(punto);
    }

    return { puntos, total };
  }

  async obtenerPorId(id: number): Promise<PuntoMudras> {
    const punto = await this.puntosMudrasRepository.findOne({
      where: { id },
      relations: ['stock']
    });

    if (!punto) {
      throw new NotFoundException(`Punto Mudras con ID ${id} no encontrado`);
    }

    await this.calcularEstadisticasPunto(punto);
    return punto;
  }

  async actualizar(input: ActualizarPuntoMudrasDto): Promise<PuntoMudras> {
    const { id, ...updateData } = input;
    const punto = await this.obtenerPorId(id);
    
    // Aplicar todos los campos directamente
    Object.assign(punto, updateData);
    
    return await this.puntosMudrasRepository.save(punto);
  }

  async eliminar(id: number): Promise<boolean> {
    const punto = await this.obtenerPorId(id);
    
    // Verificar que no tenga stock antes de eliminar
    const tieneStock = await this.stockRepository.count({
      where: { puntoMudrasId: id }
    });

    if (tieneStock > 0) {
      throw new BadRequestException('No se puede eliminar un punto que tiene stock registrado');
    }

    await this.puntosMudrasRepository.remove(punto);
    return true;
  }

  // Gestión de Stock
  async obtenerStockPunto(
    puntoMudrasId: number, 
    filtros?: FiltrosStockInput
  ): Promise<{ stock: StockPuntoMudras[]; total: number }> {
    const query = this.stockRepository.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.puntoMudras', 'punto')
      .where('stock.puntoMudrasId = :puntoMudrasId', { puntoMudrasId });

    if (filtros?.soloConStock) {
      query.andWhere('stock.cantidad > 0');
    }

    if (filtros?.soloBajoStock) {
      query.andWhere('stock.cantidad <= stock.stockMinimo');
    }

    if (filtros?.busqueda) {
      // Aquí necesitarías hacer join con la tabla de artículos
      // query.andWhere('articulo.descripcion ILIKE :busqueda', { busqueda: `%${filtros.busqueda}%` });
    }

    if (filtros?.limite) {
      query.take(filtros.limite);
    }
    if (filtros?.offset) {
      query.skip(filtros.offset);
    }

    const [stock, total] = await query.getManyAndCount();
    return { stock, total };
  }

  async ajustarStock(input: AjustarStockInput): Promise<StockPuntoMudras> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar o crear registro de stock
      let stock = await queryRunner.manager.findOne(StockPuntoMudras, {
        where: { 
          puntoMudrasId: input.puntoMudrasId, 
          articuloId: input.articuloId 
        }
      });

      const cantidadAnterior = stock?.cantidad || 0;

      if (!stock) {
        stock = queryRunner.manager.create(StockPuntoMudras, {
          puntoMudrasId: input.puntoMudrasId,
          articuloId: input.articuloId,
          cantidad: input.nuevaCantidad,
          stockMinimo: 0
        });
      } else {
        stock.cantidad = input.nuevaCantidad;
      }

      const stockGuardado = await queryRunner.manager.save(stock);

      // Registrar movimiento
      const movimiento = queryRunner.manager.create(MovimientoStockPunto, {
        puntoMudrasDestinoId: input.puntoMudrasId,
        articuloId: input.articuloId,
        tipoMovimiento: TipoMovimientoStockPunto.AJUSTE,
        cantidad: input.nuevaCantidad - cantidadAnterior,
        cantidadAnterior,
        cantidadNueva: input.nuevaCantidad,
        motivo: input.motivo || 'Ajuste manual de stock'
      });

      await queryRunner.manager.save(movimiento);
      await queryRunner.commitTransaction();

      return stockGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async transferirStock(input: TransferirStockInput): Promise<MovimientoStockPunto> {
    if (input.puntoOrigenId === input.puntoDestinoId) {
      throw new BadRequestException('El punto origen y destino no pueden ser el mismo');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar stock disponible en origen
      const stockOrigen = await queryRunner.manager.findOne(StockPuntoMudras, {
        where: { 
          puntoMudrasId: input.puntoOrigenId, 
          articuloId: input.articuloId 
        }
      });

      if (!stockOrigen || stockOrigen.cantidad < input.cantidad) {
        throw new BadRequestException('Stock insuficiente en el punto origen');
      }

      // Actualizar stock origen
      stockOrigen.cantidad -= input.cantidad;
      await queryRunner.manager.save(stockOrigen);

      // Buscar o crear stock destino
      let stockDestino = await queryRunner.manager.findOne(StockPuntoMudras, {
        where: { 
          puntoMudrasId: input.puntoDestinoId, 
          articuloId: input.articuloId 
        }
      });

      if (!stockDestino) {
        stockDestino = queryRunner.manager.create(StockPuntoMudras, {
          puntoMudrasId: input.puntoDestinoId,
          articuloId: input.articuloId,
          cantidad: input.cantidad,
          stockMinimo: 0
        });
      } else {
        stockDestino.cantidad += input.cantidad;
      }

      await queryRunner.manager.save(stockDestino);

      // Registrar movimiento
      const movimiento = queryRunner.manager.create(MovimientoStockPunto, {
        puntoMudrasOrigenId: input.puntoOrigenId,
        puntoMudrasDestinoId: input.puntoDestinoId,
        articuloId: input.articuloId,
        tipoMovimiento: TipoMovimientoStockPunto.TRANSFERENCIA,
        cantidad: input.cantidad,
        motivo: input.motivo || 'Transferencia entre puntos'
      });

      const movimientoGuardado = await queryRunner.manager.save(movimiento);
      await queryRunner.commitTransaction();

      return movimientoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerMovimientos(
    puntoMudrasId?: number,
    filtros?: FiltrosMovimientosInput
  ): Promise<{ movimientos: MovimientoStockPunto[]; total: number }> {
    const query = this.movimientosRepository.createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.puntoOrigen', 'origen')
      .leftJoinAndSelect('movimiento.puntoDestino', 'destino');

    if (puntoMudrasId) {
      query.andWhere(
        '(movimiento.puntoMudrasOrigenId = :puntoId OR movimiento.puntoMudrasDestinoId = :puntoId)',
        { puntoId: puntoMudrasId }
      );
    }

    if (filtros?.tipoMovimiento) {
      query.andWhere('movimiento.tipoMovimiento = :tipo', { tipo: filtros.tipoMovimiento });
    }

    if (filtros?.articuloId) {
      query.andWhere('movimiento.articuloId = :articuloId', { articuloId: filtros.articuloId });
    }

    if (filtros?.fechaDesde) {
      query.andWhere('movimiento.fechaMovimiento >= :fechaDesde', { fechaDesde: filtros.fechaDesde });
    }

    if (filtros?.fechaHasta) {
      query.andWhere('movimiento.fechaMovimiento <= :fechaHasta', { fechaHasta: filtros.fechaHasta });
    }

    query.orderBy('movimiento.fechaMovimiento', 'DESC');

    if (filtros?.limite) {
      query.take(filtros.limite);
    }
    if (filtros?.offset) {
      query.skip(filtros.offset);
    }

    const [movimientos, total] = await query.getManyAndCount();
    return { movimientos, total };
  }

  async obtenerEstadisticas(): Promise<any> {
    const totalPuntos = await this.puntosMudrasRepository.count();
    const puntosVenta = await this.puntosMudrasRepository.count({
      where: { tipo: TipoPuntoMudras.venta }
    });
    const depositos = await this.puntosMudrasRepository.count({
      where: { tipo: TipoPuntoMudras.deposito }
    });
    const puntosActivos = await this.puntosMudrasRepository.count({
      where: { activo: true }
    });

    const articulosConStock = await this.stockRepository
      .createQueryBuilder('stock')
      .select('COUNT(DISTINCT stock.articuloId)', 'count')
      .where('stock.cantidad > 0')
      .getRawOne();

    const valorTotalInventario = await this.stockRepository
      .createQueryBuilder('stock')
      .select('SUM(stock.cantidad)', 'total')
      .getRawOne();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const movimientosHoy = await this.movimientosRepository
      .createQueryBuilder('movimiento')
      .where('movimiento.fechaMovimiento >= :hoy', { hoy })
      .andWhere('movimiento.fechaMovimiento < :mañana', { mañana })
      .getCount();

    return {
      totalPuntos,
      puntosVenta,
      depositos,
      puntosActivos,
      articulosConStock: parseInt(articulosConStock?.count || '0'),
      valorTotalInventario: parseFloat(valorTotalInventario?.total || '0'),
      movimientosHoy
    };
  }

  // Métodos auxiliares
  private async inicializarStockPunto(puntoMudrasId: number): Promise<void> {
    // Aquí deberías obtener todos los artículos y crear registros de stock con cantidad 0
    // Por ahora lo dejamos como placeholder
    console.log(`Inicializando stock para punto ${puntoMudrasId}`);
  }

  private async calcularEstadisticasPunto(punto: PuntoMudras): Promise<void> {
    if (punto.manejaStockFisico) {
      const estadisticas = await this.stockRepository
        .createQueryBuilder('stock')
        .select([
          'COUNT(*) as totalArticulos',
          'SUM(stock.cantidad) as valorInventario'
        ])
        .where('stock.puntoMudrasId = :id', { id: punto.id })
        .getRawOne();

      punto.totalArticulos = parseInt(estadisticas?.totalArticulos || '0');
      punto.valorInventario = parseFloat(estadisticas?.valorInventario || '0');
    } else {
      punto.totalArticulos = 0;
      punto.valorInventario = 0;
    }
  }
}
