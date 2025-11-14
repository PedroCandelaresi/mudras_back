import { UsersService } from '../users-auth/users.service';
import { ActualizarUsuarioAuthInput, CrearUsuarioAuthInput, ListarUsuariosAuthInput } from './dto/usuarios-auth.dto';
import { UsuariosService } from './usuarios.service';
import { RolUsuario, Usuario } from './entities/usuario.entity';
import { UsuarioCajaAuthModel } from './dto/usuarios-auth.dto';
export declare class UsuariosAdminResolver {
    private readonly usersService;
    private readonly usuariosGestionService;
    constructor(usersService: UsersService, usuariosGestionService: UsuariosService);
    listarUsuariosAdmin(filtros?: ListarUsuariosAuthInput): Promise<{
        items: import("../users-auth/users.service").UsuarioAuthResumen[];
        total: number;
    }>;
    obtenerUsuarioAdmin(id: string): Promise<import("../users-auth/users.service").UsuarioAuthResumen>;
    crearUsuarioAdmin(input: CrearUsuarioAuthInput): Promise<import("../users-auth/users.service").UsuarioAuthResumen>;
    actualizarUsuarioAdmin(id: string, input: ActualizarUsuarioAuthInput): Promise<import("../users-auth/users.service").UsuarioAuthResumen>;
    eliminarUsuarioAdmin(id: string): Promise<boolean>;
    asignarRolesUsuarioAdmin(id: string, roles: string[]): Promise<import("../users-auth/users.service").UsuarioAuthResumen>;
    listarUsuariosGestionPorRol(rol: RolUsuario): Promise<Usuario[]>;
    usuariosCajaAuth(rolSlug?: string): Promise<UsuarioCajaAuthModel[]>;
}
