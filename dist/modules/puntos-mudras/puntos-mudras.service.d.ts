import { Repository, DataSource } from 'typeorm';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { StockPuntoMudras } from './entities/stock-punto-mudras.entity';
import { MovimientoStockPunto } from './entities/movimiento-stock-punto.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
import { FiltrosPuntosMudrasInput, FiltrosStockInput, FiltrosMovimientosInput } from './dto/filtros-puntos-mudras.dto';
import { TransferirStockInput, AjustarStockInput } from './dto/transferir-stock.dto';
export declare class PuntosMudrasService {
    private puntosMudrasRepository;
    private stockRepository;
    private movimientosRepository;
    private articulosRepository;
    private dataSource;
    constructor(puntosMudrasRepository: Repository<PuntoMudras>, stockRepository: Repository<StockPuntoMudras>, movimientosRepository: Repository<MovimientoStockPunto>, articulosRepository: Repository<Articulo>, dataSource: DataSource);
    crear(input: CrearPuntoMudrasDto): Promise<PuntoMudras>;
    obtenerTodos(filtros?: FiltrosPuntosMudrasInput): Promise<{
        puntos: PuntoMudras[];
        total: number;
    }>;
    obtenerPorId(id: number): Promise<PuntoMudras>;
    actualizar(input: ActualizarPuntoMudrasDto): Promise<PuntoMudras>;
    eliminar(id: number): Promise<boolean>;
    obtenerArticulosConStockPunto(puntoMudrasId: number): Promise<any[]>;
    obtenerStockSinAsignar(): Promise<any[]>;
    obtenerProveedores(): Promise<any[]>;
    obtenerRubrosPorProveedor(proveedorId: number): Promise<any[]>;
    buscarArticulosConFiltros(proveedorId?: number, rubro?: string, busqueda?: string): Promise<any[]>;
    modificarStockPunto(puntoMudrasId: number, articuloId: number, nuevaCantidad: number): Promise<boolean>;
    obtenerRelacionesProveedorRubro(): Promise<any[]>;
    obtenerEstadisticasProveedorRubro(): Promise<any>;
    obtenerStockPunto(puntoMudrasId: number, filtros?: FiltrosStockInput): Promise<{
        stock: StockPuntoMudras[];
        total: number;
    }>;
    ajustarStock(input: AjustarStockInput): Promise<StockPuntoMudras>;
    transferirStock(input: TransferirStockInput): Promise<MovimientoStockPunto>;
    obtenerMovimientos(puntoMudrasId?: number, filtros?: FiltrosMovimientosInput): Promise<{
        movimientos: MovimientoStockPunto[];
        total: number;
    }>;
    obtenerEstadisticas(): Promise<any>;
    private inicializarStockPunto;
    private calcularEstadisticasPunto;
    private adjuntarDetallesArticulo;
}
