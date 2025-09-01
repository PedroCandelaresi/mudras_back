import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, TipoCliente, EstadoCliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar si el email o CUIT ya existen
    if (createClienteDto.email || createClienteDto.cuit) {
      const existingCliente = await this.clientesRepository.findOne({
        where: [
          ...(createClienteDto.email ? [{ email: createClienteDto.email }] : []),
          ...(createClienteDto.cuit ? [{ cuit: createClienteDto.cuit }] : []),
        ],
      });

      if (existingCliente) {
        throw new ConflictException('El email o CUIT ya están en uso');
      }
    }

    const cliente = this.clientesRepository.create({
      ...createClienteDto,
      fechaNacimiento: createClienteDto.fechaNacimiento ? new Date(createClienteDto.fechaNacimiento) : undefined,
    });

    return this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find({
      relations: ['cuentasCorrientes', 'ventas'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
      relations: ['cuentasCorrientes', 'ventas'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async findByTipo(tipo: TipoCliente): Promise<Cliente[]> {
    return this.clientesRepository.find({
      where: { tipo },
      order: { nombre: 'ASC' },
    });
  }

  async findByEstado(estado: EstadoCliente): Promise<Cliente[]> {
    return this.clientesRepository.find({
      where: { estado },
      order: { nombre: 'ASC' },
    });
  }

  async findMorosos(): Promise<Cliente[]> {
    return this.clientesRepository.find({
      where: { estado: EstadoCliente.MOROSO },
      order: { saldoActual: 'DESC' },
    });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Verificar unicidad de email y CUIT si se están actualizando
    if (updateClienteDto.email || updateClienteDto.cuit) {
      const existingCliente = await this.clientesRepository.findOne({
        where: [
          ...(updateClienteDto.email ? [{ email: updateClienteDto.email }] : []),
          ...(updateClienteDto.cuit ? [{ cuit: updateClienteDto.cuit }] : []),
        ],
      });

      if (existingCliente && existingCliente.id !== id) {
        throw new ConflictException('El email o CUIT ya están en uso');
      }
    }

    Object.assign(cliente, {
      ...updateClienteDto,
      fechaNacimiento: updateClienteDto.fechaNacimiento ? new Date(updateClienteDto.fechaNacimiento) : cliente.fechaNacimiento,
    });

    return this.clientesRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clientesRepository.remove(cliente);
  }

  async actualizarSaldo(id: number, nuevoSaldo: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    cliente.saldoActual = nuevoSaldo;
    
    // Actualizar estado según el saldo
    if (nuevoSaldo > cliente.limiteCredito && cliente.limiteCredito > 0) {
      cliente.estado = EstadoCliente.MOROSO;
    } else if (cliente.estado === EstadoCliente.MOROSO && nuevoSaldo <= cliente.limiteCredito) {
      cliente.estado = EstadoCliente.ACTIVO;
    }

    return this.clientesRepository.save(cliente);
  }

  async buscarPorNombre(nombre: string): Promise<Cliente[]> {
    return this.clientesRepository
      .createQueryBuilder('cliente')
      .where('cliente.nombre LIKE :nombre OR cliente.apellido LIKE :nombre OR cliente.razonSocial LIKE :nombre', 
        { nombre: `%${nombre}%` })
      .orderBy('cliente.nombre', 'ASC')
      .getMany();
  }
}
