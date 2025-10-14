import { UsersService, CrearUsuarioDto, ActualizarUsuarioDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listar(pagina?: string, limite?: string, busqueda?: string, username?: string, email?: string, nombre?: string, estado?: string): Promise<{
        items: import("./users.service").UsuarioAuthResumen[];
        total: number;
    }>;
    crear(dto: CrearUsuarioDto): Promise<import("./users.service").UsuarioAuthResumen>;
    obtener(id: string): Promise<import("./users.service").UsuarioAuthResumen>;
    actualizar(id: string, dto: Omit<ActualizarUsuarioDto, 'id'>): Promise<import("./users.service").UsuarioAuthResumen>;
    eliminar(id: string): Promise<boolean>;
    asignarRoles(id: string, body: {
        roles: string[];
    }): Promise<import("./users.service").UsuarioAuthResumen>;
}
