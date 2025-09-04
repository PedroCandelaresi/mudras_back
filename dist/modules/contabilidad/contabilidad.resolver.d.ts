import { ContabilidadService } from './contabilidad.service';
import { AsientoContable, TipoAsientoContable } from './entities/asiento-contable.entity';
import { CuentaContable, TipoCuentaContable } from './entities/cuenta-contable.entity';
import { TipoMovimientoContable } from './entities/detalle-asiento-contable.entity';
export declare class ContabilidadResolver {
    private readonly contabilidadService;
    constructor(contabilidadService: ContabilidadService);
    crearCuentaContable(codigo: string, nombre: string, tipo: TipoCuentaContable, cuentaPadreId?: number): Promise<CuentaContable>;
    obtenerCuentasContables(): Promise<CuentaContable[]>;
    obtenerCuentaContable(id: number): Promise<CuentaContable>;
    crearAsientoContable(tipo: TipoAsientoContable, descripcion: string, usuarioId: number, detalles: DetalleAsientoInput[]): Promise<AsientoContable>;
    obtenerAsientosContables(): Promise<AsientoContable[]>;
    obtenerAsientoContable(id: number): Promise<AsientoContable>;
    anularAsientoContable(id: number, usuarioId: number): Promise<AsientoContable>;
    obtenerBalanceGeneral(): Promise<any>;
    crearCuentasContablesBasicas(): Promise<boolean>;
}
export declare class DetalleAsientoInput {
    cuentaContableId: number;
    tipoMovimiento: TipoMovimientoContable;
    monto: number;
    descripcion?: string;
}
export declare class BalanceGeneral {
    activos: CuentaContable[];
    pasivos: CuentaContable[];
    patrimonio: CuentaContable[];
    totalActivos: number;
    totalPasivos: number;
    totalPatrimonio: number;
    diferencia: number;
}
