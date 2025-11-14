import { Cliente } from '../../clientes/entities/cliente.entity';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { PuntoMudras } from '../../puntos-mudras/entities/punto-mudras.entity';
import { DetalleVentaCaja } from './detalle-venta-caja.entity';
import { PagoCaja } from './pago-caja.entity';
import { ComprobanteAfip } from './comprobante-afip.entity';
export declare enum TipoVentaCaja {
    MOSTRADOR = "mostrador",
    ONLINE = "online",
    MAYORISTA = "mayorista",
    TELEFONICA = "telefonica",
    DELIVERY = "delivery"
}
export declare enum EstadoVentaCaja {
    BORRADOR = "borrador",
    CONFIRMADA = "confirmada",
    CANCELADA = "cancelada",
    DEVUELTA = "devuelta",
    DEVUELTA_PARCIAL = "devuelta_parcial"
}
export declare class VentaCaja {
    id: number;
    numeroVenta: string;
    fecha: Date;
    tipoVenta: TipoVentaCaja;
    estado: EstadoVentaCaja;
    puntoMudrasId: number;
    puntoMudras: PuntoMudras;
    clienteId?: number | null;
    cliente?: Cliente | null;
    usuarioAuthId: string;
    usuarioAuth: UserAuth;
    subtotal: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    impuestos: number;
    total: number;
    cambio: number;
    observaciones?: string;
    ventaOriginalId?: number;
    ventaOriginal?: VentaCaja;
    creadoEn: Date;
    actualizadoEn: Date;
    detalles?: DetalleVentaCaja[];
    pagos?: PagoCaja[];
    comprobantesAfip?: ComprobanteAfip[];
}
