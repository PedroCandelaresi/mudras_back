import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISOS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const request = ctx?.req ?? context.switchToHttp().getRequest();
    const user = request?.user;

    if (!user) {
      return false;
    }

    const roles = Array.isArray(user.roles)
      ? user.roles.map((role: string) => role?.toLowerCase?.() ?? String(role ?? '').toLowerCase())
      : [];
    const permisos = Array.isArray(user.perms)
      ? user.perms.map((perm: string) => String(perm))
      : Array.isArray(user.permissions)
        ? user.permissions.map((perm: string) => String(perm))
        : [];

    if (requiredRoles) {
      const rolesNormalizados = requiredRoles.map((role) => role.toLowerCase());
      const tieneRol = roles.some((role) => rolesNormalizados.includes(role));
      if (!tieneRol) {
        return false;
      }
    }

    if (requiredPermissions) {
      if (roles.includes('administrador') || roles.includes('admin')) {
        return true;
      }

      if (permisos.includes('*')) {
        return true;
      }

      const tienePermisos = requiredPermissions.every((permiso) => permisos.includes(permiso));
      if (!tienePermisos) {
        return false;
      }
    }

    return true;
  }
}
