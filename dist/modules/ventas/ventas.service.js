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
exports.VentasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
let VentasService = class VentasService {
    constructor(ventasRepository, detallesVentaRepository) {
        this.ventasRepository = ventasRepository;
        this.detallesVentaRepository = detallesVentaRepository;
    }
    async crearVenta(clienteId, usuarioAuthId, tipoPago, detalles, descuentoGeneral = 0, observaciones) {
        let subtotal = 0;
        for (const detalle of detalles) {
            const montoDetalle = detalle.cantidad * detalle.precioUnitario;
            const descuentoDetalle = (detalle.descuentoPorcentaje || 0) * montoDetalle / 100 + (detalle.descuentoMonto || 0);
            subtotal += montoDetalle - descuentoDetalle;
        }
        const montoDescuento = descuentoGeneral;
        const total = subtotal - montoDescuento;
        if (total < 0) {
            throw new common_1.BadRequestException('El total de la venta no puede ser negativo');
        }
        const venta = this.ventasRepository.create({
            numero: `V-${Date.now()}`,
            clienteId,
            usuarioAuthId,
            tipoPago,
            subtotal,
            descuentoMonto: montoDescuento,
            total,
            observaciones,
            fecha: new Date(),
        });
        const ventaGuardada = await this.ventasRepository.save(venta);
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
    async findAll() {
        return this.ventasRepository.find({
            relations: ['cliente', 'usuarioAuth', 'detalles', 'detalles.articulo'],
            order: { creadoEn: 'DESC' },
        });
    }
    async obtenerVenta(id) {
        const venta = await this.ventasRepository.findOne({
            where: { id },
            relations: ['cliente', 'usuarioAuth', 'detalles', 'detalles.articulo'],
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return venta;
    }
    async obtenerVentasPorCliente(clienteId) {
        return this.ventasRepository.find({
            where: { clienteId },
            relations: ['detalles', 'detalles.articulo'],
            order: { creadoEn: 'DESC' },
        });
    }
    async obtenerVentasPorUsuarioAuth(usuarioAuthId) {
        return this.ventasRepository.find({
            where: { usuarioAuthId },
            relations: ['cliente', 'detalles', 'detalles.articulo'],
            order: { creadoEn: 'DESC' },
        });
    }
    async obtenerVentasPorFecha(fechaDesde, fechaHasta) {
        return this.ventasRepository
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.cliente', 'cliente')
            .leftJoinAndSelect('venta.usuarioAuth', 'usuarioAuth')
            .leftJoinAndSelect('venta.detalles', 'detalles')
            .leftJoinAndSelect('detalles.articulo', 'articulo')
            .where('venta.fecha >= :fechaDesde AND venta.fecha <= :fechaHasta', {
            fechaDesde,
            fechaHasta,
        })
            .orderBy('venta.fecha', 'DESC')
            .getMany();
    }
    async confirmarVenta(id) {
        const venta = await this.obtenerVenta(id);
        if (venta.estado !== venta_entity_1.EstadoVenta.PENDIENTE) {
            throw new common_1.BadRequestException('Solo se pueden confirmar ventas pendientes');
        }
        venta.estado = venta_entity_1.EstadoVenta.CONFIRMADA;
        return this.ventasRepository.save(venta);
    }
    async cancelarVenta(id, motivoCancelacion) {
        const venta = await this.obtenerVenta(id);
        if (venta.estado === venta_entity_1.EstadoVenta.CANCELADA) {
            throw new common_1.BadRequestException('La venta ya está cancelada');
        }
        venta.estado = venta_entity_1.EstadoVenta.CANCELADA;
        venta.observaciones = `${venta.observaciones || ''}\nCANCELADA: ${motivoCancelacion}`;
        return this.ventasRepository.save(venta);
    }
    async obtenerResumenVentas(fechaDesde, fechaHasta) {
        const ventas = await this.obtenerVentasPorFecha(fechaDesde, fechaHasta);
        const totalVentas = ventas.length;
        const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);
        const ventasConfirmadas = ventas.filter(v => v.estado === venta_entity_1.EstadoVenta.CONFIRMADA);
        const ventasPendientes = ventas.filter(v => v.estado === venta_entity_1.EstadoVenta.PENDIENTE);
        const ventasCanceladas = ventas.filter(v => v.estado === venta_entity_1.EstadoVenta.CANCELADA);
        const ventasPorTipoPago = {
            efectivo: ventas.filter(v => v.tipoPago === venta_entity_1.TipoPago.EFECTIVO).length,
            tarjeta: ventas.filter(v => v.tipoPago === venta_entity_1.TipoPago.TARJETA_CREDITO || v.tipoPago === venta_entity_1.TipoPago.TARJETA_DEBITO).length,
            transferencia: ventas.filter(v => v.tipoPago === venta_entity_1.TipoPago.TRANSFERENCIA).length,
            cuentaCorriente: ventas.filter(v => v.tipoPago === venta_entity_1.TipoPago.CUENTA_CORRIENTE).length,
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
    async obtenerTopArticulos(fechaDesde, fechaHasta, limite = 10) {
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
            .andWhere('venta.estado = :estado', { estado: venta_entity_1.EstadoVenta.CONFIRMADA })
            .groupBy('articulo.id, articulo.nombre')
            .orderBy('cantidadVendida', 'DESC')
            .limit(limite)
            .getRawMany();
        return result;
    }
};
exports.VentasService = VentasService;
exports.VentasService = VentasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_entity_1.DetalleVenta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VentasService);
//# sourceMappingURL=ventas.service.js.map