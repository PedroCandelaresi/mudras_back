import { Resolver, Query, Mutation, Args, Int, ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';

@ObjectType()
export class RelacionProveedorRubro {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  proveedorId: number;

  @Field()
  proveedorNombre: string;

  @Field()
  rubroNombre: string;

  @Field(() => Int)
  cantidadArticulos: number;
}

@ObjectType()
export class EstadisticasProveedorRubro {
  @Field(() => Int)
  totalRelaciones: number;

  @Field(() => Int)
  proveedoresUnicos: number;

  @Field(() => Int)
  rubrosUnicos: number;

  @Field(() => Int)
  totalArticulos: number;
}

@ObjectType()
export class ArticuloConStockPuntoMudras {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field()
  codigo: string;

  @Field(() => Float)
  precio: number;

  @Field(() => Float)
  stockAsignado: number;

  @Field(() => Float)
  stockTotal: number;

  @Field({ nullable: true })
  rubro?: string;
}

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

@ObjectType()
export class ProveedorBasico {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigo?: number;
}

@ObjectType()
export class RubroBasico {
  @Field()
  rubro: string;
}

@ObjectType()
export class ArticuloFiltrado {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field()
  codigo: string;

  @Field(() => Float)
  precio: number;

  @Field(() => Float)
  stockTotal: number;

  @Field(() => Float)
  stockAsignado: number;

  @Field(() => Float)
  stockDisponible: number;

  @Field()
  rubro: string;

  @Field()
  proveedor: string;
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

  @Query(() => [ArticuloConStockPuntoMudras])
  async obtenerStockPuntoMudras(
    @Args('puntoMudrasId', { type: () => Int }) puntoMudrasId: number,
  ): Promise<ArticuloConStockPuntoMudras[]> {
    return await this.puntosMudrasService.obtenerArticulosConStockPunto(puntoMudrasId);
  }

  @Query(() => [ProveedorBasico])
  async obtenerProveedoresConStock(): Promise<any[]> {
    return await this.puntosMudrasService.obtenerProveedores();
  }

  @Query(() => [RubroBasico])
  async obtenerRubrosPorProveedor(
    @Args('proveedorId', { type: () => Int }) proveedorId: number,
  ): Promise<any[]> {
    return await this.puntosMudrasService.obtenerRubrosPorProveedor(proveedorId);
  }

  @Query(() => [ArticuloFiltrado])
  async buscarArticulosParaAsignacion(
    @Args('proveedorId', { type: () => Int, nullable: true }) proveedorId?: number,
    @Args('rubro', { nullable: true }) rubro?: string,
    @Args('busqueda', { nullable: true }) busqueda?: string,
  ): Promise<any[]> {
    return await this.puntosMudrasService.buscarArticulosConFiltros(proveedorId, rubro, busqueda);
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

  @Mutation(() => Boolean)
  async modificarStockPunto(
    @Args('puntoMudrasId', { type: () => Int }) puntoMudrasId: number,
    @Args('articuloId', { type: () => Int }) articuloId: number,
    @Args('nuevaCantidad', { type: () => Float }) nuevaCantidad: number,
  ): Promise<boolean> {
    return await this.puntosMudrasService.modificarStockPunto(puntoMudrasId, articuloId, nuevaCantidad);
  }

  @Query(() => [RelacionProveedorRubro])
  async obtenerRelacionesProveedorRubro(): Promise<any[]> {
    return await this.puntosMudrasService.obtenerRelacionesProveedorRubro();
  }

  @Query(() => EstadisticasProveedorRubro)
  async obtenerEstadisticasProveedorRubro(): Promise<any> {
    return await this.puntosMudrasService.obtenerEstadisticasProveedorRubro();
  }
}
