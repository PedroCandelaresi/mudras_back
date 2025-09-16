import { VentaCaja } from './venta-caja.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
export declare class DetalleVentaCaja {
    id: number;
    ventaId: number;
    venta: VentaCaja;
    articuloId: number;
    articulo: Articulo;
    cantidad: number;
    precioUnitario: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    subtotal: number;
    observaciones?: string;
    creadoEn: Date;
}
