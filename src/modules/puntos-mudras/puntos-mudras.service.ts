import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, MoreThan } from 'typeorm';
import { PuntoMudras, TipoPuntoMudras } from './entities/punto-mudras.entity';
import { StockPuntoMudras } from './entities/stock-punto-mudras.entity';
import { MovimientoStockPunto, TipoMovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { FiltrosPuntosMudrasInput, FiltrosStockInput, FiltrosMovimientosInput } from './dto/filtros-puntos-mudras.dto';
import { TransferirStockInput, AjustarStockInput } from './dto/transferir-stock.dto';
import { AsignarStockMasivoInput } from './dto/asignar-stock-masivo.dto';

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
  ) { }

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

    // PROTECCIÓN DE PUNTOS POR DEFECTO
    if (punto.nombre === 'Tienda Principal' || punto.nombre === 'Depósito Primario') {
      throw new BadRequestException(`No se puede eliminar el punto Mudras por defecto: ${punto.nombre}`);
    }

    console.log(`🗑️ Eliminando punto ${punto.nombre} (ID: ${id})`);

    // 1. Encontrar el depósito principal (el de menor ID que sea tipo 'deposito' y distinto al actual)
    // Buscamos primero el depósito protegido, si no, el primer depósito disponible.
    let depositoPrincipal = await this.puntosMudrasRepository.findOne({
      where: { tipo: TipoPuntoMudras.deposito, nombre: 'Depósito Primario' },
    });

    if (!depositoPrincipal) {
      depositoPrincipal = await this.puntosMudrasRepository.findOne({
        where: { tipo: TipoPuntoMudras.deposito },
        order: { id: 'ASC' }
      });
    }

    if (!depositoPrincipal) {
      throw new Error('No se encontró un depósito principal para transferir el stock.');
    }

    // Evitar auto-transferencia
    if (depositoPrincipal.id === id) {
      // Esto solo pasaría si el único depósito que queda es el que estamos borrando (y no es uno protegido porque ya pasamos ese check)
      throw new BadRequestException('No se puede eliminar el depósito destino de la transferencia.');
    }

    console.log(`🔄 Transfiriendo stock al depósito principal: ${depositoPrincipal.nombre} (ID: ${depositoPrincipal.id})`);

    // 2. Obtener todo el stock del punto a eliminar
    const stockRecords = await this.stockRepository.find({
      where: { puntoMudrasId: id, cantidad: MoreThan(0) }
    });

    // 3. Transferir cada registro de stock
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const record of stockRecords) {
        // Buscar o crear stock en depósito principal
        let stockDestino = await queryRunner.manager.findOne(StockPuntoMudras, {
          where: {
            puntoMudrasId: depositoPrincipal.id,
            articuloId: record.articuloId
          }
        });

        if (!stockDestino) {
          stockDestino = queryRunner.manager.create(StockPuntoMudras, {
            puntoMudrasId: depositoPrincipal.id,
            articuloId: record.articuloId,
            cantidad: record.cantidad,
            stockMinimo: 0
          });
        } else {
          stockDestino.cantidad = Number(stockDestino.cantidad) + Number(record.cantidad);
        }

        await queryRunner.manager.save(stockDestino);

        // Registrar movimiento de transferencia por eliminación
        const movimiento = queryRunner.manager.create(MovimientoStockPunto, {
          puntoMudrasOrigenId: id,
          puntoMudrasDestinoId: depositoPrincipal.id,
          articuloId: record.articuloId,
          tipoMovimiento: TipoMovimientoStockPunto.TRANSFERENCIA,
          cantidad: record.cantidad,
          motivo: `Transferencia automática por eliminación de punto: ${punto.nombre}`
        });
        await queryRunner.manager.save(movimiento);
      }

      // 4. Eliminar registros de stock del punto (ahora que ya se movieron)
      await queryRunner.manager.delete(StockPuntoMudras, { puntoMudrasId: id });

      // 5. Eliminar movimientos asociados (o actualizarlos a NULL si se prefiere mantener historial, pero aquí borramos según lógica anterior)
      // Nota: Si queremos mantener historial, deberíamos poner NULL en origen/destino, pero la lógica anterior los borraba.
      // Vamos a mantener la lógica de borrar para limpiar, pero idealmente deberíamos hacer SET NULL en la FK.
      // Dado que la FK tiene ON DELETE SET NULL, simplemente borrando el punto se actualizan los movimientos.
      // Pero si queremos borrar los movimientos explícitamente como antes:
      await queryRunner.manager.delete(MovimientoStockPunto, { puntoMudrasOrigenId: id });
      await queryRunner.manager.delete(MovimientoStockPunto, { puntoMudrasDestinoId: id });

      // 6. Eliminar el punto
      await queryRunner.manager.remove(punto);

      await queryRunner.commitTransaction();
      console.log(`✅ Punto eliminado y stock transferido exitosamente`);
      return true;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error al eliminar punto y transferir stock:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
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

    const stockRecords = await this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.puntoMudras', 'punto')
      .innerJoin('mudras_articulos', 'articulo', 'articulo.id = stock.articuloId')
      .leftJoin('mudras_rubros', 'rubro', 'rubro.Rubro COLLATE utf8mb4_unicode_ci = articulo.Rubro COLLATE utf8mb4_unicode_ci')
      .select([
        'stock.id',
        'stock.articuloId',
        'stock.cantidad',
        'stock.stockMinimo',
        'articulo.id',
        'articulo.Codigo',
        'articulo.Descripcion',
        'articulo.PrecioVenta',
        'articulo.Rubro',
        'rubro.Id',
        'rubro.Rubro'
      ])
      .where('stock.puntoMudrasId = :puntoMudrasId', { puntoMudrasId })
      .getRawMany();

    console.log(`📦 Encontrados ${stockRecords.length} registros de stock`);
    if (stockRecords.length > 0) {
      console.log('🔑 Keys of first record:', Object.keys(stockRecords[0]));
    }

    const base = stockRecords.map(record => ({
      id: record.articulo_id || record.stock_articuloId,
      nombre: record.articulo_Descripcion || 'Sin nombre',
      codigo: record.articulo_Codigo || 'Sin código',
      precio: parseFloat(record.articulo_PrecioVenta || '0'),
      stockAsignado: parseFloat(record.stock_cantidad || '0'),
      stockTotal: 0, // Deprecated global stock
      rubro: record.articulo_Rubro || record.rubro_Rubro
        ? {
          id: record.rubro_Id || 0,
          nombre: record.articulo_Rubro || record.rubro_Rubro || 'Sin rubro'
        }
        : undefined,
    }));

    return this.adjuntarDetallesArticulo(base);
  }



  async obtenerMatrizStock(filtros?: { busqueda?: string, rubro?: string, proveedorId?: number }): Promise<any[]> {
    console.log(`📊 Generando matriz de stock global`);

    // 1. Obtener todos los puntos activos
    const puntos = await this.puntosMudrasRepository.find({
      where: { activo: true },
      order: { id: 'ASC' }
    });

    // 2. Construir query dinámica para pivotear los puntos
    let selectPuntos = '';
    puntos.forEach(punto => {
      selectPuntos += `, COALESCE(SUM(CASE WHEN spm.punto_mudras_id = ${punto.id} THEN spm.cantidad END), 0) as 'stock_punto_${punto.id}'`;
    });

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (filtros?.busqueda) {
      whereClause += ` AND (a.Descripcion LIKE ? OR a.Codigo LIKE ?)`;
      params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
    }

    if (filtros?.rubro) {
      whereClause += ` AND a.Rubro COLLATE utf8mb4_unicode_ci = ?`;
      params.push(filtros.rubro);
    }

    if (filtros?.proveedorId) {
      whereClause += ` AND a.idProveedor = ?`;
      params.push(filtros.proveedorId);
    }

    const query = `
      SELECT 
        a.id,
        a.Codigo,
        a.Descripcion,
        a.Rubro,
        COALESCE(SUM(spm.cantidad), 0) as stockTotal
        ${selectPuntos}
      FROM mudras_articulos a
      LEFT JOIN stock_puntos_mudras spm ON a.id = spm.articulo_id
      ${whereClause}
      GROUP BY a.id, a.Codigo, a.Descripcion, a.Rubro
      ORDER BY a.Descripcion
      LIMIT 100
    `;

    const resultados = await this.stockRepository.query(query, params);

    // 3. Formatear resultados
    return resultados.map(row => {
      const stockPorPunto = puntos.map(punto => ({
        puntoId: punto.id,
        puntoNombre: punto.nombre,
        cantidad: parseFloat(row[`stock_punto_${punto.id}`] || '0')
      }));

      return {
        id: row.id,
        codigo: row.Codigo,
        nombre: row.Descripcion,
        rubro: row.Rubro,
        stockTotal: parseFloat(row.stockTotal || '0'),
        stockPorPunto
      };
    });
  }

  // Nuevos métodos para filtros optimizados
  async obtenerProveedores(): Promise<any[]> {
    console.log(`🏭 Obteniendo lista de proveedores`);

    const query = `
      SELECT DISTINCT 
        p.IdProveedor as id,
        p.Nombre as nombre,
        p.Codigo as codigo
      FROM mudras_proveedores p
      INNER JOIN mudras_articulos a ON a.idProveedor = p.IdProveedor
      INNER JOIN stock_puntos_mudras spm ON a.id = spm.articulo_id
      GROUP BY p.IdProveedor, p.Nombre, p.Codigo
      HAVING SUM(spm.cantidad) > 0
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
      FROM mudras_proveedor_rubro pr
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
    busqueda?: string,
    destinoId?: number
  ): Promise<any[]> {
    console.log(`🔍 Buscando artículos con filtros: proveedor=${proveedorId}, rubro=${rubro}, busqueda=${busqueda}, destino=${destinoId}`);

    let query = `
      SELECT 
        a.id,
        a.Codigo,
        a.Descripcion,
        a.PrecioVenta,
        COALESCE(SUM(spm.cantidad), 0) as stockTotal,
        a.Rubro,
        p.Nombre as proveedorNombre,
        COALESCE(SUM(spm.cantidad), 0) as stockAsignado,
        0 as stockDisponible,
        COALESCE(SUM(CASE WHEN spm.punto_mudras_id = ? THEN spm.cantidad END), 0) as stockEnDestino
      FROM mudras_articulos a
      LEFT JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
      LEFT JOIN stock_puntos_mudras spm ON a.id = spm.articulo_id
      WHERE 1=1
    `;

    const params: any[] = [destinoId ?? 0];

    if (proveedorId) {
      query += ` AND a.idProveedor = ?`;
      params.push(proveedorId);
    }

    if (rubro) {
      query += ` AND a.Rubro COLLATE utf8mb4_unicode_ci = ?`;
      params.push(rubro);
    }

    if (busqueda) {
      query += ` AND (a.Descripcion LIKE ? OR a.Codigo LIKE ?)`;
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    query += `
      GROUP BY a.id, a.Codigo, a.Descripcion, a.PrecioVenta, a.Rubro, p.Nombre
      HAVING stockTotal > 0
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
      stockEnDestino: parseFloat(record.stockEnDestino || '0'),
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

    let stockRecord = await this.stockRepository.findOne({
      where: {
        puntoMudrasId: puntoMudrasId,
        articuloId: articuloId
      }
    });

    if (!stockRecord) {
      console.log(`ℹ️ No había registro de stock para punto ${puntoMudrasId} y artículo ${articuloId}. Creando uno nuevo.`);
      stockRecord = this.stockRepository.create({
        puntoMudrasId,
        articuloId,
        cantidad: Math.max(0, nuevaCantidad),
        stockMinimo: 0,
        stockMaximo: null,
      });
    } else {
      stockRecord.cantidad = Math.max(0, nuevaCantidad);
    }

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
      FROM mudras_proveedor_rubro pr
      LEFT JOIN mudras_articulos a ON a.idProveedor = pr.proveedor_id AND a.Rubro COLLATE utf8mb4_unicode_ci = pr.rubro_nombre COLLATE utf8mb4_unicode_ci
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
          (SELECT COUNT(*) FROM mudras_articulos a 
           WHERE a.idProveedor = pr.proveedor_id AND a.Rubro COLLATE utf8mb4_unicode_ci = pr.rubro_nombre COLLATE utf8mb4_unicode_ci)
        ), 0) as totalArticulos
      FROM mudras_proveedor_rubro pr
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
      console.log(`✅ Ajuste: Stock guardado ID ${stockGuardado.id} -> Cantidad: ${stockGuardado.cantidad}`);

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

  async asignarStockMasivo(input: AsignarStockMasivoInput): Promise<boolean> {
    console.log(`📦 Asignando stock masivo para punto ${input.puntoMudrasId}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const punto = await this.puntosMudrasRepository.findOne({
        where: { id: input.puntoMudrasId }
      });

      if (!punto) {
        throw new NotFoundException(`Punto Mudras con ID ${input.puntoMudrasId} no encontrado`);
      }

      for (const asignacion of input.asignaciones) {
        let stock = await queryRunner.manager.findOne(StockPuntoMudras, {
          where: {
            puntoMudrasId: input.puntoMudrasId,
            articuloId: asignacion.articuloId
          }
        });

        const cantidadAnterior = stock ? Number(stock.cantidad) : 0;
        const diferencia = asignacion.cantidad - cantidadAnterior;

        // Si no hay cambio significativo, saltar (usar una pequeña tolerancia si fuera necesario, pero siendo exactos mejor)
        if (diferencia === 0) continue;

        if (!stock) {
          stock = queryRunner.manager.create(StockPuntoMudras, {
            puntoMudrasId: input.puntoMudrasId,
            articuloId: asignacion.articuloId,
            cantidad: Number(asignacion.cantidad),
            stockMinimo: 0
          });
        } else {
          // FIX: Add to existing stock instead of overwriting, with strict casting
          stock.cantidad = Number(stock.cantidad) + Number(asignacion.cantidad);
        }

        const stockGuardado = await queryRunner.manager.save(stock);
        console.log(`✅ Asignación: Stock actualizado ID ${stockGuardado.id} (Punto: ${stockGuardado.puntoMudrasId}, Art: ${asignacion.articuloId}) -> Cantidad: ${stockGuardado.cantidad}`);

        const movimiento = queryRunner.manager.create(MovimientoStockPunto, {
          puntoMudrasDestinoId: input.puntoMudrasId,
          articuloId: asignacion.articuloId,
          tipoMovimiento: TipoMovimientoStockPunto.AJUSTE,
          cantidad: asignacion.cantidad, // The amount added is exactly what was requested
          cantidadAnterior: cantidadAnterior,
          cantidadNueva: Number(cantidadAnterior) + asignacion.cantidad,
          motivo: input.motivo || 'Asignación masiva de stock'
        });
        await queryRunner.manager.save(movimiento);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ Asignación masiva completada`);
      return true;

    } catch (error) {
      console.error('Error en asignación masiva:', error);
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
      stockOrigen.cantidad = Number(stockOrigen.cantidad) - Number(input.cantidad);
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
          cantidad: Number(input.cantidad),
          stockMinimo: 0
        });
      } else {
        stockDestino.cantidad = Number(stockDestino.cantidad) + Number(input.cantidad);
      }

      const destinoGuardado = await queryRunner.manager.save(stockDestino);
      console.log(`✅ Transferencia: Guardado stock destino ID ${destinoGuardado.id} (Punto: ${destinoGuardado.puntoMudrasId}, Art: ${destinoGuardado.articuloId}) con cantidad: ${destinoGuardado.cantidad}`);

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
      .leftJoinAndSelect('movimiento.puntoDestino', 'destino')
      .leftJoinAndSelect('movimiento.articulo', 'articulo')
      .leftJoinAndSelect('movimiento.usuario', 'usuario');

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

  private async adjuntarDetallesArticulo<T extends { id: number }>(items: T[]): Promise<(T & { articulo?: Articulo })[]> {
    if (!items.length) return items;
    const ids = Array.from(new Set(items.map(item => item.id).filter(id => typeof id === 'number' && Number.isFinite(id))));
    if (!ids.length) return items;
    // Fetch articles without performing a text-based join on `Rubro` to avoid collation issues.
    // Load proveedor relation (numeric FK) and fetch rubros separately by numeric `rubroId` when available.
    const articulos = await this.articulosRepository.find({
      where: { id: In(ids) },
      relations: ['proveedor'],
    });

    const mapa = new Map(articulos.map(art => [art.id, art]));

    // Collect rubroIds and fetch rubros in a separate query (numeric join)
    const rubroIds = Array.from(new Set(articulos.map(a => a.rubroId).filter(id => typeof id === 'number' && Number.isFinite(id))));
    let rubroMapa = new Map<number, Rubro>();
    if (rubroIds.length) {
      const rubros = await this.dataSource.getRepository(Rubro).findBy({ Id: In(rubroIds) });
      rubroMapa = new Map(rubros.map(r => [r.Id, r]));
    }

    // Attach rubro entity where possible (avoid text-based joins that caused collations mix)
    for (const art of articulos) {
      if (!art.rubro && art.rubroId && rubroMapa.has(art.rubroId)) {
        art.rubro = rubroMapa.get(art.rubroId);
      }
    }

    return items.map(item => ({
      ...item,
      articulo: mapa.get(item.id),
    }));
  }
}
