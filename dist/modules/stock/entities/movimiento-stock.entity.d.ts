import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare enum TipoMovimientoStock {
    ENTRADA = "entrada",
    SALIDA = "salida",
    AJUSTE_POSITIVO = "ajuste_positivo",
    AJUSTE_NEGATIVO = "ajuste_negativo",
    TRANSFERENCIA_ENTRADA = "transferencia_entrada",
    TRANSFERENCIA_SALIDA = "transferencia_salida"
}
export declare enum ConceptoMovimientoStock {
    COMPRA = "compra",
    VENTA = "venta",
    DEVOLUCION_CLIENTE = "devolucion_cliente",
    DEVOLUCION_PROVEEDOR = "devolucion_proveedor",
    AJUSTE_INVENTARIO = "ajuste_inventario",
    ROTURA = "rotura",
    VENCIMIENTO = "vencimiento",
    TRANSFERENCIA = "transferencia",
    PRODUCCION = "produccion"
}
export declare class MovimientoStock {
    id: number;
    articuloId: number;
    articulo: Articulo;
    tipo: TipoMovimientoStock;
    concepto: ConceptoMovimientoStock;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    costoUnitario?: number;
    costoTotal?: number;
    observaciones?: string;
    numeroComprobante?: string;
    fecha: Date;
    usuarioId: number;
    usuario: Usuario;
    creadoEn: Date;
}
