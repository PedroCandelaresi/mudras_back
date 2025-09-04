import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
export declare class ArticulosService {
    private articulosRepository;
    constructor(articulosRepository: Repository<Articulo>);
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
    }>;
    buscarPorCodigoBarras(codigoBarras: string): Promise<Articulo>;
    actualizarStock(id: number, nuevoStock: number): Promise<Articulo>;
}
