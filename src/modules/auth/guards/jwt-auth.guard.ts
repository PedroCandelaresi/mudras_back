import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // En GraphQL, debemos extraer el request desde el contexto de Apollo
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext()?.req;
    // Fallback por si algún endpoint HTTP usa el mismo guard
    return gqlReq ?? context.switchToHttp().getRequest();
  }
}
