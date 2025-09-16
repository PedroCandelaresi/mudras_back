import { VentaCaja } from './venta-caja.entity';
export declare enum TipoComprobanteAfip {
    FACTURA_A = "factura_a",
    FACTURA_B = "factura_b",
    FACTURA_C = "factura_c",
    NOTA_CREDITO_A = "nota_credito_a",
    NOTA_CREDITO_B = "nota_credito_b",
    NOTA_CREDITO_C = "nota_credito_c",
    NOTA_DEBITO_A = "nota_debito_a",
    NOTA_DEBITO_B = "nota_debito_b",
    NOTA_DEBITO_C = "nota_debito_c"
}
export declare enum EstadoComprobanteAfip {
    PENDIENTE = "pendiente",
    EMITIDO = "emitido",
    ERROR = "error",
    ANULADO = "anulado"
}
export declare class ComprobanteAfip {
    id: number;
    ventaId: number;
    venta: VentaCaja;
    tipoComprobante: TipoComprobanteAfip;
    estado: EstadoComprobanteAfip;
    puntoVenta: number;
    numeroComprobante?: number;
    cae?: string;
    vencimientoCae?: Date;
    cuitCliente?: string;
    importeTotal: number;
    importeGravado: number;
    importeExento: number;
    importeIva: number;
    urlPdf?: string;
    mensajeError?: string;
    datosAfip?: string;
    creadoEn: Date;
    actualizadoEn: Date;
}
