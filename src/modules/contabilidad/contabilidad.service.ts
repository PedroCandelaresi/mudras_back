import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsientoContable, TipoAsientoContable, EstadoAsientoContable } from './entities/asiento-contable.entity';
import { DetalleAsientoContable, TipoMovimientoContable } from './entities/detalle-asiento-contable.entity';
import { CuentaContable, TipoCuentaContable, EstadoCuentaContable } from './entities/cuenta-contable.entity';

@Injectable()
export class ContabilidadService {
  constructor(
    @InjectRepository(AsientoContable)
    private asientosRepository: Repository<AsientoContable>,
    @InjectRepository(DetalleAsientoContable)
    private detallesRepository: Repository<DetalleAsientoContable>,
    @InjectRepository(CuentaContable)
    private cuentasRepository: Repository<CuentaContable>,
  ) {}

  // Gestión de Cuentas Contables
  async crearCuentaContable(
    codigo: string,
    nombre: string,
    tipo: TipoCuentaContable,
    cuentaPadreId?: number,
  ): Promise<CuentaContable> {
    const existingCuenta = await this.cuentasRepository.findOne({
      where: { codigo },
    });

    if (existingCuenta) {
      throw new BadRequestException('Ya existe una cuenta con ese código');
    }

    const cuenta = this.cuentasRepository.create({
      codigo,
      nombre,
      tipo,
      cuentaPadreId,
      saldoActual: 0,
    });

    return this.cuentasRepository.save(cuenta);
  }

  async obtenerCuentasContables(): Promise<CuentaContable[]> {
    return this.cuentasRepository.find({
      relations: ['cuentaPadre', 'cuentasHijas', 'detallesAsientos'],
      order: { codigo: 'ASC' },
    });
  }

  async obtenerCuentaContable(id: number): Promise<CuentaContable> {
    const cuenta = await this.cuentasRepository.findOne({
      where: { id },
      relations: ['cuentaPadre', 'cuentasHijas', 'detallesAsientos'],
    });

    if (!cuenta) {
      throw new NotFoundException(`Cuenta contable con ID ${id} no encontrada`);
    }

    return cuenta;
  }

  // Gestión de Asientos Contables
  async crearAsientoContable(
    tipo: TipoAsientoContable,
    descripcion: string,
    usuarioId: number,
    detalles: Array<{
      cuentaContableId: number;
      tipoMovimiento: TipoMovimientoContable;
      monto: number;
      descripcion?: string;
    }>,
  ): Promise<AsientoContable> {
    // Validar que el asiento esté balanceado
    const totalDebe = detalles
      .filter(d => d.tipoMovimiento === TipoMovimientoContable.DEBE)
      .reduce((sum, d) => sum + d.monto, 0);
    
    const totalHaber = detalles
      .filter(d => d.tipoMovimiento === TipoMovimientoContable.HABER)
      .reduce((sum, d) => sum + d.monto, 0);

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      throw new BadRequestException('El asiento contable debe estar balanceado (Debe = Haber)');
    }

    const asiento = this.asientosRepository.create({
      tipo,
      descripcion,
      totalDebe,
      totalHaber,
      usuarioId,
      fecha: new Date(),
    });

    const asientoGuardado = await this.asientosRepository.save(asiento);

    // Crear los detalles del asiento
    for (const detalle of detalles) {
      await this.detallesRepository.save({
        asientoContableId: asientoGuardado.id,
        cuentaContableId: detalle.cuentaContableId,
        tipoMovimiento: detalle.tipoMovimiento,
        monto: detalle.monto,
        descripcion: detalle.descripcion,
      });

      // Actualizar saldo de la cuenta contable
      await this.actualizarSaldoCuenta(detalle.cuentaContableId, detalle.tipoMovimiento, detalle.monto);
    }

