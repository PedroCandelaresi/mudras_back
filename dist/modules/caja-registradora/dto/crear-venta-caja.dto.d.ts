import { TipoVentaCaja } from '../entities/venta-caja.entity';
import { MedioPagoCaja } from '../entities/pago-caja.entity';
export declare class DetalleVentaCajaInput {
    articuloId: number;
    cantidad: number;
    precioUnitario: number;
    descuentoPorcentaje?: number;
    descuentoMonto?: number;
    observaciones?: string;
}
export declare class PagoCajaInput {
    medioPago: MedioPagoCaja;
    monto: number;
    marcaTarjeta?: string;
    ultimos4Digitos?: string;
    cuotas?: number;
    numeroAutorizacion?: string;
    numeroComprobante?: string;
    observaciones?: string;
}
export declare class CrearVentaCajaInput {
    tipoVenta: TipoVentaCaja;
    clienteId?: number;
    puntoMudrasId: number;
    detalles: DetalleVentaCajaInput[];
    pagos: PagoCajaInput[];
    descuentoPorcentaje?: number;
    descuentoMonto?: number;
    observaciones?: string;
    generarFactura: boolean;
    cuitCliente?: string;
    usuarioAuthId?: string;
}
