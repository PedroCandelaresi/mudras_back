import { Resolver, Query, Mutation, Args, Int, Float, ObjectType, Field } from '@nestjs/graphql';
import { RubrosService } from './rubros.service';
import { Rubro } from './entities/rubro.entity';

@ObjectType()
export class RubroConEstadisticas {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  nombre: string;

  @Field({ nullable: true })
  codigo?: string;

  @Field(() => Float, { nullable: true })
  porcentajeRecargo?: number;

  @Field(() => Float, { nullable: true })
  porcentajeDescuento?: number;

  @Field(() => Int)
  cantidadArticulos: number;

  @Field(() => Int)
  cantidadProveedores: number;
}

@ObjectType()
export class RubrosResponse {
  @Field(() => [RubroConEstadisticas])
  rubros: RubroConEstadisticas[];

  @Field(() => Int)
  total: number;
}

@Resolver(() => Rubro)
export class RubrosResolver {
  constructor(private readonly rubrosService: RubrosService) {}

  @Query(() => RubrosResponse, { name: 'buscarRubros' })
  findAll(
    @Args('pagina', { type: () => Int, defaultValue: 0 }) pagina: number,
    @Args('limite', { type: () => Int, defaultValue: 50 }) limite: number,
    @Args('busqueda', { nullable: true }) busqueda?: string,
  ) {
    return this.rubrosService.findAll(pagina, limite, busqueda);
  }

  @Query(() => [RubroConEstadisticas], { name: 'obtenerRubros' })
  async obtenerTodosRubros() {
    const result = await this.rubrosService.findAll(0, 1000);
    return result.rubros;
  }

  @Query(() => Rubro, { name: 'rubro' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rubrosService.findOne(id);
  }

  @Query(() => Rubro, { name: 'rubroPorNombre' })
  findByNombre(@Args('rubro') rubro: string) {
    return this.rubrosService.findByNombre(rubro);
  }

  @Mutation(() => Rubro)
  async crearRubro(
    @Args('nombre') nombre: string,
    @Args('codigo', { nullable: true }) codigo?: string,
    @Args('porcentajeRecargo', { type: () => Float, nullable: true }) porcentajeRecargo?: number,
    @Args('porcentajeDescuento', { type: () => Float, nullable: true }) porcentajeDescuento?: number,
  ): Promise<Rubro> {
    return this.rubrosService.create(nombre, codigo, porcentajeRecargo, porcentajeDescuento);
  }

  @Mutation(() => Rubro)
  async actualizarRubro(
    @Args('id', { type: () => Int }) id: number,
    @Args('nombre') nombre: string,
    @Args('codigo', { nullable: true }) codigo?: string,
    @Args('porcentajeRecargo', { type: () => Float, nullable: true }) porcentajeRecargo?: number,
    @Args('porcentajeDescuento', { type: () => Float, nullable: true }) porcentajeDescuento?: number,
  ): Promise<Rubro> {
    return this.rubrosService.update(id, nombre, codigo, porcentajeRecargo, porcentajeDescuento);
  }

  @Mutation(() => Boolean)
  async eliminarRubro(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.rubrosService.remove(id);
  }

  @Query(() => [ProveedorRubro], { name: 'proveedoresPorRubro' })
  async getProveedoresPorRubro(@Args('rubroId', { type: () => Int }) rubroId: number) {
    return this.rubrosService.getProveedoresPorRubro(rubroId);
  }

  @Query(() => ArticulosPorRubroResponse, { name: 'articulosPorRubro' })
  async getArticulosPorRubro(
    @Args('rubroId', { type: () => Int }) rubroId: number,
    @Args('filtro', { nullable: true }) filtro?: string,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit?: number,
  ) {
    return this.rubrosService.getArticulosPorRubro(rubroId, filtro, offset, limit);
  }

  @Mutation(() => Boolean)
  async eliminarProveedorDeRubro(
    @Args('proveedorId', { type: () => Int }) proveedorId: number,
    @Args('rubroNombre') rubroNombre: string,
  ): Promise<boolean> {
    return this.rubrosService.eliminarProveedorDeRubro(proveedorId, rubroNombre);
  }

  @Mutation(() => Boolean)
  async eliminarArticuloDeRubro(
    @Args('articuloId', { type: () => Int }) articuloId: number,
  ): Promise<boolean> {
    return this.rubrosService.eliminarArticuloDeRubro(articuloId);
  }

  @Mutation(() => Boolean)
  async eliminarArticulosDeRubro(
    @Args('articuloIds', { type: () => [Int] }) articuloIds: number[],
  ): Promise<boolean> {
    return this.rubrosService.eliminarArticulosDeRubro(articuloIds);
  }
}

@ObjectType()
export class ProveedorRubro {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigo?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  telefono?: string;
}

@ObjectType()
export class ArticuloRubro {
  @Field(() => Int)
  id: number;

  @Field()
  codigo: string;

  @Field()
  descripcion: string;

  @Field()
  precio: number;

  @Field(() => Int)
  stock: number;

  @Field(() => ProveedorRubro, { nullable: true })
  proveedor?: ProveedorRubro;
}

@ObjectType()
export class ArticulosPorRubroResponse {
  @Field(() => [ArticuloRubro])
  articulos: ArticuloRubro[];

  @Field(() => Int)
  total: number;
}
