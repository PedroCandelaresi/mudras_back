import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';
import { MovimientoStock } from '../../stock/entities/movimiento-stock.entity';
export declare enum EstadoArticulo {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    DESCONTINUADO = "descontinuado"
}
export declare class Articulo {
    id: number;
    Codigo: string;
    Rubro: string;
    rubroId: number;
    Descripcion: string;
    Marca: string;
    PrecioVenta: number;
    PrecioCompra: number;
    StockMinimo: number;
    AlicuotaIva: number;
    Deposito: number;
    FechaCompra: Date;
    idProveedor: number;
    Lista2: number;
    Lista3: number;
    Unidad: string;
    Lista4: number;
    PorcentajeGanancia: number;
    Calculado: boolean;
    CodigoProv: string;
    CostoPromedio: number;
    CostoEnDolares: boolean;
    FechaModif: Date;
    PrecioListaProveedor: number;
    StockInicial: number;
    Ubicacion: string;
    Lista1EnDolares: boolean;
    Dto1: number;
    Dto2: number;
    Dto3: number;
    Impuesto: number;
    EnPromocion: boolean;
    UsaTalle: boolean;
    Compuesto: boolean;
    Combustible: boolean;
    ImpuestoPorcentual: boolean;
    proveedor?: Proveedor;
    rubro?: Rubro;
    movimientosStock?: MovimientoStock[];
}
