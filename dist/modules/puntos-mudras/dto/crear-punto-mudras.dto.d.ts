import { TipoPuntoMudras } from '../entities/punto-mudras.entity';
export declare class ConfiguracionEspecialInput {
    ventasOnline?: boolean;
    requiereAutorizacion?: boolean;
}
export declare class CrearPuntoMudrasDto {
    nombre: string;
    tipo: TipoPuntoMudras;
    descripcion?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    activo?: boolean;
    configuracionEspecial?: ConfiguracionEspecialInput;
}
