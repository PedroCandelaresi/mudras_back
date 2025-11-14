import { Cliente } from '../../clientes/entities/cliente.entity';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { DetalleVenta } from './detalle-venta.entity';
export declare enum EstadoVenta {
    PENDIENTE = "pendiente",
    CONFIRMADA = "confirmada",
    ENTREGADA = "entregada",
    CANCELADA = "cancelada"
}
export declare enum TipoPago {
    EFECTIVO = "efectivo",
    TARJETA_DEBITO = "tarjeta_debito",
    TARJETA_CREDITO = "tarjeta_credito",
    TRANSFERENCIA = "transferencia",
    CUENTA_CORRIENTE = "cuenta_corriente",
    MIXTO = "mixto"
}
export declare class Venta {
    id: number;
    numero: string;
    fecha: Date;
    clienteId: number;
    cliente: Cliente;
    usuarioAuthId: string;
    usuarioAuth: UserAuth;
    estado: EstadoVenta;
    tipoPago: TipoPago;
    subtotal: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    total: number;
    montoEfectivo: number;
    montoTarjeta: number;
    montoTransferencia: number;
    montoCuentaCorriente: number;
    cambio: number;
    observaciones?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    detalles?: DetalleVenta[];
}
