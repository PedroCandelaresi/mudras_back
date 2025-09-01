import { ArticulosService } from './articulos.service';
import { Articulo } from './entities/articulo.entity';
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
}
