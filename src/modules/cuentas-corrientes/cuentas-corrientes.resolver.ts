import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CuentasCorrientesService } from './cuentas-corrientes.service';
import { CuentaCorriente } from './entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente, TipoMovimientoCuentaCorriente, ConceptoMovimientoCuentaCorriente } from './entities/movimiento-cuenta-corriente.entity';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver(() => CuentaCorriente)
@RequireSecretKey()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CuentasCorrientesResolver {
  constructor(private readonly cuentasCorrientesService: CuentasCorrientesService) {}

  @Mutation(() => CuentaCorriente)
  @Permisos('cuentas.create')
  crearCuentaCliente(
    @Args('clienteId', { type: () => Int }) clienteId: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('limiteCredito', { defaultValue: 0 }) limiteCredito: number,
  ) {
    return this.cuentasCorrientesService.crearCuentaCliente(clienteId, usuarioId, limiteCredito);
  }

  @Mutation(() => CuentaCorriente)
  @Permisos('cuentas.create')
  crearCuentaProveedor(
    @Args('proveedorId', { type: () => Int }) proveedorId: number,
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('limiteCredito', { defaultValue: 0 }) limiteCredito: number,
  ) {
    return this.cuentasCorrientesService.crearCuentaProveedor(proveedorId, usuarioId, limiteCredito);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasCorrientes' })
  @Permisos('cuentas.read')
  findAll() {
    return this.cuentasCorrientesService.findAll();
  }

  @Query(() => CuentaCorriente, { name: 'cuentaCorriente' })
  @Permisos('cuentas.read')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.findOne(id);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasPorCliente' })
  @Permisos('cuentas.read')
  findByCliente(@Args('clienteId', { type: () => Int }) clienteId: number) {
    return this.cuentasCorrientesService.findByCliente(clienteId);
  }

  @Query(() => [CuentaCorriente], { name: 'cuentasPorProveedor' })
  @Permisos('cuentas.read')
  findByProveedor(@Args('proveedorId', { type: () => Int }) proveedorId: number) {
    return this.cuentasCorrientesService.findByProveedor(proveedorId);
  }

  @Mutation(() => MovimientoCuentaCorriente)
  @Permisos('cuentas.update')
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
  @Permisos('cuentas.read')
  obtenerSaldo(@Args('cuentaId', { type: () => Int }) cuentaId: number) {
    return this.cuentasCorrientesService.obtenerSaldo(cuentaId);
  }

  @Query(() => [MovimientoCuentaCorriente], { name: 'movimientosCuentaCorriente' })
  @Permisos('cuentas.read')
  obtenerMovimientos(@Args('cuentaId', { type: () => Int }) cuentaId: number) {
    return this.cuentasCorrientesService.obtenerMovimientos(cuentaId);
  }

  @Mutation(() => CuentaCorriente)
  @Permisos('cuentas.update')
  cerrarCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.cerrarCuenta(id);
  }

  @Mutation(() => CuentaCorriente)
  @Permisos('cuentas.update')
  suspenderCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.suspenderCuenta(id);
  }

  @Mutation(() => CuentaCorriente)
  @Permisos('cuentas.update')
  activarCuenta(@Args('id', { type: () => Int }) id: number) {
    return this.cuentasCorrientesService.activarCuenta(id);
  }
}
