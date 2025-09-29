import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';
export declare class RubrosService {
    private rubrosRepository;
    constructor(rubrosRepository: Repository<Rubro>);
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
}
