import { Body, Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LoginEmailDto } from './dto/login-email.dto';

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

  // Login de CLIENTE por email/password
  @Post('login-email')
  async loginEmail(@Body() dto: LoginEmailDto, @Req() _req: any, @Res() res: Response) {
    const user = await this.authService.validateClientEmail(dto.email, dto.password);
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
    return res.json({ usuario: { id: user.id, email: user.email, displayName: user.displayName, roles: await this.authService.getUserRolesSlugs(user.id) }, ...tokens });
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@Req() req: any) {
    // req.user es el payload del JWT; si el token no tiene uid aún, tratar de adjuntarlo dinámicamente
    const perfil = { ...(req.user || {}) };
    if (perfil && typeof perfil.uid === 'undefined' && typeof perfil.sub === 'string') {
      try {
        const uid = await (this.authService as any).obtenerUsuarioInternoId?.(perfil.sub);
        if (uid) perfil.uid = uid;
      } catch {}
    }
    return { perfil };
  }

  @UseGuards(JwtAuthGuard)
  @Get('permisos')
  async permisos(@Req() req: any) {
    const userId: string = req.user?.sub;
    const permisos = await this.authService.obtenerPermisosEfectivos(userId);
    return { permisos };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto, @Req() req: any, @Res() res: Response) {
    // Intentar obtener refreshToken del body o de las cookies
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
    
    // Actualizar cookies con los nuevos tokens
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

  @Post('logout')
  async logout(@Body() dto: RefreshDto, @Req() req: any, @Res() res: Response) {
    // Intentar obtener refreshToken del body o de las cookies
    let refreshToken = dto.refreshToken;
    
    if (!refreshToken && req.cookies?.mudras_refresh) {
      refreshToken = req.cookies.mudras_refresh;
    }
    
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    
    // Limpiar cookies al hacer logout
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
