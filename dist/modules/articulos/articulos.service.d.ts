import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
import { Rubro } from '../rubros/entities/rubro.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';
export declare class ArticulosService {
    private articulosRepository;
    private rubrosRepository;
    private stockPuntosRepository;
    constructor(articulosRepository: Repository<Articulo>, rubrosRepository: Repository<Rubro>, stockPuntosRepository: Repository<StockPuntoMudras>);
    private readonly logger;
    private readonly stockSumSubquery;
    private parseNullableDate;
    private hydrateTotalStock;
    findAll(): Promise<Articulo[]>;
    findOne(id: number): Promise<Articulo>;
    findByCodigo(codigo: string): Promise<Articulo>;
    findByRubro(rubro: string): Promise<Articulo[]>;
    findByDescripcion(descripcion: string): Promise<Articulo[]>;
    findByProveedor(idProveedor: number): Promise<Articulo[]>;
    findConStock(): Promise<Articulo[]>;
    findSinStock(): Promise<Articulo[]>;
    findStockBajo(): Promise<Articulo[]>;
    findEnPromocion(): Promise<Articulo[]>;
    crear(crearArticuloDto: CrearArticuloDto): Promise<Articulo>;
    actualizar(actualizarArticuloDto: ActualizarArticuloDto): Promise<Articulo>;
    eliminar(id: number): Promise<boolean>;
    buscarConFiltros(filtros: FiltrosArticuloDto): Promise<{
        articulos: Articulo[];
        total: number;
    }>;
    obtenerEstadisticas(): Promise<{
        totalArticulos: number;
        articulosActivos: number;
        articulosConStock: number;
        articulosSinStock: number;
        articulosStockBajo: number;
        articulosEnPromocion: number;
        articulosPublicadosEnTienda: number;
        valorTotalStock: number;
        totalUnidades: number;
    }>;
    buscarPorCodigoBarras(codigoBarras: string): Promise<Articulo>;
}
