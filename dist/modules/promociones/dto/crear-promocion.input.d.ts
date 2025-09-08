import { EstadoPromocion } from '../entities/promocion.entity';
export declare class CrearPromocionInput {
    nombre: string;
    inicio: string;
    fin: string;
    estado?: EstadoPromocion;
    descuento: number;
}
