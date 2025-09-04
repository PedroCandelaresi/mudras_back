import { Venta } from './venta.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
export declare class DetalleVenta {
    id: number;
    ventaId: number;
    venta: Venta;
    articuloId: number;
    articulo: Articulo;
    cantidad: number;
    precioUnitario: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    subtotal: number;
    creadoEn: Date;
}
