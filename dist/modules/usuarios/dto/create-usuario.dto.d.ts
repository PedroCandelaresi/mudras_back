import { RolUsuario, EstadoUsuario } from '../entities/usuario.entity';
export declare class CreateUsuarioDto {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password: string;
    rol: RolUsuario;
    estado?: EstadoUsuario;
    telefono?: string;
    direccion?: string;
    salario?: number;
    fechaIngreso?: string;
}
