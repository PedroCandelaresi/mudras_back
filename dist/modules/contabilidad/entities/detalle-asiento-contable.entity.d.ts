import { AsientoContable } from './asiento-contable.entity';
import { CuentaContable } from './cuenta-contable.entity';
export declare enum TipoMovimientoContable {
    DEBE = "debe",
    HABER = "haber"
}
export declare class DetalleAsientoContable {
    id: number;
    asientoContableId: number;
    asientoContable: AsientoContable;
    cuentaContableId: number;
    cuentaContable: CuentaContable;
    tipo: TipoMovimientoContable;
    monto: number;
    descripcion?: string;
    creadoEn: Date;
    tipoMovimiento: TipoMovimientoContable;
}
