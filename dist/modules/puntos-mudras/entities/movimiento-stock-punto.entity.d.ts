import { PuntoMudras } from './punto-mudras.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
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
    articulo?: Articulo;
    usuario?: Usuario;
}
