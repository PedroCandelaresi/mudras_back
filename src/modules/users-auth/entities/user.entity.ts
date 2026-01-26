import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserProvider } from '../../users-auth/entities/user-provider.entity';
import { UserRole } from '../../users-auth/entities/user-role.entity';
import { RefreshToken } from '../../users-auth/entities/refresh-token.entity';

@ObjectType()
@Entity({ name: 'mudras_usuarios_auth' })
export class UserAuth {
  @Field(() => ID)
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  username!: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  email!: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Field()
  @Column({ name: 'display_name', type: 'varchar', length: 191 })
  displayName!: string;

  @Column({ name: 'user_type', type: 'enum', enum: ['EMPRESA', 'CLIENTE'], default: 'EMPRESA' })
  userType!: 'EMPRESA' | 'CLIENTE';

  @Column({ name: 'must_change_password', type: 'tinyint', width: 1, default: 0 })
  mustChangePassword!: boolean;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt!: Date;

  @OneToMany(() => UserProvider, (up: UserProvider) => up.user)
  providers!: UserProvider[];

  @OneToMany(() => UserRole, (ur: UserRole) => ur.user)
  userRoles!: UserRole[];

  @OneToMany(() => RefreshToken, (rt: RefreshToken) => rt.user)
  refreshTokens!: RefreshToken[];
}
