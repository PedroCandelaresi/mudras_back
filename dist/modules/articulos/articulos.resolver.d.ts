import { ArticulosService } from './articulos.service';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
export declare class ArticulosResolver {
    private readonly articulosService;
    constructor(articulosService: ArticulosService);
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
    crearArticulo(crearArticuloDto: CrearArticuloDto): Promise<Articulo>;
    actualizarArticulo(actualizarArticuloDto: ActualizarArticuloDto): Promise<Articulo>;
    eliminarArticulo(id: number): Promise<boolean>;
    buscarArticulos(filtros: FiltrosArticuloDto): Promise<{
        articulos: Articulo[];
        total: number;
    }>;
    estadisticasArticulos(): Promise<{
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
    articuloPorCodigoBarras(codigoBarras: string): Promise<Articulo>;
}
