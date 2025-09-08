import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserAuth } from './user.entity';

@Entity({ name: 'mudras_auth_refresh_tokens' })
export class RefreshToken {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  @Index('idx_token_user')
  userId!: string;

  @ManyToOne(() => UserAuth, (u) => u.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserAuth;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash!: string;

  @Column({ name: 'expires_at', type: 'datetime', precision: 6 })
  expiresAt!: Date;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  revoked!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt!: Date;
}
