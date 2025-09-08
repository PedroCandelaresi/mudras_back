import { PermissionsService } from './permissions.service';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
export declare class PermissionsController {
    private readonly service;
    constructor(service: PermissionsService);
    listar(): Promise<import("./entities/permission.entity").Permission[]>;
    crear(dto: CrearPermisoDto): Promise<import("./entities/permission.entity").Permission>;
    actualizar(id: string, dto: Omit<ActualizarPermisoDto, 'id'>): Promise<import("./entities/permission.entity").Permission>;
    eliminar(id: string): Promise<boolean>;
}
