import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { Promocion } from './entities/promocion.entity';
import { CrearPromocionInput } from './dto/crear-promocion.input';
import { ActualizarPromocionInput } from './dto/actualizar-promocion.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => Promocion)
@RequireSecretKey()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PromocionesResolver {
  constructor(private readonly service: PromocionesService) {}

  @Query(() => [Promocion], { name: 'promociones' })
  @Permisos('promociones.read')
  listar() {
    return this.service.listar();
  }

  @Mutation(() => Promocion)
  @Permisos('promociones.create')
  crearPromocion(@Args('input') input: CrearPromocionInput) {
    return this.service.crear(input);
  }

  @Mutation(() => Promocion)
  @Permisos('promociones.update')
  actualizarPromocion(
    @Args('id') id: string,
    @Args('input') input: ActualizarPromocionInput,
  ) {
    return this.service.actualizar(id, input);
  }

  @Mutation(() => Boolean)
  @Permisos('promociones.delete')
  eliminarPromocion(@Args('id') id: string) {
    return this.service.eliminar(id);
  }
}
