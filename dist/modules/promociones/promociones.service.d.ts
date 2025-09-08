import { Repository } from 'typeorm';
import { Promocion } from './entities/promocion.entity';
import { CrearPromocionInput } from './dto/crear-promocion.input';
import { ActualizarPromocionInput } from './dto/actualizar-promocion.input';
export declare class PromocionesService {
    private readonly repo;
    constructor(repo: Repository<Promocion>);
    listar(): Promise<Promocion[]>;
    crear(input: CrearPromocionInput): Promise<Promocion>;
    actualizar(id: string, input: Partial<ActualizarPromocionInput>): Promise<Promocion>;
    eliminar(id: string): Promise<boolean>;
}
