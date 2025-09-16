"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const login_dto_1 = require("./dto/login.dto");
const refresh_dto_1 = require("./dto/refresh.dto");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(_dto, req, res) {
        const { user } = req;
        const tokens = await this.authService.emitirTokens(user);
        res.cookie('mudras_token', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        res.cookie('mudras_refresh', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        return res.json({ usuario: { id: user.id, username: user.username, displayName: user.displayName, roles: await this.authService.getUserRolesSlugs(user.id) }, ...tokens });
    }
    perfil(req) {
        return { perfil: req.user };
    }
    async permisos(req) {
        const userId = req.user?.sub;
        const permisos = await this.authService.obtenerPermisosEfectivos(userId);
        return { permisos };
    }
    async refresh(dto, req, res) {
        let refreshToken = dto.refreshToken;
        if (!refreshToken && req.cookies?.mudras_refresh) {
            refreshToken = req.cookies.mudras_refresh;
        }
        if (!refreshToken) {
            return res.status(400).json({
                message: ['refreshToken is required'],
                error: 'Bad Request',
                statusCode: 400
            });
        }
        const tokens = await this.authService.refrescarTokens(refreshToken);
        res.cookie('mudras_token', tokens.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        res.cookie('mudras_refresh', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        return res.json(tokens);
    }
    async logout(dto, req, res) {
        let refreshToken = dto.refreshToken;
        if (!refreshToken && req.cookies?.mudras_refresh) {
            refreshToken = req.cookies.mudras_refresh;
        }
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        res.clearCookie('mudras_token', {
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        res.clearCookie('mudras_refresh', {
            domain: process.env.NODE_ENV === 'production' ? '.mudras.nqn.net.ar' : undefined,
            path: '/'
        });
        return res.json({ ok: true });
    }
    async googleAuth() {
        return;
    }
    async googleCallback(req, res) {
        const payload = req.user;
        const { accessToken, refreshToken } = await this.authService.handleOAuthLogin(payload);
        res.cookie('mudras_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        res.cookie('mudras_refresh', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        return res.redirect(process.env.CLIENTE_PANEL_URL || '/cliente/panel');
    }
    async instagramAuth() {
        return;
    }
    async instagramCallback(req, res) {
        const payload = req.user;
        const { accessToken, refreshToken } = await this.authService.handleOAuthLogin(payload);
        res.cookie('mudras_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        res.cookie('mudras_refresh', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        return res.redirect(process.env.CLIENTE_PANEL_URL || '/cliente/panel');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('perfil'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "perfil", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('permisos'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "permisos", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('instagram'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('instagram')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "instagramAuth", null);
__decorate([
    (0, common_1.Get)('instagram/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('instagram')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "instagramCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map