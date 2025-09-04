import { Repository } from 'typeorm';
import { AsientoContable, TipoAsientoContable } from './entities/asiento-contable.entity';
import { DetalleAsientoContable, TipoMovimientoContable } from './entities/detalle-asiento-contable.entity';
import { CuentaContable, TipoCuentaContable } from './entities/cuenta-contable.entity';
export declare class ContabilidadService {
    private asientosRepository;
    private detallesRepository;
    private cuentasRepository;
    constructor(asientosRepository: Repository<AsientoContable>, detallesRepository: Repository<DetalleAsientoContable>, cuentasRepository: Repository<CuentaContable>);
    crearCuentaContable(codigo: string, nombre: string, tipo: TipoCuentaContable, cuentaPadreId?: number): Promise<CuentaContable>;
    obtenerCuentasContables(): Promise<CuentaContable[]>;
    obtenerCuentaContable(id: number): Promise<CuentaContable>;
    crearAsientoContable(tipo: TipoAsientoContable, descripcion: string, usuarioId: number, detalles: Array<{
        cuentaContableId: number;
        tipoMovimiento: TipoMovimientoContable;
        monto: number;
        descripcion?: string;
    }>): Promise<AsientoContable>;
    obtenerAsientosContables(): Promise<AsientoContable[]>;
    obtenerAsientoContable(id: number): Promise<AsientoContable>;
    anularAsientoContable(id: number, usuarioId: number): Promise<AsientoContable>;
    private actualizarSaldoCuenta;
    obtenerBalanceGeneral(): Promise<any>;
    crearCuentasContablesBasicas(): Promise<void>;
}
