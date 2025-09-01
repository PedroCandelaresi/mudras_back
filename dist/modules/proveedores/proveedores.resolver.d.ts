import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedor.entity';
export declare class ProveedoresResolver {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    findByCodigo(codigo: number): Promise<Proveedor>;
    findByNombre(nombre: string): Promise<Proveedor[]>;
}
