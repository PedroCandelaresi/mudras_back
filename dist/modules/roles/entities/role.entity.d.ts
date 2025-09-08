import { UserRole } from '../../users-auth/entities/user-role.entity';
import { RolePermission } from './role-permission.entity';
export declare class Role {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
    rolePermissions: RolePermission[];
}
