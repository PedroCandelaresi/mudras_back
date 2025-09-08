import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserAuth } from '../../users-auth/entities/user.entity';
declare const LocalStrategy_base: new (...args: [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions] | []) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<UserAuth>;
}
export {};
