import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserAuth } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'mudras_auth_user_roles' })
export class UserRole {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @PrimaryColumn({ name: 'role_id', type: 'char', length: 36 })
  roleId!: string;

  @ManyToOne(() => UserAuth, (u) => u.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserAuth;

  @ManyToOne(() => Role, (r) => r.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
