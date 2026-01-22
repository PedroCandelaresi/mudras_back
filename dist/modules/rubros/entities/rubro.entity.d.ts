import { Articulo } from '../../articulos/entities/articulo.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { ProveedorRubro } from '../../proveedores/entities/proveedor-rubro.entity';
export declare class Rubro {
    Id: number;
    Rubro: string;
    Codigo: string;
    PorcentajeRecargo: number;
    PorcentajeDescuento: number;
    unidadMedida?: string;
    articulos?: Articulo[];
    proveedores?: Proveedor[];
    proveedorRubros?: ProveedorRubro[];
}
