import { CuentasCorrientesService } from './cuentas-corrientes.service';
import { CuentaCorriente } from './entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente, TipoMovimientoCuentaCorriente, ConceptoMovimientoCuentaCorriente } from './entities/movimiento-cuenta-corriente.entity';
export declare class CuentasCorrientesResolver {
    private readonly cuentasCorrientesService;
    constructor(cuentasCorrientesService: CuentasCorrientesService);
    crearCuentaCliente(clienteId: number, usuarioId: number, limiteCredito: number): Promise<CuentaCorriente>;
    crearCuentaProveedor(proveedorId: number, usuarioId: number, limiteCredito: number): Promise<CuentaCorriente>;
    findAll(): Promise<CuentaCorriente[]>;
    findOne(id: number): Promise<CuentaCorriente>;
    findByCliente(clienteId: number): Promise<CuentaCorriente[]>;
    findByProveedor(proveedorId: number): Promise<CuentaCorriente[]>;
    registrarMovimiento(cuentaId: number, tipo: TipoMovimientoCuentaCorriente, concepto: ConceptoMovimientoCuentaCorriente, monto: number, descripcion: string, usuarioId: number, numeroComprobante?: string): Promise<MovimientoCuentaCorriente>;
    obtenerSaldo(cuentaId: number): Promise<number>;
    obtenerMovimientos(cuentaId: number): Promise<MovimientoCuentaCorriente[]>;
    cerrarCuenta(id: number): Promise<CuentaCorriente>;
    suspenderCuenta(id: number): Promise<CuentaCorriente>;
    activarCuenta(id: number): Promise<CuentaCorriente>;
}
