export declare class DetalleRecepcionDto {
    detalleId: number;
    cantidadRecibida: number;
    costoUnitario?: number;
}
export declare class RecepcionarOrdenDto {
    ordenId: number;
    detalles: DetalleRecepcionDto[];
    puntoMudrasId?: number;
}
