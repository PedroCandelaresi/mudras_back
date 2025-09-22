import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorInput } from './dto/create-proveedor.dto';
import { UpdateProveedorInput } from './dto/update-proveedor.dto';
export declare class ProveedoresResolver {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    findByCodigo(codigo: number): Promise<Proveedor>;
    findByNombre(nombre: string): Promise<Proveedor[]>;
    findArticulosByProveedor(proveedorId: number, filtro?: string, offset?: number, limit?: number): Promise<{
        articulos: any[];
        total: number;
    }>;
    create(createProveedorInput: CreateProveedorInput): Promise<Proveedor>;
    update(updateProveedorInput: UpdateProveedorInput): Promise<Proveedor>;
    remove(id: number): Promise<boolean>;
}
