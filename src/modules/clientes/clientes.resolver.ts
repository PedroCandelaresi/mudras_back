import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientesService } from './clientes.service';
import { Cliente, TipoCliente, EstadoCliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => Cliente)
@RequireSecretKey()
export class ClientesResolver {
  constructor(private readonly clientesService: ClientesService) {}

  @Mutation(() => Cliente)
  createCliente(@Args('createClienteInput') createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Query(() => [Cliente], { name: 'clientes' })
  findAll() {
    return this.clientesService.findAll();
  }

  @Query(() => Cliente, { name: 'cliente' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.clientesService.findOne(id);
  }

  @Query(() => [Cliente], { name: 'clientesPorTipo' })
  findByTipo(@Args('tipo', { type: () => TipoCliente }) tipo: TipoCliente) {
    return this.clientesService.findByTipo(tipo);
  }

  @Query(() => [Cliente], { name: 'clientesPorEstado' })
  findByEstado(@Args('estado', { type: () => EstadoCliente }) estado: EstadoCliente) {
    return this.clientesService.findByEstado(estado);
  }

  @Query(() => [Cliente], { name: 'clientesMorosos' })
  findMorosos() {
    return this.clientesService.findMorosos();
  }

  @Query(() => [Cliente], { name: 'buscarClientesPorNombre' })
  buscarPorNombre(@Args('nombre') nombre: string) {
    return this.clientesService.buscarPorNombre(nombre);
  }

  @Mutation(() => Cliente)
  updateCliente(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateClienteInput') updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Mutation(() => Cliente)
  actualizarSaldoCliente(
    @Args('id', { type: () => Int }) id: number,
    @Args('nuevoSaldo') nuevoSaldo: number,
  ) {
    return this.clientesService.actualizarSaldo(id, nuevoSaldo);
  }

  @Mutation(() => Boolean)
  async removeCliente(@Args('id', { type: () => Int }) id: number) {
    await this.clientesService.remove(id);
    return true;
  }
}
