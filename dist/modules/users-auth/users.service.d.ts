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
    userType?: 'EMPRESA' | 'CLIENTE';
}
export interface ActualizarUsuarioDto {
    id: string;
    email?: string | null;
    displayName?: string;
    isActive?: boolean;
    roles?: string[];
}
export interface FiltrosUsuariosAuth {
    busqueda?: string;
    username?: string;
    email?: string;
    nombre?: string;
    estado?: string;
}
export interface ListarUsuariosInput extends FiltrosUsuariosAuth {
    pagina?: number;
    limite?: number;
}
export interface UsuarioAuthResumen {
    id: string;
    username: string | null;
    email: string | null;
    displayName: string;
    userType: 'EMPRESA' | 'CLIENTE';
    isActive: boolean;
    mustChangePassword: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
}
export declare class UsersService {
    private readonly usersRepo;
    private readonly userRolesRepo;
    private readonly rolesRepo;
    constructor(usersRepo: Repository<UserAuth>, userRolesRepo: Repository<UserRole>, rolesRepo: Repository<Role>);
    listarEmpresaPorRolSlug(rolSlug: string): Promise<UserAuth[]>;
    listar(entrada?: ListarUsuariosInput): Promise<{
        items: UsuarioAuthResumen[];
        total: number;
    }>;
    crear(dto: CrearUsuarioDto): Promise<UsuarioAuthResumen>;
    obtener(id: string): Promise<UsuarioAuthResumen>;
    actualizar(dto: ActualizarUsuarioDto): Promise<UsuarioAuthResumen>;
    eliminar(id: string): Promise<boolean>;
    asignarRoles(id: string, rolesSlugs: string[]): Promise<UsuarioAuthResumen>;
    listarPorRolSlug(rolSlug: string): Promise<UsuarioAuthResumen[]>;
    private mapearUsuario;
}
