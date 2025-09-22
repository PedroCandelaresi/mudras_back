import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';
import { DatabaseService } from '../../common/database/database.service';
export declare class RubrosServiceRefactored {
    private rubrosRepository;
    private databaseService;
    constructor(rubrosRepository: Repository<Rubro>, databaseService: DatabaseService);
    private readonly QUERIES;
    findAll(pagina?: number, limite?: number, busqueda?: string): Promise<{
        rubros: any[];
        total: number;
    }>;
    findOne(id: number): Promise<Rubro>;
    findByNombre(rubro: string): Promise<Rubro>;
    create(nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro>;
    update(id: number, nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro>;
    remove(id: number): Promise<boolean>;
    getProveedoresPorRubro(rubroId: number): Promise<any[]>;
    getArticulosPorRubro(rubroId: number, filtro?: string, offset?: number, limit?: number): Promise<{
        articulos: any[];
        total: number;
    }>;
    eliminarProveedorDeRubro(proveedorId: number, rubroNombre: string): Promise<boolean>;
    eliminarArticuloDeRubro(articuloId: number): Promise<boolean>;
    eliminarArticulosDeRubro(articuloIds: number[]): Promise<boolean>;
    getEstadisticasRubro(rubroId: number): Promise<any>;
}
