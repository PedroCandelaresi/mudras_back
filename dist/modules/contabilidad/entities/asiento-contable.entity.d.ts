import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleAsientoContable } from './detalle-asiento-contable.entity';
export declare enum TipoAsientoContable {
    VENTA = "venta",
    COMPRA = "compra",
    PAGO = "pago",
    COBRO = "cobro",
    AJUSTE = "ajuste",
    CIERRE_CAJA = "cierre_caja",
    APERTURA_CAJA = "apertura_caja"
}
export declare enum EstadoAsientoContable {
    BORRADOR = "borrador",
    CONFIRMADO = "confirmado",
    ANULADO = "anulado"
}
export declare class AsientoContable {
    id: number;
    numero: string;
    tipo: TipoAsientoContable;
    estado: EstadoAsientoContable;
    fecha: Date;
    descripcion?: string;
    totalDebe: number;
    totalHaber: number;
    numeroComprobante?: string;
    usuarioId: number;
    usuario: Usuario;
    creadoEn: Date;
    actualizadoEn: Date;
    fechaAnulacion?: Date;
    usuarioAnulacionId?: number;
    detalles?: DetalleAsientoContable[];
}
