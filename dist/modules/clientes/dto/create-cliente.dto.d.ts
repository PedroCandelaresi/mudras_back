import { TipoCliente, EstadoCliente } from '../entities/cliente.entity';
export declare class CreateClienteDto {
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
    tipo?: TipoCliente;
    estado?: EstadoCliente;
    descuentoGeneral?: number;
    limiteCredito?: number;
    fechaNacimiento?: string;
    observaciones?: string;
}
