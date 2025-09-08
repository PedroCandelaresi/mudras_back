import { Repository } from 'typeorm';
import { UserAuth } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
export interface CrearUsuarioDto {
    username: string;
    email?: string | null;
    displayName: string;
    passwordTemporal: string;
    isActive?: boolean;
    roles?: string[];
}
export interface ActualizarUsuarioDto {
    id: string;
    email?: string | null;
    displayName?: string;
    isActive?: boolean;
    roles?: string[];
}
export declare class UsersService {
    private readonly usersRepo;
    private readonly userRolesRepo;
    private readonly rolesRepo;
    constructor(usersRepo: Repository<UserAuth>, userRolesRepo: Repository<UserRole>, rolesRepo: Repository<Role>);
    listar(pagina?: number, limite?: number): Promise<{
        items: UserAuth[];
        total: number;
    }>;
    crear(dto: CrearUsuarioDto): Promise<any>;
    obtener(id: string): Promise<any>;
    actualizar(dto: ActualizarUsuarioDto): Promise<any>;
    eliminar(id: string): Promise<boolean>;
    asignarRoles(id: string, rolesSlugs: string[]): Promise<any>;
}
