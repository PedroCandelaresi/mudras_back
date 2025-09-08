import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Extrae req desde contexto GraphQL (y fallback a HTTP si aplica)
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext()?.req ?? context.switchToHttp().getRequest();
    const user = req.user as { roles?: string[] } | undefined;
    const userRoles = user?.roles ?? [];

    return requiredRoles.some((r) => userRoles.includes(r));
  }
}
