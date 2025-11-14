import { Repository } from 'typeorm';
import { OrdenCompra, EstadoOrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';
import { AgregarDetalleOcDto } from './dto/agregar-detalle-oc.dto';
import { RecepcionarOrdenDto } from './dto/recepcionar-orden.dto';
import { Articulo } from '../articulos/entities/articulo.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';
export declare class ComprasService {
    private ordenRepo;
    private detalleRepo;
    private articuloRepo;
    private stockPuntoRepo;
    constructor(ordenRepo: Repository<OrdenCompra>, detalleRepo: Repository<DetalleOrdenCompra>, articuloRepo: Repository<Articulo>, stockPuntoRepo: Repository<StockPuntoMudras>);
    crearOrden(dto: CrearOrdenCompraDto): Promise<OrdenCompra>;
    agregarDetalle(dto: AgregarDetalleOcDto): Promise<DetalleOrdenCompra>;
    eliminarDetalle(id: number): Promise<boolean>;
    emitirOrden(id: number): Promise<OrdenCompra>;
    recepcionarOrden(input: RecepcionarOrdenDto): Promise<OrdenCompra>;
    getOrden(id: number): Promise<OrdenCompra>;
    listar(estado?: EstadoOrdenCompra, proveedorId?: number): Promise<OrdenCompra[]>;
}
