import { UsersService, CrearUsuarioDto, ActualizarUsuarioDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listar(pagina?: string, limite?: string): Promise<{
        items: import("./entities/user.entity").UserAuth[];
        total: number;
    }>;
    crear(dto: CrearUsuarioDto): Promise<any>;
    obtener(id: string): Promise<any>;
    actualizar(id: string, dto: Omit<ActualizarUsuarioDto, 'id'>): Promise<any>;
    eliminar(id: string): Promise<boolean>;
    asignarRoles(id: string, body: {
        roles: string[];
    }): Promise<any>;
}
