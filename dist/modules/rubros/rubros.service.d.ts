import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';
export declare class RubrosService {
    private rubrosRepository;
    constructor(rubrosRepository: Repository<Rubro>);
    findAll(): Promise<Rubro[]>;
    findOne(id: number): Promise<Rubro>;
    findByNombre(rubro: string): Promise<Rubro>;
}
