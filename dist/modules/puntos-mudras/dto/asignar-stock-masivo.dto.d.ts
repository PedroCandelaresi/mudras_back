export declare class AsignacionItemInput {
    articuloId: number;
    cantidad: number;
}
export declare class AsignarStockMasivoInput {
    puntoMudrasId: number;
    asignaciones: AsignacionItemInput[];
    motivo?: string;
}
