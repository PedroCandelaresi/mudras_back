import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { FiltrosPuntosMudrasInput } from './dto/filtros-puntos-mudras.dto';

@ObjectType()
export class EstadisticasPuntosMudras {
  @Field(() => Int)
  totalPuntos: number;

  @Field(() => Int)
  puntosVenta: number;

  @Field(() => Int)
  depositos: number;

  @Field(() => Int)
  puntosActivos: number;

  @Field(() => Int)
  articulosConStock: number;

  @Field()
  valorTotalInventario: number;

  @Field(() => Int)
  movimientosHoy: number;
}

@ObjectType()
export class PuntosMudrasResponse {
  @Field(() => [PuntoMudras])
  puntos: PuntoMudras[];

  @Field(() => Int)
  total: number;
}

@Resolver(() => PuntoMudras)
export class PuntosMudrasResolver {
  constructor(private readonly puntosMudrasService: PuntosMudrasService) {}

  @Query(() => PuntosMudrasResponse, { name: 'obtenerPuntosMudras' })
  async obtenerPuntosMudras(
    @Args('filtros', { type: () => FiltrosPuntosMudrasInput, nullable: true })
    filtros?: FiltrosPuntosMudrasInput,
  ): Promise<PuntosMudrasResponse> {
    return this.puntosMudrasService.obtenerTodos(filtros);
  }

  @Query(() => PuntoMudras, { name: 'obtenerPuntoMudrasPorId' })
  async obtenerPuntoMudrasPorId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PuntoMudras> {
    return this.puntosMudrasService.obtenerPorId(id);
  }

  @Query(() => EstadisticasPuntosMudras, { name: 'obtenerEstadisticasPuntosMudras' })
  async obtenerEstadisticasPuntosMudras(): Promise<EstadisticasPuntosMudras> {
    return this.puntosMudrasService.obtenerEstadisticas();
  }

  @Mutation(() => PuntoMudras)
  async crearPuntoMudras(
    @Args('input') input: CrearPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return this.puntosMudrasService.crear(input);
  }

  @Mutation(() => PuntoMudras)
  async actualizarPuntoMudras(
    @Args('input') input: ActualizarPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return this.puntosMudrasService.actualizar(input);
  }

  @Mutation(() => Boolean)
  async eliminarPuntoMudras(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.puntosMudrasService.eliminar(id);
    return true;
  }
}
