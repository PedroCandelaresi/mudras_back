import { Resolver, Query, Mutation, Args, ID, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permisos } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Resolver(() => Articulo)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ArticulosResolver {
  constructor(private readonly articulosService: ArticulosService) {}

  @Query(() => [Articulo], { name: 'articulos' })
  @Permisos('productos.read')
  findAll() {
    return this.articulosService.findAll();
  }

  @Query(() => Articulo, { name: 'articulo' })
  @Permisos('productos.read')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articulosService.findOne(id);
  }

  @Query(() => Articulo, { name: 'articuloPorCodigo' })
  @Permisos('productos.read')
  findByCodigo(@Args('codigo') codigo: string) {
    return this.articulosService.findByCodigo(codigo);
  }

  @Query(() => [Articulo], { name: 'articulosPorRubro' })
  @Permisos('productos.read')
  findByRubro(@Args('rubro') rubro: string) {
    return this.articulosService.findByRubro(rubro);
  }

  @Query(() => [Articulo], { name: 'articulosPorDescripcion' })
  @Permisos('productos.read')
  findByDescripcion(@Args('descripcion') descripcion: string) {
    return this.articulosService.findByDescripcion(descripcion);
  }

  @Query(() => [Articulo], { name: 'articulosPorProveedor' })
  @Permisos('productos.read')
  findByProveedor(@Args('idProveedor', { type: () => Int }) idProveedor: number) {
    return this.articulosService.findByProveedor(idProveedor);
  }

  @Query(() => [Articulo], { name: 'articulosConStock' })
  @Permisos('productos.read')
  findConStock() {
    return this.articulosService.findConStock();
  }

  @Query(() => [Articulo], { name: 'articulosSinStock' })
  @Permisos('productos.read')
  findSinStock() {
    return this.articulosService.findSinStock();
  }

  @Query(() => [Articulo], { name: 'articulosStockBajo' })
  @Permisos('productos.read')
  findStockBajo() {
    return this.articulosService.findStockBajo();
  }

  @Query(() => [Articulo], { name: 'articulosEnPromocion' })
  @Permisos('productos.read')
  findEnPromocion() {
    return this.articulosService.findEnPromocion();
  }

  // Nuevas queries y mutations mejoradas
  @RequireSecretKey()
  @Roles('administrador')
  @Permisos('productos.create')
  @Mutation(() => Articulo)
  crearArticulo(@Args('crearArticuloDto') crearArticuloDto: CrearArticuloDto) {
    return this.articulosService.crear(crearArticuloDto);
  }

  @RequireSecretKey()
  @Roles('administrador')
  @Permisos('productos.update')
  @Mutation(() => Articulo)
  actualizarArticulo(@Args('actualizarArticuloDto') actualizarArticuloDto: ActualizarArticuloDto) {
    return this.articulosService.actualizar(actualizarArticuloDto);
  }

  @RequireSecretKey()
  @Roles('administrador')
  @Permisos('productos.delete')
  @Mutation(() => Boolean)
  eliminarArticulo(@Args('id', { type: () => Int }) id: number) {
    return this.articulosService.eliminar(id);
  }

  @Query(() => ArticulosConPaginacion)
  @Permisos('productos.read')
  buscarArticulos(@Args('filtros') filtros: FiltrosArticuloDto) {
    return this.articulosService.buscarConFiltros(filtros);
  }

  @Query(() => EstadisticasArticulos)
  @Permisos('dashboard.read')
  estadisticasArticulos() {
    return this.articulosService.obtenerEstadisticas();
  }

  @Query(() => Articulo, { nullable: true })
  @Permisos('productos.read')
  articuloPorCodigoBarras(@Args('codigoBarras') codigoBarras: string) {
    return this.articulosService.buscarPorCodigoBarras(codigoBarras);
  }

  @RequireSecretKey()
  @Roles('administrador')
  @Permisos('stock.update')
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
  
  @Field()
  totalUnidades: number;
}
