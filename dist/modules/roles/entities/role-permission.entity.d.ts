import { Role } from './role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
export declare class RolePermission {
    roleId: string;
    permissionId: string;
    role: Role;
    permission: Permission;
}
