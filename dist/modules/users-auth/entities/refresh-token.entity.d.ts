import { UserAuth } from './user.entity';
export declare class RefreshToken {
    id: string;
    userId: string;
    user: UserAuth;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
