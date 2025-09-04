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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_1 = require("./entities/cliente.entity");
let ClientesService = class ClientesService {
    constructor(clientesRepository) {
        this.clientesRepository = clientesRepository;
    }
    async create(createClienteDto) {
        if (createClienteDto.email || createClienteDto.cuit) {
            const existingCliente = await this.clientesRepository.findOne({
                where: [
                    ...(createClienteDto.email ? [{ email: createClienteDto.email }] : []),
                    ...(createClienteDto.cuit ? [{ cuit: createClienteDto.cuit }] : []),
                ],
            });
            if (existingCliente) {
                throw new common_1.ConflictException('El email o CUIT ya están en uso');
            }
        }
        const cliente = this.clientesRepository.create({
            ...createClienteDto,
            fechaNacimiento: createClienteDto.fechaNacimiento ? new Date(createClienteDto.fechaNacimiento) : undefined,
        });
        return this.clientesRepository.save(cliente);
    }
    async findAll() {
        return this.clientesRepository.find({
            relations: ['cuentasCorrientes', 'ventas'],
            order: { creadoEn: 'DESC' },
        });
    }
    async findOne(id) {
        const cliente = await this.clientesRepository.findOne({
            where: { id },
            relations: ['cuentasCorrientes', 'ventas'],
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return cliente;
    }
    async findByTipo(tipo) {
        return this.clientesRepository.find({
            where: { tipo },
            order: { nombre: 'ASC' },
        });
    }
    async findByEstado(estado) {
        return this.clientesRepository.find({
            where: { estado },
            order: { nombre: 'ASC' },
        });
    }
    async findMorosos() {
        return this.clientesRepository.find({
            where: { estado: cliente_entity_1.EstadoCliente.MOROSO },
            order: { saldoActual: 'DESC' },
        });
    }
    async update(id, updateClienteDto) {
        const cliente = await this.findOne(id);
        if (updateClienteDto.email || updateClienteDto.cuit) {
            const existingCliente = await this.clientesRepository.findOne({
                where: [
                    ...(updateClienteDto.email ? [{ email: updateClienteDto.email }] : []),
                    ...(updateClienteDto.cuit ? [{ cuit: updateClienteDto.cuit }] : []),
                ],
            });
            if (existingCliente && existingCliente.id !== id) {
                throw new common_1.ConflictException('El email o CUIT ya están en uso');
            }
        }
        Object.assign(cliente, {
            ...updateClienteDto,
            fechaNacimiento: updateClienteDto.fechaNacimiento ? new Date(updateClienteDto.fechaNacimiento) : cliente.fechaNacimiento,
        });
        return this.clientesRepository.save(cliente);
    }
    async remove(id) {
        const cliente = await this.findOne(id);
        await this.clientesRepository.remove(cliente);
    }
    async actualizarSaldo(id, nuevoSaldo) {
        const cliente = await this.findOne(id);
        cliente.saldoActual = nuevoSaldo;
        if (nuevoSaldo > cliente.limiteCredito && cliente.limiteCredito > 0) {
            cliente.estado = cliente_entity_1.EstadoCliente.MOROSO;
        }
        else if (cliente.estado === cliente_entity_1.EstadoCliente.MOROSO && nuevoSaldo <= cliente.limiteCredito) {
            cliente.estado = cliente_entity_1.EstadoCliente.ACTIVO;
        }
        return this.clientesRepository.save(cliente);
    }
    async buscarPorNombre(nombre) {
        return this.clientesRepository
            .createQueryBuilder('cliente')
            .where('cliente.nombre LIKE :nombre OR cliente.apellido LIKE :nombre OR cliente.razonSocial LIKE :nombre', { nombre: `%${nombre}%` })
            .orderBy('cliente.nombre', 'ASC')
            .getMany();
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map