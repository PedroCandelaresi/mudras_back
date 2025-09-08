import { RolePermission } from '../../roles/entities/role-permission.entity';
export declare class Permission {
    id: string;
    resource: string;
    action: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    rolePermissions: RolePermission[];
}
