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
const punto_mudras_entity_1 = require("../../puntos-mudras/entities/punto-mudras.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const stock_punto_mudras_entity_1 = require("../../puntos-mudras/entities/stock-punto-mudras.entity");
const movimiento_stock_punto_entity_1 = require("../../puntos-mudras/entities/movimiento-stock-punto.entity");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
let CajaRegistradoraService = class CajaRegistradoraService {
    constructor(ventaCajaRepository, detalleVentaCajaRepository, pagoCajaRepository, movimientoInventarioRepository, articuloRepository, stockPuntoRepository, puntoMudrasRepository, dataSource) {
        this.ventaCajaRepository = ventaCajaRepository;
        this.detalleVentaCajaRepository = detalleVentaCajaRepository;
        this.pagoCajaRepository = pagoCajaRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.articuloRepository = articuloRepository;
        this.stockPuntoRepository = stockPuntoRepository;
        this.puntoMudrasRepository = puntoMudrasRepository;
        this.dataSource = dataSource;
    }
    async buscarArticulos(input) {
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
            query.andWhere('(LOWER(articulo.Descripcion) LIKE :nombre OR LOWER(articulo.Codigo) LIKE :nombre OR LOWER(articulo.Rubro) LIKE :nombre)', { nombre: `%${nombre}%` });
        }
        query.limit(input.limite);
        const articulos = await query.getMany();
        const articulosConStock = [];
        for (const articulo of articulos) {
            const stockDisponible = await this.calcularStockDisponible(articulo.id, undefined, input.puntoMudrasId);
            if (input.puntoMudrasId && stockDisponible <= 0) {
                continue;
            }
            const precioFinal = this.calcularPrecioFinalArticulo(articulo);
            articulo.PrecioVenta = precioFinal;
            articulosConStock.push({
                ...articulo,
                stockDisponible,
                stockDespuesVenta: stockDisponible,
                alertaStock: stockDisponible <= 0,
            });
        }
        return articulosConStock;
    }
    async crearVenta(input, usuarioAuthId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!input.puntoMudrasId) {
                throw new common_1.BadRequestException('Debe seleccionar un punto de Mudras de tipo venta');
            }
            const punto = await queryRunner.manager.findOne(punto_mudras_entity_1.PuntoMudras, {
                where: { id: input.puntoMudrasId, activo: true, tipo: punto_mudras_entity_1.TipoPuntoMudras.venta },
            });
            if (!punto) {
                throw new common_1.NotFoundException('Punto de Mudras no encontrado, inactivo o no es de tipo venta');
            }
            if (!input.detalles || input.detalles.length === 0) {
                throw new common_1.BadRequestException('La venta debe incluir al menos un artículo');
            }
            const puntoMudrasId = input.puntoMudrasId;
            if (punto.manejaStockFisico) {
                for (const detalle of input.detalles) {
                    const cantidad = Number(detalle.cantidad);
                    if (cantidad <= 0) {
                        throw new common_1.BadRequestException('La cantidad de cada artículo debe ser mayor a 0');
                    }
                    await this.verificarStockDisponible(queryRunner, detalle.articuloId, cantidad, puntoMudrasId);
                }
            }
            const hayNoEfectivo = (input.pagos || []).some((p) => String(p.medioPago).toLowerCase() !== 'efectivo');
            if (hayNoEfectivo && !(input.cuitCliente && String(input.cuitCliente).trim().length >= 7)) {
                throw new common_1.BadRequestException('DNI/CUIT del cliente requerido para pagos no en efectivo');
            }
            const numeroVenta = await this.generarNumeroVenta(queryRunner);
            const clienteVentaId = await this.obtenerClienteParaVenta(queryRunner, input.clienteId);
            let subtotal = 0;
            for (const detalle of input.detalles) {
                const cantidad = Number(detalle.cantidad);
                const precioUnitario = Number(detalle.precioUnitario);
                if (cantidad <= 0 || precioUnitario < 0) {
                    throw new common_1.BadRequestException('Cantidad y precio unitario deben ser mayores o iguales a cero');
                }
                const subtotalDetalle = cantidad * precioUnitario;
                const descuentoPorcentaje = Number(detalle.descuentoPorcentaje || 0);
                const descuentoMonto = Number(detalle.descuentoMonto || 0);
                const descuentoCalculado = descuentoMonto || (subtotalDetalle * descuentoPorcentaje / 100);
                subtotal += subtotalDetalle - descuentoCalculado;
            }
            const descuentoTotal = Number(input.descuentoMonto || (subtotal * (Number(input.descuentoPorcentaje || 0) / 100)));
            const total = subtotal - descuentoTotal;
            const totalPagos = input.pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
            if (Math.abs(totalPagos - total) > 0.01) {
                throw new common_1.BadRequestException('El total de pagos no coincide con el total de la venta');
            }
            const venta = queryRunner.manager.create(venta_caja_entity_1.VentaCaja, {
                numeroVenta,
                fecha: new Date(),
                tipoVenta: input.tipoVenta ?? venta_caja_entity_1.TipoVentaCaja.MOSTRADOR,
                estado: venta_caja_entity_1.EstadoVentaCaja.CONFIRMADA,
                puntoMudrasId: puntoMudrasId,
                clienteId: clienteVentaId ?? null,
                usuarioAuthId,
                subtotal,
                descuentoPorcentaje: Number(input.descuentoPorcentaje || 0),
                descuentoMonto: descuentoTotal,
                impuestos: 0,
                total,
                cambio: totalPagos - total,
                observaciones: input.observaciones,
                cuitCliente: input.cuitCliente,
                nombreCliente: input.nombreCliente,
                razonSocialCliente: input.razonSocialCliente,
                tipoClienteSnapshot: 'CONSUMIDOR_FINAL'
            });
            const ventaGuardada = await queryRunner.manager.save(venta_caja_entity_1.VentaCaja, venta);
            for (const detalleInput of input.detalles) {
                const cantidad = Number(detalleInput.cantidad);
                const precioUnitario = Number(detalleInput.precioUnitario);
                const subtotalDetalle = cantidad * precioUnitario;
                const descuentoPorcentaje = Number(detalleInput.descuentoPorcentaje || 0);
                const descuentoMonto = Number(detalleInput.descuentoMonto || 0);
                const descuentoCalculado = descuentoMonto || (subtotalDetalle * descuentoPorcentaje / 100);
                const detalle = queryRunner.manager.create(detalle_venta_caja_entity_1.DetalleVentaCaja, {
                    ventaId: ventaGuardada.id,
                    articuloId: detalleInput.articuloId,
                    cantidad,
                    precioUnitario,
                    descuentoPorcentaje,
                    descuentoMonto: descuentoCalculado,
                    subtotal: subtotalDetalle - descuentoCalculado,
                    observaciones: detalleInput.observaciones,
                });
                await queryRunner.manager.save(detalle_venta_caja_entity_1.DetalleVentaCaja, detalle);
                if (punto.manejaStockFisico) {
                    await this.crearMovimientoInventario(queryRunner, detalleInput.articuloId, puntoMudrasId ?? null, -cantidad, movimiento_inventario_entity_1.TipoMovimientoInventario.VENTA, usuarioAuthId, ventaGuardada.id, precioUnitario, numeroVenta);
                    const { stockAnterior, stockNuevo } = await this.ajustarStockArticulo(queryRunner, detalleInput.articuloId, -cantidad);
                    await this.registrarMovimientoStockLegacy(queryRunner, detalleInput.articuloId, stockAnterior, stockNuevo, usuarioAuthId);
                    if (puntoMudrasId) {
                        await this.ajustarStockPunto(queryRunner, puntoMudrasId, detalleInput.articuloId, -cantidad, usuarioAuthId, numeroVenta, movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.VENTA, `Venta caja ${numeroVenta}`);
                    }
                }
            }
            for (const pagoInput of input.pagos) {
                const pago = queryRunner.manager.create(pago_caja_entity_1.PagoCaja, {
                    ventaId: ventaGuardada.id,
                    medioPago: pagoInput.medioPago,
                    monto: Number(pagoInput.monto),
                    marcaTarjeta: pagoInput.marcaTarjeta,
                    ultimos4Digitos: pagoInput.ultimos4Digitos,
                    cuotas: pagoInput.cuotas ? Number(pagoInput.cuotas) : undefined,
                    numeroComprobante: pagoInput.numeroComprobante || pagoInput.numeroAutorizacion,
                    observaciones: pagoInput.observaciones,
                });
                await queryRunner.manager.save(pago_caja_entity_1.PagoCaja, pago);
            }
            if (input.generarFactura) {
            }
            await queryRunner.commitTransaction();
            return await this.ventaCajaRepository.findOne({
                where: { id: ventaGuardada.id },
                relations: ['puntoMudras', 'usuarioAuth', 'detalles', 'detalles.articulo', 'pagos']
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
        const querySuma = query.clone();
        const { montoTotal } = await querySuma
            .select('SUM(venta.total)', 'montoTotal')
            .getRawOne();
        const ventasResult = await query
            .skip(filtros.offset)
            .take(filtros.limite)
            .getMany();
        const resumenVentas = ventasResult.map(venta => ({
            id: venta.id,
            numeroVenta: venta.numeroVenta,
            fecha: venta.fecha,
            nombreCliente: venta.razonSocialCliente || venta.nombreCliente || venta.cliente?.nombre || 'Consumidor Final',
            cuitCliente: venta.cuitCliente || venta.cliente?.cuit,
            razonSocialCliente: venta.razonSocialCliente,
            nombreUsuario: venta?.usuarioAuth?.displayName || 'Usuario',
            nombrePuesto: venta.puntoMudras?.nombre || 'Punto',
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
            resumen: {
                totalVentas: total,
                montoTotal: Number(montoTotal || 0)
            }
        };
    }
    async calcularStockDisponible(articuloId, _puestoVentaId, puntoMudrasId) {
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
    async crearMovimientoInventario(queryRunner, articuloId, puntoMudrasId, cantidad, tipoMovimiento, usuarioAuthId, ventaCajaId, precioVenta, numeroComprobante) {
        const movimiento = queryRunner.manager.create(movimiento_inventario_entity_1.MovimientoInventario, {
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
        await queryRunner.manager.save(movimiento_inventario_entity_1.MovimientoInventario, movimiento);
    }
    async obtenerClienteParaVenta(queryRunner, clienteId) {
        if (!clienteId)
            return null;
        const clienteExistente = await queryRunner.manager.findOne(cliente_entity_1.Cliente, { where: { id: clienteId } });
        if (!clienteExistente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return clienteExistente.id;
    }
    async verificarStockDisponible(queryRunner, articuloId, cantidad, puntoMudrasId) {
        if (puntoMudrasId) {
            const stockPunto = await this.obtenerStockPunto(queryRunner, puntoMudrasId, articuloId, 'pessimistic_read');
            if (stockPunto < cantidad) {
                throw new common_1.BadRequestException(`Stock insuficiente en el punto seleccionado para el artículo ${articuloId} (disponible: ${stockPunto}, requiere: ${cantidad})`);
            }
            return;
        }
        const stockGlobal = await this.obtenerStockGlobal(queryRunner, articuloId, 'pessimistic_read');
        if (stockGlobal < cantidad) {
            throw new common_1.BadRequestException(`Stock global insuficiente para el artículo ${articuloId} (disponible: ${stockGlobal}, requiere: ${cantidad})`);
        }
    }
    async obtenerStockGlobal(queryRunner, articuloId, lock = 'pessimistic_read') {
        const articulo = await queryRunner.manager.findOne(articulo_entity_1.Articulo, {
            where: { id: articuloId },
            lock: { mode: lock },
        });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID ${articuloId} no encontrado`);
        }
        return 0;
    }
    async obtenerStockTotalPuntos(queryRunner, articuloId) {
        const qb = queryRunner.manager
            .createQueryBuilder(stock_punto_mudras_entity_1.StockPuntoMudras, 'stock')
            .select('COALESCE(SUM(stock.cantidad), 0)', 'total')
            .where('stock.articuloId = :articuloId', { articuloId });
        try {
            qb.setLock('pessimistic_read');
        }
        catch { }
        const resultado = await qb.getRawOne();
        return Number(resultado?.total || 0);
    }
    async obtenerStockPunto(queryRunner, puntoMudrasId, articuloId, lock = 'pessimistic_read') {
        const registro = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
            where: { puntoMudrasId, articuloId },
            lock: { mode: lock },
        });
        return Number(registro?.cantidad || 0);
    }
    async ajustarStockArticulo(queryRunner, articuloId, delta) {
        let stockAnterior = await this.obtenerStockGlobal(queryRunner, articuloId, 'pessimistic_write');
        let stockNuevo = stockAnterior + delta;
        if (stockNuevo < 0) {
            const stockPuntos = await this.obtenerStockTotalPuntos(queryRunner, articuloId);
            if (stockPuntos + delta < 0) {
                throw new common_1.BadRequestException(`Stock global insuficiente para el artículo ${articuloId} (disponible: ${stockPuntos}, requiere: ${Math.abs(delta)})`);
            }
            stockAnterior = Math.max(stockAnterior, stockPuntos);
            stockNuevo = stockAnterior + delta;
        }
        return { stockAnterior, stockNuevo };
    }
    async ajustarStockPunto(queryRunner, puntoMudrasId, articuloId, delta, usuarioId, referencia, tipoMovimiento, motivo) {
        const registro = await queryRunner.manager.findOne(stock_punto_mudras_entity_1.StockPuntoMudras, {
            where: { puntoMudrasId, articuloId },
            lock: { mode: 'pessimistic_write' },
        });
        const cantidadAnterior = Number(registro?.cantidad || 0);
        const cantidadNueva = cantidadAnterior + delta;
        if (cantidadNueva < 0) {
            throw new common_1.BadRequestException(`El punto seleccionado no posee stock suficiente para el artículo ${articuloId} (resultado: ${cantidadNueva})`);
        }
        if (registro) {
            registro.cantidad = cantidadNueva;
            await queryRunner.manager.save(stock_punto_mudras_entity_1.StockPuntoMudras, registro);
        }
        else {
            const nuevoRegistro = queryRunner.manager.create(stock_punto_mudras_entity_1.StockPuntoMudras, {
                puntoMudrasId,
                articuloId,
                cantidad: cantidadNueva,
                stockMinimo: 0,
            });
            await queryRunner.manager.save(stock_punto_mudras_entity_1.StockPuntoMudras, nuevoRegistro);
        }
        const usuarioIdNum = typeof usuarioId === 'string' ? Number(usuarioId) : usuarioId;
        const movimiento = queryRunner.manager.create(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
            puntoMudrasOrigenId: delta < 0 ? puntoMudrasId : undefined,
            puntoMudrasDestinoId: delta > 0 ? puntoMudrasId : undefined,
            articuloId,
            tipoMovimiento,
            cantidad: Math.abs(delta),
            cantidadAnterior,
            cantidadNueva,
            usuarioId: Number.isFinite(usuarioIdNum) ? usuarioIdNum : undefined,
            referenciaExterna: referencia,
            motivo: motivo ?? (tipoMovimiento === movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.VENTA
                ? `Venta caja ${referencia}`
                : tipoMovimiento === movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.DEVOLUCION
                    ? `Devolución caja ${referencia}`
                    : `Movimiento ${tipoMovimiento}`),
        });
        await queryRunner.manager.save(movimiento_stock_punto_entity_1.MovimientoStockPunto, movimiento);
    }
    async registrarMovimientoStockLegacy(queryRunner, articuloId, stockAnterior, stockNuevo, usuarioAuthId) {
        try {
            const art = await queryRunner.manager.findOne(articulo_entity_1.Articulo, { where: { id: articuloId } });
            const rawCodigo = art?.Codigo ?? String(articuloId);
            const codigo = String(rawCodigo).substring(0, 20);
            let usuarioId = null;
            if (usuarioAuthId) {
                try {
                    const rows = await queryRunner.manager.query('SELECT usuario_id AS usuarioId FROM usuarios_auth_map WHERE auth_user_id = ? LIMIT 1', [usuarioAuthId]);
                    const uid = rows?.[0]?.usuarioId;
                    if (typeof uid === 'number' && Number.isFinite(uid))
                        usuarioId = uid;
                    else if (uid != null) {
                        const n = Number(uid);
                        usuarioId = Number.isFinite(n) ? n : null;
                    }
                }
                catch { }
            }
            const hoy = new Date();
            const fechaSql = hoy.toISOString().slice(0, 10);
            await queryRunner.manager.query('INSERT INTO tbStock (Fecha, Codigo, Stock, StockAnterior, Usuario) VALUES (DATE(?), ?, ?, ?, ?)', [fechaSql, codigo, stockNuevo, stockAnterior, usuarioId]);
        }
        catch {
        }
    }
    async obtenerDetalleVenta(id) {
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
    async cancelarVenta(id, usuarioAuthId, motivo) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const venta = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
                where: { id },
                relations: ['detalles', 'puntoMudras']
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
            if (venta.puntoMudras) {
                let puntoMudrasId = venta.puntoMudras?.id ?? null;
                if (!puntoMudrasId) {
                    const movimientoVenta = await queryRunner.manager.findOne(movimiento_stock_punto_entity_1.MovimientoStockPunto, {
                        where: {
                            referenciaExterna: venta.numeroVenta,
                            tipoMovimiento: movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.VENTA,
                        },
                    });
                    puntoMudrasId =
                        movimientoVenta?.puntoMudrasOrigenId ??
                            movimientoVenta?.puntoMudrasDestinoId ??
                            null;
                }
                for (const detalle of venta.detalles || []) {
                    const cantidad = Number(detalle.cantidad);
                    await this.crearMovimientoInventario(queryRunner, detalle.articuloId, venta.puntoMudrasId ?? null, cantidad, movimiento_inventario_entity_1.TipoMovimientoInventario.DEVOLUCION, usuarioAuthId || venta.usuarioAuthId, venta.id, detalle.precioUnitario, `CANCELACION-${venta.numeroVenta}`);
                    const { stockAnterior, stockNuevo } = await this.ajustarStockArticulo(queryRunner, detalle.articuloId, cantidad);
                    await this.registrarMovimientoStockLegacy(queryRunner, detalle.articuloId, stockAnterior, stockNuevo, usuarioAuthId || venta.usuarioAuthId);
                    if (puntoMudrasId) {
                        await this.ajustarStockPunto(queryRunner, puntoMudrasId, detalle.articuloId, cantidad, usuarioAuthId || venta.usuarioAuthId, `CANCELACION-${venta.numeroVenta}`, movimiento_stock_punto_entity_1.TipoMovimientoStockPunto.DEVOLUCION, `Cancelación ${venta.numeroVenta}`);
                    }
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
    async procesarDevolucion(ventaOriginalId, articulosDevolver, usuarioAuthId, motivo) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const ventaOriginal = await queryRunner.manager.findOne(venta_caja_entity_1.VentaCaja, {
                where: { id: ventaOriginalId },
                relations: ['detalles', 'puntoMudras']
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
                puntoMudrasId: ventaOriginal.puntoMudrasId,
                clienteId: ventaOriginal.clienteId,
                usuarioAuthId: usuarioAuthId || ventaOriginal.usuarioAuthId,
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
                if (ventaOriginal.puntoMudras) {
                    await this.crearMovimientoInventario(queryRunner, detalleData.articuloId, ventaOriginal.puntoMudrasId ?? null, Math.abs(detalleData.cantidad), movimiento_inventario_entity_1.TipoMovimientoInventario.DEVOLUCION, usuarioAuthId || ventaOriginal.usuarioAuthId, ventaDevolucionGuardada.id, detalleData.precioUnitario, numeroDevolucion);
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
        const ultimaVenta = await queryRunner.manager
            .createQueryBuilder(venta_caja_entity_1.VentaCaja, 'v')
            .orderBy('v.id', 'DESC')
            .getOne();
        const ultimoNumero = ultimaVenta ? parseInt(ultimaVenta.numeroVenta.split('-')[1]) : 0;
        const nuevoNumero = ultimoNumero + 1;
        return `V-${nuevoNumero.toString().padStart(8, '0')}`;
    }
    async generarNumeroDevolucion(queryRunner) {
        const ultimaDevolucion = await queryRunner.manager
            .createQueryBuilder(venta_caja_entity_1.VentaCaja, 'v')
            .where('v.numeroVenta LIKE :pref', { pref: 'D-%' })
            .orderBy('v.id', 'DESC')
            .getOne();
        const ultimoNumero = ultimaDevolucion ? parseInt(ultimaDevolucion.numeroVenta.split('-')[1]) : 0;
        const nuevoNumero = ultimoNumero + 1;
        return `D-${nuevoNumero.toString().padStart(8, '0')}`;
    }
    obtenerCostoReferencia(articulo) {
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
    aplicarIncremento(base, porcentaje) {
        const valor = Number(porcentaje ?? 0);
        if (!valor)
            return base;
        const limitado = valor <= -100 ? -99.99 : valor;
        return base * (1 + limitado / 100);
    }
    aplicarDescuento(base, porcentaje) {
        const valor = Number(porcentaje ?? 0);
        if (!valor)
            return base;
        const limitado = Math.min(95, Math.max(0, valor));
        return base * (1 - limitado / 100);
    }
    calcularPrecioFinalArticulo(articulo) {
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
};
exports.CajaRegistradoraService = CajaRegistradoraService;
exports.CajaRegistradoraService = CajaRegistradoraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_caja_entity_1.VentaCaja)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_caja_entity_1.DetalleVentaCaja)),
    __param(2, (0, typeorm_1.InjectRepository)(pago_caja_entity_1.PagoCaja)),
    __param(3, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(4, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __param(5, (0, typeorm_1.InjectRepository)(stock_punto_mudras_entity_1.StockPuntoMudras)),
    __param(6, (0, typeorm_1.InjectRepository)(punto_mudras_entity_1.PuntoMudras)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CajaRegistradoraService);
//# sourceMappingURL=caja-registradora.service.js.map