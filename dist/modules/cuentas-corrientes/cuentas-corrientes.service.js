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
exports.CuentasCorrientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cuenta_corriente_entity_1 = require("./entities/cuenta-corriente.entity");
const movimiento_cuenta_corriente_entity_1 = require("./entities/movimiento-cuenta-corriente.entity");
let CuentasCorrientesService = class CuentasCorrientesService {
    constructor(cuentasCorrientesRepository, movimientosRepository) {
        this.cuentasCorrientesRepository = cuentasCorrientesRepository;
        this.movimientosRepository = movimientosRepository;
    }
    async crearCuentaCliente(clienteId, usuarioId, limiteCredito = 0) {
        const cuenta = this.cuentasCorrientesRepository.create({
            tipo: cuenta_corriente_entity_1.TipoCuentaCorriente.CLIENTE,
            clienteId,
            usuarioId,
            limiteCredito,
            saldoActual: 0,
        });
        return this.cuentasCorrientesRepository.save(cuenta);
    }
    async crearCuentaProveedor(proveedorId, usuarioId, limiteCredito = 0) {
        const cuenta = this.cuentasCorrientesRepository.create({
            tipo: cuenta_corriente_entity_1.TipoCuentaCorriente.PROVEEDOR,
            proveedorId,
            usuarioId,
            limiteCredito,
            saldoActual: 0,
        });
        return this.cuentasCorrientesRepository.save(cuenta);
    }
    async findAll() {
        return this.cuentasCorrientesRepository.find({
            relations: ['cliente', 'proveedor', 'usuario', 'movimientos'],
            order: { creadoEn: 'DESC' },
        });
    }
    async findOne(id) {
        const cuenta = await this.cuentasCorrientesRepository.findOne({
            where: { id },
            relations: ['cliente', 'proveedor', 'usuario', 'movimientos'],
        });
        if (!cuenta) {
            throw new common_1.NotFoundException(`Cuenta corriente con ID ${id} no encontrada`);
        }
        return cuenta;
    }
    async findByCliente(clienteId) {
        return this.cuentasCorrientesRepository.find({
            where: { clienteId },
            relations: ['movimientos'],
            order: { creadoEn: 'DESC' },
        });
    }
    async findByProveedor(proveedorId) {
        return this.cuentasCorrientesRepository.find({
            where: { proveedorId },
            relations: ['movimientos'],
            order: { creadoEn: 'DESC' },
        });
    }
    async registrarMovimiento(cuentaId, tipo, concepto, monto, descripcion, usuarioId, numeroComprobante) {
        const cuenta = await this.findOne(cuentaId);
        const saldoAnterior = cuenta.saldoActual;
        let saldoNuevo;
        if (tipo === movimiento_cuenta_corriente_entity_1.TipoMovimientoCuentaCorriente.DEBITO) {
            saldoNuevo = saldoAnterior + monto;
        }
        else {
            saldoNuevo = saldoAnterior - monto;
        }
        if (cuenta.tipo === cuenta_corriente_entity_1.TipoCuentaCorriente.CLIENTE && saldoNuevo > cuenta.limiteCredito && cuenta.limiteCredito > 0) {
            throw new common_1.BadRequestException('El movimiento excede el límite de crédito');
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
        cuenta.saldoActual = saldoNuevo;
        await this.cuentasCorrientesRepository.save(cuenta);
        return this.movimientosRepository.save(movimiento);
    }
    async obtenerSaldo(cuentaId) {
        const cuenta = await this.findOne(cuentaId);
        return cuenta.saldoActual;
    }
    async obtenerMovimientos(cuentaId) {
        return this.movimientosRepository.find({
            where: { cuentaCorrienteId: cuentaId },
            relations: ['usuario'],
            order: { creadoEn: 'DESC' },
        });
    }
    async cerrarCuenta(id) {
        const cuenta = await this.findOne(id);
        if (cuenta.saldoActual !== 0) {
            throw new common_1.BadRequestException('No se puede cerrar una cuenta con saldo pendiente');
        }
        cuenta.estado = cuenta_corriente_entity_1.EstadoCuentaCorriente.CERRADA;
        return this.cuentasCorrientesRepository.save(cuenta);
    }
    async suspenderCuenta(id) {
        const cuenta = await this.findOne(id);
        cuenta.estado = cuenta_corriente_entity_1.EstadoCuentaCorriente.SUSPENDIDA;
        return this.cuentasCorrientesRepository.save(cuenta);
    }
    async activarCuenta(id) {
        const cuenta = await this.findOne(id);
        cuenta.estado = cuenta_corriente_entity_1.EstadoCuentaCorriente.ACTIVA;
        return this.cuentasCorrientesRepository.save(cuenta);
    }
};
exports.CuentasCorrientesService = CuentasCorrientesService;
exports.CuentasCorrientesService = CuentasCorrientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cuenta_corriente_entity_1.CuentaCorriente)),
    __param(1, (0, typeorm_1.InjectRepository)(movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CuentasCorrientesService);
//# sourceMappingURL=cuentas-corrientes.service.js.map