import { VentaCaja } from './venta-caja.entity';
export declare class PuestoVenta {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    ubicacion?: string;
    activo: boolean;
    permiteFacturacion: boolean;
    descontarStock: boolean;
    configuracion?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    ventas?: VentaCaja[];
}
