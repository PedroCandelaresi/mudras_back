import { RubrosService } from './rubros.service';
import { Rubro } from './entities/rubro.entity';
export declare class RubrosResolver {
    private readonly rubrosService;
    constructor(rubrosService: RubrosService);
    findAll(): Promise<Rubro[]>;
    findOne(id: number): Promise<Rubro>;
    findByNombre(rubro: string): Promise<Rubro>;
}
