import { Articulo } from '../../articulos/entities/articulo.entity';
export declare class SnapshotInventarioMensual {
    id: number;
    articuloId: number;
    articulo: Articulo;
    puestoVentaId?: number;
    anio: number;
    mes: number;
    stockInicial: number;
    stockFinal: number;
    totalEntradas: number;
    totalSalidas: number;
    stockCalculado: number;
    diferencia: number;
    valorInventario?: number;
    observaciones?: string;
    creadoEn: Date;
}
