import { Repository } from 'typeorm';
import { Venta, TipoPago } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
export declare class VentasService {
    private ventasRepository;
    private detallesVentaRepository;
    constructor(ventasRepository: Repository<Venta>, detallesVentaRepository: Repository<DetalleVenta>);
    crearVenta(clienteId: number, usuarioAuthId: string, tipoPago: TipoPago, detalles: Array<{
        articuloId: number;
        cantidad: number;
        precioUnitario: number;
        descuentoPorcentaje?: number;
        descuentoMonto?: number;
    }>, descuentoGeneral?: number, observaciones?: string): Promise<Venta>;
    findAll(): Promise<Venta[]>;
    obtenerVenta(id: number): Promise<Venta>;
    obtenerVentasPorCliente(clienteId: number): Promise<Venta[]>;
    obtenerVentasPorUsuarioAuth(usuarioAuthId: string): Promise<Venta[]>;
    obtenerVentasPorFecha(fechaDesde: Date, fechaHasta: Date): Promise<Venta[]>;
    confirmarVenta(id: number): Promise<Venta>;
    cancelarVenta(id: number, motivoCancelacion: string): Promise<Venta>;
    obtenerResumenVentas(fechaDesde: Date, fechaHasta: Date): Promise<any>;
    obtenerTopArticulos(fechaDesde: Date, fechaHasta: Date, limite?: number): Promise<any[]>;
}
