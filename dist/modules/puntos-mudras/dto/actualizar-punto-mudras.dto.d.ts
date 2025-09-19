import { ConfiguracionEspecialInput } from './crear-punto-mudras.dto';
export declare class ActualizarPuntoMudrasDto {
    id: number;
    nombre?: string;
    descripcion?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    activo?: boolean;
    configuracionEspecial?: ConfiguracionEspecialInput;
}
