export declare class FiltrosArticuloDto {
    busqueda?: string;
    codigo?: string;
    descripcion?: string;
    marca?: string;
    rubroId?: number;
    proveedorId?: number;
    soloConStock?: boolean;
    soloStockBajo?: boolean;
    soloSinStock?: boolean;
    soloEnPromocion?: boolean;
    soloPublicadosEnTienda?: boolean;
    precioMinimo?: number;
    precioMaximo?: number;
    pagina: number;
    limite: number;
    ordenarPor: string;
    direccionOrden: 'ASC' | 'DESC';
}
