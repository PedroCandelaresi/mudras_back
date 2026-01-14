import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorInput } from './dto/create-proveedor.dto';
import { UpdateProveedorInput } from './dto/update-proveedor.dto';
import { RubroPorProveedor } from './dto/rubros-por-proveedor.dto';
import { Rubro } from '../rubros/entities/rubro.entity';
export declare class ProveedoresService {
    private proveedoresRepository;
    private rubrosRepository;
    constructor(proveedoresRepository: Repository<Proveedor>, rubrosRepository: Repository<Rubro>);
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    findByCodigo(codigo: string): Promise<Proveedor>;
    findByNombre(nombre: string): Promise<Proveedor[]>;
    create(createProveedorInput: CreateProveedorInput): Promise<Proveedor>;
    update(updateProveedorInput: UpdateProveedorInput): Promise<Proveedor>;
    findArticulosByProveedor(proveedorId: number, filtro?: string, offset?: number, limit?: number): Promise<{
        articulos: any[];
        total: number;
    }>;
    remove(id: number): Promise<boolean>;
    findRubrosByProveedor(proveedorId: number): Promise<RubroPorProveedor[]>;
}
