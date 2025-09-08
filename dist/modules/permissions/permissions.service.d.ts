import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
export declare class PermissionsService {
    private readonly permsRepo;
    constructor(permsRepo: Repository<Permission>);
    listar(): Promise<Permission[]>;
    crear(dto: CrearPermisoDto): Promise<Permission>;
    actualizar(dto: ActualizarPermisoDto): Promise<Permission>;
    eliminar(id: string): Promise<boolean>;
}
