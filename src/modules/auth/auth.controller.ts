import { Body, Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _dto: LoginDto, @Req() req: any, @Res() res: Response) {
    // req.user fue seteado por LocalStrategy.validate
    const { user } = req;
    const tokens = await this.authService.emitirTokens(user);
    // Setear cookies HTTP-only además de devolver JSON para clientes que las usen
    res.cookie('mudras_token', tokens.accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.cookie('mudras_refresh', tokens.refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.json({ usuario: { id: user.id, username: user.username, displayName: user.displayName, roles: await this.authService.getUserRolesSlugs(user.id) }, ...tokens });
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Req() req: any) {
    // req.user es el payload del JWT
    return { perfil: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('permisos')
  async permisos(@Req() req: any) {
    const userId: string = req.user?.sub;
    const permisos = await this.authService.obtenerPermisosEfectivos(userId);
    return { permisos };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    const tokens = await this.authService.refrescarTokens(dto.refreshToken);
    return tokens;
  }

  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    await this.authService.logout(dto.refreshToken);
    return { ok: true };
  }

  // OAuth Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirección automática a Google
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    // req.user proviene de GoogleStrategy.validate
    const payload = req.user as {
      provider: 'google'; providerUserId: string; email: string | null; displayName: string; accessToken: string; refreshToken: string | null;
    };
    const { accessToken, refreshToken } = await this.authService.handleOAuthLogin(payload);
    // Setear cookies HTTP-only
    res.cookie('mudras_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.cookie('mudras_refresh', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.redirect(process.env.CLIENTE_PANEL_URL || '/cliente/panel');
  }

  // OAuth Instagram
  @Get('instagram')
  @UseGuards(AuthGuard('instagram'))
  async instagramAuth() {
    return;
  }

  @Get('instagram/callback')
  @UseGuards(AuthGuard('instagram'))
  async instagramCallback(@Req() req: any, @Res() res: Response) {
    const payload = req.user as {
      provider: 'instagram'; providerUserId: string; email: string | null; displayName: string; accessToken: string; refreshToken: string | null;
    };
    const { accessToken, refreshToken } = await this.authService.handleOAuthLogin(payload);
    res.cookie('mudras_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.cookie('mudras_refresh', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.redirect(process.env.CLIENTE_PANEL_URL || '/cliente/panel');
  }
}
