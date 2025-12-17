import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { TransferirStockInput, AjustarStockInput } from './dto/transferir-stock.dto';
import { Articulo } from '../articulos/entities/articulo.entity';
export declare class RubroInfo {
    id: number;
    nombre: string;
}
export declare class RelacionProveedorRubro {
    id: number;
    proveedorId: number;
    proveedorNombre: string;
    rubroNombre: string;
    cantidadArticulos: number;
}
export declare class EstadisticasProveedorRubro {
    totalRelaciones: number;
    proveedoresUnicos: number;
    rubrosUnicos: number;
    totalArticulos: number;
}
export declare class ArticuloConStockPuntoMudras {
    id: number;
    nombre: string;
    codigo: string;
    precio: number;
    stockAsignado: number;
    stockTotal: number;
    rubro?: RubroInfo;
    articulo?: Articulo;
}
export declare class EstadisticasPuntosMudras {
    totalPuntos: number;
    puntosVenta: number;
    depositos: number;
    puntosActivos: number;
    articulosConStock: number;
    valorTotalInventario: number;
    movimientosHoy: number;
}
export declare class ProveedorBasico {
    id: number;
    nombre: string;
    codigo?: number;
}
export declare class RubroBasico {
    rubro: string;
}
export declare class ArticuloFiltrado {
    id: number;
    nombre: string;
    codigo: string;
    precio: number;
    stockTotal: number;
    stockAsignado: number;
    stockDisponible: number;
    stockEnDestino: number;
    rubro: string;
    proveedor: string;
}
export declare class PuntosMudrasResolver {
    private readonly puntosMudrasService;
    constructor(puntosMudrasService: PuntosMudrasService);
    obtenerPuntosMudras(): Promise<PuntoMudras[]>;
    obtenerPuntoMudrasPorId(id: number): Promise<PuntoMudras>;
    obtenerEstadisticasPuntosMudras(): Promise<EstadisticasPuntosMudras>;
    obtenerStockPuntoMudras(puntoMudrasId: number): Promise<ArticuloConStockPuntoMudras[]>;
    obtenerProveedoresConStock(): Promise<ProveedorBasico[]>;
    obtenerRubrosPorProveedor(proveedorId: string): Promise<RubroBasico[]>;
    buscarArticulosParaAsignacion(proveedorId?: number, rubro?: string, busqueda?: string, destinoId?: number): Promise<ArticuloFiltrado[]>;
    crearPuntoMudras(input: CrearPuntoMudrasDto): Promise<PuntoMudras>;
    actualizarPuntoMudras(input: ActualizarPuntoMudrasDto): Promise<PuntoMudras>;
    eliminarPuntoMudras(id: number): Promise<boolean>;
    modificarStockPunto(puntoMudrasId: number, articuloId: number, nuevaCantidad: number): Promise<boolean>;
    transferirStock(input: TransferirStockInput): Promise<boolean>;
    ajustarStock(input: AjustarStockInput): Promise<boolean>;
    obtenerRelacionesProveedorRubro(): Promise<RelacionProveedorRubro[]>;
    obtenerEstadisticasProveedorRubro(): Promise<EstadisticasProveedorRubro>;
    obtenerMatrizStock(busqueda?: string, rubro?: string, proveedorId?: number): Promise<MatrizStockItem[]>;
}
export declare class StockPunto {
    puntoId: number;
    puntoNombre: string;
    cantidad: number;
}
export declare class MatrizStockItem {
    id: number;
    codigo: string;
    nombre: string;
    rubro?: string;
    stockTotal: number;
    stockPorPunto: StockPunto[];
}
