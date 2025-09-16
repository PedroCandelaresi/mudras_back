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
exports.CajaRegistradoraService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_caja_entity_1 = require("../entities/venta-caja.entity");
const detalle_venta_caja_entity_1 = require("../entities/detalle-venta-caja.entity");
const pago_caja_entity_1 = require("../entities/pago-caja.entity");
const movimiento_inventario_entity_1 = require("../entities/movimiento-inventario.entity");
const puesto_venta_entity_1 = require("../entities/puesto-venta.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
let CajaRegistradoraService = class CajaRegistradoraService {
    constructor(ventaCajaRepository, detalleVentaCajaRepository, pagoCajaRepository, movimientoInventarioRepository, puestoVentaRepository, articuloRepository, dataSource) {
        this.ventaCajaRepository = ventaCajaRepository;
        this.detalleVentaCajaRepository = detalleVentaCajaRepository;
        this.pagoCajaRepository = pagoCajaRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.puestoVentaRepository = puestoVentaRepository;
        this.articuloRepository = articuloRepository;
        this.dataSource = dataSource;
    }
    async buscarArticulos(input) {
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
        const articulosConStock = [];
        for (const articulo of articulos) {
            const stockDisponible = await this.calcularStockDisponible(articulo.id, input.puestoVentaId);
            articulosConStock.push({
                ...articulo,
                stockDisponible: articulo.Deposito || 0,
                stockDespuesVenta: stockDisponible,
                alertaStock: stockDisponible <= 0,
            });
        }
        return articulosConStock;
    }
    async crearVenta(input, usuarioId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const puesto = await queryRunner.manager.findOne(puesto_venta_entity_1.PuestoVenta, {
                where: { id: input.puestoVentaId, activo: true }
            });
            if (!puesto) {
                throw new common_1.NotFoundException('Puesto de venta no encontrado o inactivo');
            }
            const numeroVenta = await this.generarNumeroVenta(queryRunner);
            let subtotal = 0;
            for (const detalle of input.detalles) {
                const subtotalDetalle = detalle.cantidad * detalle.precioUnitario;
                const descuento = detalle.descuentoMonto || (subtotalDetalle * (detalle.descuentoPorcentaje || 0) / 100);
                subtotal += subtotalDetalle - descuento;
            }
            const descuentoTotal = input.descuentoMonto || (subtotal * (input.descuentoPorcentaje || 0) / 100);
            const total = subtotal - descuentoTotal;
            const totalPagos = input.pagos.reduce((sum, pago) => sum + pago.monto, 0);
            if (Math.abs(totalPagos - total) > 0.01) {
                throw new common_1.BadRequestException('El total de pagos no coincide con el total de la venta');
            }
            const venta = queryRunner.manager.create(venta_caja_entity_1.VentaCaja, {
                numeroVenta,
                fecha: new Date(),
                tipoVenta: input.tipoVenta,
                estado: venta_caja_entity_1.EstadoVentaCaja.CONFIRMADA,
                puestoVentaId: input.puestoVentaId,
                clienteId: input.clienteId,
                usuarioId,
                subtotal,
                descuentoPorcentaje: input.descuentoPorcentaje || 0,
                descuentoMonto: descuentoTotal,
                impuestos: 0,
                total,
                cambio: totalPagos - total,
                observaciones: input.observaciones,
            });
            const ventaGuardada = await queryRunner.manager.save(venta_caja_entity_1.VentaCaja, venta);
            for (const detalleInput of input.detalles) {
                const subtotalDetalle = detalleInput.cantidad * detalleInput.precioUnitario;
                const descuento = detalleInput.descuentoMonto || (subtotalDetalle * (detalleInput.descuentoPorcentaje || 0) / 100);
                const detalle = queryRunner.manager.create(detalle_venta_caja_entity_1.DetalleVentaCaja, {
                    ventaId: ventaGuardada.id,
                    articuloId: detalleInput.articuloId,
                    cantidad: detalleInput.cantidad,
                    precioUnitario: detalleInput.precioUnitario,
                    descuentoPorcentaje: detalleInput.descuentoPorcentaje || 0,
                    descuentoMonto: descuento,
                    subtotal: subtotalDetalle - descuento,
                    observaciones: detalleInput.observaciones,
                });
                await queryRunner.manager.save(detalle_venta_caja_entity_1.DetalleVentaCaja, detalle);
                if (puesto.descontarStock) {
                    await this.crearMovimientoInventario(queryRunner, detalleInput.articuloId, input.puestoVentaId, -detalleInput.cantidad, movimiento_inventario_entity_1.TipoMovimientoInventario.VENTA, usuarioId, ventaGuardada.id, detalleInput.precioUnitario, numeroVenta);
                }
            }
            for (const pagoInput of input.pagos) {
                const pago = queryRunner.manager.create(pago_caja_entity_1.PagoCaja, {
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
                await queryRunner.manager.save(pago_caja_entity_1.PagoCaja, pago);
            }
            if (input.generarFactura) {
            }
            await queryRunner.commitTransaction();
            return await this.ventaCajaRepository.findOne({
                where: { id: ventaGuardada.id },
                relations: ['puestoVenta', 'cliente', 'usuario', 'detalles', 'detalles.articulo', 'pagos']
            });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async obtenerHistorialVentas(filtros) {
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
        const resumenVentas = ventas.map(venta => ({
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
    async calcularStockDisponible(articuloId, puestoVentaId) {
        const articulo = await this.articuloRepository.findOne({
            where: { id: articuloId }
        });
        if (!articulo) {
            return 0;
        }
        const query = this.movimientoInventarioRepository.createQueryBuilder('mov')
            .where('mov.articuloId = :articuloId', { articuloId });
        if (puestoVentaId) {
            query.andWhere('(mov.puestoVentaId = :puestoVentaId OR mov.puestoVentaId IS NULL)', { puestoVentaId });
        }
        const movimientos = await query.getMany();
        const totalMovimientos = movimientos.reduce((sum, mov) => sum + mov.cantidad, 0);
        return (articulo.Deposito || 0) + totalMovimientos;
    }
    async crearMovimientoInventario(queryRunner, articuloId, puestoVentaId, cantidad, tipoMovimiento, usuarioId, ventaCajaId, precioVenta, numeroComprobante) {
        const stockAnterior = await this.calcularStockDisponible(articuloId, puestoVentaId);
        const stockNuevo = stockAnterior + cantidad;
        const movimiento = queryRunner.manager.create(movimiento_inventario_entity_1.MovimientoInventario, {
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
        await queryRunner.manager.save(movimiento_inventario_entity_1.MovimientoInventario, movimiento);
    }
    async obtenerPuestosVenta() {
        return await this.puestoVentaRepository.find({
            where: { activo: true },
            order: { nombre: 'ASC' }
        });
    }
    async obtenerDetalleVenta(id) {
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
    async cancelarVenta(id, usuarioId, motivo) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const venta = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
                where: { id },
                relations: ['detalles', 'puestoVenta']
            });
            if (!venta) {
                throw new common_1.NotFoundException('Venta no encontrada');
            }
            if (venta.estado === venta_caja_entity_1.EstadoVentaCaja.CANCELADA) {
                throw new common_1.BadRequestException('La venta ya está cancelada');
            }
            venta.estado = venta_caja_entity_1.EstadoVentaCaja.CANCELADA;
            venta.observaciones = `${venta.observaciones || ''}\nCANCELADA: ${motivo || 'Sin motivo especificado'}`;
            await queryRunner.manager.save(venta_caja_entity_1.VentaCaja, venta);
            if (venta.puestoVenta?.descontarStock) {
                for (const detalle of venta.detalles || []) {
                    await this.crearMovimientoInventario(queryRunner, detalle.articuloId, venta.puestoVentaId, detalle.cantidad, movimiento_inventario_entity_1.TipoMovimientoInventario.DEVOLUCION, usuarioId || venta.usuarioId, venta.id, detalle.precioUnitario, `CANCELACION-${venta.numeroVenta}`);
                }
            }
            await queryRunner.commitTransaction();
            return await this.obtenerDetalleVenta(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async procesarDevolucion(ventaOriginalId, articulosDevolver, usuarioId, motivo) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const ventaOriginal = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
                where: { id: ventaOriginalId },
                relations: ['detalles', 'puestoVenta', 'cliente']
            });
            if (!ventaOriginal) {
                throw new common_1.NotFoundException('Venta original no encontrada');
            }
            if (ventaOriginal.estado === venta_caja_entity_1.EstadoVentaCaja.CANCELADA) {
                throw new common_1.BadRequestException('No se puede devolver una venta cancelada');
            }
            for (const itemDevolver of articulosDevolver) {
                const detalleOriginal = ventaOriginal.detalles?.find(d => d.articuloId === itemDevolver.articuloId);
                if (!detalleOriginal) {
                    throw new common_1.BadRequestException(`Artículo ${itemDevolver.articuloId} no encontrado en la venta original`);
                }
                if (itemDevolver.cantidad > detalleOriginal.cantidad) {
                    throw new common_1.BadRequestException(`No se puede devolver más cantidad de la vendida para el artículo ${itemDevolver.articuloId}`);
                }
            }
            const numeroDevolucion = await this.generarNumeroDevolucion(queryRunner);
            let subtotalDevolucion = 0;
            const detallesDevolucion = [];
            for (const itemDevolver of articulosDevolver) {
                const detalleOriginal = ventaOriginal.detalles?.find(d => d.articuloId === itemDevolver.articuloId);
                if (detalleOriginal) {
                    const proporcion = itemDevolver.cantidad / detalleOriginal.cantidad;
                    const subtotalItem = detalleOriginal.subtotal * proporcion;
                    subtotalDevolucion += subtotalItem;
                    detallesDevolucion.push({
                        articuloId: itemDevolver.articuloId,
                        cantidad: -itemDevolver.cantidad,
                        precioUnitario: detalleOriginal.precioUnitario,
                        descuentoPorcentaje: detalleOriginal.descuentoPorcentaje,
                        descuentoMonto: detalleOriginal.descuentoMonto * proporcion,
                        subtotal: -subtotalItem,
                        observaciones: `Devolución de ${itemDevolver.cantidad} unidades`
                    });
                }
            }
            const ventaDevolucion = queryRunner.manager.create(venta_caja_entity_1.VentaCaja, {
                numeroVenta: numeroDevolucion,
                fecha: new Date(),
                tipoVenta: ventaOriginal.tipoVenta,
                estado: venta_caja_entity_1.EstadoVentaCaja.CONFIRMADA,
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
            const ventaDevolucionGuardada = await queryRunner.manager.save(venta_caja_entity_1.VentaCaja, ventaDevolucion);
            for (const detalleData of detallesDevolucion) {
                const detalle = queryRunner.manager.create(detalle_venta_caja_entity_1.DetalleVentaCaja, {
                    ventaId: ventaDevolucionGuardada.id,
                    ...detalleData
                });
                await queryRunner.manager.save(detalle_venta_caja_entity_1.DetalleVentaCaja, detalle);
                if (ventaOriginal.puestoVenta?.descontarStock) {
                    await this.crearMovimientoInventario(queryRunner, detalleData.articuloId, ventaOriginal.puestoVentaId, Math.abs(detalleData.cantidad), movimiento_inventario_entity_1.TipoMovimientoInventario.DEVOLUCION, usuarioId || ventaOriginal.usuarioId, ventaDevolucionGuardada.id, detalleData.precioUnitario, numeroDevolucion);
                }
            }
            const totalDevuelto = Math.abs(subtotalDevolucion);
            const totalOriginal = ventaOriginal.total;
            if (totalDevuelto >= totalOriginal * 0.99) {
                ventaOriginal.estado = venta_caja_entity_1.EstadoVentaCaja.DEVUELTA;
            }
            else {
                ventaOriginal.estado = venta_caja_entity_1.EstadoVentaCaja.DEVUELTA_PARCIAL;
            }
            await queryRunner.manager.save(venta_caja_entity_1.VentaCaja, ventaOriginal);
            await queryRunner.commitTransaction();
            return await this.obtenerDetalleVenta(ventaDevolucionGuardada.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async generarNumeroVenta(queryRunner) {
        const ultimaVenta = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
            order: { id: 'DESC' }
        });
        const ultimoNumero = ultimaVenta ? parseInt(ultimaVenta.numeroVenta.split('-')[1]) : 0;
        const nuevoNumero = ultimoNumero + 1;
        return `V-${nuevoNumero.toString().padStart(8, '0')}`;
    }
    async generarNumeroDevolucion(queryRunner) {
        const ultimaDevolucion = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
            where: { numeroVenta: { $like: 'D-%' } },
            order: { id: 'DESC' }
        });
        const ultimoNumero = ultimaDevolucion ? parseInt(ultimaDevolucion.numeroVenta.split('-')[1]) : 0;
        const nuevoNumero = ultimoNumero + 1;
        return `D-${nuevoNumero.toString().padStart(8, '0')}`;
    }
};
exports.CajaRegistradoraService = CajaRegistradoraService;
exports.CajaRegistradoraService = CajaRegistradoraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_caja_entity_1.VentaCaja)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_caja_entity_1.DetalleVentaCaja)),
    __param(2, (0, typeorm_1.InjectRepository)(pago_caja_entity_1.PagoCaja)),
    __param(3, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(4, (0, typeorm_1.InjectRepository)(puesto_venta_entity_1.PuestoVenta)),
    __param(5, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CajaRegistradoraService);
//# sourceMappingURL=caja-registradora.service.js.map