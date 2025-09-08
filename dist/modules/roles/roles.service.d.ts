import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
export interface CrearRolDto {
    name: string;
    slug: string;
}
export interface ActualizarRolDto {
    id: string;
    name?: string;
    slug?: string;
}
export declare class RolesService {
    private readonly rolesRepo;
    private readonly rpRepo;
    private readonly permsRepo;
    constructor(rolesRepo: Repository<Role>, rpRepo: Repository<RolePermission>, permsRepo: Repository<Permission>);
    listar(): Promise<Role[]>;
    listarPermisos(): Promise<Permission[]>;
    crear(dto: CrearRolDto): Promise<Role>;
    actualizar(dto: ActualizarRolDto): Promise<Role>;
    eliminar(id: string): Promise<boolean>;
    asignarPermisos(roleId: string, permissionIds: string[]): Promise<{
        ok: boolean;
    }>;
}
