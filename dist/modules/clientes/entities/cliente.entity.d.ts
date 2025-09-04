import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { Venta } from '../../ventas/entities/venta.entity';
export declare enum TipoCliente {
    MINORISTA = "minorista",
    MAYORISTA = "mayorista",
    DISTRIBUIDOR = "distribuidor"
}
export declare enum EstadoCliente {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    MOROSO = "moroso"
}
export declare class Cliente {
    id: number;
    nombre: string;
    apellido?: string;
    razonSocial?: string;
    cuit?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
    tipo: TipoCliente;
    estado: EstadoCliente;
    descuentoGeneral: number;
    limiteCredito: number;
    saldoActual: number;
    fechaNacimiento?: Date;
    observaciones?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    cuentasCorrientes?: CuentaCorriente[];
    ventas?: Venta[];
}
