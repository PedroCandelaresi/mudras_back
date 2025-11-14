import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';
export declare enum EstadoOrdenCompra {
    BORRADOR = "BORRADOR",
    EMITIDA = "EMITIDA",
    RECEPCIONADA = "RECEPCIONADA",
    ANULADA = "ANULADA"
}
export declare class OrdenCompra {
    id: number;
    proveedorId: number;
    estado: EstadoOrdenCompra;
    observaciones?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    fechaEmision?: Date;
    fechaRecepcion?: Date;
    detalles?: DetalleOrdenCompra[];
    proveedor?: Proveedor;
}
