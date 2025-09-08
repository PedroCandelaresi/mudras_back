import { UserAuth } from './user.entity';
import { Role } from '../../roles/entities/role.entity';
export declare class UserRole {
    userId: string;
    roleId: string;
    user: UserAuth;
    role: Role;
}
