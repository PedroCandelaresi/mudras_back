import { Proveedor } from './proveedor.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';
export declare class ProveedorRubro {
    proveedorId: number;
    rubroId: number;
    porcentajeRecargo: number;
    porcentajeDescuento: number;
    proveedor: Proveedor;
    rubro: Rubro;
}
