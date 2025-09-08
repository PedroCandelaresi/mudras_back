import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity({ name: 'mudras_auth_role_permissions' })
export class RolePermission {
  @PrimaryColumn({ name: 'role_id', type: 'char', length: 36 })
  roleId!: string;

  @PrimaryColumn({ name: 'permission_id', type: 'char', length: 36 })
  permissionId!: string;

  @ManyToOne(() => Role, (r) => r.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Permission, (p) => p.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;
}
