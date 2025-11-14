import { OrdenCompra } from './orden-compra.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
export declare class DetalleOrdenCompra {
    id: number;
    ordenId: number;
    articuloId: number;
    cantidad: number;
    precioUnitario?: number;
    cantidadRecibida?: number;
    costoUnitarioRecepcion?: number;
    orden: OrdenCompra;
    articulo: Articulo;
}
