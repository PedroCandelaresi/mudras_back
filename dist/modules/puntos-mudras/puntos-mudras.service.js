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
let PuntosMudrasService = class PuntosMudrasService {
    constructor(puntosMudrasRepository, stockRepository, movimientosRepository, dataSource) {
        this.puntosMudrasRepository = puntosMudrasRepository;
        this.stockRepository = stockRepository;
        this.movimientosRepository = movimientosRepository;
        this.dataSource = dataSource;
    }
    async crear(input) {
        const punto = this.puntosMudrasRepository.create({
            ...input,
            activo: input.activo ?? true,
            permiteVentasOnline: input.configuracionEspecial?.ventasOnline ?? false,
            manejaStockFisico: true,
            requiereAutorizacion: input.configuracionEspecial?.requiereAutorizacion ?? false,
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
        if (updateData.configuracionEspecial) {
            punto.permiteVentasOnline = updateData.configuracionEspecial.ventasOnline ?? punto.permiteVentasOnline;
            punto.requiereAutorizacion = updateData.configuracionEspecial.requiereAutorizacion ?? punto.requiereAutorizacion;
        }
        Object.assign(punto, updateData);
        return await this.puntosMudrasRepository.save(punto);
    }
    async eliminar(id) {
        const punto = await this.obtenerPorId(id);
        const tieneStock = await this.stockRepository.count({
            where: { puntoMudrasId: id }
        });
        if (tieneStock > 0) {
            throw new common_1.BadRequestException('No se puede eliminar un punto que tiene stock registrado');
        }
        await this.puntosMudrasRepository.remove(punto);
        return true;
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
        const movimientosHoy = await this.movimientosRepository.count({
            where: {
                fechaMovimiento: {
                    $gte: hoy
                }
            }
        });
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
        console.log(`Inicializando stock para punto ${puntoMudrasId}`);
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
};
exports.PuntosMudrasService = PuntosMudrasService;
exports.PuntosMudrasService = PuntosMudrasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(punto_mudras_entity_1.PuntoMudras)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_punto_mudras_entity_1.StockPuntoMudras)),
    __param(2, (0, typeorm_1.InjectRepository)(movimiento_stock_punto_entity_1.MovimientoStockPunto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PuntosMudrasService);
//# sourceMappingURL=puntos-mudras.service.js.map