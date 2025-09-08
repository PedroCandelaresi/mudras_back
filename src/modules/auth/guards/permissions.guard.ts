import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISOS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPerms || requiredPerms.length === 0) return true;

    // Extrae req desde contexto GraphQL (y fallback a HTTP si aplica)
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext()?.req ?? context.switchToHttp().getRequest();
    const user = req.user as { perms?: string[]; roles?: string[] } | undefined;
    const userPerms = user?.perms ?? [];
    const roles = (user?.roles ?? []).map((r) => r.toLowerCase());

    // 1) Si trae permisos explícitos en el token, evalúa directo
    const hasByPerms = requiredPerms.some((p) => userPerms.includes(p));
    if (hasByPerms) return true;

    // 2) Política por roles (fallback): 'administrador' todo permitido
    if (roles.includes('administrador')) return true;

    // 3) Mapeo básico de roles -> permisos (extensible si hace falta)
    const rolePermsMap: Record<string, string[]> = {
      administrador: ['*'],
      // ventas: ['productos.read', 'dashboard.read'],
      // deposito: ['productos.read', 'stock.update'],
    };
    for (const role of roles) {
      const grants = rolePermsMap[role] || [];
      if (grants.includes('*')) return true;
      if (requiredPerms.some((p) => grants.includes(p))) return true;
    }

    return false;
  }
}
