import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { AsientoContable } from '../../contabilidad/entities/asiento-contable.entity';
export declare enum RolUsuario {
    ADMINISTRADOR = "administrador",
    PROGRAMADOR = "programador",
    CAJA = "caja",
    DEPOSITO = "deposito",
    DIS_GRAFICO = "dis_grafico"
}
export declare enum EstadoUsuario {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    SUSPENDIDO = "suspendido"
}
export declare class Usuario {
    id: number;
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password: string;
    rol: RolUsuario;
    estado: EstadoUsuario;
    telefono?: string;
    direccion?: string;
    salario: number;
    fechaIngreso?: Date;
    ultimoAcceso?: Date;
    creadoEn: Date;
    actualizadoEn: Date;
    cuentasCorrientes?: CuentaCorriente[];
    asientosContables?: AsientoContable[];
}
