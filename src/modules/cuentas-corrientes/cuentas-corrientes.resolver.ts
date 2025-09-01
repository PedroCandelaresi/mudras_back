import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CuentasCorrientesService } from './cuentas-corrientes.service';
import { CuentaCorriente } from './entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente, TipoMovimientoCuentaCorriente, ConceptoMovimientoCuentaCorriente } from './entities/movimiento-cuenta-corriente.entity';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => CuentaCorriente)
@RequireSecretKey()
export class CuentasCorrientesResolver {
  constructor(private readonly cuentasCorrientesService: CuentasCorrientesService) {}

  @Mutation(() => CuentaCorriente)
  crearCuentaCliente(
    @Args('clienteId', { type: () => Int }) clienteId: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('limiteCredito', { defaultValue: 0 }) limiteCredito: number,
  ) {
    return this.cuentasCorrientesService.crearCuentaCliente(clienteId, usuarioId, limiteCredito);
  }

  @Mutation(() => CuentaCorriente)
  crearCuentaProveedor(
    @Args('proveedorId', { type: () => Int }) proveedorId: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('limiteCredito', { defaultValue: 0 }) limiteCredito: number,
  ) {
    return this.cuentasCorrientesService.crearCuentaProveedor(proveedorId, usuarioId, limiteCredito);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasCorrientes' })
  findAll() {
    return this.cuentasCorrientesService.findAll();
  }

  @Query(() => CuentaCorriente, { name: 'cuentaCorriente' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.findOne(id);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasPorCliente' })
  findByCliente(@Args('clienteId', { type: () => Int }) clienteId: number) {
    return this.cuentasCorrientesService.findByCliente(clienteId);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasPorProveedor' })
  findByProveedor(@Args('proveedorId', { type: () => Int }) proveedorId: number) {
    return this.cuentasCorrientesService.findByProveedor(proveedorId);
  }

  @Mutation(() => MovimientoCuentaCorriente)
  registrarMovimiento(
    @Args('cuentaId', { type: () => Int }) cuentaId: number,
    @Args('tipo', { type: () => TipoMovimientoCuentaCorriente }) tipo: TipoMovimientoCuentaCorriente,
    @Args('concepto', { type: () => ConceptoMovimientoCuentaCorriente }) concepto: ConceptoMovimientoCuentaCorriente,
    @Args('monto') monto: number,
    @Args('descripcion') descripcion: string,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('numeroComprobante', { nullable: true }) numeroComprobante?: string,
  ) {
    return this.cuentasCorrientesService.registrarMovimiento(
      cuentaId,
      tipo,
      concepto,
      monto,
      descripcion,
      usuarioId,
      numeroComprobante,
    );
  }

  @Query(() => Number, { name: 'saldoCuentaCorriente' })
  obtenerSaldo(@Args('cuentaId', { type: () => Int }) cuentaId: number) {
    return this.cuentasCorrientesService.obtenerSaldo(cuentaId);
  }

  @Query(() => [MovimientoCuentaCorriente], { name: 'movimientosCuentaCorriente' })
  obtenerMovimientos(@Args('cuentaId', { type: () => Int }) cuentaId: number) {
    return this.cuentasCorrientesService.obtenerMovimientos(cuentaId);
  }

  @Mutation(() => CuentaCorriente)
  cerrarCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.cerrarCuenta(id);
  }

  @Mutation(() => CuentaCorriente)
  suspenderCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.suspenderCuenta(id);
  }

  @Mutation(() => CuentaCorriente)
  activarCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.activarCuenta(id);
  }
}
