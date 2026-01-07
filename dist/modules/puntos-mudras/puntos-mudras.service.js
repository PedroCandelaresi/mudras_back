"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntosMudrasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const punto_mudras_entity_1 = require("./entities/punto-mudras.entity");
const stock_punto_mudras_entity_1 = require("./entities/stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("./entities/movimiento-stock-punto.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const rubro_entity_1 = require("../rubros/entities/rubro.entity");
let PuntosMudrasService = class PuntosMudrasService {
    constructor(puntosMudrasRepository, stockRepository, movimientosRepository, articulosRepository, dataSource) {
        this.puntosMudrasRepository = puntosMudrasRepository;
        this.stockRepository = stockRepository;
        this.movimientosRepository = movimientosRepository;
        this.articulosRepository = articulosRepository;
        this.dataSource = dataSource;
    }
    async crear(input) {
        const punto = this.puntosMudrasRepository.create({
            ...input,
            tipo: input.tipo,
            activo: input.activo ?? true,
            permiteVentasOnline: input.permiteVentasOnline ?? false,
            manejaStockFisico: true,
            requiereAutorizacion: input.requiereAutorizacion ?? false,
        });
        const puntoGuardado = await this.puntosMudrasRepository.save(punto);
        if (puntoGuardado.manejaStockFisico) {
            await this.inicializarStockPunto(puntoGuardado.id);
        }
        await this.calcularEstadisticasPunto(puntoGuardado);
        return puntoGuardado;
    }
    async obtenerTodos(filtros) {
        const query = this.puntosMudrasRepository.createQueryBuilder('punto');
        if (filtros?.tipo) {
            query.andWhere('punto.tipo = :tipo', { tipo: filtros.tipo });
        }
        if (filtros?.activo !== undefined) {
            query.andWhere('punto.activo = :activo', { activo: filtros.activo });
        }
        if (filtros?.busqueda) {
            query.andWhere('(punto.nombre ILIKE :busqueda OR punto.descripcion ILIKE :busqueda OR punto.direccion ILIKE :busqueda)', { busqueda: `%${filtros.busqueda}%` });
        }
        const ordenarPor = filtros?.ordenarPor || 'fechaCreacion';
        const direccion = filtros?.direccionOrden || 'DESC';
        query.orderBy(`punto.${ordenarPor}`, direccion);
        if (filtros?.limite) {
            query.take(filtros.limite);
        }
        if (filtros?.offset) {
            query.skip(filtros.offset);
        }
        const [puntos, total] = await query.getManyAndCount();
        for (const punto of puntos) {
            await this.calcularEstadisticasPunto(punto);
        }
        return { puntos, total };
    }
    async obtenerPorId(id) {
        const punto = await this.puntosMudrasRepository.findOne({
            where: { id },
            relations: ['stock']
        });
        if (!punto) {
            throw new common_1.NotFoundException(`Punto Mudras con ID ${id} no encontrado`);
        }
        await this.calcularEstadisticasPunto(punto);
        return punto;
    }
    async actualizar(input) {
        const { id, ...updateData } = input;
        const punto = await this.obtenerPorId(id);
        Object.assign(punto, updateData);
        return await this.puntosMudrasRepository.save(punto);
    }
    async eliminar(id) {
        const punto = await this.obtenerPorId(id);
        console.log(`🗑️ Eliminando punto ${punto.nombre} (ID: ${id})`);
        const depositoPrincipal = await this.puntosMudrasRepository.findOne({
            where: { tipo: punto_mudras_entity_1.TipoPuntoMudras.deposito },
            order: { id: 'ASC' }
        });
        if (!depositoPrincipal) {
            throw new Error('No se encontró un depósito principal para transferir el stock.');
        }
        if (depositoPrincipal.id === id) {
            throw new common_1.BadRequestException('No se puede eliminar el depósito principal.');
        }
        console.log(`🔄 Transfiriendo stock al depósito principal: ${depositoPrincipal.nombre} (ID: ${depositoPrincipal.id})`);
        const stockRecords = await this.stockRepository.find({
            where: { puntoMudrasId: id, cantidad: (0, typeorm_2.MoreThan)(0) }
        });
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const record of stockRecords) {
                let stockDestino = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
                    where: {
                        puntoMudrasId: depositoPrincipal.id,
                        articuloId: record.articuloId
                    }
                });
                if (!stockDestino) {
                    stockDestino = queryRunner.manager.create(stock_punto_mudras_entity_1.StockPuntoMudras, {
                        puntoMudrasId: depositoPrincipal.id,
                        articuloId: record.articuloId,
                        cantidad: record.cantidad,
                        stockMinimo: 0
                    });
                }
                else {
                    stockDestino.cantidad = Number(stockDestino.cantidad) + Number(record.cantidad);
                }
                await queryRunner.manager.save(stockDestino);
                const movimiento = queryRunner.manager.create(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
                    puntoMudrasOrigenId: id,
                    puntoMudrasDestinoId: depositoPrincipal.id,
                    articuloId: record.articuloId,
                    tipoMovimiento: movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.TRANSFERENCIA,
                    cantidad: record.cantidad,
                    motivo: `Transferencia automática por eliminación de punto: ${punto.nombre}`
                });
                await queryRunner.manager.save(movimiento);
            }
            await queryRunner.manager.delete(stock_punto_mudras_entity_1.StockPuntoMudras, { puntoMudrasId: id });
            await queryRunner.manager.delete(movimiento_stock_punto_entity_1.MovimientoStockPunto, { puntoMudrasOrigenId: id });
            await queryRunner.manager.delete(movimiento_stock_punto_entity_1.MovimientoStockPunto, { puntoMudrasDestinoId: id });
            await queryRunner.manager.remove(punto);
            await queryRunner.commitTransaction();
            console.log(`✅ Punto eliminado y stock transferido exitosamente`);
            return true;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error al eliminar punto y transferir stock:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async obtenerArticulosConStockPunto(puntoMudrasId) {
        console.log(`🔍 Obteniendo artículos con stock para punto ${puntoMudrasId}`);
        const punto = await this.puntosMudrasRepository.findOne({
            where: { id: puntoMudrasId }
        });
        if (!punto) {
            throw new Error(`Punto Mudras con ID ${puntoMudrasId} no encontrado`);
        }
        const stockRecords = await this.stockRepository
            .createQueryBuilder('stock')
            .leftJoinAndSelect('stock.puntoMudras', 'punto')
            .leftJoin('mudras_articulos', 'articulo', 'articulo.id = stock.articuloId')
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
        const base = stockRecords.map(record => ({
            id: record.articulo_id,
            nombre: record.articulo_Descripcion || 'Sin nombre',
            codigo: record.articulo_Codigo || 'Sin código',
            precio: parseFloat(record.articulo_PrecioVenta || '0'),
            stockAsignado: parseFloat(record.stock_cantidad || '0'),
            stockTotal: 0,
            rubro: record.articulo_Rubro || record.rubro_Rubro
                ? {
                    id: record.rubro_Id || 0,
                    nombre: record.articulo_Rubro || record.rubro_Rubro || 'Sin rubro'
                }
                : undefined,
        }));
        return this.adjuntarDetallesArticulo(base);
    }
    async obtenerMatrizStock(filtros) {
        console.log(`📊 Generando matriz de stock global`);
        const puntos = await this.puntosMudrasRepository.find({
            where: { activo: true },
            order: { id: 'ASC' }
        });
        let selectPuntos = '';
        puntos.forEach(punto => {
            selectPuntos += `, COALESCE(SUM(CASE WHEN spm.punto_mudras_id = ${punto.id} THEN spm.cantidad END), 0) as 'stock_punto_${punto.id}'`;
        });
        let whereClause = 'WHERE 1=1';
        const params = [];
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
    async obtenerProveedores() {
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
    async obtenerRubrosPorProveedor(proveedorId) {
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
    async buscarArticulosConFiltros(proveedorId, rubro, busqueda, destinoId) {
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
        const params = [destinoId ?? 0];
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
    async modificarStockPunto(puntoMudrasId, articuloId, nuevaCantidad) {
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
        }
        else {
            stockRecord.cantidad = Math.max(0, nuevaCantidad);
        }
        await this.stockRepository.save(stockRecord);
        console.log(`✅ Stock actualizado exitosamente`);
        return true;
    }
    async obtenerRelacionesProveedorRubro() {
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
    async obtenerEstadisticasProveedorRubro() {
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
    async obtenerStockPunto(puntoMudrasId, filtros) {
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
    async ajustarStock(input) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let stock = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
                where: {
                    puntoMudrasId: input.puntoMudrasId,
                    articuloId: input.articuloId
                }
            });
            const cantidadAnterior = stock?.cantidad || 0;
            if (!stock) {
                stock = queryRunner.manager.create(stock_punto_mudras_entity_1.StockPuntoMudras, {
                    puntoMudrasId: input.puntoMudrasId,
                    articuloId: input.articuloId,
                    cantidad: input.nuevaCantidad,
                    stockMinimo: 0
                });
            }
            else {
                stock.cantidad = input.nuevaCantidad;
            }
            const stockGuardado = await queryRunner.manager.save(stock);
            const movimiento = queryRunner.manager.create(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
                puntoMudrasDestinoId: input.puntoMudrasId,
                articuloId: input.articuloId,
                tipoMovimiento: movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.AJUSTE,
                cantidad: input.nuevaCantidad - cantidadAnterior,
                cantidadAnterior,
                cantidadNueva: input.nuevaCantidad,
                motivo: input.motivo || 'Ajuste manual de stock'
            });
            await queryRunner.manager.save(movimiento);
            await queryRunner.commitTransaction();
            return stockGuardado;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async asignarStockMasivo(input) {
        console.log(`📦 Asignando stock masivo para punto ${input.puntoMudrasId}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const punto = await this.puntosMudrasRepository.findOne({
                where: { id: input.puntoMudrasId }
            });
            if (!punto) {
                throw new common_1.NotFoundException(`Punto Mudras con ID ${input.puntoMudrasId} no encontrado`);
            }
            for (const asignacion of input.asignaciones) {
                let stock = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
                    where: {
                        puntoMudrasId: input.puntoMudrasId,
                        articuloId: asignacion.articuloId
                    }
                });
                const cantidadAnterior = stock ? Number(stock.cantidad) : 0;
                const diferencia = asignacion.cantidad - cantidadAnterior;
                if (diferencia === 0)
                    continue;
                if (!stock) {
                    stock = queryRunner.manager.create(stock_punto_mudras_entity_1.StockPuntoMudras, {
                        puntoMudrasId: input.puntoMudrasId,
                        articuloId: asignacion.articuloId,
                        cantidad: asignacion.cantidad,
                        stockMinimo: 0
                    });
                }
                else {
                    stock.cantidad = asignacion.cantidad;
                }
                await queryRunner.manager.save(stock);
                const movimiento = queryRunner.manager.create(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
                    puntoMudrasDestinoId: input.puntoMudrasId,
                    articuloId: asignacion.articuloId,
                    tipoMovimiento: movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.AJUSTE,
                    cantidad: diferencia,
                    cantidadAnterior: cantidadAnterior,
                    cantidadNueva: asignacion.cantidad,
                    motivo: input.motivo || 'Asignación masiva de stock'
                });
                await queryRunner.manager.save(movimiento);
            }
            await queryRunner.commitTransaction();
            console.log(`✅ Asignación masiva completada`);
            return true;
        }
        catch (error) {
            console.error('Error en asignación masiva:', error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async transferirStock(input) {
        if (input.puntoOrigenId === input.puntoDestinoId) {
            throw new common_1.BadRequestException('El punto origen y destino no pueden ser el mismo');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const stockOrigen = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
                where: {
                    puntoMudrasId: input.puntoOrigenId,
                    articuloId: input.articuloId
                }
            });
            if (!stockOrigen || stockOrigen.cantidad < input.cantidad) {
                throw new common_1.BadRequestException('Stock insuficiente en el punto origen');
            }
            stockOrigen.cantidad -= input.cantidad;
            await queryRunner.manager.save(stockOrigen);
            let stockDestino = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
                where: {
                    puntoMudrasId: input.puntoDestinoId,
                    articuloId: input.articuloId
                }
            });
            if (!stockDestino) {
                stockDestino = queryRunner.manager.create(stock_punto_mudras_entity_1.StockPuntoMudras, {
                    puntoMudrasId: input.puntoDestinoId,
                    articuloId: input.articuloId,
                    cantidad: input.cantidad,
                    stockMinimo: 0
                });
            }
            else {
                stockDestino.cantidad += input.cantidad;
            }
            await queryRunner.manager.save(stockDestino);
            const movimiento = queryRunner.manager.create(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
                puntoMudrasOrigenId: input.puntoOrigenId,
                puntoMudrasDestinoId: input.puntoDestinoId,
                articuloId: input.articuloId,
                tipoMovimiento: movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.TRANSFERENCIA,
                cantidad: input.cantidad,
                motivo: input.motivo || 'Transferencia entre puntos'
            });
            const movimientoGuardado = await queryRunner.manager.save(movimiento);
            await queryRunner.commitTransaction();
            return movimientoGuardado;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async obtenerMovimientos(puntoMudrasId, filtros) {
        const query = this.movimientosRepository.createQueryBuilder('movimiento')
            .leftJoinAndSelect('movimiento.puntoOrigen', 'origen')
            .leftJoinAndSelect('movimiento.puntoDestino', 'destino');
        if (puntoMudrasId) {
            query.andWhere('(movimiento.puntoMudrasOrigenId = :puntoId OR movimiento.puntoMudrasDestinoId = :puntoId)', { puntoId: puntoMudrasId });
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
    async obtenerEstadisticas() {
        const totalPuntos = await this.puntosMudrasRepository.count();
        const puntosVenta = await this.puntosMudrasRepository.count({
            where: { tipo: punto_mudras_entity_1.TipoPuntoMudras.venta }
        });
        const depositos = await this.puntosMudrasRepository.count({
            where: { tipo: punto_mudras_entity_1.TipoPuntoMudras.deposito }
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
    async inicializarStockPunto(puntoMudrasId) {
        console.log(`🔄 Inicializando stock para punto ${puntoMudrasId}`);
        const articulos = await this.articulosRepository.find();
        console.log(`📦 Encontrados ${articulos.length} artículos activos`);
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
    async calcularEstadisticasPunto(punto) {
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
        }
        else {
            punto.totalArticulos = 0;
            punto.valorInventario = 0;
        }
    }
    async adjuntarDetallesArticulo(items) {
        if (!items.length)
            return items;
        const ids = Array.from(new Set(items.map(item => item.id).filter(id => typeof id === 'number' && Number.isFinite(id))));
        if (!ids.length)
            return items;
        const articulos = await this.articulosRepository.find({
            where: { id: (0, typeorm_2.In)(ids) },
            relations: ['proveedor'],
        });
        const mapa = new Map(articulos.map(art => [art.id, art]));
        const rubroIds = Array.from(new Set(articulos.map(a => a.rubroId).filter(id => typeof id === 'number' && Number.isFinite(id))));
        let rubroMapa = new Map();
        if (rubroIds.length) {
            const rubros = await this.dataSource.getRepository(rubro_entity_1.Rubro).findBy({ Id: (0, typeorm_2.In)(rubroIds) });
            rubroMapa = new Map(rubros.map(r => [r.Id, r]));
        }
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
};
exports.PuntosMudrasService = PuntosMudrasService;
exports.PuntosMudrasService = PuntosMudrasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(punto_mudras_entity_1.PuntoMudras)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_punto_mudras_entity_1.StockPuntoMudras)),
    __param(2, (0, typeorm_1.InjectRepository)(movimiento_stock_punto_entity_1.MovimientoStockPunto)),
    __param(3, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PuntosMudrasService);
//# sourceMappingURL=puntos-mudras.service.js.map