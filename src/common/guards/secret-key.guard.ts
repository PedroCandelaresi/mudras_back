import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class SecretKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const secretKey = request.headers['x-secret-key'];
    const expectedSecretKey = process.env.X_SECRET_KEY;

    if (!expectedSecretKey) {
      throw new UnauthorizedException('Configuración de seguridad no encontrada');
    }

    if (!secretKey || secretKey !== expectedSecretKey) {
      throw new UnauthorizedException('Clave secreta inválida o faltante');
    }

    return true;
  }
}
