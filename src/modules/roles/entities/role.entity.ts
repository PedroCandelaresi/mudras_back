import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../../users-auth/entities/user-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ name: 'mudras_auth_roles' })
export class Role {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 191 })
  name!: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  slug!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt!: Date;

  @OneToMany(() => UserRole, (ur: UserRole) => ur.role)
  userRoles!: UserRole[];

  @OneToMany(() => RolePermission, (rp: RolePermission) => rp.role)
  rolePermissions!: RolePermission[];
}
