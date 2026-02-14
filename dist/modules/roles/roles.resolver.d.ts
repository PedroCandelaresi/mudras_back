import { RolesService } from './roles.service';
import { CrearRolInput, ActualizarRolInput } from './dto/role.inputs';
export declare class RolePublic {
    id: string;
    nombre: string;
    slug: string;
}
export declare class PermissionPublic {
    id: string;
    resource: string;
    action: string;
    attributes: string;
    description: string;
}
export declare class RolesResolver {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    roles(): Promise<{
        id: string;
        nombre: string;
        slug: string;
    }[]>;
    permisos(): Promise<import("../permissions/entities/permission.entity").Permission[]>;
    crearRol(input: CrearRolInput): Promise<{
        id: string;
        nombre: string;
        slug: string;
    }>;
    actualizarRol(input: ActualizarRolInput): Promise<{
        id: string;
        nombre: string;
        slug: string;
    }>;
    eliminarRol(id: string): Promise<boolean>;
    asignarPermisosRol(id: string, permissions: string[]): Promise<boolean>;
}
