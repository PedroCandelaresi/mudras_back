import { DetalleAsientoContable } from './detalle-asiento-contable.entity';
export declare enum TipoCuentaContable {
    ACTIVO = "activo",
    PASIVO = "pasivo",
    PATRIMONIO = "patrimonio",
    INGRESO = "ingreso",
    EGRESO = "egreso"
}
export declare enum EstadoCuentaContable {
    ACTIVA = "activa",
    INACTIVA = "inactiva"
}
export declare class CuentaContable {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    tipo: TipoCuentaContable;
    estado: EstadoCuentaContable;
    saldoActual: number;
    aceptaMovimientos: boolean;
    cuentaPadreId?: number;
    nivel: number;
    creadoEn: Date;
    actualizadoEn: Date;
    detallesAsientos?: DetalleAsientoContable[];
}
