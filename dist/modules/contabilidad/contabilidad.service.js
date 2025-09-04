"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContabilidadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asiento_contable_entity_1 = require("./entities/asiento-contable.entity");
const detalle_asiento_contable_entity_1 = require("./entities/detalle-asiento-contable.entity");
const cuenta_contable_entity_1 = require("./entities/cuenta-contable.entity");
let ContabilidadService = class ContabilidadService {
    constructor(asientosRepository, detallesRepository, cuentasRepository) {
        this.asientosRepository = asientosRepository;
        this.detallesRepository = detallesRepository;
        this.cuentasRepository = cuentasRepository;
    }
    async crearCuentaContable(codigo, nombre, tipo, cuentaPadreId) {
        const existingCuenta = await this.cuentasRepository.findOne({
            where: { codigo },
        });
        if (existingCuenta) {
            throw new common_1.BadRequestException('Ya existe una cuenta con ese código');
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
    async obtenerCuentasContables() {
        return this.cuentasRepository.find({
            relations: ['cuentaPadre', 'cuentasHijas', 'detallesAsientos'],
            order: { codigo: 'ASC' },
        });
    }
    async obtenerCuentaContable(id) {
        const cuenta = await this.cuentasRepository.findOne({
            where: { id },
            relations: ['cuentaPadre', 'cuentasHijas', 'detallesAsientos'],
        });
        if (!cuenta) {
            throw new common_1.NotFoundException(`Cuenta contable con ID ${id} no encontrada`);
        }
        return cuenta;
    }
    async crearAsientoContable(tipo, descripcion, usuarioId, detalles) {
        const totalDebe = detalles
            .filter(d => d.tipoMovimiento === detalle_asiento_contable_entity_1.TipoMovimientoContable.DEBE)
            .reduce((sum, d) => sum + d.monto, 0);
        const totalHaber = detalles
            .filter(d => d.tipoMovimiento === detalle_asiento_contable_entity_1.TipoMovimientoContable.HABER)
            .reduce((sum, d) => sum + d.monto, 0);
        if (Math.abs(totalDebe - totalHaber) > 0.01) {
            throw new common_1.BadRequestException('El asiento contable debe estar balanceado (Debe = Haber)');
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
        for (const detalle of detalles) {
            await this.detallesRepository.save({
                asientoContableId: asientoGuardado.id,
                cuentaContableId: detalle.cuentaContableId,
                tipoMovimiento: detalle.tipoMovimiento,
                monto: detalle.monto,
                descripcion: detalle.descripcion,
            });
            await this.actualizarSaldoCuenta(detalle.cuentaContableId, detalle.tipoMovimiento, detalle.monto);
        }
        return this.obtenerAsientoContable(asientoGuardado.id);
    }
    async obtenerAsientosContables() {
        return this.asientosRepository.find({
            relations: ['usuario', 'detalles', 'detalles.cuentaContable'],
            order: { creadoEn: 'DESC' },
        });
    }
    async obtenerAsientoContable(id) {
        const asiento = await this.asientosRepository.findOne({
            where: { id },
            relations: ['usuario', 'detalles', 'detalles.cuentaContable'],
        });
        if (!asiento) {
            throw new common_1.NotFoundException(`Asiento contable con ID ${id} no encontrado`);
        }
        return asiento;
    }
    async anularAsientoContable(id, usuarioId) {
        const asiento = await this.obtenerAsientoContable(id);
        if (asiento.estado === asiento_contable_entity_1.EstadoAsientoContable.ANULADO) {
            throw new common_1.BadRequestException('El asiento ya está anulado');
        }
        for (const detalle of asiento.detalles) {
            const tipoReverso = detalle.tipoMovimiento === detalle_asiento_contable_entity_1.TipoMovimientoContable.DEBE
                ? detalle_asiento_contable_entity_1.TipoMovimientoContable.HABER
                : detalle_asiento_contable_entity_1.TipoMovimientoContable.DEBE;
            await this.actualizarSaldoCuenta(detalle.cuentaContableId, tipoReverso, detalle.monto);
        }
        asiento.estado = asiento_contable_entity_1.EstadoAsientoContable.ANULADO;
        asiento.fechaAnulacion = new Date();
        asiento.usuarioAnulacionId = usuarioId;
        return this.asientosRepository.save(asiento);
    }
    async actualizarSaldoCuenta(cuentaId, tipoMovimiento, monto) {
        const cuenta = await this.obtenerCuentaContable(cuentaId);
        if (tipoMovimiento === detalle_asiento_contable_entity_1.TipoMovimientoContable.DEBE) {
            cuenta.saldoActual += monto;
        }
        else {
            cuenta.saldoActual -= monto;
        }
        await this.cuentasRepository.save(cuenta);
    }
    async obtenerBalanceGeneral() {
        const cuentas = await this.obtenerCuentasContables();
        const activos = cuentas.filter(c => c.tipo === cuenta_contable_entity_1.TipoCuentaContable.ACTIVO);
        const pasivos = cuentas.filter(c => c.tipo === cuenta_contable_entity_1.TipoCuentaContable.PASIVO);
        const patrimonio = cuentas.filter(c => c.tipo === cuenta_contable_entity_1.TipoCuentaContable.PATRIMONIO);
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
    async crearCuentasContablesBasicas() {
        const cuentasBasicas = [
            { codigo: '1', nombre: 'ACTIVO', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '1.1', nombre: 'ACTIVO CORRIENTE', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '1.1.1', nombre: 'CAJA', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '1.1.2', nombre: 'BANCO', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '1.1.3', nombre: 'MERCADERÍAS', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '1.2', nombre: 'ACTIVO NO CORRIENTE', tipo: cuenta_contable_entity_1.TipoCuentaContable.ACTIVO },
            { codigo: '2', nombre: 'PASIVO', tipo: cuenta_contable_entity_1.TipoCuentaContable.PASIVO },
            { codigo: '2.1', nombre: 'PASIVO CORRIENTE', tipo: cuenta_contable_entity_1.TipoCuentaContable.PASIVO },
            { codigo: '2.1.1', nombre: 'PROVEEDORES', tipo: cuenta_contable_entity_1.TipoCuentaContable.PASIVO },
            { codigo: '3', nombre: 'PATRIMONIO NETO', tipo: cuenta_contable_entity_1.TipoCuentaContable.PATRIMONIO },
            { codigo: '4', nombre: 'INGRESOS', tipo: cuenta_contable_entity_1.TipoCuentaContable.INGRESO },
            { codigo: '4.1', nombre: 'VENTAS', tipo: cuenta_contable_entity_1.TipoCuentaContable.INGRESO },
            { codigo: '5', nombre: 'EGRESOS', tipo: cuenta_contable_entity_1.TipoCuentaContable.EGRESO },
            { codigo: '5.1', nombre: 'COSTO DE VENTAS', tipo: cuenta_contable_entity_1.TipoCuentaContable.EGRESO },
        ];
        for (const cuentaData of cuentasBasicas) {
            const existingCuenta = await this.cuentasRepository.findOne({
                where: { codigo: cuentaData.codigo },
            });
            if (!existingCuenta) {
                await this.crearCuentaContable(cuentaData.codigo, cuentaData.nombre, cuentaData.tipo);
            }
        }
    }
};
exports.ContabilidadService = ContabilidadService;
exports.ContabilidadService = ContabilidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asiento_contable_entity_1.AsientoContable)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_asiento_contable_entity_1.DetalleAsientoContable)),
    __param(2, (0, typeorm_1.InjectRepository)(cuenta_contable_entity_1.CuentaContable)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ContabilidadService);
//# sourceMappingURL=contabilidad.service.js.map