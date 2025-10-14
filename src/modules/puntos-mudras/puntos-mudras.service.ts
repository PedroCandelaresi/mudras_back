import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PuntoMudras, TipoPuntoMudras } from './entities/punto-mudras.entity';
import { StockPuntoMudras } from './entities/stock-punto-mudras.entity';
import { MovimientoStockPunto, TipoMovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
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
    @InjectRepository(Articulo)
    private articulosRepository: Repository<Articulo>,
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
    
    console.log(`🗑️ Eliminando punto ${punto.nombre} (ID: ${id})`);
    
    // Eliminar todos los registros de stock asociados
    const stockEliminados = await this.stockRepository.delete({
      puntoMudrasId: id
    });
    
    console.log(`📦 Eliminados ${stockEliminados.affected || 0} registros de stock`);
    
    // Eliminar todos los movimientos de stock asociados (origen y destino)
    const movimientosEliminados1 = await this.movimientosRepository.delete({
      puntoMudrasOrigenId: id
    });
    
    const movimientosEliminados2 = await this.movimientosRepository.delete({
      puntoMudrasDestinoId: id
    });
    
    console.log(`📋 Eliminados ${(movimientosEliminados1.affected || 0) + (movimientosEliminados2.affected || 0)} movimientos de stock`);

    // Finalmente eliminar el punto
    await this.puntosMudrasRepository.remove(punto);
    console.log(`✅ Punto eliminado exitosamente`);
    
    return true;
  }

  // Gestión de Stock
  async obtenerArticulosConStockPunto(puntoMudrasId: number): Promise<any[]> {
    console.log(`🔍 Obteniendo artículos con stock para punto ${puntoMudrasId}`);
    
    // Verificar si es un depósito
    const punto = await this.puntosMudrasRepository.findOne({
      where: { id: puntoMudrasId }
    });

    if (!punto) {
      throw new Error(`Punto Mudras con ID ${puntoMudrasId} no encontrado`);
    }

    if (punto.tipo === 'deposito') {
      // Para depósitos, mostrar stock sin asignar (stock total - stock asignado a puntos)
      return await this.obtenerStockSinAsignar();
    } else {
      // Para puntos de venta, mostrar stock asignado específicamente
      const stockRecords = await this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.puntoMudras', 'punto')
        .leftJoin('tbarticulos', 'articulo', 'articulo.id = stock.articuloId')
        .leftJoin('tbrubros', 'rubro', 'rubro.Rubro = articulo.Rubro')
        .select([
          'stock.id',
          'stock.articuloId',
          'stock.cantidad',
          'stock.stockMinimo',
          'articulo.id',
          'articulo.Codigo',
          'articulo.Descripcion',
          'articulo.PrecioVenta',
          'articulo.Deposito',
          'articulo.Rubro',
          'rubro.Id',
          'rubro.Rubro'
        ])
        .where('stock.puntoMudrasId = :puntoMudrasId', { puntoMudrasId })
        .getRawMany();

      console.log(`📦 Encontrados ${stockRecords.length} registros de stock`);

      return stockRecords.map(record => ({
        id: record.articulo_id,
        nombre: record.articulo_Descripcion || 'Sin nombre',
        codigo: record.articulo_Codigo || 'Sin código',
        precio: parseFloat(record.articulo_PrecioVenta || '0'),
        stockAsignado: parseFloat(record.stock_cantidad || '0'),
        stockTotal: parseFloat(record.articulo_Deposito || '0'),
        rubro: record.articulo_Rubro || record.rubro_Rubro
          ? {
              id: record.rubro_Id || 0,
              nombre: record.articulo_Rubro || record.rubro_Rubro || 'Sin rubro'
            }
          : undefined,
      }));
    }
  }

  async obtenerStockSinAsignar(): Promise<any[]> {
    console.log(`🏪 Obteniendo stock sin asignar para depósito`);
    
    // Obtener todos los artículos con su stock total y calcular stock asignado
    const query = `
      SELECT 
        a.id,
        a.Codigo,
        a.Descripcion,
        a.PrecioVenta,
        a.Deposito as stockTotal,
        a.Rubro,
        COALESCE(SUM(spm.cantidad), 0) as stockAsignado,
        (a.Deposito - COALESCE(SUM(spm.cantidad), 0)) as stockDisponible
      FROM tbarticulos a
      LEFT JOIN stock_puntos_mudras spm ON a.id = spm.articulo_id
      WHERE a.Deposito > 0
      GROUP BY a.id, a.Codigo, a.Descripcion, a.PrecioVenta, a.Deposito, a.Rubro
      HAVING stockDisponible > 0
      ORDER BY a.Descripcion
    `;

    const stockRecords = await this.stockRepository.query(query);
    console.log(`📦 Encontrados ${stockRecords.length} artículos con stock disponible`);

    return stockRecords.map(record => ({
      id: record.id,
      nombre: record.Descripcion || 'Sin nombre',
      codigo: record.Codigo || 'Sin código',
      precio: parseFloat(record.PrecioVenta || '0'),
      stockAsignado: parseFloat(record.stockDisponible || '0'), // En depósito mostramos el disponible como "asignado"
      stockTotal: parseFloat(record.stockTotal || '0'),
      rubro: record.Rubro
        ? {
            id: 0,
            nombre: record.Rubro || 'Sin rubro'
          }
        : undefined,
    }));
  }

  // Nuevos métodos para filtros optimizados
  async obtenerProveedores(): Promise<any[]> {
    console.log(`🏭 Obteniendo lista de proveedores`);
    
    const query = `
      SELECT DISTINCT 
        p.IdProveedor as id,
        p.Nombre as nombre,
        p.Codigo as codigo
      FROM tbproveedores p
      INNER JOIN tbarticulos a ON a.idProveedor = p.IdProveedor
      WHERE a.Deposito > 0
      ORDER BY p.Nombre
    `;

    const proveedores = await this.stockRepository.query(query);
    console.log(`🏭 Encontrados ${proveedores.length} proveedores con stock`);
    
    return proveedores;
  }

  async obtenerRubrosPorProveedor(proveedorId: number): Promise<any[]> {
    console.log(`📋 Obteniendo rubros para proveedor ${proveedorId} desde tb_proveedor_rubro`);
    
    const query = `
      SELECT DISTINCT 
        pr.rubro_nombre as rubro
      FROM tb_proveedor_rubro pr
      WHERE pr.proveedor_id = ?
      ORDER BY pr.rubro_nombre
    `;

    const rubros = await this.stockRepository.query(query, [proveedorId]);
    console.log(`📋 Encontrados ${rubros.length} rubros para proveedor ${proveedorId} desde tabla relacional`);
    
    return rubros.map(r => ({ rubro: r.rubro }));
  }

  async buscarArticulosConFiltros(
    proveedorId?: number,
    rubro?: string,
    busqueda?: string
  ): Promise<any[]> {
    console.log(`🔍 Buscando artículos con filtros: proveedor=${proveedorId}, rubro=${rubro}, busqueda=${busqueda}`);
    
    let query = `
      SELECT 
        a.id,
        a.Codigo,
        a.Descripcion,
        a.PrecioVenta,
        a.Deposito as stockTotal,
        a.Rubro,
        p.Nombre as proveedorNombre,
        COALESCE(SUM(spm.cantidad), 0) as stockAsignado,
        (a.Deposito - COALESCE(SUM(spm.cantidad), 0)) as stockDisponible
      FROM tbarticulos a
      LEFT JOIN tbproveedores p ON a.idProveedor = p.IdProveedor
      LEFT JOIN stock_puntos_mudras spm ON a.id = spm.articulo_id
      WHERE a.Deposito > 0
    `;

    const params: any[] = [];

    if (proveedorId) {
      query += ` AND a.idProveedor = ?`;
      params.push(proveedorId);
    }

    if (rubro) {
      query += ` AND a.Rubro = ?`;
      params.push(rubro);
    }

    if (busqueda && busqueda.length >= 3) {
      query += ` AND (a.Descripcion LIKE ? OR a.Codigo LIKE ?)`;
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    query += `
      GROUP BY a.id, a.Codigo, a.Descripcion, a.PrecioVenta, a.Deposito, a.Rubro, p.Nombre
      HAVING stockDisponible > 0
      ORDER BY a.Descripcion
      LIMIT 50
    `;

    const articulos = await this.stockRepository.query(query, params);
    console.log(`🔍 Encontrados ${articulos.length} artículos con filtros aplicados`);

    return articulos.map(record => ({
      id: record.id,
      nombre: record.Descripcion || 'Sin nombre',
      codigo: record.Codigo || 'Sin código',
      precio: parseFloat(record.PrecioVenta || '0'),
      stockTotal: parseFloat(record.stockTotal || '0'),
      stockAsignado: parseFloat(record.stockAsignado || '0'),
      stockDisponible: parseFloat(record.stockDisponible || '0'),
      rubro: record.Rubro || 'Sin rubro',
      proveedor: record.proveedorNombre || 'Sin proveedor'
    }));
  }

  async modificarStockPunto(
    puntoMudrasId: number,
    articuloId: number,
    nuevaCantidad: number
  ): Promise<boolean> {
    console.log(`🔄 Modificando stock: Punto ${puntoMudrasId}, Artículo ${articuloId}, Nueva cantidad: ${nuevaCantidad}`);
    
    const stockRecord = await this.stockRepository.findOne({
      where: {
        puntoMudrasId: puntoMudrasId,
        articuloId: articuloId
      }
    });

    if (!stockRecord) {
      console.log(`❌ No se encontró registro de stock para punto ${puntoMudrasId} y artículo ${articuloId}`);
      return false;
    }

    stockRecord.cantidad = nuevaCantidad;
    await this.stockRepository.save(stockRecord);
    
    console.log(`✅ Stock actualizado exitosamente`);
    return true;
  }

  async obtenerRelacionesProveedorRubro(): Promise<any[]> {
    const query = `
      SELECT 
        pr.id,
        pr.proveedor_id as proveedorId,
        pr.proveedor_nombre as proveedorNombre,
        pr.rubro_nombre as rubroNombre,
        COUNT(a.id) as cantidadArticulos
      FROM tb_proveedor_rubro pr
      LEFT JOIN tbarticulos a ON a.idProveedor = pr.proveedor_id AND a.Rubro = pr.rubro_nombre
      GROUP BY pr.id, pr.proveedor_id, pr.proveedor_nombre, pr.rubro_nombre
      ORDER BY pr.proveedor_nombre, pr.rubro_nombre
    `;
    
    return await this.stockRepository.query(query);
  }

  async obtenerEstadisticasProveedorRubro(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as totalRelaciones,
        COUNT(DISTINCT pr.proveedor_id) as proveedoresUnicos,
        COUNT(DISTINCT pr.rubro_nombre) as rubrosUnicos,
        COALESCE(SUM(
          (SELECT COUNT(*) FROM tbarticulos a 
           WHERE a.idProveedor = pr.proveedor_id AND a.Rubro = pr.rubro_nombre)
        ), 0) as totalArticulos
      FROM tb_proveedor_rubro pr
    `;
    
    const result = await this.stockRepository.query(query);
    return result[0];
  }

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
      .andWhere('movimiento.fechaMovimiento < :manana', { manana: mañana })
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
    console.log(`🔄 Inicializando stock para punto ${puntoMudrasId}`);
    
    // Obtener todos los artículos (no hay campo Estado en la entidad actual)
    const articulos = await this.articulosRepository.find();

    console.log(`📦 Encontrados ${articulos.length} artículos activos`);

    // Crear registros de stock con cantidad 0 para cada artículo
    const stockRegistros = articulos.map(articulo => {
      return this.stockRepository.create({
        puntoMudrasId: puntoMudrasId,
        articuloId: articulo.id,
        cantidad: 0,
        stockMinimo: 0,
        stockMaximo: null,
      });
    });

    if (stockRegistros.length > 0) {
      await this.stockRepository.save(stockRegistros);
      console.log(`✅ Creados ${stockRegistros.length} registros de stock iniciales`);
    }
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
