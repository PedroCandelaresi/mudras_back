import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaCorriente, TipoCuentaCorriente, EstadoCuentaCorriente } from './entities/cuenta-corriente.entity';
import { MovimientoCuentaCorriente, TipoMovimientoCuentaCorriente, ConceptoMovimientoCuentaCorriente } from './entities/movimiento-cuenta-corriente.entity';

@Injectable()
export class CuentasCorrientesService {
  constructor(
    @InjectRepository(CuentaCorriente)
    private cuentasCorrientesRepository: Repository<CuentaCorriente>,
    @InjectRepository(MovimientoCuentaCorriente)
    private movimientosRepository: Repository<MovimientoCuentaCorriente>,
  ) {}

  async crearCuentaCliente(clienteId: number, usuarioId: number, limiteCredito: number = 0): Promise<CuentaCorriente> {
    const cuenta = this.cuentasCorrientesRepository.create({
      tipo: TipoCuentaCorriente.CLIENTE,
      clienteId,
      usuarioId,
      limiteCredito,
      saldoActual: 0,
    });

    return this.cuentasCorrientesRepository.save(cuenta);
  }

  async crearCuentaProveedor(proveedorId: number, usuarioId: number, limiteCredito: number = 0): Promise<CuentaCorriente> {
    const cuenta = this.cuentasCorrientesRepository.create({
      tipo: TipoCuentaCorriente.PROVEEDOR,
      proveedorId,
      usuarioId,
      limiteCredito,
      saldoActual: 0,
    });

    return this.cuentasCorrientesRepository.save(cuenta);
  }

  async findAll(): Promise<CuentaCorriente[]> {
    return this.cuentasCorrientesRepository.find({
      relations: ['cliente', 'proveedor', 'usuario', 'movimientos'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CuentaCorriente> {
    const cuenta = await this.cuentasCorrientesRepository.findOne({
      where: { id },
      relations: ['cliente', 'proveedor', 'usuario', 'movimientos'],
    });

    if (!cuenta) {
      throw new NotFoundException(`Cuenta corriente con ID ${id} no encontrada`);
    }

    return cuenta;
  }

  async findByCliente(clienteId: number): Promise<CuentaCorriente[]> {
    return this.cuentasCorrientesRepository.find({
      where: { clienteId },
      relations: ['movimientos'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findByProveedor(proveedorId: number): Promise<CuentaCorriente[]> {
    return this.cuentasCorrientesRepository.find({
      where: { proveedorId },
      relations: ['movimientos'],
      order: { creadoEn: 'DESC' },
    });
  }

  async registrarMovimiento(
    cuentaId: number,
    tipo: TipoMovimientoCuentaCorriente,
    concepto: ConceptoMovimientoCuentaCorriente,
    monto: number,
    descripcion: string,
    usuarioId: number,
    numeroComprobante?: string,
  ): Promise<MovimientoCuentaCorriente> {
    const cuenta = await this.findOne(cuentaId);
    const saldoAnterior = cuenta.saldoActual;
    
    let saldoNuevo: number;
    if (tipo === TipoMovimientoCuentaCorriente.DEBITO) {
      saldoNuevo = saldoAnterior + monto;
    } else {
      saldoNuevo = saldoAnterior - monto;
    }

    // Verificar límite de crédito para clientes
    if (cuenta.tipo === TipoCuentaCorriente.CLIENTE && saldoNuevo > cuenta.limiteCredito && cuenta.limiteCredito > 0) {
      throw new BadRequestException('El movimiento excede el límite de crédito');
    }

    const movimiento = this.movimientosRepository.create({
      cuentaCorrienteId: cuentaId,
      tipo,
      concepto,
      monto,
      saldoAnterior,
      saldoNuevo,
      descripcion,
      numeroComprobante,
      fecha: new Date(),
      usuarioId,
    });

    // Actualizar saldo de la cuenta
    cuenta.saldoActual = saldoNuevo;
    await this.cuentasCorrientesRepository.save(cuenta);

    return this.movimientosRepository.save(movimiento);
  }

  async obtenerSaldo(cuentaId: number): Promise<number> {
    const cuenta = await this.findOne(cuentaId);
    return cuenta.saldoActual;
  }

  async obtenerMovimientos(cuentaId: number): Promise<MovimientoCuentaCorriente[]> {
    return this.movimientosRepository.find({
      where: { cuentaCorrienteId: cuentaId },
      relations: ['usuario'],
      order: { creadoEn: 'DESC' },
    });
  }

  async cerrarCuenta(id: number): Promise<CuentaCorriente> {
    const cuenta = await this.findOne(id);
    
    if (cuenta.saldoActual !== 0) {
      throw new BadRequestException('No se puede cerrar una cuenta con saldo pendiente');
    }

    cuenta.estado = EstadoCuentaCorriente.CERRADA;
    return this.cuentasCorrientesRepository.save(cuenta);
  }

  async suspenderCuenta(id: number): Promise<CuentaCorriente> {
    const cuenta = await this.findOne(id);
    cuenta.estado = EstadoCuentaCorriente.SUSPENDIDA;
    return this.cuentasCorrientesRepository.save(cuenta);
  }

  async activarCuenta(id: number): Promise<CuentaCorriente> {
    const cuenta = await this.findOne(id);
    cuenta.estado = EstadoCuentaCorriente.ACTIVA;
    return this.cuentasCorrientesRepository.save(cuenta);
  }
}
