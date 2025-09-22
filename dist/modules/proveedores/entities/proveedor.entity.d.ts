import { Articulo } from '../../articulos/entities/articulo.entity';
import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';
export declare enum EstadoProveedor {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    SUSPENDIDO = "suspendido"
}
export declare class Proveedor {
    IdProveedor: number;
    Codigo: number;
    Nombre: string;
    Contacto: string;
    Direccion: string;
    Localidad: string;
    Provincia: string;
    CP: string;
    Telefono: string;
    Celular: string;
    TipoIva: number;
    CUIT: string;
    Observaciones: string;
    Web: string;
    Mail: string;
    Rubro: string;
    rubroId: number;
    Saldo: number;
    Pais: string;
    Fax: string;
    FechaModif: Date;
    articulos?: Articulo[];
    rubro?: Rubro;
    cuentasCorrientes?: CuentaCorriente[];
}
