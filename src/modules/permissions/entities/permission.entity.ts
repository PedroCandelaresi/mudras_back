import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { RolePermission } from '../../roles/entities/role-permission.entity';

@Entity({ name: 'mudras_auth_permissions' })
@Unique('uq_permission', ['resource', 'action'])
export class Permission {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 191 })
  resource!: string;

  @Column({ type: 'varchar', length: 64 })
  action!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt!: Date;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];
}
