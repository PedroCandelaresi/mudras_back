import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContabilidadService } from './contabilidad.service';
import { AsientoContable, TipoAsientoContable } from './entities/asiento-contable.entity';
import { CuentaContable, TipoCuentaContable } from './entities/cuenta-contable.entity';
import { TipoMovimientoContable } from './entities/detalle-asiento-contable.entity';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => AsientoContable)
@RequireSecretKey()
export class ContabilidadResolver {
  constructor(private readonly contabilidadService: ContabilidadService) {}

  @Mutation(() => CuentaContable)
  crearCuentaContable(
    @Args('codigo') codigo: string,
    @Args('nombre') nombre: string,
    @Args('tipo', { type: () => TipoCuentaContable }) tipo: TipoCuentaContable,
    @Args('cuentaPadreId', { type: () => Int, nullable: true }) cuentaPadreId?: number,
  ) {
    return this.contabilidadService.crearCuentaContable(codigo, nombre, tipo, cuentaPadreId);
  }

  @Query(() => [CuentaContable], { name: 'cuentasContables' })
  obtenerCuentasContables() {
    return this.contabilidadService.obtenerCuentasContables();
  }

  @Query(() => CuentaContable, { name: 'cuentaContable' })
  obtenerCuentaContable(@Args('id', { type: () => Int }) id: number) {
    return this.contabilidadService.obtenerCuentaContable(id);
  }

  @Mutation(() => AsientoContable)
  crearAsientoContable(
    @Args('tipo', { type: () => TipoAsientoContable }) tipo: TipoAsientoContable,
    @Args('descripcion') descripcion: string,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('detalles', { type: () => [DetalleAsientoInput] }) detalles: DetalleAsientoInput[],
  ) {
    return this.contabilidadService.crearAsientoContable(tipo, descripcion, usuarioId, detalles);
  }

  @Query(() => [AsientoContable], { name: 'asientosContables' })
  obtenerAsientosContables() {
    return this.contabilidadService.obtenerAsientosContables();
  }

  @Query(() => AsientoContable, { name: 'asientoContable' })
  obtenerAsientoContable(@Args('id', { type: () => Int }) id: number) {
    return this.contabilidadService.obtenerAsientoContable(id);
  }

  @Mutation(() => AsientoContable)
  anularAsientoContable(
    @Args('id', { type: () => Int }) id: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
  ) {
    return this.contabilidadService.anularAsientoContable(id, usuarioId);
  }

  @Query(() => BalanceGeneral, { name: 'balanceGeneral' })
  obtenerBalanceGeneral() {
    return this.contabilidadService.obtenerBalanceGeneral();
  }

  @Mutation(() => Boolean)
  async crearCuentasContablesBasicas() {
    await this.contabilidadService.crearCuentasContablesBasicas();
    return true;
  }
}

// Input Types para GraphQL
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DetalleAsientoInput {
  @Field(() => Int)
  cuentaContableId: number;

  @Field(() => TipoMovimientoContable)
  tipoMovimiento: TipoMovimientoContable;

  @Field()
  monto: number;

  @Field({ nullable: true })
  descripcion?: string;
}

// Object Types para respuestas complejas
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BalanceGeneral {
  @Field(() => [CuentaContable])
  activos: CuentaContable[];

  @Field(() => [CuentaContable])
  pasivos: CuentaContable[];

  @Field(() => [CuentaContable])
  patrimonio: CuentaContable[];

  @Field()
  totalActivos: number;

  @Field()
  totalPasivos: number;

  @Field()
  totalPatrimonio: number;

  @Field()
  diferencia: number;
}
