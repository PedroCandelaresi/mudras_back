import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(_dto: LoginDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    perfil(req: any): {
        perfil: any;
    };
    permisos(req: any): Promise<{
        permisos: string[];
    }>;
    refresh(dto: RefreshDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(dto: RefreshDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuth(): Promise<void>;
    googleCallback(req: any, res: Response): Promise<void>;
    instagramAuth(): Promise<void>;
    instagramCallback(req: any, res: Response): Promise<void>;
}
