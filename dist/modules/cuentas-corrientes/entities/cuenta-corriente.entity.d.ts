import { Cliente } from '../../clientes/entities/cliente.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente.entity';
export declare enum TipoCuentaCorriente {
    CLIENTE = "cliente",
    PROVEEDOR = "proveedor"
}
export declare enum EstadoCuentaCorriente {
    ACTIVA = "activa",
    SUSPENDIDA = "suspendida",
    CERRADA = "cerrada"
}
export declare class CuentaCorriente {
    id: number;
    tipo: TipoCuentaCorriente;
    estado: EstadoCuentaCorriente;
    saldoActual: number;
    limiteCredito: number;
    fechaVencimiento?: Date;
    observaciones?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    clienteId?: number;
    cliente?: Cliente;
    proveedorId?: number;
    proveedor?: Proveedor;
    usuarioId: number;
    usuario: Usuario;
    movimientos?: MovimientoCuentaCorriente[];
}
