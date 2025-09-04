import { Repository } from 'typeorm';
import { Cliente, TipoCliente, EstadoCliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesService {
    private clientesRepository;
    constructor(clientesRepository: Repository<Cliente>);
    create(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(): Promise<Cliente[]>;
    findOne(id: number): Promise<Cliente>;
    findByTipo(tipo: TipoCliente): Promise<Cliente[]>;
    findByEstado(estado: EstadoCliente): Promise<Cliente[]>;
    findMorosos(): Promise<Cliente[]>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
    remove(id: number): Promise<void>;
    actualizarSaldo(id: number, nuevoSaldo: number): Promise<Cliente>;
    buscarPorNombre(nombre: string): Promise<Cliente[]>;
}
