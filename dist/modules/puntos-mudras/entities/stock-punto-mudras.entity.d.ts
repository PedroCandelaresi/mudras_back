import { PuntoMudras } from './punto-mudras.entity';
export declare class StockPuntoMudras {
    id: number;
    puntoMudrasId: number;
    articuloId: number;
    cantidad: number;
    stockMinimo: number;
    stockMaximo?: number;
    estanteria?: string;
    estante?: string;
    fechaActualizacion: Date;
    puntoMudras: PuntoMudras;
    articulo?: any;
    estadoStock?: string;
}
