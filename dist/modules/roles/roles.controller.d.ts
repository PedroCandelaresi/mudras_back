import { RolesService, CrearRolDto, ActualizarRolDto } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    listar(): Promise<import("./entities/role.entity").Role[]>;
    listarPermisos(): Promise<import("../permissions/entities/permission.entity").Permission[]>;
    crear(dto: CrearRolDto): Promise<import("./entities/role.entity").Role>;
    actualizar(id: string, dto: Omit<ActualizarRolDto, 'id'>): Promise<import("./entities/role.entity").Role>;
    eliminar(id: string): Promise<boolean>;
    asignarPermisos(id: string, body: {
        permissionIds: string[];
    }): Promise<{
        ok: boolean;
    }>;
}
