import { Repository } from 'typeorm';
import { ComprobanteAfip, TipoComprobanteAfip } from '../entities/comprobante-afip.entity';
import { VentaCaja } from '../entities/venta-caja.entity';
export interface DatosFacturaAfip {
    tipoComprobante: TipoComprobanteAfip;
    puntoVenta: number;
    cuitCliente: string;
    importeTotal: number;
    importeGravado: number;
    importeExento: number;
    importeIva: number;
    conceptos: Array<{
        descripcion: string;
        cantidad: number;
        precioUnitario: number;
        importeTotal: number;
    }>;
}
export interface RespuestaAfip {
    exito: boolean;
    numeroComprobante?: number;
    cae?: string;
    vencimientoCae?: Date;
    urlPdf?: string;
    error?: string;
    datosCompletos?: any;
}
export declare class AfipService {
    private comprobanteAfipRepository;
    private readonly logger;
    constructor(comprobanteAfipRepository: Repository<ComprobanteAfip>);
    emitirComprobante(venta: VentaCaja, datos: DatosFacturaAfip): Promise<ComprobanteAfip>;
    reintentarEmision(comprobanteId: number): Promise<ComprobanteAfip>;
    private llamarAfipStub;
    private generarCaeStub;
    obtenerComprobantesVenta(ventaId: number): Promise<ComprobanteAfip[]>;
    obtenerComprobantesPendientes(): Promise<ComprobanteAfip[]>;
}
