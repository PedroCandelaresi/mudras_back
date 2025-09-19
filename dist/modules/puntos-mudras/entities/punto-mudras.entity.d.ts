import { StockPuntoMudras } from './stock-punto-mudras.entity';
import { MovimientoStockPunto } from './movimiento-stock-punto.entity';
export declare enum TipoPuntoMudras {
    venta = "venta",
    deposito = "deposito"
}
export declare class PuntoMudras {
    id: number;
    nombre: string;
    tipo: TipoPuntoMudras;
    descripcion?: string;
    direccion: string;
    telefono?: string;
    email?: string;
    activo: boolean;
    permiteVentasOnline: boolean;
    manejaStockFisico: boolean;
    requiereAutorizacion: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    stock?: StockPuntoMudras[];
    movimientosOrigen?: MovimientoStockPunto[];
    movimientosDestino?: MovimientoStockPunto[];
    totalArticulos?: number;
    valorInventario?: number;
}
