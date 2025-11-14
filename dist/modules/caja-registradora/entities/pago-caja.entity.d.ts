import { VentaCaja } from './venta-caja.entity';
export declare enum MedioPagoCaja {
    EFECTIVO = "efectivo",
    DEBITO = "debito",
    CREDITO = "credito",
    TRANSFERENCIA = "transferencia",
    QR = "qr",
    CUENTA_CORRIENTE = "cuenta_corriente"
}
export declare class PagoCaja {
    id: number;
    ventaId: number;
    venta: VentaCaja;
    medioPago: MedioPagoCaja;
    monto: number;
    marcaTarjeta?: string;
    ultimos4Digitos?: string;
    cuotas?: number;
    numeroComprobante?: string;
    observaciones?: string;
    creadoEn: Date;
}
