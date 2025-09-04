import { CuentaCorriente } from './cuenta-corriente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare enum TipoMovimientoCuentaCorriente {
    DEBITO = "debito",
    CREDITO = "credito"
}
export declare enum ConceptoMovimientoCuentaCorriente {
    VENTA = "venta",
    PAGO = "pago",
    COMPRA = "compra",
    AJUSTE = "ajuste",
    INTERES = "interes",
    DESCUENTO = "descuento"
}
export declare class MovimientoCuentaCorriente {
    id: number;
    cuentaCorrienteId: number;
    cuentaCorriente: CuentaCorriente;
    tipo: TipoMovimientoCuentaCorriente;
    concepto: ConceptoMovimientoCuentaCorriente;
    monto: number;
    saldoAnterior: number;
    saldoNuevo: number;
    descripcion?: string;
    numeroComprobante?: string;
    fecha: Date;
    usuarioId: number;
    usuario: Usuario;
    creadoEn: Date;
}
