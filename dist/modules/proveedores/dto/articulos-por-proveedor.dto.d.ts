export declare class ArticuloProveedor {
    Id: number;
    Codigo?: string;
    Descripcion: string;
    Stock?: number;
    PrecioVenta?: number;
    Rubro?: string;
    StockMinimo?: number;
    EnPromocion?: boolean;
    stock: number;
    precio: number;
    rubro: string;
}
export declare class ArticulosPorProveedorResponse {
    articulos: ArticuloProveedor[];
    total: number;
}
