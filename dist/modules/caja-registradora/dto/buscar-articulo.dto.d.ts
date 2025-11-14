import { Articulo } from '../../articulos/entities/articulo.entity';
export declare class BuscarArticuloInput {
    codigoBarras?: string;
    sku?: string;
    nombre?: string;
    puntoMudrasId?: number;
    limite: number;
}
export declare class ArticuloConStock extends Articulo {
    stockDisponible: number;
    stockDespuesVenta: number;
    alertaStock: boolean;
}
