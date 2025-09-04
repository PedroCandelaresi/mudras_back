import { EstadoArticulo } from '../entities/articulo.entity';
export declare class FiltrosArticuloDto {
    busqueda?: string;
    codigo?: string;
    descripcion?: string;
    marca?: string;
    rubroId?: number;
    proveedorId?: number;
    estado?: EstadoArticulo;
    soloConStock?: boolean;
    soloStockBajo?: boolean;
    soloEnPromocion?: boolean;
    soloPublicadosEnTienda?: boolean;
    precioMinimo?: number;
    precioMaximo?: number;
    pagina: number;
    limite: number;
    ordenarPor: string;
    direccionOrden: 'ASC' | 'DESC';
}
