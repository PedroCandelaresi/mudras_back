import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserAuth } from './user.entity';

@Entity({ name: 'mudras_auth_user_providers' })
@Index('idx_provider_user', ['provider', 'providerUserId'])
export class UserProvider {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @ManyToOne(() => UserAuth, (u) => u.providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserAuth;

  @Column({ type: 'enum', enum: ['google', 'instagram'] })
  provider!: 'google' | 'instagram';

  @Column({ name: 'provider_user_id', type: 'varchar', length: 191 })
  providerUserId!: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  email!: string | null;

  @Column({ name: 'access_token', type: 'text', nullable: true })
  accessToken!: string | null;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt!: Date;
}
