import { Resolver, Query, Mutation, Args, Int, ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { UseGuards, ValidationPipe, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';
import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { TransferirStockInput, AjustarStockInput } from './dto/transferir-stock.dto';
import { AsignarStockMasivoInput } from './dto/asignar-stock-masivo.dto';
import { Articulo } from '../articulos/entities/articulo.entity';
import { MovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { FiltrosMovimientosInput } from './dto/filtros-puntos-mudras.dto';

@ObjectType()
export class RubroInfo {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;
}

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

  @Field(() => RubroInfo, { nullable: true })
  rubro?: RubroInfo;

  @Field(() => Articulo, { nullable: true })
  articulo?: Articulo;
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

  @Field(() => Float)
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

  @Field(() => Float)
  stockEnDestino: number;

  @Field()
  rubro: string;

  @Field()
  proveedor: string;
}

@Resolver(() => PuntoMudras)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PuntosMudrasResolver {
  constructor(private readonly puntosMudrasService: PuntosMudrasService) { }

  @Query(() => [PuntoMudras])
  @Permisos('stock.read')
  async obtenerPuntosMudras(): Promise<PuntoMudras[]> {
    const resultado = await this.puntosMudrasService.obtenerTodos();
    return resultado.puntos;
  }

  @Query(() => PuntoMudras)
  @Permisos('stock.read')
  async obtenerPuntoMudrasPorId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.obtenerPorId(id);
  }

  @Query(() => EstadisticasPuntosMudras)
  @Permisos('dashboard.read')
  async obtenerEstadisticasPuntosMudras(): Promise<EstadisticasPuntosMudras> {
    return await this.puntosMudrasService.obtenerEstadisticas();
  }

  @Query(() => [ArticuloConStockPuntoMudras])
  @Permisos('stock.read')
  async obtenerStockPuntoMudras(
    @Args('puntoMudrasId', { type: () => Int }) puntoMudrasId: number,
  ): Promise<ArticuloConStockPuntoMudras[]> {
    return await this.puntosMudrasService.obtenerArticulosConStockPunto(puntoMudrasId);
  }

  @Query(() => [ProveedorBasico])
  @Permisos('stock.read')
  async obtenerProveedoresConStock(): Promise<ProveedorBasico[]> {
    return await this.puntosMudrasService.obtenerProveedores();
  }

  @Query(() => [RubroBasico])
  @Permisos('stock.read')
  async obtenerRubrosPorProveedor(
    @Args('proveedorId', { type: () => ID }) proveedorId: string,
  ): Promise<RubroBasico[]> {
    // Validamos el identificador en el borde de la API para devolver un error claro.
    const parsedId = Number(proveedorId);
    if (!Number.isFinite(parsedId)) {
      throw new BadRequestException('El identificador del proveedor debe ser numérico.');
    }
    return await this.puntosMudrasService.obtenerRubrosPorProveedor(parsedId);
  }

  @Query(() => [ArticuloFiltrado])
  @Permisos('stock.read')
  async buscarArticulosParaAsignacion(
    @Args('proveedorId', { type: () => Int, nullable: true }) proveedorId?: number,
    @Args('rubro', { nullable: true }) rubro?: string,
    @Args('busqueda', { nullable: true }) busqueda?: string,
    @Args('destinoId', { type: () => Int, nullable: true }) destinoId?: number,
  ): Promise<ArticuloFiltrado[]> {
    return await this.puntosMudrasService.buscarArticulosConFiltros(proveedorId, rubro, busqueda, destinoId);
  }

  @Mutation(() => PuntoMudras)
  @RequireSecretKey()
  @Permisos('stock.update')
  async crearPuntoMudras(
    @Args('input', new ValidationPipe()) input: CrearPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.crear(input);
  }

  @Mutation(() => PuntoMudras)
  @RequireSecretKey()
  @Permisos('stock.update')
  async actualizarPuntoMudras(
    @Args('input', new ValidationPipe()) input: ActualizarPuntoMudrasDto,
  ): Promise<PuntoMudras> {
    return await this.puntosMudrasService.actualizar(input);
  }

  @Mutation(() => Boolean)
  @RequireSecretKey()
  @Permisos('stock.update')
  async eliminarPuntoMudras(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.puntosMudrasService.eliminar(id);
    return true;
  }

  @Mutation(() => Boolean)
  @RequireSecretKey()
  @Permisos('stock.update')
  async modificarStockPunto(
    @Args('puntoMudrasId', { type: () => Int }) puntoMudrasId: number,
    @Args('articuloId', { type: () => Int }) articuloId: number,
    @Args('nuevaCantidad', { type: () => Float }) nuevaCantidad: number,
  ): Promise<boolean> {
    return await this.puntosMudrasService.modificarStockPunto(puntoMudrasId, articuloId, nuevaCantidad);
  }

  @Mutation(() => Boolean)
  @RequireSecretKey()
  @Permisos('stock.update')
  async transferirStock(
    @Args('input', new ValidationPipe()) input: TransferirStockInput,
  ): Promise<boolean> {
    await this.puntosMudrasService.transferirStock(input);
    return true;
  }

  @Mutation(() => Boolean)
  @RequireSecretKey()
  @Permisos('stock.update')
  async ajustarStock(
    @Args('input', new ValidationPipe()) input: AjustarStockInput,
  ): Promise<boolean> {
    await this.puntosMudrasService.ajustarStock(input);
    return true;
  }

  @Mutation(() => Boolean)
  @RequireSecretKey()
  @Permisos('stock.update')
  async asignarStockMasivo(
    @Args('input', new ValidationPipe()) input: AsignarStockMasivoInput,
  ): Promise<boolean> {
    return await this.puntosMudrasService.asignarStockMasivo(input);
  }

  @Query(() => [RelacionProveedorRubro])
  @Permisos('stock.read')
  async obtenerRelacionesProveedorRubro(): Promise<RelacionProveedorRubro[]> {
    return await this.puntosMudrasService.obtenerRelacionesProveedorRubro();
  }

  @Query(() => EstadisticasProveedorRubro)
  @Permisos('dashboard.read')
  async obtenerEstadisticasProveedorRubro(): Promise<EstadisticasProveedorRubro> {
    return await this.puntosMudrasService.obtenerEstadisticasProveedorRubro();
  }
  @Query(() => [MatrizStockItem])
  @Permisos('stock.read')
  async obtenerMatrizStock(
    @Args('busqueda', { nullable: true }) busqueda?: string,
    @Args('rubro', { nullable: true }) rubro?: string,
    @Args('proveedorId', { type: () => Int, nullable: true }) proveedorId?: number,
  ): Promise<MatrizStockItem[]> {
    return await this.puntosMudrasService.obtenerMatrizStock({ busqueda, rubro, proveedorId });
  }

  @Query(() => MovimientosPaginados)
  @Permisos('stock.read')
  async movimientosStockFull(
    @Args('input', { nullable: true }) input?: FiltrosMovimientosInput,
    @Args('puntoMudrasId', { type: () => Int, nullable: true }) puntoMudrasId?: number,
  ): Promise<MovimientosPaginados> {
    return await this.puntosMudrasService.obtenerMovimientos(puntoMudrasId, input);
  }
}

@ObjectType()
export class StockPunto {
  @Field(() => Int)
  puntoId: number;

  @Field()
  puntoNombre: string;

  @Field(() => Float)
  cantidad: number;
}

@ObjectType()
export class MatrizStockItem {
  @Field(() => Int)
  id: number;

  @Field()
  codigo: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  rubro?: string;

  @Field(() => Float)
  stockTotal: number;

  @Field(() => [StockPunto])
  stockPorPunto: StockPunto[];
}

@ObjectType()
export class MovimientosPaginados {
  @Field(() => [MovimientoStockPunto])
  movimientos: MovimientoStockPunto[];

  @Field(() => Int)
  total: number;
}
