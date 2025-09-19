import { PuntoMudras } from './punto-mudras.entity';
export declare enum TipoMovimientoStockPunto {
    ENTRADA = "entrada",
    SALIDA = "salida",
    TRANSFERENCIA = "transferencia",
    AJUSTE = "ajuste",
    VENTA = "venta",
    DEVOLUCION = "devolucion"
}
export declare class MovimientoStockPunto {
    id: number;
    puntoMudrasOrigenId?: number;
    puntoMudrasDestinoId?: number;
    articuloId: number;
    tipoMovimiento: TipoMovimientoStockPunto;
    cantidad: number;
    cantidadAnterior?: number;
    cantidadNueva?: number;
    motivo?: string;
    referenciaExterna?: string;
    usuarioId?: number;
    fechaMovimiento: Date;
    puntoOrigen?: PuntoMudras;
    puntoDestino?: PuntoMudras;
    articulo?: any;
    usuario?: any;
}
