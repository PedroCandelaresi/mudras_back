import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1) Header Authorization: Bearer <token>
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2) Cookies más comunes (acepta varios nombres)
        (req) => {
          if (!req || !req.cookies) return null;
          const posibles = [
            'mudras_token',
            'mudras_jwt',
            'access_token',
            'auth_token',
            'authorization',
            'Authorization',
          ];
          for (const name of posibles) {
            const raw = req.cookies[name];
            if (typeof raw === 'string' && raw.length > 0) {
              // Si la cookie viene como "Bearer <token>", extraemos la segunda parte
              const parts = raw.split(' ');
              return parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : raw;
            }
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_me',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // devolvemos el payload tal cual para adjuntarlo en req.user
    return payload;
  }
}
