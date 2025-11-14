import { Articulo } from '../../articulos/entities/articulo.entity';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { PuntoMudras } from '../../puntos-mudras/entities/punto-mudras.entity';
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
    puntoMudrasId?: number | null;
    puntoMudras?: PuntoMudras | null;
    tipoMovimiento: TipoMovimientoInventario;
    cantidad: number;
    precioVenta?: number;
    observaciones?: string;
    numeroComprobante?: string;
    ventaCajaId?: number;
    ventaCaja?: VentaCaja;
    fecha: Date;
    usuarioAuthId: string;
    usuarioAuth: UserAuth;
    creadoEn: Date;
}
