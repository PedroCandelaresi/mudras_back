import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorInput } from './dto/create-proveedor.dto';
import { UpdateProveedorInput } from './dto/update-proveedor.dto';
import { RubroPorProveedor } from './dto/rubros-por-proveedor.dto';
import { Rubro } from '../rubros/entities/rubro.entity';
import { ProveedorRubro } from './entities/proveedor-rubro.entity';
import { ArticulosService } from '../articulos/articulos.service';
export declare class ProveedoresService {
    private proveedoresRepository;
    private rubrosRepository;
    private proveedorRubrosRepository;
    private articulosService;
    constructor(proveedoresRepository: Repository<Proveedor>, rubrosRepository: Repository<Rubro>, proveedorRubrosRepository: Repository<ProveedorRubro>, articulosService: ArticulosService);
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    findByCodigo(codigo: string): Promise<Proveedor>;
    findByNombre(nombre: string): Promise<Proveedor[]>;
    create(createProveedorInput: CreateProveedorInput): Promise<Proveedor>;
    update(updateProveedorInput: UpdateProveedorInput): Promise<Proveedor>;
    configurarRubroProveedor(proveedorId: number, rubroId: number, recargo: number, descuento: number): Promise<ProveedorRubro>;
    findArticulosByProveedor(proveedorId: number, filtro?: string, offset?: number, limit?: number): Promise<{
        articulos: any[];
        total: number;
    }>;
    remove(id: number): Promise<boolean>;
    findRubrosByProveedor(proveedorId: number): Promise<RubroPorProveedor[]>;
}
