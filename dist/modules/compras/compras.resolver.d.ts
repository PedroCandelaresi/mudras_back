import { ComprasService } from './compras.service';
import { OrdenCompra, EstadoOrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';
import { AgregarDetalleOcDto } from './dto/agregar-detalle-oc.dto';
import { RecepcionarOrdenDto } from './dto/recepcionar-orden.dto';
export declare class ComprasResolver {
    private readonly service;
    constructor(service: ComprasService);
    getOrden(id: number): Promise<OrdenCompra>;
    listar(estado?: EstadoOrdenCompra, proveedorId?: number): Promise<OrdenCompra[]>;
    crearOrdenCompra(input: CrearOrdenCompraDto): Promise<OrdenCompra>;
    agregarDetalleOrden(input: AgregarDetalleOcDto): Promise<DetalleOrdenCompra>;
    eliminarDetalleOrden(detalleId: number): Promise<boolean>;
    emitirOrdenCompra(id: number): Promise<OrdenCompra>;
    recepcionarOrdenCompra(input: RecepcionarOrdenDto): Promise<OrdenCompra>;
}
