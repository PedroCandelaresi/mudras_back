import { Repository } from 'typeorm';
import { Gasto } from './entities/gasto.entity';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CrearGastoDto } from './dto/crear-gasto.dto';
import { ActualizarGastoDto } from './dto/actualizar-gasto.dto';
import { CrearCategoriaGastoDto } from './dto/crear-categoria-gasto.dto';
export declare class GastosService {
    private gastoRepo;
    private categoriaRepo;
    constructor(gastoRepo: Repository<Gasto>, categoriaRepo: Repository<CategoriaGasto>);
    listar(desde?: string, hasta?: string, categoriaId?: number, proveedorId?: number): Promise<Gasto[]>;
    crear(input: CrearGastoDto): Promise<Gasto>;
    actualizar(input: ActualizarGastoDto): Promise<Gasto>;
    eliminar(id: number): Promise<boolean>;
    crearCategoria(input: CrearCategoriaGastoDto): Promise<CategoriaGasto>;
    listarCategorias(): Promise<CategoriaGasto[]>;
}
