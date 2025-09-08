import { UserProvider } from '../../users-auth/entities/user-provider.entity';
import { UserRole } from '../../users-auth/entities/user-role.entity';
import { RefreshToken } from '../../users-auth/entities/refresh-token.entity';
export declare class UserAuth {
    id: string;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    displayName: string;
    userType: 'EMPRESA' | 'CLIENTE';
    mustChangePassword: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    providers: UserProvider[];
    userRoles: UserRole[];
    refreshTokens: RefreshToken[];
}
