import { Articulo } from '../../articulos/entities/articulo.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
export declare class Rubro {
    Id: number;
    Rubro: string;
    Codigo: string;
    PorcentajeRecargo: number;
    PorcentajeDescuento: number;
    articulos?: Articulo[];
    proveedores?: Proveedor[];
    proveedoresNuevos?: Proveedor[];
}
