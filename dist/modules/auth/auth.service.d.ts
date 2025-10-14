import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from '../users-auth/entities/user.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import { RefreshToken } from '../users-auth/entities/refresh-token.entity';
import { Role } from '../roles/entities/role.entity';
import { UserProvider } from '../users-auth/entities/user-provider.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
export interface JwtPayload {
    sub: string;
    username: string | null;
    roles: string[];
    typ: 'EMPRESA' | 'CLIENTE';
    perms: string[];
}
export declare class AuthService {
    private readonly usersRepo;
    private readonly userRolesRepo;
    private readonly rolesRepo;
    private readonly providersRepo;
    private readonly refreshRepo;
    private readonly rolePermRepo;
    private readonly permsRepo;
    private readonly jwtService;
    constructor(usersRepo: Repository<UserAuth>, userRolesRepo: Repository<UserRole>, rolesRepo: Repository<Role>, providersRepo: Repository<UserProvider>, refreshRepo: Repository<RefreshToken>, rolePermRepo: Repository<RolePermission>, permsRepo: Repository<Permission>, jwtService: JwtService);
    validateUser(username: string, plainPassword: string): Promise<UserAuth>;
    getUserRolesSlugs(userId: string): Promise<string[]>;
    obtenerPermisosEfectivos(userId: string): Promise<string[]>;
    emitirTokens(user: UserAuth): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refrescarTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    handleOAuthLogin(input: {
        provider: 'google' | 'instagram';
        providerUserId: string;
        email: string | null;
        displayName: string;
        accessToken: string;
        refreshToken: string | null;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: UserAuth;
    }>;
}
