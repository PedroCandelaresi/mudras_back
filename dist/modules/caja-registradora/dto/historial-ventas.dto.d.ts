import { EstadoVentaCaja, TipoVentaCaja } from '../entities/venta-caja.entity';
import { MedioPagoCaja } from '../entities/pago-caja.entity';
export declare class FiltrosHistorialInput {
    fechaDesde?: string;
    fechaHasta?: string;
    usuarioAuthId?: string;
    puntoMudrasId?: number;
    medioPago?: MedioPagoCaja;
    estado?: EstadoVentaCaja;
    tipoVenta?: TipoVentaCaja;
    limite: number;
    offset: number;
}
export declare class ResumenVenta {
    id: number;
    numeroVenta: string;
    fecha: Date;
    nombreCliente?: string;
    cuitCliente?: string;
    razonSocialCliente?: string;
    nombreUsuario: string;
    nombrePuesto: string;
    total: number;
    estado: EstadoVentaCaja;
    tipoVenta: TipoVentaCaja;
    cantidadItems: number;
    mediosPago: string[];
}
export declare class ResumenHistorialVentas {
    totalVentas: number;
    montoTotal: number;
}
export declare class HistorialVentasResponse {
    ventas: ResumenVenta[];
    total: number;
    totalPaginas: number;
    paginaActual: number;
    resumen?: ResumenHistorialVentas;
}
