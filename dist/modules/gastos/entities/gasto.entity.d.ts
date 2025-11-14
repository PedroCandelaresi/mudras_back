import { CategoriaGasto } from './categoria-gasto.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
export declare class Gasto {
    id: number;
    fecha: Date;
    montoNeto: number;
    alicuotaIva?: number;
    montoIva: number;
    total: number;
    descripcion?: string;
    proveedorId?: number;
    categoriaId?: number;
    proveedor?: Proveedor;
    categoria?: CategoriaGasto;
    creadoEn: Date;
}