    return this.obtenerAsientoContable(asientoGuardado.id);
  }

  async obtenerAsientosContables(): Promise<AsientoContable[]> {
    return this.asientosRepository.find({
      relations: ['usuario', 'detalles', 'detalles.cuentaContable'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerAsientoContable(id: number): Promise<AsientoContable> {
    const asiento = await this.asientosRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.cuentaContable'],
    });

    if (!asiento) {
      throw new NotFoundException(`Asiento contable con ID ${id} no encontrado`);
    }

    return asiento;
  }

  async anularAsientoContable(id: number, usuarioId: number): Promise<AsientoContable> {
    const asiento = await this.obtenerAsientoContable(id);

    if (asiento.estado === EstadoAsientoContable.ANULADO) {
      throw new BadRequestException('El asiento ya está anulado');
    }

    // Revertir los movimientos en las cuentas
    for (const detalle of asiento.detalles) {
      const tipoReverso = detalle.tipoMovimiento === TipoMovimientoContable.DEBE 
        ? TipoMovimientoContable.HABER 
        : TipoMovimientoContable.DEBE;
      
      await this.actualizarSaldoCuenta(detalle.cuentaContableId, tipoReverso, detalle.monto);
    }

    asiento.estado = EstadoAsientoContable.ANULADO;
    asiento.fechaAnulacion = new Date();
    asiento.usuarioAnulacionId = usuarioId;

    return this.asientosRepository.save(asiento);
  }

  private async actualizarSaldoCuenta(
    cuentaId: number,
    tipoMovimiento: TipoMovimientoContable,
    monto: number,
  ): Promise<void> {
    const cuenta = await this.obtenerCuentaContable(cuentaId);
    
    if (tipoMovimiento === TipoMovimientoContable.DEBE) {
      cuenta.saldoActual += monto;
    } else {
      cuenta.saldoActual -= monto;
    }

    await this.cuentasRepository.save(cuenta);
  }

  async obtenerBalanceGeneral(): Promise<any> {
    const cuentas = await this.obtenerCuentasContables();
    
    const activos = cuentas.filter(c => c.tipo === TipoCuentaContable.ACTIVO);
    const pasivos = cuentas.filter(c => c.tipo === TipoCuentaContable.PASIVO);
    const patrimonio = cuentas.filter(c => c.tipo === TipoCuentaContable.PATRIMONIO);
    
    const totalActivos = activos.reduce((sum, c) => sum + c.saldoActual, 0);
    const totalPasivos = pasivos.reduce((sum, c) => sum + c.saldoActual, 0);
    const totalPatrimonio = patrimonio.reduce((sum, c) => sum + c.saldoActual, 0);

    return {
      activos,
      pasivos,
      patrimonio,
      totalActivos,
      totalPasivos,
      totalPatrimonio,
      diferencia: totalActivos - (totalPasivos + totalPatrimonio),
    };
  }

  async crearCuentasContablesBasicas(): Promise<void> {
    const cuentasBasicas = [
      { codigo: '1', nombre: 'ACTIVO', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '1.1', nombre: 'ACTIVO CORRIENTE', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '1.1.1', nombre: 'CAJA', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '1.1.2', nombre: 'BANCO', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '1.1.3', nombre: 'MERCADERÍAS', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '1.2', nombre: 'ACTIVO NO CORRIENTE', tipo: TipoCuentaContable.ACTIVO },
      { codigo: '2', nombre: 'PASIVO', tipo: TipoCuentaContable.PASIVO },
      { codigo: '2.1', nombre: 'PASIVO CORRIENTE', tipo: TipoCuentaContable.PASIVO },
      { codigo: '2.1.1', nombre: 'PROVEEDORES', tipo: TipoCuentaContable.PASIVO },
      { codigo: '3', nombre: 'PATRIMONIO NETO', tipo: TipoCuentaContable.PATRIMONIO },
      { codigo: '4', nombre: 'INGRESOS', tipo: TipoCuentaContable.INGRESO },
      { codigo: '4.1', nombre: 'VENTAS', tipo: TipoCuentaContable.INGRESO },
      { codigo: '5', nombre: 'EGRESOS', tipo: TipoCuentaContable.EGRESO },
      { codigo: '5.1', nombre: 'COSTO DE VENTAS', tipo: TipoCuentaContable.EGRESO },
    ];

    for (const cuentaData of cuentasBasicas) {
      const existingCuenta = await this.cuentasRepository.findOne({
        where: { codigo: cuentaData.codigo },
      });
      
      if (!existingCuenta) {
        await this.crearCuentaContable(
          cuentaData.codigo,
          cuentaData.nombre,
          cuentaData.tipo,
        );
      }
    }
  }
}
