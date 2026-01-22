import { RolesService } from './roles.service';
export declare class RolePublic {
    id: string;
    nombre: string;
    slug: string;
}
export declare class RolesResolver {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    roles(): Promise<{
        id: string;
        nombre: string;
        slug: string;
    }[]>;
}
