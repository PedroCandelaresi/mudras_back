import { Resolver, Query, Mutation, Args, ID, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => Articulo)
export class ArticulosResolver {
  constructor(private readonly articulosService: ArticulosService) {}

  @Query(() => [Articulo], { name: 'articulos' })
  findAll() {
    return this.articulosService.findAll();
  }

  @Query(() => Articulo, { name: 'articulo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articulosService.findOne(id);
  }

  @Query(() => Articulo, { name: 'articuloPorCodigo' })
  findByCodigo(@Args('codigo') codigo: string) {
    return this.articulosService.findByCodigo(codigo);
  }

  @Query(() => [Articulo], { name: 'articulosPorRubro' })
  findByRubro(@Args('rubro') rubro: string) {
    return this.articulosService.findByRubro(rubro);
  }

  @Query(() => [Articulo], { name: 'articulosPorDescripcion' })
  findByDescripcion(@Args('descripcion') descripcion: string) {
    return this.articulosService.findByDescripcion(descripcion);
  }

  @Query(() => [Articulo], { name: 'articulosPorProveedor' })
  findByProveedor(@Args('idProveedor', { type: () => Int }) idProveedor: number) {
    return this.articulosService.findByProveedor(idProveedor);
  }

  @Query(() => [Articulo], { name: 'articulosConStock' })
  findConStock() {
    return this.articulosService.findConStock();
  }

  @Query(() => [Articulo], { name: 'articulosSinStock' })
  findSinStock() {
    return this.articulosService.findSinStock();
  }

  @Query(() => [Articulo], { name: 'articulosStockBajo' })
  findStockBajo() {
    return this.articulosService.findStockBajo();
  }

  @Query(() => [Articulo], { name: 'articulosEnPromocion' })
  findEnPromocion() {
    return this.articulosService.findEnPromocion();
  }

  // Nuevas queries y mutations mejoradas
  @RequireSecretKey()
  @Mutation(() => Articulo)
  crearArticulo(@Args('crearArticuloDto') crearArticuloDto: CrearArticuloDto) {
    return this.articulosService.crear(crearArticuloDto);
  }

  @RequireSecretKey()
  @Mutation(() => Articulo)
  actualizarArticulo(@Args('actualizarArticuloDto') actualizarArticuloDto: ActualizarArticuloDto) {
    return this.articulosService.actualizar(actualizarArticuloDto);
  }

  @RequireSecretKey()
  @Mutation(() => Boolean)
  eliminarArticulo(@Args('id', { type: () => Int }) id: number) {
    return this.articulosService.eliminar(id);
  }

  @Query(() => ArticulosConPaginacion)
  buscarArticulos(@Args('filtros') filtros: FiltrosArticuloDto) {
    return this.articulosService.buscarConFiltros(filtros);
  }

  @Query(() => EstadisticasArticulos)
  estadisticasArticulos() {
    return this.articulosService.obtenerEstadisticas();
  }

  @Query(() => Articulo, { nullable: true })
  articuloPorCodigoBarras(@Args('codigoBarras') codigoBarras: string) {
    return this.articulosService.buscarPorCodigoBarras(codigoBarras);
  }

  @RequireSecretKey()
  @Mutation(() => Articulo)
  actualizarStockArticulo(
    @Args('id', { type: () => Int }) id: number,
    @Args('nuevoStock') nuevoStock: number
  ) {
    return this.articulosService.actualizarStock(id, nuevoStock);
  }
}

@ObjectType()
class ArticulosConPaginacion {
  @Field(() => [Articulo])
  articulos: Articulo[];

  @Field(() => Int)
  total: number;
}

@ObjectType()
class EstadisticasArticulos {
  @Field(() => Int)
  totalArticulos: number;

  @Field(() => Int)
  articulosActivos: number;

  @Field(() => Int)
  articulosConStock: number;

  @Field(() => Int)
  articulosSinStock: number;

  @Field(() => Int)
  articulosStockBajo: number;

  @Field(() => Int)
  articulosEnPromocion: number;

  @Field(() => Int)
  articulosPublicadosEnTienda: number;

  @Field()
  valorTotalStock: number;
}
