import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
export declare class ProveedoresService {
    private proveedoresRepository;
    constructor(proveedoresRepository: Repository<Proveedor>);
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    findByCodigo(codigo: number): Promise<Proveedor>;
    findByNombre(nombre: string): Promise<Proveedor[]>;
}
