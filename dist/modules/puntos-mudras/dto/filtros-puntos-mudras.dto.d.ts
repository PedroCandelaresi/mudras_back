import { TipoPuntoMudras } from '../entities/punto-mudras.entity';
export declare class FiltrosPuntosMudrasInput {
    tipo?: TipoPuntoMudras;
    activo?: boolean;
    busqueda?: string;
    limite?: number;
    offset?: number;
    ordenarPor?: string;
    direccionOrden?: 'ASC' | 'DESC';
}
export declare class FiltrosStockInput {
    busqueda?: string;
    soloConStock?: boolean;
    soloBajoStock?: boolean;
    limite?: number;
    offset?: number;
}
export declare class FiltrosMovimientosInput {
    tipoMovimiento?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    articuloId?: number;
    limite?: number;
    offset?: number;
}
