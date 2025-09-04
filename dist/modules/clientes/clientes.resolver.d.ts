import { ClientesService } from './clientes.service';
import { Cliente, TipoCliente, EstadoCliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesResolver {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    createCliente(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(): Promise<Cliente[]>;
    findOne(id: number): Promise<Cliente>;
    findByTipo(tipo: TipoCliente): Promise<Cliente[]>;
    findByEstado(estado: EstadoCliente): Promise<Cliente[]>;
    findMorosos(): Promise<Cliente[]>;
    buscarPorNombre(nombre: string): Promise<Cliente[]>;
    updateCliente(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
    actualizarSaldoCliente(id: number, nuevoSaldo: number): Promise<Cliente>;
    removeCliente(id: number): Promise<boolean>;
}
