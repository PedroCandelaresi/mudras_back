import { Gasto } from './gasto.entity';
export declare class CategoriaGasto {
    id: number;
    nombre: string;
    descripcion?: string;
    gastos: Gasto[];
}
