export declare class TransferirStockInput {
    puntoOrigenId: number;
    puntoDestinoId: number;
    articuloId: number;
    cantidad: number;
    motivo?: string;
}
export declare class AjustarStockInput {
    puntoMudrasId: number;
    articuloId: number;
    nuevaCantidad: number;
    motivo?: string;
}
