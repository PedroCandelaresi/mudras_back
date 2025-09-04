import { VentasService } from './ventas.service';
import { Venta, TipoPago } from './entities/venta.entity';
export declare class VentasResolver {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    crearVenta(clienteId: number, usuarioId: number, tipoPago: TipoPago, detalles: DetalleVentaInput[], descuentoGeneral: number, observaciones?: string): Promise<Venta>;
    findAll(): Promise<Venta[]>;
    obtenerVenta(id: number): Promise<Venta>;
    obtenerVentasPorCliente(clienteId: number): Promise<Venta[]>;
    obtenerVentasPorUsuario(usuarioId: number): Promise<Venta[]>;
    obtenerVentasPorFecha(fechaDesde: Date, fechaHasta: Date): Promise<Venta[]>;
    confirmarVenta(id: number): Promise<Venta>;
    cancelarVenta(id: number, motivoCancelacion: string): Promise<Venta>;
    obtenerResumenVentas(fechaDesde: Date, fechaHasta: Date): Promise<any>;
    obtenerTopArticulos(fechaDesde: Date, fechaHasta: Date, limite: number): Promise<any[]>;
}
export declare class DetalleVentaInput {
    articuloId: number;
    cantidad: number;
    precioUnitario: number;
    descuentoPorcentaje?: number;
    descuentoMonto?: number;
}
export declare class VentasPorTipoPago {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
    cuentaCorriente: number;
}
export declare class ResumenVentas {
    totalVentas: number;
    montoTotal: number;
    ventasConfirmadas: number;
    ventasPendientes: number;
    ventasCanceladas: number;
    ventasPorTipoPago: VentasPorTipoPago;
    promedioVenta: number;
}
export declare class TopArticulo {
    articuloId: number;
    articuloNombre: string;
    cantidadVendida: number;
    montoTotal: number;
    numeroVentas: number;
}
