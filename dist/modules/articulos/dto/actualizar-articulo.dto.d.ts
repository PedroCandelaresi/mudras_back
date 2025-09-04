import { EstadoArticulo } from '../entities/articulo.entity';
export declare class ActualizarArticuloDto {
    id: number;
    Codigo?: string;
    Rubro?: string;
    Descripcion?: string;
    Marca?: string;
    precioVenta?: number;
    PrecioCompra?: number;
    stock?: number;
    stockMinimo?: number;
    Unidad?: string;
    unidadMedida?: string;
    cantidadPorEmpaque?: number;
    tipoEmpaque?: string;
    descuentoPorcentaje?: number;
    descuentoMonto?: number;
    EnPromocion?: boolean;
    fechaInicioPromocion?: string;
    fechaFinPromocion?: string;
    publicadoEnTienda?: boolean;
    descripcionTienda?: string;
    imagenesUrls?: string[];
    codigoBarras?: string;
    manejaStock?: boolean;
    idProveedor?: number;
    rubroId?: number;
    estado?: EstadoArticulo;
}
