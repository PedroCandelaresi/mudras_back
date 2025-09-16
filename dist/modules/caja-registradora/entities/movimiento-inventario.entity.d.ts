import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PuestoVenta } from './puesto-venta.entity';
import { VentaCaja } from './venta-caja.entity';
export declare enum TipoMovimientoInventario {
    VENTA = "venta",
    DEVOLUCION = "devolucion",
    AJUSTE_POSITIVO = "ajuste_positivo",
    AJUSTE_NEGATIVO = "ajuste_negativo",
    TRANSFERENCIA_ENTRADA = "transferencia_entrada",
    TRANSFERENCIA_SALIDA = "transferencia_salida",
    COMPRA = "compra",
    ROTURA = "rotura",
    VENCIMIENTO = "vencimiento",
    INVENTARIO_INICIAL = "inventario_inicial"
}
export declare class MovimientoInventario {
    id: number;
    articuloId: number;
    articulo: Articulo;
    puestoVentaId?: number;
    puestoVenta?: PuestoVenta;
    tipoMovimiento: TipoMovimientoInventario;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    costoUnitario?: number;
    precioVenta?: number;
    observaciones?: string;
    numeroComprobante?: string;
    ventaCajaId?: number;
    ventaCaja?: VentaCaja;
    fecha: Date;
    usuarioId: number;
    usuario: Usuario;
    creadoEn: Date;
}
