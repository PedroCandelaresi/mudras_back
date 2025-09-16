import { Repository, DataSource } from 'typeorm';
import { VentaCaja } from '../entities/venta-caja.entity';
import { DetalleVentaCaja } from '../entities/detalle-venta-caja.entity';
import { PagoCaja } from '../entities/pago-caja.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { PuestoVenta } from '../entities/puesto-venta.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { CrearVentaCajaInput } from '../dto/crear-venta-caja.dto';
import { BuscarArticuloInput, ArticuloConStock } from '../dto/buscar-articulo.dto';
import { FiltrosHistorialInput, HistorialVentasResponse } from '../dto/historial-ventas.dto';
export declare class CajaRegistradoraService {
    private ventaCajaRepository;
    private detalleVentaCajaRepository;
    private pagoCajaRepository;
    private movimientoInventarioRepository;
    private puestoVentaRepository;
    private articuloRepository;
    private dataSource;
    constructor(ventaCajaRepository: Repository<VentaCaja>, detalleVentaCajaRepository: Repository<DetalleVentaCaja>, pagoCajaRepository: Repository<PagoCaja>, movimientoInventarioRepository: Repository<MovimientoInventario>, puestoVentaRepository: Repository<PuestoVenta>, articuloRepository: Repository<Articulo>, dataSource: DataSource);
    buscarArticulos(input: BuscarArticuloInput): Promise<ArticuloConStock[]>;
    crearVenta(input: CrearVentaCajaInput, usuarioId: number): Promise<VentaCaja>;
    obtenerHistorialVentas(filtros: FiltrosHistorialInput): Promise<HistorialVentasResponse>;
    private calcularStockDisponible;
    private crearMovimientoInventario;
    obtenerPuestosVenta(): Promise<PuestoVenta[]>;
    obtenerDetalleVenta(id: number): Promise<VentaCaja | null>;
    cancelarVenta(id: number, usuarioId?: number, motivo?: string): Promise<VentaCaja>;
    procesarDevolucion(ventaOriginalId: number, articulosDevolver: Array<{
        articuloId: number;
        cantidad: number;
    }>, usuarioId?: number, motivo?: string): Promise<VentaCaja>;
    private generarNumeroVenta;
    private generarNumeroDevolucion;
}
