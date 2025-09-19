import { PuntoMudras } from './punto-mudras.entity';
export declare class StockPuntoMudras {
    id: number;
    puntoMudrasId: number;
    articuloId: number;
    cantidad: number;
    stockMinimo: number;
    stockMaximo?: number;
    fechaActualizacion: Date;
    puntoMudras: PuntoMudras;
    articulo?: any;
    estadoStock?: string;
}
