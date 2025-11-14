import { CajaRegistradoraService } from '../services/caja-registradora.service';
import { AfipService } from '../services/afip.service';
import { VentaCaja } from '../entities/venta-caja.entity';
import { ComprobanteAfip } from '../entities/comprobante-afip.entity';
import { CrearVentaCajaInput } from '../dto/crear-venta-caja.dto';
import { BuscarArticuloInput, ArticuloConStock } from '../dto/buscar-articulo.dto';
import { FiltrosHistorialInput, HistorialVentasResponse } from '../dto/historial-ventas.dto';
export declare class CajaRegistradoraResolver {
    private readonly cajaRegistradoraService;
    private readonly afipService;
    constructor(cajaRegistradoraService: CajaRegistradoraService, afipService: AfipService);
    buscarArticulosCaja(input: BuscarArticuloInput): Promise<ArticuloConStock[]>;
    obtenerHistorialVentas(filtros: FiltrosHistorialInput): Promise<HistorialVentasResponse>;
    obtenerDetalleVenta(id: number): Promise<VentaCaja | null>;
    crearVentaCaja(input: CrearVentaCajaInput, usuario: any): Promise<VentaCaja>;
    cancelarVentaCaja(id: number, motivo?: string, usuario?: any): Promise<VentaCaja>;
    procesarDevolucion(ventaOriginalId: number, articulosDevolver: string, motivo?: string, usuario?: any): Promise<VentaCaja>;
    obtenerComprobantesAfip(ventaId: number): Promise<ComprobanteAfip[]>;
    reintentarEmisionAfip(comprobanteId: number): Promise<ComprobanteAfip>;
    obtenerComprobantesPendientes(): Promise<ComprobanteAfip[]>;
}
