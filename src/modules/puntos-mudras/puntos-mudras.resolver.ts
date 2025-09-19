import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';

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

  @Field(() => Number)
  valorTotalInventario: number;

  @Field(() => Int)
  movimientosHoy: number;
}

@Resolver(() => PuntoMudras)
export class PuntosMudrasResolver {
  constructor(private readonly puntosMudrasService: PuntosMudrasService) {}

  @Query(() => [PuntoMudras])
  async obtenerPuntosMudras(): Promise<PuntoMudras[]> {
    const resultado = await this.puntosMudrasService.obtenerTodos();
    return resultado.puntos;
  }

  @Query(() => PuntoMudras)
  async obtenerPuntoMudrasPorId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.obtenerPorId(id);
  }

  @Query(() => EstadisticasPuntosMudras)
  async obtenerEstadisticasPuntosMudras(): Promise<EstadisticasPuntosMudras> {
    return await this.puntosMudrasService.obtenerEstadisticas();
  }

  @Mutation(() => PuntoMudras)
  async crearPuntoMudras(
    @Args('input', new ValidationPipe()) input: CrearPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.crear(input);
  }

  @Mutation(() => PuntoMudras)
  async actualizarPuntoMudras(
    @Args('input', new ValidationPipe()) input: ActualizarPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.actualizar(input);
  }

  @Mutation(() => Boolean)
  async eliminarPuntoMudras(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.puntosMudrasService.eliminar(id);
    return true;
  }
}
