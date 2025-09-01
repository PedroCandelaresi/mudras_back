import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedor.entity';

@Resolver(() => Proveedor)
export class ProveedoresResolver {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Query(() => [Proveedor], { name: 'proveedores' })
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Query(() => Proveedor, { name: 'proveedor' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Query(() => Proveedor, { name: 'proveedorPorCodigo' })
  findByCodigo(@Args('codigo', { type: () => Int }) codigo: number) {
    return this.proveedoresService.findByCodigo(codigo);
  }

  @Query(() => [Proveedor], { name: 'proveedoresPorNombre' })
  findByNombre(@Args('nombre') nombre: string) {
    return this.proveedoresService.findByNombre(nombre);
  }
}
