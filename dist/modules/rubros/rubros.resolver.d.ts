import { RubrosService } from './rubros.service';
import { Rubro } from './entities/rubro.entity';
export declare class RubroConEstadisticas {
    id: number;
    nombre: string;
    codigo?: string;
    porcentajeRecargo?: number;
    porcentajeDescuento?: number;
    cantidadArticulos: number;
    cantidadProveedores: number;
}
export declare class RubrosResponse {
    rubros: RubroConEstadisticas[];
    total: number;
}
export declare class RubrosResolver {
    private readonly rubrosService;
    constructor(rubrosService: RubrosService);
    findAll(pagina: number, limite: number, busqueda?: string): Promise<{
        rubros: any[];
        total: number;
    }>;
    obtenerTodosRubros(): Promise<any[]>;
    findOne(id: number): Promise<Rubro>;
    findByNombre(rubro: string): Promise<Rubro>;
    crearRubro(nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro>;
    actualizarRubro(id: number, nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro>;
    eliminarRubro(id: number): Promise<boolean>;
    getProveedoresPorRubro(rubroId: number): Promise<any[]>;
    getArticulosPorRubro(rubroId: number, filtro?: string, offset?: number, limit?: number): Promise<{
        articulos: any[];
        total: number;
    }>;
    eliminarProveedorDeRubro(proveedorId: number, rubroNombre: string): Promise<boolean>;
    eliminarArticuloDeRubro(articuloId: number): Promise<boolean>;
    eliminarArticulosDeRubro(articuloIds: number[]): Promise<boolean>;
}
export declare class ProveedorRubro {
    id: number;
    nombre: string;
    codigo?: string;
    email?: string;
    telefono?: string;
}
export declare class ArticuloRubro {
    id: number;
    codigo: string;
    descripcion: string;
    precio: number;
    stock: number;
    proveedor?: ProveedorRubro;
}
export declare class ArticulosPorRubroResponse {
    articulos: ArticuloRubro[];
    total: number;
}
