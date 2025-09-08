import { UserAuth } from './user.entity';
export declare class UserProvider {
    id: string;
    userId: string;
    user: UserAuth;
    provider: 'google' | 'instagram';
    providerUserId: string;
    email: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
