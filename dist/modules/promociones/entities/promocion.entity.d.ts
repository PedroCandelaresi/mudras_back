export declare enum EstadoPromocion {
    ACTIVA = "ACTIVA",
    PROGRAMADA = "PROGRAMADA",
    FINALIZADA = "FINALIZADA"
}
export declare class Promocion {
    id: string;
    nombre: string;
    inicio: string;
    fin: string;
    estado: EstadoPromocion;
    descuento: number;
    createdAt: Date;
    updatedAt: Date;
}
