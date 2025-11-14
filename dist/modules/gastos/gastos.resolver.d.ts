import { GastosService } from './gastos.service';
import { Gasto } from './entities/gasto.entity';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CrearGastoDto } from './dto/crear-gasto.dto';
import { ActualizarGastoDto } from './dto/actualizar-gasto.dto';
import { CrearCategoriaGastoDto } from './dto/crear-categoria-gasto.dto';
export declare class GastosResolver {
    private readonly service;
    constructor(service: GastosService);
    gastos(desde?: string, hasta?: string, categoriaId?: number, proveedorId?: number): Promise<Gasto[]>;
    categoriasGasto(): Promise<CategoriaGasto[]>;
    crearGasto(input: CrearGastoDto): Promise<Gasto>;
    actualizarGasto(input: ActualizarGastoDto): Promise<Gasto>;
    eliminarGasto(id: number): Promise<boolean>;
    crearCategoriaGasto(input: CrearCategoriaGastoDto): Promise<CategoriaGasto>;
}
